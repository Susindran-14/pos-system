from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/expenses", tags=["Operational Store Expenses"])

@router.get("", response_model=List[schemas.ExpenseResponse])
def get_expenses(category: Optional[str] = None, db: Session = Depends(get_db)):
    """List operational store expenses."""
    query = db.query(models.Expense)
    if category and category != "All":
        query = query.filter(models.Expense.category == category)
    return query.order_by(models.Expense.id.desc()).all()

@router.post("", response_model=schemas.ExpenseResponse)
def create_expense(exp_in: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    """Log an operational store expense."""
    expense = models.Expense(**exp_in.model_dump())
    db.add(expense)

    audit = models.AuditLog(
        user="Staff",
        action="CREATE_EXPENSE",
        details=f"Recorded ₹{exp_in.amount:.2f} for {exp_in.category} ({exp_in.description})"
    )
    db.add(audit)

    db.commit()
    db.refresh(expense)
    return expense

@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found.")
    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully."}
