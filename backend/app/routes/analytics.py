"""
API routes for Analytics.
"""
from fastapi import APIRouter, Depends
from app.config.db import get_db
from app.routes.deps import get_current_user
from app.models.documents import UserDocument
from app.schemas.analytics import AnalyticsKPIResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/kpis", response_model=AnalyticsKPIResponse)
async def get_kpis(current_user: UserDocument = Depends(get_current_user)):
    """
    Get dashboard KPIs for the authenticated user's company.
    """
    db = get_db()
    kpis = await AnalyticsService.get_kpis(db, current_user.company_id)
    return kpis
