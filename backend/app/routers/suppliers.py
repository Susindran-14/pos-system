from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from pydantic import BaseModel

router = APIRouter(prefix="/api/suppliers", tags=["Supplier Ledger Matrix"])

class SupplierPaymentRequest(BaseModel):
    amount_paid: float
    notes: Optional[str] = "Payment to Supplier"

@router.get("", response_model=List[schemas.SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    """Retrieve all suppliers and their ledger balances."""
    return db.query(models.Supplier).order_by(models.Supplier.name.asc()).all()

@router.post("", response_model=schemas.SupplierResponse)
def create_supplier(supp_in: schemas.SupplierCreate, db: Session = Depends(get_db)):
    """Add a new wholesale supplier/manufacturer."""
    existing = db.query(models.Supplier).filter(models.Supplier.code == supp_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Supplier code '{supp_in.code}' already exists.")
    supplier = models.Supplier(**supp_in.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

@router.put("/{supplier_id}", response_model=schemas.SupplierResponse)
def update_supplier(supplier_id: int, supp_in: schemas.SupplierUpdate, db: Session = Depends(get_db)):
    """Update supplier information."""
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    
    for field, value in supp_in.model_dump(exclude_unset=True).items():
        setattr(supplier, field, value)
    
    db.commit()
    db.refresh(supplier)
    return supplier

@router.post("/{supplier_id}/pay", response_model=schemas.SupplierResponse)
def pay_supplier(supplier_id: int, req: SupplierPaymentRequest, db: Session = Depends(get_db)):
    """Record outbound payment to supplier and reduce outstanding dues."""
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    
    supplier.paid = (supplier.paid or 0.0) + req.amount_paid
    supplier.outstanding_due = max(0.0, (supplier.outstanding_due or 0.0) - req.amount_paid)
    
    # Audit log
    audit = models.AuditLog(
        user="Staff",
        action="SUPPLIER_PAID",
        details=f"Paid ₹{req.amount_paid:.2f} to {supplier.name}. Outstanding balance: ₹{supplier.outstanding_due:.2f}"
    )
    db.add(audit)
    db.commit()
    db.refresh(supplier)
    return supplier

@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    db.delete(supplier)
    db.commit()
    return {"message": f"Supplier '{supplier.name}' deleted successfully."}
