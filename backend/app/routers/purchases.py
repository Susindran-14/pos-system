from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from datetime import datetime

router = APIRouter(prefix="/api/purchases", tags=["Wholesale Purchase Intake"])

def generate_purchase_number(db: Session) -> str:
    year = datetime.utcnow().year
    prefix = f"PO-{year}-"
    latest = db.query(models.Purchase).filter(models.Purchase.purchase_no.like(f"{prefix}%")).order_by(models.Purchase.id.desc()).first()
    if latest:
        try:
            curr = int(latest.purchase_no.split("-")[-1])
            new_n = curr + 1
        except Exception:
            new_n = 1
    else:
        new_n = 1
    return f"{prefix}{str(new_n).zfill(5)}"

@router.get("", response_model=List[schemas.PurchaseResponse])
def get_purchases(db: Session = Depends(get_db)):
    """List wholesale purchase invoices."""
    return db.query(models.Purchase).order_by(models.Purchase.id.desc()).all()

@router.post("", response_model=schemas.PurchaseResponse)
def create_purchase(po_in: schemas.PurchaseCreate, db: Session = Depends(get_db)):
    """Record wholesale purchase intake, auto-increase product stock, and update supplier ledger."""
    po_no = generate_purchase_number(db)
    
    purchase = models.Purchase(
        purchase_no=po_no,
        supplier_id=po_in.supplier_id,
        supplier_name=po_in.supplier_name,
        purchase_date=po_in.purchase_date or datetime.utcnow(),
        invoice_ref=po_in.invoice_ref,
        subtotal=po_in.subtotal,
        tax_amount=po_in.tax_amount,
        grand_total=po_in.grand_total,
        paid_amount=po_in.paid_amount,
        balance_due=po_in.balance_due,
        payment_status="Paid" if po_in.balance_due <= 0 else "Partial" if po_in.paid_amount > 0 else "Unpaid",
        notes=po_in.notes
    )
    db.add(purchase)
    db.flush()

    # Process items and increase stock
    for item_data in po_in.items:
        po_item = models.PurchaseItem(
            purchase_id=purchase.id,
            product_id=item_data.product_id,
            sku=item_data.sku,
            name=item_data.name,
            qty=item_data.qty,
            unit_cost=item_data.unit_cost,
            gst_rate=item_data.gst_rate,
            total=item_data.total
        )
        db.add(po_item)

        # Update product stock & cost price
        if item_data.product_id:
            product = db.query(models.Product).filter(models.Product.id == item_data.product_id).first()
        else:
            product = db.query(models.Product).filter(models.Product.sku == item_data.sku).first()
        
        if product:
            product.stock += item_data.qty
            if item_data.unit_cost > 0:
                product.cost_price = item_data.unit_cost
            
            # Record Stock Movement
            movement = models.StockMovement(
                product_id=product.id,
                sku=product.sku,
                movement_type="Purchase",
                qty=item_data.qty,
                reference_no=po_no,
                notes=f"Purchase Intake PO #{po_no} from {po_in.supplier_name}"
            )
            db.add(movement)

    # Update supplier ledger
    if po_in.supplier_id:
        supplier = db.query(models.Supplier).filter(models.Supplier.id == po_in.supplier_id).first()
        if supplier:
            supplier.total_purchases = (supplier.total_purchases or 0.0) + po_in.grand_total
            supplier.paid = (supplier.paid or 0.0) + po_in.paid_amount
            supplier.outstanding_due = (supplier.outstanding_due or 0.0) + po_in.balance_due

    # Audit log
    audit = models.AuditLog(
        user="Staff",
        action="CREATE_PURCHASE",
        details=f"Intake PO {po_no} from {po_in.supplier_name} for ₹{po_in.grand_total:.2f}"
    )
    db.add(audit)

    db.commit()
    db.refresh(purchase)
    return purchase
