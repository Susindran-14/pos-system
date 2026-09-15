from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.database import get_db
from app import models
import time

router = APIRouter(prefix="/api/scanner", tags=["Mobile Wireless Scanner Gun Bridge"])

# In-memory session store for lightning-fast cross-device synchronization
# Structure: { session_id: { "pending_scans": [...], "cart_status": {...}, "last_active": timestamp } }
scanner_sessions: Dict[str, Dict[str, Any]] = {}

class ScanPayload(BaseModel):
    session_id: str
    barcode: str

class CartStatusPayload(BaseModel):
    session_id: str
    total_items: int
    grand_total: float
    last_item_name: Optional[str] = None
    last_item_price: Optional[float] = None

def get_or_create_session(session_id: str) -> Dict[str, Any]:
    now = time.time()
    # Clean up old sessions (> 2 hours old)
    stale_keys = [k for k, v in scanner_sessions.items() if now - v.get("last_active", 0) > 7200]
    for k in stale_keys:
        scanner_sessions.pop(k, None)

    if session_id not in scanner_sessions:
        scanner_sessions[session_id] = {
            "pending_scans": [],
            "history": [],
            "cart_status": {
                "total_items": 0,
                "grand_total": 0.0,
                "last_item_name": "No items scanned yet",
                "last_item_price": 0.0,
                "updated_at": now,
            },
            "last_active": now,
        }
    session = scanner_sessions[session_id]
    session["last_active"] = now
    return session

@router.post("/push")
def push_barcode_scan(payload: ScanPayload, db: Session = Depends(get_db)):
    """
    Called by the smartphone scanner gun when a barcode is scanned.
    Looks up product and queues it for the active POS terminal.
    """
    session = get_or_create_session(payload.session_id)
    raw_barcode = payload.barcode.strip()
    if not raw_barcode:
        raise HTTPException(status_code=400, detail="Barcode cannot be empty")

    # Look up product in database
    product = db.query(models.Product).filter(
        (models.Product.barcode == raw_barcode) | (models.Product.sku.ilike(raw_barcode))
    ).first()

    product_info = None
    if product:
        product_info = {
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "barcode": product.barcode or raw_barcode,
            "selling_price": float(product.selling_price),
            "mrp": float(product.mrp or product.selling_price),
            "size": product.size or "",
            "color": product.color or "",
            "category": product.category or "Apparel",
            "stock": product.stock,
            "gst_rate": float(product.gst_rate or 5.0),
        }
    else:
        product_info = {
            "id": None,
            "name": f"Item ({raw_barcode})",
            "sku": raw_barcode,
            "barcode": raw_barcode,
            "selling_price": 0.0,
            "mrp": 0.0,
            "size": "",
            "color": "",
            "category": "General",
            "stock": 1,
            "gst_rate": 5.0,
            "unregistered": True
        }

    scan_entry = {
        "id": f"scan_{int(time.time() * 1000)}",
        "barcode": raw_barcode,
        "product": product_info,
        "timestamp": time.time(),
    }

    session["pending_scans"].append(scan_entry)
    session["history"].insert(0, scan_entry)
    if len(session["history"]) > 50:
        session["history"] = session["history"][:50]

    return {
        "status": "success",
        "message": f"Scanned: {product_info['name']}",
        "product": product_info,
        "cart_status": session["cart_status"],
    }

@router.get("/poll/{session_id}")
def poll_scans_for_pos(session_id: str):
    """
    Called periodically by the desktop POS terminal to retrieve new scans sent by the smartphone.
    """
    session = get_or_create_session(session_id)
    scans = list(session["pending_scans"])
    session["pending_scans"].clear()
    return {
        "session_id": session_id,
        "scans": scans,
        "has_scans": len(scans) > 0,
    }

@router.post("/sync-cart")
def sync_cart_status(payload: CartStatusPayload):
    """
    Called by the POS terminal to update the live cart counter displayed on the mobile scanner gun.
    """
    session = get_or_create_session(payload.session_id)
    session["cart_status"] = {
        "total_items": payload.total_items,
        "grand_total": round(payload.grand_total, 2),
        "last_item_name": payload.last_item_name or "Item added",
        "last_item_price": round(payload.last_item_price or 0.0, 2),
        "updated_at": time.time(),
    }
    return {"status": "synced", "cart_status": session["cart_status"]}

@router.get("/cart-status/{session_id}")
def get_cart_status(session_id: str):
    """
    Called by the smartphone scanner gun to fetch the live POS counter.
    """
    session = get_or_create_session(session_id)
    return {
        "session_id": session_id,
        "cart_status": session["cart_status"],
        "history": session["history"][:10],
    }
