from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from bson import ObjectId
from datetime import datetime
from app.routes.deps import require_super_admin
from app.models.documents import UserDocument
from app.config.db import get_db
from app.schemas.schemas import CompanyCreateRequest, CompanyResponse, AdminOverviewResponse, AdminCompanyResponse, AdminCompanyDetailsResponse, UserResponse, ActivityLogResponse

router = APIRouter(prefix="/admin", tags=["admin-dashboard", "admin-companies"])

@router.get("/overview", response_model=AdminOverviewResponse)
async def get_overview(current_user: UserDocument = Depends(require_super_admin)):
    db = get_db()
    total_companies = await db["companies"].count_documents({})
    total_users = await db["users"].count_documents({"role": {"$ne": "super_admin"}})
    total_documents = await db["documents"].count_documents({})
    total_transactions = await db["transactions"].count_documents({})

    logs_cursor = db["activity_logs"].find().sort("created_at", -1).limit(10)
    logs_list = await logs_cursor.to_list(length=10)
    
    recent_activity = []
    for log in logs_list:
        log["id"] = str(log["_id"])
        recent_activity.append(ActivityLogResponse(**log))

    return AdminOverviewResponse(
        total_companies=total_companies,
        total_users=total_users,
        total_documents=total_documents,
        total_transactions=total_transactions,
        recent_system_activity=recent_activity
    )

@router.post("/companies", response_model=CompanyResponse)
async def create_company(payload: CompanyCreateRequest, current_user: UserDocument = Depends(require_super_admin)):
    db = get_db()
    company_dict = {
        "name": payload.name,
        "created_at": datetime.utcnow()
    }
    result = await db["companies"].insert_one(company_dict)
    company_dict["_id"] = result.inserted_id
    company_dict["id"] = str(result.inserted_id)
    return CompanyResponse(**company_dict)

@router.get("/companies", response_model=List[AdminCompanyResponse])
async def list_companies(current_user: UserDocument = Depends(require_super_admin)):
    db = get_db()
    cursor = db["companies"].find()
    companies = await cursor.to_list(length=100)
    
    result = []
    for c in companies:
        c_id_str = str(c["_id"])
        total_users = await db["users"].count_documents({"company_id": c_id_str})
        active_users = await db["users"].count_documents({"company_id": c_id_str, "status": "active"})
        total_documents = await db["documents"].count_documents({"company_id": c_id_str})
        total_transactions = await db["transactions"].count_documents({"company_id": c_id_str})
        
        # Last activity is approximated by fetching the latest log
        latest_log = await db["activity_logs"].find_one(
            {"company_id": c_id_str}, sort=[("created_at", -1)]
        )
        
        last_activity = latest_log["created_at"] if latest_log else None
        
        result.append(AdminCompanyResponse(
            id=c_id_str,
            name=c["name"],
            total_users=total_users,
            active_users=active_users,
            total_documents=total_documents,
            total_transactions=total_transactions,
            last_activity=last_activity
        ))
        
    return result

@router.get("/companies/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: str, current_user: UserDocument = Depends(require_super_admin)):
    db = get_db()
    if not ObjectId.is_valid(company_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format.")
    company = await db["companies"].find_one({"_id": ObjectId(company_id)})
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found.")
    company["id"] = str(company["_id"])
    return CompanyResponse(**company)

@router.get("/companies/{company_id}/details", response_model=AdminCompanyDetailsResponse)
async def get_company_details(company_id: str, current_user: UserDocument = Depends(require_super_admin)):
    db = get_db()
    if not ObjectId.is_valid(company_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format.")
        
    company = await db["companies"].find_one({"_id": ObjectId(company_id)})
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        
    # Get users
    users_cursor = db["users"].find({"company_id": company_id})
    users_list = await users_cursor.to_list(length=1000)
    for u in users_list:
        u["id"] = str(u["_id"])
        
    users = [UserResponse(**u) for u in users_list]
    
    # Get document stats
    total_documents = await db["documents"].count_documents({"company_id": company_id})
    pipeline = [
        {"$match": {"company_id": company_id}},
        {"$group": {"_id": "$type", "count": {"$sum": 1}}}
    ]
    doc_types = await db["documents"].aggregate(pipeline).to_list(100)
    documents_by_type = {item["_id"] or "Unknown": item["count"] for item in doc_types}
    
    # Fill in defaults
    for t in ["PO", "WB", "GRN", "Invoice"]:
        if t not in documents_by_type:
            documents_by_type[t] = 0
            
    # Get transaction stats
    total_transactions = await db["transactions"].count_documents({"company_id": company_id})
    
    # Get recent activity
    logs_cursor = db["activity_logs"].find({"company_id": company_id}).sort("created_at", -1).limit(20)
    logs_list = await logs_cursor.to_list(length=20)
    
    recent_activity = []
    for log in logs_list:
        log["id"] = str(log["_id"])
        recent_activity.append(ActivityLogResponse(**log))
        
    return AdminCompanyDetailsResponse(
        users=users,
        total_documents=total_documents,
        documents_by_type=documents_by_type,
        total_transactions=total_transactions,
        recent_activity=recent_activity
    )

