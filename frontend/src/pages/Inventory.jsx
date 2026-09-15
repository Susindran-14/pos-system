import React, { useState, useEffect } from 'react';
import { Boxes, Sliders, History, AlertCircle, TrendingUp, X, Check } from 'lucide-react';
import { inventoryApi, productsApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Inventory() {
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustData, setAdjustData] = useState({ sku: '', new_stock: 0, reason: 'Physical stock count correction' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sum, mvs, prods] = await Promise.all([
        inventoryApi.getSummary(),
        inventoryApi.getMovements({ limit: 50 }),
        productsApi.getAll(),
      ]);
      setSummary(sum);
      setMovements(mvs || []);
      setProducts(prods || []);
      if (prods.length > 0 && !adjustData.sku) {
        setAdjustData((prev) => ({ ...prev, sku: prods[0].sku, new_stock: prods[0].stock }));
      }
    } catch (err) {
      showToast('Error loading inventory data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.adjustStock(adjustData);
      showToast(`Stock updated for ${adjustData.sku}!`);
      setIsAdjustModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary KPI Cards */}
      <div className="kpi-cards-row">
        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <Boxes size={24} />
          </div>
          <div className="kpi-content">
            <h4>TOTAL STOCK QUANTITY</h4>
            <div className="num">{summary?.total_units || 0} Units</div>
            <span className="sub">{summary?.total_items || 0} Distinct SKUs</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <h4>COST VALUATION (FIFO)</h4>
            <div className="num">₹ {summary?.cost_valuation?.toLocaleString('en-IN') || 0}</div>
            <span className="sub">Inventory investment cost</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <h4>RETAIL VALUATION (MRP/SP)</h4>
            <div className="num">₹ {summary?.retail_valuation?.toLocaleString('en-IN') || 0}</div>
            <span className="sub">Potential Revenue value</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div className="kpi-content">
            <h4>LOW STOCK ITEMS</h4>
            <div className="num">{summary?.low_stock_count || 0} SKUs</div>
            <span className="sub" style={{ color: '#ef4444' }}>{summary?.out_of_stock_count || 0} Out of stock</span>
          </div>
        </div>
      </div>

      {/* Stock Movement Ledger Table */}
      <div className="data-table-card">
        <div className="table-header-toolbar">
          <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <History size={18} />
            <span>Real-time Stock Movement & Audit Ledger</span>
          </h3>
          <button
            className="btn-primary"
            onClick={() => setIsAdjustModalOpen(true)}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <Sliders size={16} />
            <span>Manual Stock Adjustment</span>
          </button>
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date & Time</th>
              <th>SKU</th>
              <th>Movement Type</th>
              <th>Quantity Change</th>
              <th>Reference No</th>
              <th>Audit Notes</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No stock movements recorded yet.
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id}>
                  <td>#{m.id}</td>
                  <td>{new Date(m.date_time).toLocaleString()}</td>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{m.sku}</td>
                  <td>
                    <span
                      className={`badge ${
                        m.movement_type === 'Sale'
                          ? 'danger'
                          : m.movement_type === 'Purchase' || m.movement_type === 'Opening'
                          ? 'success'
                          : 'warning'
                      }`}
                    >
                      {m.movement_type}
                    </span>
                  </td>
                  <td
                    style={{
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: m.qty > 0 ? '#10b981' : '#ef4444',
                    }}
                  >
                    {m.qty > 0 ? `+${m.qty}` : m.qty}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{m.reference_no || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{m.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADJUST STOCK MODAL */}
      {isAdjustModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Adjust Product Stock</h3>
              <button onClick={() => setIsAdjustModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdjustSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Select Product / SKU:</label>
                  <select
                    className="form-control"
                    value={adjustData.sku}
                    onChange={(e) => {
                      const selProd = products.find((p) => p.sku === e.target.value);
                      setAdjustData({
                        ...adjustData,
                        sku: e.target.value,
                        new_stock: selProd?.stock || 0,
                      });
                    }}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.sku}>
                        {p.name} ({p.sku}) — Current: {p.stock} units
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>New Correct Physical Stock Count:</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={adjustData.new_stock}
                    onChange={(e) => setAdjustData({ ...adjustData, new_stock: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Adjustment Reason / Note:</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={adjustData.reason}
                    onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAdjustModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
