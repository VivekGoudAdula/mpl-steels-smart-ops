"""
API routes for Document management.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from app.config.db import get_db
from app.routes.deps import get_current_user
from app.models.documents import UserDocument
from app.schemas.transactions import DocumentSchema
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentSchema, status_code=status.HTTP_201_CREATED)
async def upload_document(
    txn_id: str = Form(...),
    type: str = Form(...), # PO/WB/GRN/INV
    file: UploadFile = File(...),
    current_user: UserDocument = Depends(get_current_user)
):
    """
    Upload a document and link it to a transaction.
    """
    if not current_user.company_id:
        raise HTTPException(status_code=403, detail="User not associated with a company")
        
    db = get_db()
    doc = await DocumentService.upload_document(
        db, current_user.company_id, txn_id, type, file
    )
    
    if not doc:
        raise HTTPException(status_code=404, detail="Transaction not found or access denied")
        
    return doc

@router.get("/", response_model=List[DocumentSchema])
async def get_documents(
    txn_id: str = Query(...),
    current_user: UserDocument = Depends(get_current_user)
):
    """
    Get all documents for a specific transaction.
    """
    db = get_db()
    docs = await DocumentService.get_documents(db, current_user.company_id, txn_id)
    return docs

@router.delete("/{doc_id}")
async def delete_document(
    doc_id: str,
    current_user: UserDocument = Depends(get_current_user)
):
    """
    Delete a document.
    """
    db = get_db()
    success = await DocumentService.delete_document(db, current_user.company_id, doc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    return {"message": "Document deleted successfully"}

@router.put("/{doc_id}")
async def update_document(
    doc_id: str,
    name: Optional[str] = None,
    type: Optional[str] = None,
    current_user: UserDocument = Depends(get_current_user)
):
    """
    Update document metadata (name/type).
    """
    db = get_db()
    success = await DocumentService.update_document(
        db, current_user.company_id, doc_id, name, type
    )
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    return {"message": "Document updated successfully"}
