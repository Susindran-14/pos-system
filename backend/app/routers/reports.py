from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
from app.database import get_db
from app import models, schemas
from datetime import datetime, date

router = APIRouter(prefix="/api/reports", tags=["Analytics & Financial Audit Reports"])

@router.get("/dashboard")
def get_dashboard_kpis(db: Session = Depends(get_db)):
    """Live dashboard KPIs & analytics for management and POS counters."""
    today = datetime.utcnow().date()
    sales = db.query(models.Sale).filter(models.Sale.status != "Returned").all()
    today_sales = [s for s in sales if s.date_time and s.date_time.date() == today]
    
    # Calculate today's sales metrics
    today_sales_total = sum(s.grand_total for s in today_sales)
    today_bills_count = len(today_sales)
    
    # Fetch all products once to calculate low stock and cost lookup
    products = db.query(models.Product).all()
    cost_map = {p.sku: p.cost_price for p in products if p.sku}
    low_stock_count = len([p for p in products if p.stock <= p.reorder_level])

    # Estimate today's profit: (selling total - cost total)
    today_cost_total = 0.0
    for sale in today_sales:
        for item in sale.items:
            cost = cost_map.get(item.sku, (item.rate or 0) * 0.5)
            today_cost_total += (cost * (item.qty or 0))
    today_profit = max(0.0, today_sales_total - today_cost_total)

    # Payment mode breakdown for today
    payment_breakdown = {}
    for s in today_sales:
        mode = s.payment_mode or "Cash"
        payment_breakdown[mode] = payment_breakdown.get(mode, 0.0) + s.grand_total

    # Hourly sales trend for today (08:00 to 22:00)
    hourly_trend = []
    for hour in range(8, 22):
        hour_sales = sum(
            s.grand_total for s in today_sales 
            if s.date_time and s.date_time.hour == hour
        )
        hourly_trend.append({
            "hour": f"{hour:02d}:00",
            "amount": round(hour_sales, 2)
        })

    # Top selling apparel items
    item_sales_map = {}
    for s in sales:
        for item in s.items:
            key = (item.sku, item.name)
            item_sales_map[key] = item_sales_map.get(key, 0) + item.qty
    
    top_selling = [
        {"sku": k[0], "name": k[1], "qty_sold": qty}
        for k, qty in sorted(item_sales_map.items(), key=lambda x: x[1], reverse=True)[:6]
    ]

    # Recent sales
    recent_sales = db.query(models.Sale).order_by(models.Sale.id.desc()).limit(8).all()

    return {
        "today_sales": round(today_sales_total, 2),
        "today_profit": round(today_profit, 2),
        "today_invoices": today_bills_count,
        "low_stock_count": low_stock_count,
        "payment_breakdown": payment_breakdown,
        "hourly_trend": hourly_trend,
        "top_selling": top_selling,
        "recent_sales": [
            {
                "id": s.id,
                "invoice_no": s.invoice_no,
                "customer_name": s.customer_name,
                "grand_total": s.grand_total,
                "payment_mode": s.payment_mode,
                "date_time": s.date_time.strftime("%H:%M") if s.date_time else "",
                "status": s.status
            }
            for s in recent_sales
        ]
    }

@router.get("/gst-summary")
def get_gst_summary(db: Session = Depends(get_db)):
    """GST & Tax breakdown summary (GSTR-1 compliant)."""
    sales = db.query(models.Sale).filter(models.Sale.status != "Returned").all()
    
    tax_slabs = {
        "5%": {"taxable": 0.0, "cgst": 0.0, "sgst": 0.0, "igst": 0.0, "total_tax": 0.0},
        "12%": {"taxable": 0.0, "cgst": 0.0, "sgst": 0.0, "igst": 0.0, "total_tax": 0.0},
        "18%": {"taxable": 0.0, "cgst": 0.0, "sgst": 0.0, "igst": 0.0, "total_tax": 0.0},
        "0%": {"taxable": 0.0, "cgst": 0.0, "sgst": 0.0, "igst": 0.0, "total_tax": 0.0},
    }

    for sale in sales:
        for item in sale.items:
            rate_str = f"{int(item.gst_rate)}%"
            if rate_str not in tax_slabs:
                tax_slabs[rate_str] = {"taxable": 0.0, "cgst": 0.0, "sgst": 0.0, "igst": 0.0, "total_tax": 0.0}
            
            tax_slabs[rate_str]["taxable"] += item.taxable_amount
            tax_slabs[rate_str]["cgst"] += item.cgst
            tax_slabs[rate_str]["sgst"] += item.sgst
            tax_slabs[rate_str]["igst"] += item.igst
            tax_slabs[rate_str]["total_tax"] += (item.cgst + item.sgst + item.igst)

    # Format numbers
    for k in tax_slabs:
        for sub_k in tax_slabs[k]:
            tax_slabs[k][sub_k] = round(tax_slabs[k][sub_k], 2)

    total_taxable = sum(s.taxable_amount for s in sales)
    total_tax = sum(s.cgst + s.sgst + s.igst for s in sales)
    total_revenue = sum(s.grand_total for s in sales)

    return {
        "slabs": tax_slabs,
        "total_taxable": round(total_taxable, 2),
        "total_tax": round(total_tax, 2),
        "total_revenue": round(total_revenue, 2)
    }

@router.get("/day-end-zreport")
def get_day_end_zreport(date_str: Optional[str] = None, db: Session = Depends(get_db)):
    """Z-Report / Day-end Cashier Closeout calculation."""
    if date_str:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    else:
        target_date = datetime.utcnow().date()

    sales = db.query(models.Sale).all()
    day_sales = [s for s in sales if s.date_time and s.date_time.date() == target_date]
    
    expenses = db.query(models.Expense).all()
    day_expenses = [e for e in expenses if e.expense_date == str(target_date)]

    cash_sales = sum(s.amount_paid for s in day_sales if s.payment_mode == "Cash" and s.status != "Returned")
    upi_sales = sum(s.grand_total for s in day_sales if s.payment_mode == "UPI" and s.status != "Returned")
    card_sales = sum(s.grand_total for s in day_sales if s.payment_mode == "Card" and s.status != "Returned")
    credit_sales = sum(s.grand_total for s in day_sales if s.payment_mode == "Credit" and s.status != "Returned")
    total_returns = sum(s.grand_total for s in day_sales if s.status == "Returned")
    total_expenses = sum(e.amount for e in day_expenses)
    cash_expenses = sum(e.amount for e in day_expenses if e.payment_method == "Cash")

    expected_drawer_cash = max(0.0, cash_sales - cash_expenses)

    return {
        "report_date": str(target_date),
        "total_bills": len(day_sales),
        "cash_sales": round(cash_sales, 2),
        "upi_sales": round(upi_sales, 2),
        "card_sales": round(card_sales, 2),
        "credit_sales": round(credit_sales, 2),
        "total_gross_sales": round(cash_sales + upi_sales + card_sales + credit_sales, 2),
        "total_returns": round(total_returns, 2),
        "total_expenses": round(total_expenses, 2),
        "cash_expenses": round(cash_expenses, 2),
        "expected_drawer_cash": round(expected_drawer_cash, 2)
    }

@router.get("/pnl")
def get_pnl_statement(db: Session = Depends(get_db)):
    """Profit and Loss Statement."""
    sales = db.query(models.Sale).filter(models.Sale.status != "Returned").all()
    expenses = db.query(models.Expense).all()
    
    gross_revenue = sum(s.grand_total for s in sales)
    cogs = 0.0
    for s in sales:
        for item in s.items:
            prod = db.query(models.Product).filter(models.Product.sku == item.sku).first()
            cost = prod.cost_price if prod else (item.rate * 0.5)
            cogs += (cost * item.qty)
            
    gross_profit = max(0.0, gross_revenue - cogs)
    total_expenses = sum(e.amount for e in expenses)
    net_profit = gross_profit - total_expenses

    return {
        "gross_revenue": round(gross_revenue, 2),
        "cogs": round(cogs, 2),
        "gross_profit": round(gross_profit, 2),
        "gross_margin_pct": round((gross_profit / gross_revenue * 100) if gross_revenue > 0 else 0, 1),
        "total_expenses": round(total_expenses, 2),
        "net_profit": round(net_profit, 2),
        "net_margin_pct": round((net_profit / gross_revenue * 100) if gross_revenue > 0 else 0, 1)
    }

@router.get("/audit-logs", response_model=List[schemas.AuditLogResponse])
def get_audit_logs(limit: int = 100, db: Session = Depends(get_db)):
    """Chronological system audit trail."""
    return db.query(models.AuditLog).order_by(models.AuditLog.id.desc()).limit(limit).all()
