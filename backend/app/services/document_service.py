"""
Service layer for Document management.
"""
import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DocumentService:
    @staticmethod
    async def upload_document(
        db: AsyncIOMotorDatabase,
        company_id: str,
        txn_id: str,
        doc_type: str,
        file: UploadFile
    ) -> Optional[Dict[str, Any]]:
        """
        Upload a file, save it to storage, and link it to the transaction.
        """
        # Generate unique filename
        ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        # Save file
        with open(filepath, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Document metadata
        doc_id = str(uuid.uuid4())
        doc_obj = {
            "id": doc_id,
            "name": file.filename,
            "type": doc_type,
            "url": f"/uploads/{filename}",
            "uploaded_at": datetime.utcnow()
        }

        # Push to ERP document mapping collection
        await db["erp_document_links"].update_one(
            {"txn_id": txn_id, "company_id": company_id},
            {"$push": {"documents": doc_obj}},
            upsert=True
        )

        return doc_obj

    @staticmethod
    async def get_documents(
        db: AsyncIOMotorDatabase,
        company_id: str,
        txn_id: str
    ) -> List[Dict[str, Any]]:
        """
        Get all documents for a transaction.
        """
        transaction = await db["erp_document_links"].find_one(
            {"txn_id": txn_id, "company_id": company_id},
            {"documents": 1}
        )
        
        return transaction.get("documents", []) if transaction else []

    @staticmethod
    async def delete_document(
        db: AsyncIOMotorDatabase,
        company_id: str,
        doc_id: str
    ) -> bool:
        """
        Delete a document from transaction and physical storage.
        """
        # Find the transaction containing this document
        transaction = await db["erp_document_links"].find_one(
            {"company_id": company_id, "documents.id": doc_id}
        )
        
        if not transaction:
            return False

        # Find the specific document to get the URL/path
        doc_to_delete = next((d for d in transaction["documents"] if d["id"] == doc_id), None)
        if not doc_to_delete:
            return False

        # Remove from DB
        await db["erp_document_links"].update_one(
            {"_id": transaction["_id"]},
            {"$pull": {"documents": {"id": doc_id}}}
        )

        # Delete from storage
        url = doc_to_delete["url"]
        filename = url.split("/")[-1]
        filepath = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(filepath):
            os.remove(filepath)

        return True

    @staticmethod
    async def update_document(
        db: AsyncIOMotorDatabase,
        company_id: str,
        doc_id: str,
        name: Optional[str] = None,
        doc_type: Optional[str] = None
    ) -> bool:
        """
        Update document metadata.
        """
        update_fields = {}
        if name:
            update_fields["documents.$.name"] = name
        if doc_type:
            update_fields["documents.$.type"] = doc_type

        if not update_fields:
            return False

        result = await db["erp_document_links"].update_one(
            {"company_id": company_id, "documents.id": doc_id},
            {"$set": update_fields}
        )
        
        return result.modified_count > 0
