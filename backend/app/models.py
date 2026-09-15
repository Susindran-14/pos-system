from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    pin = Column(String(100), nullable=False) # 4-digit PIN for fast POS lock/unlock
    name = Column(String(100), nullable=False)
    role = Column(String(20), default="ADMIN") # ADMIN or CASHIER
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class StoreSetting(Base):
    __tablename__ = "store_settings"

    key = Column(String(50), primary_key=True, index=True)
    value = Column(Text, nullable=False)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    barcode = Column(String(50), index=True, nullable=False)
    name = Column(String(200), nullable=False)
    category = Column(String(100), index=True, default="General")
    brand = Column(String(100), index=True, default="Generic")
    size = Column(String(20), default="Free Size")
    color = Column(String(50), default="Standard")
    fabric = Column(String(50), default="Cotton")
    hsn = Column(String(20), default="6205")
    gst_rate = Column(Float, default=5.0)
    cost_price = Column(Float, default=0.0)
    selling_price = Column(Float, default=0.0)
    mrp = Column(Float, default=0.0)
    stock = Column(Integer, default=0)
    reorder_level = Column(Integer, default=5)
    supplier_id = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    mobile = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    loyalty_points = Column(Integer, default=0)
    outstanding_due = Column(Float, default=0.0)
    total_purchases = Column(Float, default=0.0)
    last_purchase_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    gstin = Column(String(30), nullable=True)
    total_purchases = Column(Float, default=0.0)
    paid = Column(Float, default=0.0)
    outstanding_due = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    invoice_no = Column(String(50), unique=True, index=True, nullable=False)
    date_time = Column(DateTime, default=datetime.utcnow, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    customer_name = Column(String(100), default="Walk-in Customer")
    customer_mobile = Column(String(20), default="")
    subtotal = Column(Float, default=0.0)
    item_discount = Column(Float, default=0.0)
    bill_discount = Column(Float, default=0.0)
    taxable_amount = Column(Float, default=0.0)
    cgst = Column(Float, default=0.0)
    sgst = Column(Float, default=0.0)
    igst = Column(Float, default=0.0)
    round_off = Column(Float, default=0.0)
    grand_total = Column(Float, default=0.0)
    payment_mode = Column(String(50), default="Cash")
    amount_paid = Column(Float, default=0.0)
    change_returned = Column(Float, default=0.0)
    status = Column(String(30), default="Completed") # Completed, Returned, Cancelled
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")

class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    sku = Column(String(50), nullable=False)
    name = Column(String(200), nullable=False)
    size = Column(String(20), default="")
    color = Column(String(50), default="")
    qty = Column(Integer, default=1)
    rate = Column(Float, default=0.0)
    mrp = Column(Float, default=0.0)
    discount_type = Column(String(20), default="flat")
    discount_value = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    gst_rate = Column(Float, default=5.0)
    taxable_amount = Column(Float, default=0.0)
    cgst = Column(Float, default=0.0)
    sgst = Column(Float, default=0.0)
    igst = Column(Float, default=0.0)
    total = Column(Float, default=0.0)

    sale = relationship("Sale", back_populates="items")

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    purchase_no = Column(String(50), unique=True, index=True, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True)
    supplier_name = Column(String(150), nullable=False)
    purchase_date = Column(DateTime, default=datetime.utcnow)
    invoice_ref = Column(String(50), nullable=True)
    subtotal = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    grand_total = Column(Float, default=0.0)
    paid_amount = Column(Float, default=0.0)
    balance_due = Column(Float, default=0.0)
    payment_status = Column(String(30), default="Paid")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("PurchaseItem", back_populates="purchase", cascade="all, delete-orphan")

class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    sku = Column(String(50), nullable=False)
    name = Column(String(200), nullable=False)
    qty = Column(Integer, default=1)
    unit_cost = Column(Float, default=0.0)
    gst_rate = Column(Float, default=5.0)
    total = Column(Float, default=0.0)

    purchase = relationship("Purchase", back_populates="items")

class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    sku = Column(String(50), index=True, nullable=False)
    movement_type = Column(String(50), nullable=False) # Opening, Sale, Purchase, Return, Adjustment
    qty = Column(Integer, nullable=False) # Positive or negative
    reference_no = Column(String(50), nullable=True)
    date_time = Column(DateTime, default=datetime.utcnow, index=True)
    notes = Column(Text, nullable=True)

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    expense_date = Column(String(50), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    payment_method = Column(String(50), default="Cash")
    amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String(100), default="Admin")
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(50), nullable=True)
