from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.config import settings
import re

from sqlalchemy import text

# Format database URL for SQLAlchemy
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Check if SQLite or PostgreSQL (Neon DB)
is_sqlite = db_url.startswith("sqlite")

def create_active_engine():
    if is_sqlite:
        return create_engine(db_url, connect_args={"check_same_thread": False})
    try:
        # Test connection with a fast 4s timeout
        test_engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=300,
            pool_size=10,
            max_overflow=20,
            connect_args={"connect_timeout": 4}
        )
        with test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("[DATABASE] Successfully connected to Neon Cloud PostgreSQL.")
        return test_engine
    except Exception as e:
        print(f"[DATABASE NOTICE] Cloud PostgreSQL unreachable ({e}).")
        print("[DATABASE NOTICE] Automatically switching to local offline SQLite database (pos_local.db).")
        return create_engine("sqlite:///./pos_local.db", connect_args={"check_same_thread": False})

engine = create_active_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    FastAPI dependency that yields a SQLAlchemy database session per request,
    and cleanly closes it after the request completes.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
