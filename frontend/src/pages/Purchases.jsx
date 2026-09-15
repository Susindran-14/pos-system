import React, { useState, useEffect } from 'react';
import { Truck, Plus, Search, Calendar, DollarSign, X } from 'lucide-react';
import { purchasesApi, suppliersApi, productsApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Purchases() {
  const { showToast } = useToast();
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { product_id: null, sku: '', name: '', qty: 10, unit_cost: 450, gst_rate: 5, total: 4725 },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pos, sups, prods] = await Promise.all([
        purchasesApi.getAll(),
        suppliersApi.getAll(),
        productsApi.getAll(),
      ]);
      setPurchases(pos || []);
      setSuppliers(sups || []);
      setProducts(prods || []);
      if (sups.length > 0 && !selectedSupplierId) {
        setSelectedSupplierId(sups[0].id);
      }
    } catch (err) {
      showToast('Failed to load purchases: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItemRow = () => {
    setItems([
      ...items,
      { product_id: null, sku: '', name: '', qty: 10, unit_cost: 500, gst_rate: 5, total: 5250 },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'sku') {
      const prod = products.find((p) => p.sku === value);
      if (prod) {
        updated[index].product_id = prod.id;
        updated[index].name = prod.name;
        updated[index].unit_cost = prod.cost_price || 0;
        updated[index].gst_rate = prod.gst_rate || 5;
      }
    }

    const qty = Number(updated[index].qty) || 0;
    const cost = Number(updated[index].unit_cost) || 0;
    const tax = Number(updated[index].gst_rate) || 0;
    const sub = qty * cost;
    updated[index].total = Number((sub + (sub * tax) / 100).toFixed(2));

    setItems(updated);
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === Number(selectedSupplierId));
    if (!sup) {
      showToast('Please select a supplier', 'warning');
      return;
    }

    const grand = calculateGrandTotal();
    const paid = Number(paidAmount) || 0;
    const balance = Math.max(0, grand - paid);

    const payload = {
      supplier_id: sup.id,
      supplier_name: sup.name,
      invoice_ref: invoiceRef,
      items: items.filter((i) => i.sku && i.name),
      subtotal: items.reduce((sum, i) => sum + i.qty * i.unit_cost, 0),
      tax_amount: items.reduce((sum, i) => sum + (i.qty * i.unit_cost * i.gst_rate) / 100, 0),
      grand_total: grand,
      paid_amount: paid,
      balance_due: balance,
      notes: notes,
    };

    try {
      await purchasesApi.create(payload);
      showToast('Purchase intake recorded & stock added to inventory!');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="data-table-card">
      <div className="table-header-toolbar">
        <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Truck size={18} />
          <span>Wholesale Purchases & Inventory Inward Ledger</span>
        </h3>
        <button
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <Plus size={16} />
          <span>Intake New Shipment (PO)</span>
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>PO Number</th>
            <th>Date</th>
            <th>Supplier Name</th>
            <th>Invoice Ref</th>
            <th>Items Intake</th>
            <th>Total Amount</th>
            <th>Paid (₹)</th>
            <th>Balance Due</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No wholesale intake invoices recorded yet.
              </td>
            </tr>
          ) : (
            purchases.map((po) => (
              <tr key={po.id}>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{po.purchase_no}</td>
                <td>{new Date(po.purchase_date).toLocaleDateString()}</td>
                <td style={{ fontWeight: 600 }}>{po.supplier_name}</td>
                <td>{po.invoice_ref || '—'}</td>
                <td>{po.items?.length || 0} Apparel Items</td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>₹{po.grand_total.toFixed(2)}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>₹{po.paid_amount.toFixed(2)}</td>
                <td style={{ fontWeight: 700, color: po.balance_due > 0 ? '#ef4444' : '#10b981', fontFamily: 'var(--font-mono)' }}>
                  ₹{po.balance_due.toFixed(2)}
                </td>
                <td>
                  <span className={`badge ${po.payment_status === 'Paid' ? 'success' : 'danger'}`}>
                    {po.payment_status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* NEW PURCHASE INTAKE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Record Wholesale Purchase Intake (Inward Stock)</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label>Supplier / Manufacturer *</label>
                    <select
                      className="form-control"
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                    >
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Supplier Invoice / Bill No</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. SUP-INV-9921"
                      value={invoiceRef}
                      onChange={(e) => setInvoiceRef(e.target.value)}
                    />
                  </div>
                </div>

                {/* Items Table */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: '12px', fontWeight: 700 }}>Stock Line Items:</label>
                    <button type="button" onClick={handleAddItemRow} className="nav-btn" style={{ fontSize: '11px', padding: '3px 8px' }}>
                      + Add Item Row
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                      <select
                        className="form-control"
                        value={item.sku}
                        onChange={(e) => handleItemChange(idx, 'sku', e.target.value)}
                      >
                        <option value="">-- Select Product / SKU --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.sku}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        className="form-control"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Cost"
                        className="form-control"
                        value={item.unit_cost}
                        onChange={(e) => handleItemChange(idx, 'unit_cost', e.target.value)}
                      />
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                        ₹{item.total}
                      </div>
                      <button
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-card-subtle)', padding: 12, borderRadius: 8 }}>
                  <div className="form-group">
                    <label>Amount Paid Now (₹):</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={paidAmount}
                      placeholder={calculateGrandTotal().toString()}
                      onChange={(e) => setPaidAmount(e.target.value)}
                    />
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GRAND TOTAL (WITH GST):</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      ₹ {calculateGrandTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Intake & Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
