from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from pydantic import BaseModel

router = APIRouter(prefix="/api/customers", tags=["Customer CRM & Credit Ledger"])

class DueSettlementRequest(BaseModel):
    amount_paid: float
    notes: Optional[str] = "Customer Credit Payment"

@router.get("", response_model=List[schemas.CustomerResponse])
def get_customers(search: Optional[str] = None, db: Session = Depends(get_db)):
    """Retrieve all customers or search by mobile number / name."""
    query = db.query(models.Customer)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Customer.mobile.ilike(s)) |
            (models.Customer.name.ilike(s))
        )
    return query.order_by(models.Customer.name.asc()).all()

@router.get("/by-mobile/{mobile}", response_model=schemas.CustomerResponse)
def get_customer_by_mobile(mobile: str, db: Session = Depends(get_db)):
    """Instant customer lookup for POS checkout."""
    customer = db.query(models.Customer).filter(models.Customer.mobile == mobile).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found.")
    return customer

@router.post("", response_model=schemas.CustomerResponse)
def create_customer(cust_in: schemas.CustomerCreate, db: Session = Depends(get_db)):
    """Register a new customer."""
    existing = db.query(models.Customer).filter(models.Customer.mobile == cust_in.mobile).first()
    if existing:
        return existing
    customer = models.Customer(**cust_in.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

@router.put("/{customer_id}", response_model=schemas.CustomerResponse)
def update_customer(customer_id: int, cust_in: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    """Update customer details."""
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found.")
    
    for field, value in cust_in.model_dump(exclude_unset=True).items():
        setattr(customer, field, value)
    
    db.commit()
    db.refresh(customer)
    return customer

@router.post("/{customer_id}/settle-due", response_model=schemas.CustomerResponse)
def settle_customer_due(customer_id: int, req: DueSettlementRequest, db: Session = Depends(get_db)):
    """Record credit settlement payment from a customer."""
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found.")
    
    customer.outstanding_due = max(0.0, (customer.outstanding_due or 0.0) - req.amount_paid)
    
    # Audit log
    audit = models.AuditLog(
        user="Staff",
        action="CUSTOMER_DUE_SETTLED",
        details=f"Received ₹{req.amount_paid:.2f} due settlement for {customer.name} ({customer.mobile}). Remaining due: ₹{customer.outstanding_due:.2f}"
    )
    db.add(audit)
    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found.")
    db.delete(customer)
    db.commit()
    return {"message": f"Customer '{customer.name}' deleted successfully."}
