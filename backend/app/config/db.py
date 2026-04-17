"""
Async MongoDB connection management using Motor.
Provides a globally accessible database instance and
lifecycle hooks for FastAPI startup/shutdown events.
"""

import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config.settings import settings

logger = logging.getLogger(__name__)

# Module-level references — populated on startup
_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def connect_db() -> None:
    """
    Open the MongoDB connection pool.
    Called during FastAPI's lifespan startup.
    """
    global _client, _db

    logger.info("Connecting to MongoDB...")
    _client = AsyncIOMotorClient(settings.MONGO_URI)
    _db = _client.get_default_database()

    # Verify connectivity with a lightweight ping
    await _client.admin.command("ping")
    logger.info("MongoDB connection established.")


async def close_db() -> None:
    """
    Close the MongoDB connection pool.
    Called during FastAPI's lifespan shutdown.
    """
    global _client, _db

    if _client:
        _client.close()
        _client = None
        _db = None
        logger.info("MongoDB connection closed.")


def get_db() -> AsyncIOMotorDatabase:
    """
    Return the active database instance.
    Raises RuntimeError if called before connect_db().
    """
    if _db is None:
        raise RuntimeError(
            "Database not initialised. Ensure connect_db() ran during startup."
        )
    return _db
