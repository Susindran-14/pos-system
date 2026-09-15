from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from datetime import datetime

router = APIRouter(prefix="/api/sales", tags=["Sales & POS Checkout Engine"])

def generate_invoice_number(db: Session) -> str:
    """Generate sequential invoice number: INV-YYYY-000001."""
    year = datetime.utcnow().year
    prefix = f"INV-{year}-"
    
    # Find latest invoice number for this year
    latest = db.query(models.Sale).filter(models.Sale.invoice_no.like(f"{prefix}%")).order_by(models.Sale.id.desc()).first()
    if latest:
        try:
            current_num = int(latest.invoice_no.split("-")[-1])
            new_num = current_num + 1
        except Exception:
            new_num = 1
    else:
        new_num = 1
    
    return f"{prefix}{str(new_num).zfill(6)}"

@router.post("", response_model=schemas.SaleResponse)
def create_sale(sale_in: schemas.SaleCreate, db: Session = Depends(get_db)):
    """
    Process complete POS transaction:
    1. Validate item stock & prices
    2. Create Sale & SaleItem records
    3. Deduct product inventory stock & create StockMovement log
    4. Update customer loyalty points & ledger dues
    """
    invoice_no = generate_invoice_number(db)
    
    # Create Sale master record
    sale = models.Sale(
        invoice_no=invoice_no,
        date_time=datetime.utcnow(),
        customer_id=sale_in.customer_id,
        customer_name=sale_in.customer_name,
        customer_mobile=sale_in.customer_mobile,
        subtotal=sale_in.subtotal,
        item_discount=sale_in.item_discount,
        bill_discount=sale_in.bill_discount,
        taxable_amount=sale_in.taxable_amount,
        cgst=sale_in.cgst,
        sgst=sale_in.sgst,
        igst=sale_in.igst,
        round_off=sale_in.round_off,
        grand_total=sale_in.grand_total,
        payment_mode=sale_in.payment_mode,
        amount_paid=sale_in.amount_paid,
        change_returned=sale_in.change_returned,
        status="Completed",
        notes=sale_in.notes
    )
    db.add(sale)
    db.flush() # Populate sale.id

    # Process items and deduct inventory
    for item_data in sale_in.items:
        sale_item = models.SaleItem(
            sale_id=sale.id,
            product_id=item_data.product_id,
            sku=item_data.sku,
            name=item_data.name,
            size=item_data.size,
            color=item_data.color,
            qty=item_data.qty,
            rate=item_data.rate,
            mrp=item_data.mrp,
            discount_type=item_data.discount_type,
            discount_value=item_data.discount_value,
            discount_amount=item_data.discount_amount,
            gst_rate=item_data.gst_rate,
            taxable_amount=item_data.taxable_amount,
            cgst=item_data.cgst,
            sgst=item_data.sgst,
            igst=item_data.igst,
            total=item_data.total
        )
        db.add(sale_item)

        # Deduct product stock
        if item_data.product_id:
            product = db.query(models.Product).filter(models.Product.id == item_data.product_id).first()
        else:
            product = db.query(models.Product).filter(models.Product.sku == item_data.sku).first()
        
        if product:
            product.stock = max(0, product.stock - item_data.qty)
            movement = models.StockMovement(
                product_id=product.id,
                sku=product.sku,
                movement_type="Sale",
                qty=-item_data.qty,
                reference_no=invoice_no,
                notes=f"POS Sale Invoice #{invoice_no}"
            )
            db.add(movement)

    # Handle customer account loyalty & credit
    if sale_in.customer_id:
        customer = db.query(models.Customer).filter(models.Customer.id == sale_in.customer_id).first()
        if customer:
            customer.total_purchases = (customer.total_purchases or 0) + sale_in.grand_total
            customer.last_purchase_date = datetime.utcnow().strftime("%Y-%m-%d")
            
            # Loyalty Points: +1 point per ₹100 spent, minus redeemed points
            earned_points = int(sale_in.grand_total / 100)
            redeemed = sale_in.loyalty_points_redeemed or 0
            customer.loyalty_points = max(0, (customer.loyalty_points or 0) + earned_points - redeemed)

            # If Store Credit / Due sale
            if sale_in.payment_mode == "Credit" or sale_in.payment_mode == "Due":
                unpaid = max(0, sale_in.grand_total - sale_in.amount_paid)
                customer.outstanding_due = (customer.outstanding_due or 0) + unpaid

    # Log system audit trail
    audit = models.AuditLog(
        user="Staff",
        action="CREATE_SALE",
        details=f"Generated Invoice {invoice_no} for amount ₹{sale_in.grand_total:.2f} ({sale_in.payment_mode})"
    )
    db.add(audit)

    db.commit()
    db.refresh(sale)
    return sale

@router.get("", response_model=List[schemas.SaleResponse])
def get_sales(
    limit: int = 100,
    search: Optional[str] = None,
    customer_mobile: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve historical sales with filters."""
    query = db.query(models.Sale)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Sale.invoice_no.ilike(s)) |
            (models.Sale.customer_name.ilike(s)) |
            (models.Sale.customer_mobile.ilike(s))
        )
    if customer_mobile:
        query = query.filter(models.Sale.customer_mobile == customer_mobile)
    
    return query.order_by(models.Sale.id.desc()).limit(limit).all()

@router.get("/{invoice_or_id}", response_model=schemas.SaleResponse)
def get_sale_details(invoice_or_id: str, db: Session = Depends(get_db)):
    """Get single sale bill details for reprint or audit."""
    if invoice_or_id.isdigit():
        sale = db.query(models.Sale).filter(models.Sale.id == int(invoice_or_id)).first()
    else:
        sale = db.query(models.Sale).filter(models.Sale.invoice_no == invoice_or_id).first()
    
    if not sale:
        raise HTTPException(status_code=404, detail="Invoice record not found.")
    return sale

@router.post("/{sale_id}/return")
def return_sale(sale_id: int, reason: Optional[str] = "Customer Return", db: Session = Depends(get_db)):
    """Void or return sale and restore product stock counts."""
    sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale invoice not found.")
    if sale.status == "Returned":
        raise HTTPException(status_code=400, detail="Invoice has already been marked as returned.")

    sale.status = "Returned"
    sale.notes = f"{sale.notes or ''} [Returned: {reason}]"

    # Restore inventory stock
    for item in sale.items:
        if item.product_id:
            product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        else:
            product = db.query(models.Product).filter(models.Product.sku == item.sku).first()
        
        if product:
            product.stock += item.qty
            movement = models.StockMovement(
                product_id=product.id,
                sku=product.sku,
                movement_type="Return",
                qty=item.qty,
                reference_no=f"RET-{sale.invoice_no}",
                notes=f"Return of Invoice {sale.invoice_no}: {reason}"
            )
            db.add(movement)

    # Log audit
    audit = models.AuditLog(
        user="Staff",
        action="RETURN_SALE",
        details=f"Returned Invoice {sale.invoice_no}: {reason}"
    )
    db.add(audit)

    db.commit()
    return {"message": f"Invoice {sale.invoice_no} returned and stock restored."}
