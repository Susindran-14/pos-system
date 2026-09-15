from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas
from datetime import datetime

router = APIRouter(prefix="/api/products", tags=["Product Catalog & Inventory"])

@router.get("", response_model=List[schemas.ProductResponse])
def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve products with optional filtering by search query, category, or brand."""
    query = db.query(models.Product)
    if category and category != "All":
        query = query.filter(models.Product.category == category)
    if brand and brand != "All":
        query = query.filter(models.Product.brand == brand)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Product.name.ilike(s)) |
            (models.Product.sku.ilike(s)) |
            (models.Product.barcode.ilike(s))
        )
    return query.order_by(models.Product.name.asc()).all()

@router.get("/barcode/{barcode}", response_model=schemas.ProductResponse)
def get_by_barcode(barcode: str, db: Session = Depends(get_db)):
    """Fast barcode lookup for instant scanner billing."""
    product = db.query(models.Product).filter(
        (models.Product.barcode == barcode) | (models.Product.sku == barcode)
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found for scanned barcode/SKU.")
    return product

@router.get("/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get single product details by ID."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product

@router.post("", response_model=schemas.ProductResponse)
def create_product(product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Add a new product or variant with opening stock movement ledger record."""
    existing = db.query(models.Product).filter(models.Product.sku == product_in.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Product with SKU '{product_in.sku}' already exists.")
    
    product = models.Product(**product_in.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)

    # Automatically log initial stock movement if stock > 0
    if product.stock > 0:
        movement = models.StockMovement(
            product_id=product.id,
            sku=product.sku,
            movement_type="Opening",
            qty=product.stock,
            reference_no="INIT-STOCK",
            notes="Initial Product Stock Entry"
        )
        db.add(movement)
        db.commit()

    return product

@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: int, update_in: schemas.ProductUpdate, db: Session = Depends(get_db)):
    """Update existing product details."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    update_data = update_in.model_dump(exclude_unset=True)
    
    # Check if stock was modified directly to record adjustment
    if "stock" in update_data and update_data["stock"] != product.stock:
        diff = update_data["stock"] - product.stock
        movement = models.StockMovement(
            product_id=product.id,
            sku=product.sku,
            movement_type="Adjustment",
            qty=diff,
            reference_no="MANUAL-ADJ",
            notes=f"Manual Stock Correction (from {product.stock} to {update_data['stock']})"
        )
        db.add(movement)

    for field, value in update_data.items():
        setattr(product, field, value)
    
    product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product item."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    db.delete(product)
    db.commit()
    return {"message": f"Product '{product.name}' deleted successfully."}

# --- CATEGORIES & BRANDS ---
@router.get("/meta/categories", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).filter(models.Category.is_active == True).all()

@router.post("/meta/categories", response_model=schemas.CategoryResponse)
def add_category(cat_in: schemas.CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Category).filter(models.Category.name == cat_in.name).first()
    if existing:
        return existing
    cat = models.Category(name=cat_in.name, code=cat_in.code)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.get("/meta/brands", response_model=List[schemas.BrandResponse])
def get_brands(db: Session = Depends(get_db)):
    return db.query(models.Brand).filter(models.Brand.is_active == True).all()

@router.post("/meta/brands", response_model=schemas.BrandResponse)
def add_brand(brand_in: schemas.BrandCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Brand).filter(models.Brand.name == brand_in.name).first()
    if existing:
        return existing
    brand = models.Brand(name=brand_in.name)
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand
