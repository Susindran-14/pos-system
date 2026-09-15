import React, { useState, useEffect } from 'react';
import { Building2, Plus, DollarSign, X, Trash2 } from 'lucide-react';
import { suppliersApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Suppliers() {
  const { showToast } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phone: '',
    address: '',
    gstin: '',
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await suppliersApi.getAll();
      setSuppliers(data || []);
    } catch (err) {
      showToast('Error loading suppliers: ' + err.message, 'error');
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      code: 'SUP-' + Math.floor(100 + Math.random() * 900),
      name: '',
      phone: '',
      address: '',
      gstin: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await suppliersApi.create(formData);
      showToast(`Supplier ${formData.name} added!`);
      setIsModalOpen(false);
      loadSuppliers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenPay = (sup) => {
    setSelectedSupplier(sup);
    setPaymentAmount(sup.outstanding_due.toString());
    setIsPayModalOpen(true);
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    try {
      await suppliersApi.pay(selectedSupplier.id, Number(paymentAmount), 'Ledger Payment to Supplier');
      showToast(`Payment of ₹${paymentAmount} recorded!`);
      setIsPayModalOpen(false);
      loadSuppliers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="data-table-card">
      <div className="table-header-toolbar">
        <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building2 size={18} />
          <span>Wholesale Supplier Ledger Matrix</span>
        </h3>
        <button className="btn-primary" onClick={handleOpenAdd} style={{ padding: '8px 16px', fontSize: '13px' }}>
          <Plus size={16} />
          <span>Add New Supplier</span>
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Supplier Name</th>
            <th>Phone / Contact</th>
            <th>GSTIN</th>
            <th>Total Purchases</th>
            <th>Total Paid</th>
            <th>Outstanding Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No suppliers registered yet. Click "+ Add New Supplier" to create one.
              </td>
            </tr>
          ) : (
            suppliers.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.code}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.address}</div>
                </td>
                <td>{s.phone || '—'}</td>
                <td>{s.gstin || '—'}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>₹{s.total_purchases?.toFixed(2)}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>₹{s.paid?.toFixed(2)}</td>
                <td
                  style={{
                    fontWeight: 700,
                    color: s.outstanding_due > 0 ? '#ef4444' : '#10b981',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  ₹{s.outstanding_due?.toFixed(2)}
                </td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => handleOpenPay(s)}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    <DollarSign size={13} />
                    <span>Pay Due</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ADD SUPPLIER MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Add Wholesale Supplier</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Supplier Code *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Supplier / Mill Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Sri Lakshmi Silks Wholesale"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone / Contact Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="9840012345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>GSTIN</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="33AAACS1234F1Z1"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    className="form-control"
                    style={{ height: '60px', padding: '8px 12px' }}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAY DUE MODAL */}
      {isPayModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Record Outbound Payment</h3>
              <button onClick={() => setIsPayModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handlePaySubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '13px', marginBottom: 12 }}>
                  Supplier: <b>{selectedSupplier?.name}</b>
                </p>
                <div className="form-group">
                  <label>Payment Amount (₹):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    autoFocus
                    className="form-control"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsPayModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
