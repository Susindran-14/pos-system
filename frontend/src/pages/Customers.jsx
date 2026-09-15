import React, { useState, useEffect } from 'react';
import { Users2, Plus, Search, DollarSign, X, Award, Phone } from 'lucide-react';
import { customersApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Customers() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [formData, setFormData] = useState({
    mobile: '',
    name: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customersApi.getAll();
      setCustomers(data || []);
    } catch (err) {
      showToast('Error loading customers: ' + err.message, 'error');
    }
  };

  const handleOpenAdd = () => {
    setFormData({ mobile: '', name: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customersApi.create(formData);
      showToast(`Customer ${formData.name} added!`);
      setIsModalOpen(false);
      loadCustomers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenSettle = (cust) => {
    setSelectedCustomer(cust);
    setSettleAmount(cust.outstanding_due.toString());
    setIsSettleModalOpen(true);
  };

  const handleSettleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customersApi.settleDue(selectedCustomer.id, Number(settleAmount), 'Customer Credit Due Settled');
      showToast(`Settled ₹${settleAmount} from ${selectedCustomer.name}!`);
      setIsSettleModalOpen(false);
      loadCustomers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filtered = customers.filter((c) => {
    const s = search.toLowerCase();
    return !s || c.name.toLowerCase().includes(s) || c.mobile.includes(s);
  });

  return (
    <div className="data-table-card">
      <div className="table-header-toolbar">
        <div className="pos-input-wrapper" style={{ maxWidth: '300px' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by Mobile or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={handleOpenAdd} style={{ padding: '8px 16px', fontSize: '13px' }}>
          <Plus size={16} />
          <span>Add Customer Profile</span>
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Mobile Phone</th>
            <th>Loyalty Points</th>
            <th>Total Purchases</th>
            <th>Last Purchase</th>
            <th>Outstanding Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No customer profiles found.
              </td>
            </tr>
          ) : (
            filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.address || c.email || '—'}</div>
                </td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{c.mobile}</td>
                <td>
                  <span className="badge warning" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Award size={12} /> {c.loyalty_points || 0} pts
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>₹{c.total_purchases?.toFixed(2)}</td>
                <td>{c.last_purchase_date || '—'}</td>
                <td
                  style={{
                    fontWeight: 700,
                    color: c.outstanding_due > 0 ? '#ef4444' : '#10b981',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  ₹{c.outstanding_due?.toFixed(2)}
                </td>
                <td>
                  {c.outstanding_due > 0 && (
                    <button
                      className="btn-primary"
                      onClick={() => handleOpenSettle(c)}
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      <DollarSign size={13} />
                      <span>Collect Due</span>
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ADD CUSTOMER MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Add New Customer Profile</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Senthil Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="senthil@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Address / City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="12, Extension Nagar, Salem"
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SETTLE DUE MODAL */}
      {isSettleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '380px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Collect Customer Credit Due</h3>
              <button onClick={() => setIsSettleModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSettleSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '13px', marginBottom: 12 }}>
                  Customer: <b>{selectedCustomer?.name}</b> ({selectedCustomer?.mobile})
                </p>
                <div className="form-group">
                  <label>Amount Collected (₹):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    autoFocus
                    className="form-control"
                    value={settleAmount}
                    onChange={(e) => setSettleAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsSettleModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Record Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
