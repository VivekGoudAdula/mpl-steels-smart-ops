"""
API routes for Transactions.
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.config.db import get_db
from app.routes.deps import get_current_user
from app.models.documents import UserDocument
from app.schemas.transactions import (
    POCreateRequest, 
    TransactionResponse, 
    WBCreateRequest, 
    GRNCreateRequest, 
    InvoiceCreateRequest
)
from app.services.transaction_service import TransactionService

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    po_data: POCreateRequest,
    current_user: UserDocument = Depends(get_current_user)
):
    """
    Create a new transaction starting with a Purchase Order (PO).
    """
    if not current_user.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not associated with any company."
        )
        
    db = get_db()
    transaction = await TransactionService.create_transaction(
        db, current_user.company_id, po_data
    )
    return transaction

@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    po_number: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: UserDocument = Depends(get_current_user)
):
    """
    Get all transactions for the authenticated user's company.
    """
    if not current_user.company_id:
        return []
        
    db = get_db()
    transactions = await TransactionService.get_transactions(
        db, current_user.company_id, po_number, start_date, end_date
    )
    return transactions

@router.get("/{id}", response_model=TransactionResponse)
async def get_transaction(
    id: str,
    current_user: UserDocument = Depends(get_current_user)
):
    """
    Get details of a single transaction by ID.
    """
    if not current_user.company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied."
        )
        
    db = get_db()
    transaction = await TransactionService.get_transaction_by_id(
        db, current_user.company_id, id
    )
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found."
        )
        
    return transaction

@router.post("/{id}/weighbridge", response_model=TransactionResponse)
async def add_weighbridge(
    id: str,
    wb_data: WBCreateRequest,
    current_user: UserDocument = Depends(get_current_user)
):
    """Update transaction with Weighbridge details."""
    db = get_db()
    transaction = await TransactionService.update_stage(
        db, current_user.company_id, id, "wb", wb_data.model_dump()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.post("/{id}/grn", response_model=TransactionResponse)
async def add_grn(
    id: str,
    grn_data: GRNCreateRequest,
    current_user: UserDocument = Depends(get_current_user)
):
    """Update transaction with GRN details."""
    db = get_db()
    transaction = await TransactionService.update_stage(
        db, current_user.company_id, id, "grn", grn_data.model_dump()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.post("/{id}/invoice", response_model=TransactionResponse)
async def add_invoice(
    id: str,
    invoice_data: InvoiceCreateRequest,
    current_user: UserDocument = Depends(get_current_user)
):
    """Update transaction with Invoice details."""
    db = get_db()
    transaction = await TransactionService.update_stage(
        db, current_user.company_id, id, "invoice", invoice_data.model_dump()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction
