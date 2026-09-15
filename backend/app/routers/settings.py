from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
import json
import os
import sqlite3
import urllib.request
import urllib.parse
from app.database import get_db, is_sqlite
from app.config import settings as app_settings
from app import models

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

def execute_neon_sql_query(query: str, params: list = None, neon_cs: str = None):
    if neon_cs is None:
        neon_cs = app_settings.DATABASE_URL
        if neon_cs.startswith("postgres://"):
            neon_cs = neon_cs.replace("postgres://", "postgresql://", 1)

    parsed = urllib.parse.urlparse(neon_cs)
    host = parsed.hostname
    if not host or "neon.tech" not in host:
        raise ValueError(f"Invalid or missing Neon connection string host: {host}")

    endpoint = f"https://{host}/sql"
    payload = {"query": query}
    if params:
        payload["params"] = params

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=data,
        headers={
            "Neon-Connection-String": neon_cs,
            "Content-Type": "application/json"
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))

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

@router.get("/db-status")
def get_db_status(db: Session = Depends(get_db)):
    """Retrieve current database engine information and table metrics."""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sqlite_path = os.path.join(base_dir, "pos_local.db")
    if not os.path.exists(sqlite_path):
        sqlite_path = os.path.join(os.getcwd(), "pos_local.db")

    sqlite_exists = os.path.exists(sqlite_path)
    sqlite_size = f"{os.path.getsize(sqlite_path) / 1024:.1f} KB" if sqlite_exists else None

    # Count records in current active database
    stats = {
        "products": db.query(models.Product).count(),
        "sales": db.query(models.Sale).count(),
        "customers": db.query(models.Customer).count(),
        "suppliers": db.query(models.Supplier).count(),
        "categories": db.query(models.Category).count(),
        "brands": db.query(models.Brand).count(),
    }

    db_url = app_settings.DATABASE_URL
    is_neon = "neon.tech" in db_url

    return {
        "active_engine": "Neon Serverless PostgreSQL (Cloud)" if (is_neon and not is_sqlite) else "SQLite (Local File)",
        "is_neon": is_neon,
        "is_sqlite": is_sqlite,
        "sqlite_file_available": sqlite_exists,
        "sqlite_size": sqlite_size,
        "stats": stats
    }

@router.post("/sync-to-neon")
def sync_sqlite_to_neon():
    """
    Sync all tables and records from local SQLite (pos_local.db)
    to remote Neon Serverless PostgreSQL database over HTTPS.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sqlite_path = os.path.join(base_dir, "pos_local.db")
    if not os.path.exists(sqlite_path):
        sqlite_path = os.path.join(os.getcwd(), "pos_local.db")
        
    if not os.path.exists(sqlite_path):
        raise HTTPException(
            status_code=404, 
            detail="Local SQLite database (pos_local.db) was not found on the server to sync from."
        )

    neon_url = app_settings.DATABASE_URL
    if not neon_url or "neon.tech" not in neon_url:
        raise HTTPException(
            status_code=400,
            detail="Valid Neon PostgreSQL DATABASE_URL is not configured in backend environment."
        )

    try:
        sqlite_conn = sqlite3.connect(sqlite_path)
        sqlite_conn.row_factory = sqlite3.Row
        sqlite_cur = sqlite_conn.cursor()

        tables_in_order = [
            "users",
            "store_settings",
            "categories",
            "brands",
            "products",
            "customers",
            "suppliers",
            "expenses",
            "audit_logs",
            "sales",
            "sale_items",
            "purchases",
            "purchase_items",
            "stock_movements"
        ]

        synced_details = {}
        total_records = 0

        for table in tables_in_order:
            try:
                sqlite_cur.execute(f"SELECT count(*) FROM sqlite_master WHERE type='table' AND name=?", (table,))
                if sqlite_cur.fetchone()[0] == 0:
                    continue

                sqlite_cur.execute(f"SELECT * FROM {table}")
                rows = sqlite_cur.fetchall()
                if not rows:
                    synced_details[table] = 0
                    continue

                columns = [desc[0] for desc in sqlite_cur.description]
                col_names_str = ", ".join([f'"{col}"' for col in columns])

                # Delete existing rows in Neon target table
                execute_neon_sql_query(f'DELETE FROM "{table}";', neon_cs=neon_url)

                batch_size = 50
                for i in range(0, len(rows), batch_size):
                    batch = rows[i:i+batch_size]
                    val_placeholders = []
                    params = []
                    p_idx = 1
                    for row in batch:
                        row_placeholders = []
                        for col in columns:
                            val = row[col]
                            row_placeholders.append(f"${p_idx}")
                            p_idx += 1
                            params.append(val)
                        val_placeholders.append(f"({', '.join(row_placeholders)})")

                    insert_query = f'INSERT INTO "{table}" ({col_names_str}) VALUES {", ".join(val_placeholders)};'
                    execute_neon_sql_query(insert_query, params=params, neon_cs=neon_url)

                # Reset Postgres sequence for ID if exists
                if "id" in columns:
                    try:
                        execute_neon_sql_query(
                            f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) FROM \"{table}\"), 1), true);",
                            neon_cs=neon_url
                        )
                    except Exception:
                        pass

                synced_details[table] = len(rows)
                total_records += len(rows)
            except Exception as table_err:
                print(f"Error syncing {table}: {table_err}")
                synced_details[table] = f"Error: {str(table_err)}"

        sqlite_conn.close()

        return {
            "success": True,
            "message": f"Successfully synced {total_records} records across {len(synced_details)} tables to Neon Cloud DB!",
            "total_records": total_records,
            "details": synced_details
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync SQLite to Neon DB: {str(e)}")
