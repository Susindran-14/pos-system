import React, { useState, useEffect } from 'react';
import { FileBarChart, Calendar, Printer, DollarSign, PieChart, ShieldCheck } from 'lucide-react';
import { reportsApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Reports() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('zreport'); // 'zreport', 'gst', 'pnl'
  const [zReportDate, setZReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [zReportData, setZReportData] = useState(null);
  const [gstData, setGstData] = useState(null);
  const [pnlData, setPnlData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'zreport') loadZReport();
    else if (activeTab === 'gst') loadGst();
    else if (activeTab === 'pnl') loadPnl();
  }, [activeTab, zReportDate]);

  const loadZReport = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getDayEndZReport(zReportDate);
      setZReportData(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadGst = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getGstSummary();
      setGstData(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadPnl = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getPnL();
      setPnlData(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
        <button
          className={`nav-btn ${activeTab === 'zreport' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('zreport')}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <Calendar size={16} />
          <span>Day-End Closeout (Z-Report)</span>
        </button>

        <button
          className={`nav-btn ${activeTab === 'gst' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('gst')}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <PieChart size={16} />
          <span>GST Tax Summary (GSTR-1)</span>
        </button>

        <button
          className={`nav-btn ${activeTab === 'pnl' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('pnl')}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <DollarSign size={16} />
          <span>Profit & Loss Statement</span>
        </button>
      </div>

      {/* TAB 1: Z-REPORT CLOSEOUT */}
      {activeTab === 'zreport' && (
        <div className="data-table-card" style={{ padding: 24, maxWidth: '640px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Day-End Cashier Z-Report</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Daily cash drawer & sales settlement summary</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="date"
                className="form-control"
                style={{ width: '150px' }}
                value={zReportDate}
                onChange={(e) => setZReportDate(e.target.value)}
              />
              <button className="nav-btn" onClick={() => window.print()}>
                <Printer size={15} />
              </button>
            </div>
          </div>

          {zReportData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span>Total Bills Issued:</span>
                <b>{zReportData.total_bills} Invoices</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span>Gross Cash Collected:</span>
                <b style={{ fontFamily: 'var(--font-mono)' }}>₹ {zReportData.cash_sales.toFixed(2)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span>Digital UPI Collections:</span>
                <b style={{ fontFamily: 'var(--font-mono)' }}>₹ {zReportData.upi_sales.toFixed(2)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span>Card Payments:</span>
                <b style={{ fontFamily: 'var(--font-mono)' }}>₹ {zReportData.card_sales.toFixed(2)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span>Store Credit / Due Bills:</span>
                <b style={{ fontFamily: 'var(--font-mono)' }}>₹ {zReportData.credit_sales.toFixed(2)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', color: '#ef4444' }}>
                <span>Less: Today's Cash Expenses Paid:</span>
                <b style={{ fontFamily: 'var(--font-mono)' }}>- ₹ {zReportData.cash_expenses.toFixed(2)}</b>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px',
                  background: 'var(--bg-card-subtle)',
                  borderRadius: 8,
                  fontSize: '16px',
                  fontWeight: 800,
                  marginTop: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <span>EXPECTED DRAWER CASH:</span>
                <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  ₹ {zReportData.expected_drawer_cash.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GST SUMMARY */}
      {activeTab === 'gst' && (
        <div className="data-table-card">
          <div className="table-header-toolbar">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>GST Tax Slabs Breakdown (GSTR-1 Format)</h3>
            <button className="nav-btn" onClick={() => window.print()}>
              <Printer size={15} />
              <span>Print Tax Audit</span>
            </button>
          </div>

          <table className="styled-table">
            <thead>
              <tr>
                <th>GST Tax Bracket</th>
                <th>Total Taxable Turnover (₹)</th>
                <th>CGST (₹)</th>
                <th>SGST (₹)</th>
                <th>IGST (₹)</th>
                <th>Total GST Liability (₹)</th>
              </tr>
            </thead>
            <tbody>
              {gstData &&
                Object.entries(gstData.slabs).map(([slab, vals]) => (
                  <tr key={slab}>
                    <td style={{ fontWeight: 700 }}>{slab}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₹{vals.taxable.toFixed(2)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₹{vals.cgst.toFixed(2)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₹{vals.sgst.toFixed(2)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₹{vals.igst.toFixed(2)}</td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#4f46e5' }}>
                      ₹{vals.total_tax.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: PROFIT & LOSS */}
      {activeTab === 'pnl' && (
        <div className="data-table-card" style={{ padding: 24, maxWidth: '640px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: 16 }}>Profit & Loss (P&L) Statement</h3>
          {pnlData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span>Gross Store Sales Revenue:</span>
                <b style={{ fontFamily: 'var(--font-mono)' }}>₹ {pnlData.gross_revenue.toFixed(2)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', color: '#ef4444' }}>
                <span>Less: Cost of Goods Sold (COGS):</span>
                <b style={{ fontFamily: 'var(--font-mono)' }}>- ₹ {pnlData.cogs.toFixed(2)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>
                <span>GROSS PROFIT:</span>
                <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  ₹ {pnlData.gross_profit.toFixed(2)} ({pnlData.gross_margin_pct}%)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', color: '#ef4444' }}>
                <span>Less: Store Operating Expenses:</span>
                <b style={{ fontFamily: 'var(--font-mono)' }}>- ₹ {pnlData.total_expenses.toFixed(2)}</b>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'var(--bg-card-subtle)',
                  borderRadius: 8,
                  fontSize: '18px',
                  fontWeight: 800,
                  marginTop: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <span>NET STORE PROFIT:</span>
                <span style={{ color: pnlData.net_profit >= 0 ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                  ₹ {pnlData.net_profit.toFixed(2)} ({pnlData.net_margin_pct}%)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
