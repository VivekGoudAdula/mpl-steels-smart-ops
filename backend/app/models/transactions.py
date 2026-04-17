"""
MongoDB document models for Transactions.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field, BaseModel
from app.models.documents import MongoBaseModel

class PODocument(BaseModel):
    """Purchase Order part of a transaction."""
    po_number: str
    vendor_id: str
    material: str
    quantity: float
    rate: float
    status: str = "created"

class TransactionDocument(MongoBaseModel):
    """Represents a transaction document in MongoDB."""
    company_id: str
    txn_id: str
    po: PODocument
    wb: Optional[Dict[str, Any]] = None
    grn: Optional[Dict[str, Any]] = None
    invoice: Optional[Dict[str, Any]] = None
    documents: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
