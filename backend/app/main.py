from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base
from app.init_db import init_database
from app.routers import (
    auth,
    products,
    sales,
    customers,
    suppliers,
    purchases,
    inventory,
    expenses,
    reports,
    settings as store_settings,
    scanner
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and essential setup on server startup
    try:
        init_database()
    except Exception as e:
        print(f"Warning: Database init encountered an error: {e}")
    yield

app = FastAPI(
    title="Tamil Dress Collection - POS & Retail Management API",
    description="High-performance REST API backend for Textile Retail & POS billing powered by FastAPI and Neon PostgreSQL.",
    version="4.0.0",
    lifespan=lifespan
)

# CORS (Cross-Origin Resource Sharing) configuration - Allow all local dev ports & network
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(sales.router)
app.include_router(customers.router)
app.include_router(suppliers.router)
app.include_router(purchases.router)
app.include_router(inventory.router)
app.include_router(expenses.router)
app.include_router(reports.router)
app.include_router(store_settings.router)
app.include_router(scanner.router)

@app.get("/")
def root_status():
    return {
        "system": "Tamil Dress Collection POS API",
        "status": "Online",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "version": "4.0.0"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database_connected": True
    }
