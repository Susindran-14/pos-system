from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/inventory", tags=["Inventory Valuation & Stock Movements"])

class StockAdjustmentRequest(BaseModel):
    sku: str
    new_stock: int
    reason: str = "Manual Physical Count Correction"

@router.get("/summary")
def get_inventory_summary(db: Session = Depends(get_db)):
    """Get total inventory stock valuation and low stock count."""
    products = db.query(models.Product).all()
    
    total_items = len(products)
    total_units = sum(p.stock for p in products)
    cost_valuation = sum(p.stock * p.cost_price for p in products)
    retail_valuation = sum(p.stock * p.selling_price for p in products)
    low_stock_items = [p for p in products if p.stock <= p.reorder_level]
    out_of_stock_items = [p for p in products if p.stock == 0]

    return {
        "total_items": total_items,
        "total_units": total_units,
        "cost_valuation": round(cost_valuation, 2),
        "retail_valuation": round(retail_valuation, 2),
        "potential_profit": round(retail_valuation - cost_valuation, 2),
        "low_stock_count": len(low_stock_items),
        "out_of_stock_count": len(out_of_stock_items)
    }

@router.get("/movements", response_model=List[schemas.StockMovementResponse])
def get_stock_movements(sku: Optional[str] = None, limit: int = 100, db: Session = Depends(get_db)):
    """Get stock movement ledger records."""
    query = db.query(models.StockMovement)
    if sku:
        query = query.filter(models.StockMovement.sku == sku)
    return query.order_by(models.StockMovement.id.desc()).limit(limit).all()

@router.post("/adjust")
def adjust_stock(req: StockAdjustmentRequest, db: Session = Depends(get_db)):
    """Manually adjust product stock level and write to movement ledger."""
    product = db.query(models.Product).filter(models.Product.sku == req.sku).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    old_stock = product.stock
    diff = req.new_stock - old_stock
    product.stock = req.new_stock
    
    movement = models.StockMovement(
        product_id=product.id,
        sku=product.sku,
        movement_type="Adjustment",
        qty=diff,
        reference_no="MANUAL-ADJ",
        notes=f"{req.reason} (Stock adjusted from {old_stock} to {req.new_stock})"
    )
    db.add(movement)

    audit = models.AuditLog(
        user="Staff",
        action="STOCK_ADJUSTMENT",
        details=f"Adjusted {product.sku} ({product.name}) from {old_stock} to {req.new_stock}: {req.reason}"
    )
    db.add(audit)

    db.commit()
    return {"message": f"Stock for {product.name} updated to {req.new_stock}.", "diff": diff}
