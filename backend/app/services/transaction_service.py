"""
Service layer for Transaction operations.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.models.transactions import TransactionDocument, PODocument
from app.schemas.transactions import POCreateRequest

class TransactionService:
    @staticmethod
    async def generate_txn_id(db: AsyncIOMotorDatabase, company_id: str) -> str:
        """
        Generate a sequential TXN ID for a specific company.
        Format: TXN001, TXN002...
        """
        counter = await db["counters"].find_one_and_update(
            {"company_id": company_id, "type": "transaction"},
            {"$inc": {"seq": 1}},
            upsert=True,
            return_document=True
        )
        seq = counter.get("seq", 1)
        return f"TXN{seq:03d}"

    @staticmethod
    async def create_transaction(
        db: AsyncIOMotorDatabase, 
        company_id: str, 
        po_data: POCreateRequest
    ) -> Dict[str, Any]:
        """
        Create a new transaction with a Purchase Order.
        """
        txn_id = await TransactionService.generate_txn_id(db, company_id)
        
        po_dict = po_data.model_dump()
        po_dict["status"] = "created"
        
        transaction = {
            "company_id": company_id,
            "txn_id": txn_id,
            "po": po_dict,
            "wb": None,
            "grn": None,
            "invoice": None,
            "documents": [],
            "created_at": datetime.utcnow()
        }
        
        result = await db["transactions"].insert_one(transaction)
        transaction["_id"] = str(result.inserted_id)
        return transaction

    @staticmethod
    async def get_transactions(
        db: AsyncIOMotorDatabase,
        company_id: str,
        po_number: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve all transactions for a company with optional filters.
        """
        query = {"company_id": company_id}
        
        if po_number:
            query["po.po_number"] = {"$regex": po_number, "$options": "i"}
            
        if start_date or end_date:
            query["created_at"] = {}
            if start_date:
                query["created_at"]["$gte"] = start_date
            if end_date:
                query["created_at"]["$lte"] = end_date
                
        cursor = db["transactions"].find(query).sort("created_at", -1)
        transactions = await cursor.to_list(length=100)
        
        for txn in transactions:
            txn["_id"] = str(txn["_id"])
            
        return transactions

    @staticmethod
    async def get_transaction_by_id(
        db: AsyncIOMotorDatabase,
        company_id: str,
        txn_id_str: str
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve a single transaction by its MongoDB _id, ensuring company ownership.
        """
        if not ObjectId.is_valid(txn_id_str):
            return None
            
        transaction = await db["transactions"].find_one({
            "_id": ObjectId(txn_id_str),
            "company_id": company_id
        })
        
        if transaction:
            transaction["_id"] = str(transaction["_id"])
            
        return transaction

    @staticmethod
    async def update_stage(
        db: AsyncIOMotorDatabase,
        company_id: str,
        txn_id_str: str,
        stage: str,
        data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """
        Generic method to update a transaction stage (wb, grn, or invoice).
        """
        if not ObjectId.is_valid(txn_id_str):
            return None
            
        result = await db["transactions"].find_one_and_update(
            {"_id": ObjectId(txn_id_str), "company_id": company_id},
            {"$set": {stage: data}},
            return_document=True
        )
        
        if result:
            result["_id"] = str(result["_id"])
            
        return result
