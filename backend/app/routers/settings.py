from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database import get_db
from app import models
import json

router = APIRouter(prefix="/api/settings", tags=["Store Settings & Configuration"])

DEFAULT_SETTINGS = {
    "storeName": "TAMIL DRESS COLLECTION",
    "storeNameTamil": "தமிழ் டிரஸ் கலெக்ஷன்",
    "address": "142, Main Road, Near Bus Stand, Salem - 636001",
    "gstin": "33ABCDE1234F1Z5",
    "phone": "9876543210",
    "upiId": "tamildress@upi",
    "printerWidth": "80mm", # 80mm, 58mm, A4
    "roundOffEnabled": True,
    "taxCalculationType": "Local", # Local (CGST+SGST) or Interstate (IGST)
    "currencySymbol": "₹"
}

@router.get("")
def get_settings(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Retrieve all store settings."""
    settings_records = db.query(models.StoreSetting).all()
    if not settings_records:
        # Initialize default settings
        for key, val in DEFAULT_SETTINGS.items():
            s = models.StoreSetting(key=key, value=json.dumps(val))
            db.add(s)
        db.commit()
        return DEFAULT_SETTINGS
    
    result = {}
    for item in settings_records:
        try:
            result[item.key] = json.loads(item.value)
        except Exception:
            result[item.key] = item.value
    return result

@router.put("")
def update_settings(new_settings: Dict[str, Any], db: Session = Depends(get_db)):
    """Update store settings."""
    for key, val in new_settings.items():
        record = db.query(models.StoreSetting).filter(models.StoreSetting.key == key).first()
        val_str = json.dumps(val)
        if record:
            record.value = val_str
        else:
            db.add(models.StoreSetting(key=key, value=val_str))
    
    db.commit()
    return {"message": "Settings updated successfully."}
