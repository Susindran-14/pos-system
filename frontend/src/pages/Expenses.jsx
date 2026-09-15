import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Trash2, X, DollarSign } from 'lucide-react';
import { expensesApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Expenses() {
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    expense_date: new Date().toISOString().split('T')[0],
    category: 'Shop Rent',
    description: '',
    payment_method: 'UPI GPay',
    amount: '',
  });

  const categories = ['Shop Rent', 'Electricity', 'Staff Salary', 'Maintenance', 'Tea & Snacks', 'Packaging', 'Miscellaneous'];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await expensesApi.getAll();
      setExpenses(data || []);
    } catch (err) {
      showToast('Error loading expenses: ' + err.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await expensesApi.create({
        ...formData,
        amount: Number(formData.amount),
      });
      showToast('Expense recorded successfully!');
      setIsModalOpen(false);
      loadExpenses();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await expensesApi.delete(id);
      showToast('Expense deleted.');
      loadExpenses();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filtered = expenses.filter((e) => selectedCat === 'All' || e.category === selectedCat);
  const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="data-table-card">
      <div className="table-header-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <select
            className="form-control"
            style={{ width: '180px' }}
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>
            Total: <strong style={{ color: '#ef4444' }}>₹ {totalAmount.toFixed(2)}</strong>
          </span>
        </div>

        <button
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <Plus size={16} />
          <span>Record Store Expense</span>
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Payment Method</th>
            <th>Amount (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No operational expenses recorded.
              </td>
            </tr>
          ) : (
            filtered.map((e) => (
              <tr key={e.id}>
                <td>{e.expense_date}</td>
                <td>
                  <span className="badge warning">{e.category}</span>
                </td>
                <td>{e.description || '—'}</td>
                <td>
                  <span className="badge info">{e.payment_method}</span>
                </td>
                <td style={{ fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
                  ₹ {e.amount?.toFixed(2)}
                </td>
                <td>
                  <button
                    className="nav-btn danger"
                    onClick={() => handleDelete(e.id)}
                    style={{ padding: '4px 8px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ADD EXPENSE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Record Store Operational Expense</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Expense Date:</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.expense_date}
                    onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Expense Category:</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    autoFocus
                    className="form-control"
                    placeholder="e.g. 3500"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Payment Method:</label>
                  <select
                    className="form-control"
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI GPay">UPI GPay</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Credit/Debit Card</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description / Note:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. EB Bill Store Lighting & AC"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
