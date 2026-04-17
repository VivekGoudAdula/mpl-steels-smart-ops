"""
MongoDB document models (Python dataclasses / typed dicts).
These mirror the actual shape of documents stored in MongoDB.
"""

from datetime import datetime
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field


class PyObjectId(ObjectId):
    """
    Custom Pydantic-compatible wrapper around BSON ObjectId.
    Allows ObjectId to be used as a Pydantic field type.
    """

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value: object) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError(f"Invalid ObjectId: {value}")
        return ObjectId(value)

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema

        return core_schema.no_info_plain_validator_function(
            cls.validate,
            serialization=core_schema.to_string_ser_schema(),
        )


class MongoBaseModel(BaseModel):
    """
    Base model that maps MongoDB's '_id' field to Python's 'id'.
    All MongoDB document models should inherit from this.
    """

    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }


class CompanyDocument(MongoBaseModel):
    """Represents a company (tenant) document as stored in MongoDB."""

    name: str
    domain: Optional[str] = None
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserDocument(MongoBaseModel):
    """Represents a user document as stored in MongoDB."""

    company_id: Optional[str] = None
    company_name: Optional[str] = None
    name: str
    email: str
    password_hash: str
    emp_id: Optional[str] = None
    job_title: Optional[str] = None
    role: str = Field(default="viewer")                 # super_admin | editor | viewer
    status: str = Field(default="active")               # active | inactive
    last_login: Optional[datetime] = None
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ActivityLogDocument(MongoBaseModel):
    """Represents an activity log document in MongoDB."""
    company_id: str
    user_id: str
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
