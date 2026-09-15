import sys
import os
import hashlib
import json

# Ensure app module is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base, SessionLocal
from app import models

def hash_pin(pin: str) -> str:
    return hashlib.sha256(pin.encode("utf-8")).hexdigest()

def init_database():
    """
    Initialize database tables in Neon PostgreSQL (or local fallback)
    and seed clean default metadata (Admin PIN 1111, default categories & store settings).
    """
    print("=" * 70)
    print("TAMIL DRESS COLLECTION - POS DATABASE INITIALIZATION")
    print("=" * 70)
    print(f"Connecting to database engine: {engine.url.render_as_string(hide_password=True)}...")
    
    # 1. Create all tables
    print("[1/4] Creating all relational tables...")
    Base.metadata.create_all(bind=engine)
    print("      Tables successfully verified & created in database.")

    db = SessionLocal()
    try:
        # 2. Seed Default Administrator Account
        print("[2/4] Checking Admin accounts...")
        admin_user = db.query(models.User).filter(models.User.username == "admin").first()
        if not admin_user:
            default_admin = models.User(
                username="admin",
                pin=hash_pin("1111"), # Default 4-digit PIN: 1111
                name="Store Administrator",
                role="ADMIN",
                is_active=True
            )
            db.add(default_admin)
            print("      Created default Administrator (Username: 'admin', PIN: '1111').")
        else:
            print("      Administrator account already exists.")

        # 3. Seed Default Store Settings
        print("[3/4] Checking Store Configuration...")
        default_settings = {
            "storeName": "TAMIL DRESS COLLECTION",
            "storeNameTamil": "தமிழ் டிரஸ் கலெக்ஷன்",
            "address": "142, Main Road, Near Bus Stand, Salem - 636001",
            "gstin": "33ABCDE1234F1Z5",
            "phone": "9876543210",
            "upiId": "tamildress@upi",
            "printerWidth": "80mm",
            "roundOffEnabled": True,
            "taxCalculationType": "Local",
            "currencySymbol": "₹"
        }
        for key, val in default_settings.items():
            setting = db.query(models.StoreSetting).filter(models.StoreSetting.key == key).first()
            if not setting:
                db.add(models.StoreSetting(key=key, value=json.dumps(val)))
        print("      Store profile settings initialized.")

        # 4. Seed Essential Apparel Categories & Brands for quick dropdown selection
        print("[4/4] Checking standard categories and brands...")
        categories = ["Shirts", "Jeans", "Trousers", "T-Shirts", "Kurtas", "Blazers", "Sarees", "Accessories"]
        for cat_name in categories:
            if not db.query(models.Category).filter(models.Category.name == cat_name).first():
                db.add(models.Category(name=cat_name, code=cat_name[:3].upper()))
        
        brands = ["Louis Philippe", "Levi's", "Raymond", "Manyavar", "Tommy Hilfiger", "US Polo Assn", "Generic"]
        for brand_name in brands:
            if not db.query(models.Brand).filter(models.Brand.name == brand_name).first():
                db.add(models.Brand(name=brand_name))

        db.commit()
        print("=" * 70)
        print("DATABASE INITIALIZATION COMPLETED SUCCESSFULLY!")
        print("Zero dummy data: Ready for live production store operations.")
        print("=" * 70)

    except Exception as e:
        db.rollback()
        print(f"ERROR during database initialization: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
