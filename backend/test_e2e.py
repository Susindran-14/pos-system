import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_api():
    print("=" * 60)
    print("RUNNING END-TO-END API TESTS ON FASTAPI POS BACKEND")
    print("=" * 60)

    # 1. Health check
    res = requests.get("http://localhost:8000/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[1/8] Health Check: OK")

    # 2. Auth Login with PIN
    res = requests.post(f"{BASE_URL}/auth/login", json={"pin": "1111"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    user = res.json()
    print(f"[2/8] Auth PIN Login: OK (Logged in as '{user['name']}', Role: '{user['role']}')")

    # 3. Add a Garment / Product
    test_prod = {
        "sku": "SH-SILK-001",
        "barcode": "8901001",
        "name": "Kancheepuram Silk Party Shirt",
        "category": "Shirts",
        "brand": "Louis Philippe",
        "size": "L",
        "color": "Maroon Gold",
        "fabric": "Silk Blend",
        "hsn": "6205",
        "gst_rate": 5.0,
        "cost_price": 750.0,
        "selling_price": 1899.0,
        "mrp": 2299.0,
        "stock": 25,
        "reorder_level": 5
    }
    res = requests.post(f"{BASE_URL}/products", json=test_prod)
    if res.status_code == 400 and "already exists" in res.text:
        res = requests.get(f"{BASE_URL}/products/barcode/8901001")
    assert res.status_code == 200, f"Create product failed: {res.text}"
    prod = res.json()
    print(f"[3/8] Product Master: OK (Created '{prod['name']}', SKU: {prod['sku']}, Stock: {prod['stock']})")

    # 4. Barcode Quick Lookup
    res = requests.get(f"{BASE_URL}/products/barcode/8901001")
    assert res.status_code == 200, f"Barcode lookup failed: {res.text}"
    print(f"[4/8] Barcode Scanner Lookup: OK (Found '{res.json()['name']}')")

    # 5. Customer Registration
    test_cust = {
        "mobile": "9876543210",
        "name": "Senthil Kumar",
        "email": "senthil@gmail.com",
        "address": "12, Extension Nagar, Salem"
    }
    res = requests.post(f"{BASE_URL}/customers", json=test_cust)
    assert res.status_code == 200, f"Customer registration failed: {res.text}"
    cust = res.json()
    print(f"[5/8] Customer CRM: OK (Customer: {cust['name']}, Mobile: {cust['mobile']})")

    # 6. Process POS Sale Transaction (Billing Engine)
    sale_payload = {
        "customer_id": cust["id"],
        "customer_name": cust["name"],
        "customer_mobile": cust["mobile"],
        "items": [
            {
                "product_id": prod["id"],
                "sku": prod["sku"],
                "name": prod["name"],
                "size": prod["size"],
                "color": prod["color"],
                "qty": 2,
                "rate": 1899.0,
                "mrp": 2299.0,
                "discount_type": "flat",
                "discount_value": 0.0,
                "discount_amount": 0.0,
                "gst_rate": 5.0,
                "taxable_amount": 3617.14,
                "cgst": 90.43,
                "sgst": 90.43,
                "igst": 0.0,
                "total": 3798.0
            }
        ],
        "subtotal": 3798.0,
        "item_discount": 0.0,
        "bill_discount": 0.0,
        "taxable_amount": 3617.14,
        "cgst": 90.43,
        "sgst": 90.43,
        "igst": 0.0,
        "round_off": 0.0,
        "grand_total": 3798.0,
        "payment_mode": "UPI",
        "amount_paid": 3798.0,
        "change_returned": 0.0,
        "notes": "E2E Automated POS Test Sale"
    }
    res = requests.post(f"{BASE_URL}/sales", json=sale_payload)
    assert res.status_code == 200, f"POS Sale failed: {res.text}"
    sale = res.json()
    print(f"[6/8] POS Billing Engine: OK (Generated Invoice #{sale['invoice_no']}, Total: Rs.{sale['grand_total']})")

    # Verify inventory was automatically deducted
    res = requests.get(f"{BASE_URL}/products/{prod['id']}")
    updated_prod = res.json()
    assert updated_prod["stock"] == prod["stock"] - 2, f"Stock deduction failed: expected {prod['stock']-2}, got {updated_prod['stock']}"
    print(f"[7/8] Automated Stock Deduction: OK (Stock reduced from {prod['stock']} -> {updated_prod['stock']})")

    # 7. Dashboard Analytics
    res = requests.get(f"{BASE_URL}/reports/dashboard")
    assert res.status_code == 200, f"Dashboard reports failed: {res.text}"
    dash = res.json()
    print(f"[8/8] Dashboard Analytics & Reports: OK (Today Sales: Rs.{dash['today_sales']}, Invoices: {dash['today_invoices']})")

    print("=" * 60)
    print("ALL END-TO-END TESTS PASSED SUCCESSFULLY (100% OPERATIONAL)")
    print("=" * 60)

if __name__ == "__main__":
    test_api()
