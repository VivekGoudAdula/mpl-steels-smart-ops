"""
Pydantic schemas for request validation and response serialization.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field


# ──────────────────────────── Auth Schemas ────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    company_id: Optional[str] = None
    name: str
    email: str
    emp_id: Optional[str] = None
    job_title: Optional[str] = None
    role: str
    status: str
    company_name: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    company_id: Optional[str] = None


# ──────────────────────────── User Schemas ────────────────────────────

class AdminUserCreateRequest(BaseModel):
    company_id: str
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6)
    emp_id: Optional[str] = None
    job_title: Optional[str] = None
    role: str = Field(..., description="Must be 'editor' or 'viewer'")

class AdminUserUpdateRequest(BaseModel):
    name: Optional[str] = None
    emp_id: Optional[str] = None
    job_title: Optional[str] = None
    role: Optional[str] = None

class UserStatusUpdate(BaseModel):
    status: str = Field(..., description="Must be 'active' or 'inactive'")

# ──────────────────────────── Company Schemas ─────────────────────────

class CompanyCreateRequest(BaseModel):
    name: str

class CompanyResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    
    model_config = {"from_attributes": True}

# ──────────────────────────── Admin Overview / Dashboard Schemas ────────

class ActivityLogResponse(BaseModel):
    id: str
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class AdminOverviewResponse(BaseModel):
    total_companies: int
    total_users: int
    total_documents: int
    total_transactions: int
    recent_system_activity: List[ActivityLogResponse] = []

class AdminCompanyResponse(BaseModel):
    id: str
    name: str
    total_users: int
    active_users: int
    total_documents: int
    total_transactions: int
    last_activity: Optional[datetime] = None

class AdminCompanyDetailsResponse(BaseModel):
    users: List[UserResponse]
    total_documents: int
    documents_by_type: Dict[str, int]
    total_transactions: int
    recent_activity: List[ActivityLogResponse]
