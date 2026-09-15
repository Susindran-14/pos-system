import os
import sys
import sqlite3
import json
import urllib.request
import urllib.parse

# Ensure app path is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import settings

def execute_neon_sql(query, params=None, neon_cs=None):
    """
    Executes a SQL query against Neon Serverless PostgreSQL using the HTTPS API (Port 443),
    which bypasses all ISP / router TCP port 5432 blocking.
    """
    if neon_cs is None:
        neon_cs = settings.DATABASE_URL
        if neon_cs.startswith("postgres://"):
            neon_cs = neon_cs.replace("postgres://", "postgresql://", 1)

    parsed = urllib.parse.urlparse(neon_cs)
    host = parsed.hostname
    if not host or "neon.tech" not in host:
        raise ValueError(f"Invalid Neon connection string host: {host}")

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

    with urllib.request.urlopen(req, timeout=15) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        return result

def migrate_sqlite_to_neon():
    """
    Migrate all data from local SQLite database (pos_local.db)
    to remote Neon PostgreSQL database over secure HTTPS (port 443).
    """
    sqlite_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pos_local.db")
    if not os.path.exists(sqlite_path):
        print(f"❌ Error: Local database '{sqlite_path}' not found.")
        return

    neon_url = "postgresql://neondb_owner:npg_f2mTxRAVWM0U@ep-cool-glitter-az63etx4.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

    print("=" * 70)
    print("TAMIL DRESS COLLECTION - POS DATA MIGRATION (SQLite -> Neon DB)")
    print("=" * 70)
    print(f"Source SQLite DB : {sqlite_path}")
    print(f"Target Neon DB   : Neon Cloud PostgreSQL (over secure HTTPS Port 443)")
    print("=" * 70)

    # 1. Connect to SQLite
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

    print("\n[1/2] Migrating tables & data to Neon Cloud...")
    total_records = 0

    for table in tables_in_order:
        try:
            # Check if table exists in SQLite
            sqlite_cur.execute(f"SELECT count(*) FROM sqlite_master WHERE type='table' AND name=?", (table,))
            if sqlite_cur.fetchone()[0] == 0:
                continue

            # Fetch rows from SQLite
            sqlite_cur.execute(f"SELECT * FROM {table}")
            rows = sqlite_cur.fetchall()
            if not rows:
                print(f"   • {table.ljust(18)} : 0 rows (empty)")
                continue

            columns = [desc[0] for desc in sqlite_cur.description]
            col_names_str = ", ".join([f'"{col}"' for col in columns])

            # Clear existing target data in Neon
            execute_neon_sql(f'DELETE FROM "{table}";', neon_cs=neon_url)

            # Insert rows in batches
            batch_size = 50
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i+batch_size]
                # Build parameterized insert
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
                execute_neon_sql(insert_query, params=params, neon_cs=neon_url)

            # Reset Postgres sequence for id column if present
            if "id" in columns:
                try:
                    execute_neon_sql(
                        f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) FROM \"{table}\"), 1), true);",
                        neon_cs=neon_url
                    )
                except Exception:
                    pass

            count = len(rows)
            total_records += count
            print(f"   * {table.ljust(18)} : [OK] {count} rows synced to Neon.")

        except Exception as err:
            print(f"   * {table.ljust(18)} : [ERR] Sync error: {err}")

    sqlite_conn.close()

    print("\n[2/2] Migration Summary:")
    print(f"      Completed! Total {total_records} records successfully synced to your Neon database.")
    print("=" * 70)

if __name__ == "__main__":
    migrate_sqlite_to_neon()


