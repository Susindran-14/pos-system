from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
import hashlib

router = APIRouter(prefix="/api/auth", tags=["Authentication & Staff"])

def hash_pin(pin: str) -> str:
    """Hash the PIN with SHA-256 for secure storage."""
    return hashlib.sha256(pin.encode("utf-8")).hexdigest()

@router.post("/login", response_model=schemas.UserResponse)
def login_with_pin(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with 4-digit security PIN."""
    pin_hash = hash_pin(req.pin)
    user = db.query(models.User).filter(
        (models.User.pin == pin_hash) | (models.User.pin == req.pin),
        models.User.is_active == True
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid security PIN. Please try again."
        )
    return user

@router.get("/users", response_model=List[schemas.UserResponse])
def list_users(db: Session = Depends(get_db)):
    """List all staff users."""
    return db.query(models.User).all()

@router.post("/users", response_model=schemas.UserResponse)
def create_user(req: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new staff user with role and PIN."""
    existing = db.query(models.User).filter(models.User.username == req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists.")
    
    new_user = models.User(
        username=req.username,
        pin=hash_pin(req.pin),
        name=req.name,
        role=req.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a staff user."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    # Prevent deleting last admin
    admins = db.query(models.User).filter(models.User.role == "ADMIN").all()
    if user.role == "ADMIN" and len(admins) <= 1:
        raise HTTPException(status_code=400, detail="Cannot delete the sole Administrator account.")
    
    db.delete(user)
    db.commit()
    return {"message": f"User '{user.username}' deleted successfully"}
