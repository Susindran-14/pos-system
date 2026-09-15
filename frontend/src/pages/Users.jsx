import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, X, User } from 'lucide-react';
import { authApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Users() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    pin: '',
    name: '',
    role: 'CASHIER',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await authApi.getUsers();
      setUsers(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.pin.length < 4) {
      showToast('PIN must be 4 digits', 'warning');
      return;
    }
    try {
      await authApi.createUser(formData);
      showToast(`User ${formData.name} created!`);
      setIsModalOpen(false);
      setFormData({ username: '', pin: '', name: '', role: 'CASHIER' });
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await authApi.deleteUser(id);
      showToast(`User ${name} removed.`);
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="data-table-card">
      <div className="table-header-toolbar">
        <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} />
          <span>Staff Accounts & Workstation Access Permissions</span>
        </h3>
        <button
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <Plus size={16} />
          <span>Add Staff Cashier</span>
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>PIN Authentication</th>
            <th>Account Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ fontWeight: 600 }}>{u.name}</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{u.username}</td>
              <td>
                <span className={`badge ${u.role === 'ADMIN' ? 'warning' : 'info'}`}>{u.role}</span>
              </td>
              <td>
                <span style={{ letterSpacing: '4px', fontWeight: 800 }}>••••</span> (4-digit PIN)
              </td>
              <td>
                <span className="badge success">Active</span>
              </td>
              <td>
                {u.username !== 'admin' && (
                  <button
                    className="nav-btn danger"
                    onClick={() => handleDelete(u.id, u.name)}
                    style={{ padding: '4px 8px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD USER MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Add Staff Member</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Ramesh Cashier"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Username (Login ID) *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. ramesh"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>4-Digit Security Passcode PIN *</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    className="form-control"
                    placeholder="••••"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
                <div className="form-group">
                  <label>Access Role</label>
                  <select
                    className="form-control"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="CASHIER">Cashier (POS Sales Only)</option>
                    <option value="ADMIN">Administrator (Full Access)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
