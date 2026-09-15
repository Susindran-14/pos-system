import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Coins,
  Receipt,
  AlertTriangle,
  CreditCard,
  Shirt,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { reportsApi } from '../api/client';

export default function Dashboard({ onNavigateToPos }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await reportsApi.getDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading live business analytics...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* KPI Cards Row */}
      <div className="kpi-cards-row">
        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <h4>TODAY'S SALES</h4>
            <div className="num">₹ {data.today_sales?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <span className="sub" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
              <ArrowUpRight size={13} /> Active live billing
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <Coins size={24} />
          </div>
          <div className="kpi-content">
            <h4>ESTIMATED PROFIT</h4>
            <div className="num">₹ {data.today_profit?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <span className="sub">Gross margin on today's items</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            <Receipt size={24} />
          </div>
          <div className="kpi-content">
            <h4>BILLS ISSUED</h4>
            <div className="num">{data.today_invoices} Invoices</div>
            <span className="sub">Today's transactions</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-content">
            <h4>LOW STOCK ALERTS</h4>
            <div className="num">{data.low_stock_count} Items</div>
            <span className="sub" style={{ color: '#ef4444' }}>Reorder recommended</span>
          </div>
        </div>
      </div>

      {/* Grid: Payment Breakdown & Top Selling Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Payment Modes Split */}
        <div className="data-table-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={18} />
            <span>Today's Payment Settlement Split</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(data.payment_breakdown || {}).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No sales recorded yet today.</p>
            ) : (
              Object.entries(data.payment_breakdown).map(([mode, amt]) => {
                const pct = data.today_sales > 0 ? (amt / data.today_sales) * 100 : 0;
                return (
                  <div key={mode}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{mode}</span>
                      <span style={{ fontWeight: 700 }}>₹{amt.toFixed(2)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-card-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#4f46e5', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Selling Apparel */}
        <div className="data-table-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shirt size={18} />
            <span>Top-Selling Apparel & Garments</span>
          </h3>
          {data.top_selling?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No items sold yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.top_selling.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-card-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU: {item.sku}</div>
                  </div>
                  <span className="badge success">{item.qty_sold} Units Sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="data-table-card">
        <div className="table-header-toolbar">
          <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} />
            <span>Recent Store Invoices</span>
          </h3>
          <button className="btn-primary" onClick={onNavigateToPos} style={{ padding: '6px 14px', fontSize: '13px' }}>
            Open POS Counter
          </button>
        </div>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer</th>
              <th>Time</th>
              <th>Payment Mode</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recent_sales?.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No invoices generated yet. Start billing in POS Counter!
                </td>
              </tr>
            ) : (
              data.recent_sales.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.invoice_no}</td>
                  <td>{s.customer_name}</td>
                  <td>{s.date_time}</td>
                  <td><span className="badge info">{s.payment_mode}</span></td>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>₹{s.grand_total?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${s.status === 'Completed' ? 'success' : 'danger'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
