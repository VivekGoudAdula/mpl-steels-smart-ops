from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.config.settings import settings
from app.config.db import connect_db, close_db
from app.routes import auth, companies, users, transactions, documents, analytics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_db()
    yield
    # Shutdown: Close MongoDB connection
    await close_db()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Static Files
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Enable CORS
origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",")]
# Add variant without trailing slash if present
for o in list(origins):
    if o.endswith("/"):
        origins.append(o[:-1])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(documents.router)
app.include_router(analytics.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
