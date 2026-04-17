"""
Pydantic schemas for Transaction request validation and response serialization.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class POCreateRequest(BaseModel):
    """Request schema for creating a new PO / Transaction."""
    po_number: str
    vendor_id: str
    material: str
    quantity: float
    rate: float

class WBCreateRequest(BaseModel):
    """Request schema for adding Weighbridge details."""
    wb_number: str
    vehicle_number: str
    gross: float
    tare: float
    net: float

class GRNCreateRequest(BaseModel):
    """Request schema for adding GRN details."""
    grn_number: str
    accepted_qty: float
    rejected_qty: float
    status: str

class InvoiceCreateRequest(BaseModel):
    """Request schema for adding Invoice details."""
    invoice_number: str
    amount: float
    tax: float
    total: float
    status: str

class DocumentSchema(BaseModel):
    """Schema for document metadata."""
    id: str
    name: str
    type: str # PO/WB/GRN/INV
    url: str
    uploaded_at: datetime

class POSchema(BaseModel):
    """Schema for PO details within a transaction."""
    po_number: str
    vendor_id: str
    material: str
    quantity: float
    rate: float
    status: str

class TransactionResponse(BaseModel):
    """Full Transaction response schema."""
    id: str = Field(alias="_id")
    company_id: str
    txn_id: str
    po: POSchema
    wb: Optional[Dict[str, Any]] = None
    grn: Optional[Dict[str, Any]] = None
    invoice: Optional[Dict[str, Any]] = None
    documents: List[DocumentSchema] = []
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True
        json_encoders = {datetime: lambda v: v.isoformat()}
