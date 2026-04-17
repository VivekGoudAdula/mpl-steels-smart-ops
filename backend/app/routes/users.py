from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.routes.deps import get_current_user, require_super_admin
from app.models.documents import UserDocument
from app.config.db import get_db
from app.schemas.schemas import UserResponse, AdminUserCreateRequest, AdminUserUpdateRequest, UserStatusUpdate
from app.utils.auth import hash_password

router = APIRouter(tags=["users"])

@router.get("/users/me", response_model=UserResponse)
async def get_me(current_user: UserDocument = Depends(get_current_user)):
    return current_user

@router.post("/admin/users", response_model=UserResponse)
async def create_user(payload: AdminUserCreateRequest, current_user: UserDocument = Depends(require_super_admin)):
    """Create user inside a company (super admin only)."""
    db = get_db()
    
    if payload.role not in ["editor", "viewer"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role must be 'editor' or 'viewer'")
        
    # Verify company exists
    if not ObjectId.is_valid(payload.company_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid company ID.")
    company = await db["companies"].find_one({"_id": ObjectId(payload.company_id)})
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found.")

    existing_user = await db["users"].find_one({"email": payload.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists.")
        
    user_dict = {
        "company_id": payload.company_id,
        "name": payload.name,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "emp_id": payload.emp_id,
        "job_title": payload.job_title,
        "role": payload.role,
        "status": "active",
        "created_at": datetime.utcnow()
    }
    
    result = await db["users"].insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    user_dict["id"] = str(result.inserted_id)
    return UserResponse(**user_dict)

@router.get("/admin/users", response_model=List[UserResponse])
async def list_users(company_id: Optional[str] = None, current_user: UserDocument = Depends(require_super_admin)):
    """List users of a company (super admin only)."""
    db = get_db()
    if not company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="company_id is required.")
        
    cursor = db["users"].find({"company_id": company_id})
    users = await cursor.to_list(length=100)
    for u in users:
        u["id"] = str(u["_id"])
    return [UserResponse(**u) for u in users]

@router.put("/admin/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, payload: AdminUserUpdateRequest, current_user: UserDocument = Depends(require_super_admin)):
    """Update user (super admin only)."""
    db = get_db()
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format.")
        
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        
    update_data = payload.model_dump(exclude_unset=True)
    if "role" in update_data and update_data["role"] not in ["editor", "viewer"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role specified.")
        
    if not update_data:
        user["id"] = str(user["_id"])
        return UserResponse(**user)
        
    await db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
    
    updated_user = await db["users"].find_one({"_id": ObjectId(user_id)})
    updated_user["id"] = str(updated_user["_id"])
    return UserResponse(**updated_user)

@router.patch("/admin/users/{user_id}/status", response_model=UserResponse)
async def update_status(user_id: str, payload: UserStatusUpdate, current_user: UserDocument = Depends(require_super_admin)):
    """Activate/Deactivate user (super admin only)."""
    db = get_db()
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format.")
        
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        
    if payload.status not in ["active", "inactive"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Status must be 'active' or 'inactive'.")
        
    await db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": {"status": payload.status}})
    
    updated_user = await db["users"].find_one({"_id": ObjectId(user_id)})
    updated_user["id"] = str(updated_user["_id"])
    return UserResponse(**updated_user)
