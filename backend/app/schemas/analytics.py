"""
Pydantic schemas for Analytics.
"""
from pydantic import BaseModel

class AnalyticsKPIResponse(BaseModel):
    """Schema for high-level dashboard KPIs."""
    total_transactions: int
    total_pos: int
    total_invoices: int
    total_documents: int
