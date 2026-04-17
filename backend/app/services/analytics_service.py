"""
Service layer for Analytics and Reporting.
"""
from typing import Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

class AnalyticsService:
    @staticmethod
    async def get_kpis(db: AsyncIOMotorDatabase, company_id: str) -> Dict[str, int]:
        """
        Calculate dashboard KPIs using MongoDB aggregation.
        """
        pipeline = [
            { "$match": { "company_id": company_id } },
            {
                "$group": {
                    "_id": None,
                    "total_transactions": { "$sum": 1 },
                    "total_pos": { 
                        "$sum": { "$cond": [{ "$ifNull": ["$po", False] }, 1, 0] } 
                    },
                    "total_invoices": { 
                        "$sum": { "$cond": [{ "$ifNull": ["$invoice", False] }, 1, 0] } 
                    },
                    "total_documents": { "$sum": { "$size": "$documents" } }
                }
            }
        ]
        
        cursor = db["transactions"].aggregate(pipeline)
        result = await cursor.to_list(length=1)
        
        if not result:
            return {
                "total_transactions": 0,
                "total_pos": 0,
                "total_invoices": 0,
                "total_documents": 0
            }
            
        data = result[0]
        return {
            "total_transactions": data.get("total_transactions", 0),
            "total_pos": data.get("total_pos", 0),
            "total_invoices": data.get("total_invoices", 0),
            "total_documents": data.get("total_documents", 0)
        }
