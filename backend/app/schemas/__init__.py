from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- AUTH SCHEMAS ---
class LoginRequest(BaseModel):
    pin: str = Field(..., description="4-digit security PIN")

class UserCreate(BaseModel):
    username: str
    pin: str
    name: str
    role: str = "ADMIN"

class UserResponse(BaseModel):
    id: int
    username: str
    name: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- PRODUCT SCHEMAS ---
class ProductBase(BaseModel):
    sku: str
    barcode: str
    name: str
    category: str = "General"
    brand: str = "Generic"
    size: str = "Free Size"
    color: str = "Standard"
    fabric: str = "Cotton"
    hsn: str = "6205"
    gst_rate: float = 5.0
    cost_price: float = 0.0
    selling_price: float = 0.0
    mrp: float = 0.0
    stock: int = 0
    reorder_level: int = 5
    supplier_id: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    barcode: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    fabric: Optional[str] = None
    hsn: Optional[str] = None
    gst_rate: Optional[float] = None
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    mrp: Optional[float] = None
    stock: Optional[int] = None
    reorder_level: Optional[int] = None
    supplier_id: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- CUSTOMER SCHEMAS ---
class CustomerBase(BaseModel):
    mobile: str
    name: str
    email: Optional[str] = None
    address: Optional[str] = None
    loyalty_points: int = 0
    outstanding_due: float = 0.0
    total_purchases: float = 0.0
    last_purchase_date: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    loyalty_points: Optional[int] = None
    outstanding_due: Optional[float] = None

class CustomerResponse(CustomerBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- SUPPLIER SCHEMAS ---
class SupplierBase(BaseModel):
    code: str
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    gstin: Optional[str] = None
    total_purchases: float = 0.0
    paid: float = 0.0
    outstanding_due: float = 0.0

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    gstin: Optional[str] = None
    paid: Optional[float] = None
    outstanding_due: Optional[float] = None

class SupplierResponse(SupplierBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- SALE & BILLING SCHEMAS ---
class SaleItemCreate(BaseModel):
    product_id: Optional[int] = None
    sku: str
    name: str
    size: str = ""
    color: str = ""
    qty: int = 1
    rate: float
    mrp: float
    discount_type: str = "flat"
    discount_value: float = 0.0
    discount_amount: float = 0.0
    gst_rate: float = 5.0
    taxable_amount: float
    cgst: float
    sgst: float
    igst: float = 0.0
    total: float

class SaleItemResponse(SaleItemCreate):
    id: int
    sale_id: int

    class Config:
        from_attributes = True

class SaleCreate(BaseModel):
    customer_id: Optional[int] = None
    customer_name: str = "Walk-in Customer"
    customer_mobile: str = ""
    items: List[SaleItemCreate]
    subtotal: float
    item_discount: float = 0.0
    bill_discount: float = 0.0
    taxable_amount: float
    cgst: float
    sgst: float
    igst: float = 0.0
    round_off: float = 0.0
    grand_total: float
    payment_mode: str = "Cash"
    amount_paid: float
    change_returned: float = 0.0
    loyalty_points_redeemed: Optional[int] = 0
    notes: Optional[str] = None

class SaleResponse(BaseModel):
    id: int
    invoice_no: str
    date_time: datetime
    customer_id: Optional[int] = None
    customer_name: str
    customer_mobile: str
    subtotal: float
    item_discount: float
    bill_discount: float
    taxable_amount: float
    cgst: float
    sgst: float
    igst: float
    round_off: float
    grand_total: float
    payment_mode: str
    amount_paid: float
    change_returned: float
    status: str
    notes: Optional[str] = None
    items: List[SaleItemResponse] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- PURCHASE SCHEMAS ---
class PurchaseItemCreate(BaseModel):
    product_id: Optional[int] = None
    sku: str
    name: str
    qty: int
    unit_cost: float
    gst_rate: float = 5.0
    total: float

class PurchaseItemResponse(PurchaseItemCreate):
    id: int
    purchase_id: int

    class Config:
        from_attributes = True

class PurchaseCreate(BaseModel):
    supplier_id: Optional[int] = None
    supplier_name: str
    purchase_date: Optional[datetime] = None
    invoice_ref: Optional[str] = None
    items: List[PurchaseItemCreate]
    subtotal: float
    tax_amount: float
    grand_total: float
    paid_amount: float
    balance_due: float
    payment_status: str = "Paid"
    notes: Optional[str] = None

class PurchaseResponse(BaseModel):
    id: int
    purchase_no: str
    supplier_id: Optional[int] = None
    supplier_name: str
    purchase_date: datetime
    invoice_ref: Optional[str] = None
    subtotal: float
    tax_amount: float
    grand_total: float
    paid_amount: float
    balance_due: float
    payment_status: str
    notes: Optional[str] = None
    items: List[PurchaseItemResponse] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- EXPENSE SCHEMAS ---
class ExpenseCreate(BaseModel):
    expense_date: str
    category: str
    description: Optional[str] = None
    payment_method: str = "Cash"
    amount: float

class ExpenseResponse(ExpenseCreate):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- STOCK MOVEMENT SCHEMAS ---
class StockMovementResponse(BaseModel):
    id: int
    product_id: Optional[int] = None
    sku: str
    movement_type: str
    qty: int
    reference_no: Optional[str] = None
    date_time: datetime
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# --- CATEGORY & BRAND SCHEMAS ---
class CategoryCreate(BaseModel):
    name: str
    code: Optional[str] = None

class CategoryResponse(BaseModel):
    id: int
    name: str
    code: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class BrandCreate(BaseModel):
    name: str

class BrandResponse(BaseModel):
    id: int
    name: str
    is_active: bool

    class Config:
        from_attributes = True

# --- AUDIT LOG SCHEMA ---
class AuditLogResponse(BaseModel):
    id: int
    user: str
    action: str
    details: Optional[str] = None
    timestamp: datetime
    ip_address: Optional[str] = None

    class Config:
        from_attributes = True
