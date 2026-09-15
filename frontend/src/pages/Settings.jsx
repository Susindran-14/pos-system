import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Database, Server, CheckCircle2 } from 'lucide-react';
import { settingsApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    storeName: 'TAMIL DRESS COLLECTION',
    storeNameTamil: 'தமிழ் டிரஸ் கலெக்ஷன்',
    address: '142, Main Road, Near Bus Stand, Salem - 636001',
    gstin: '33ABCDE1234F1Z5',
    phone: '9876543210',
    upiId: 'tamildress@upi',
    printerWidth: '80mm',
    roundOffEnabled: true,
    taxCalculationType: 'Local',
  });

  useEffect(() => {
    settingsApi
      .getSettings()
      .then((data) => {
        if (data) setFormData((prev) => ({ ...prev, ...data }));
      })
      .catch((err) => showToast(err.message, 'error'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingsApi.updateSettings(formData);
      showToast('Store settings saved successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: '800px' }}>
      {/* Store Configuration Card */}
      <div className="data-table-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <SettingsIcon size={18} />
          <span>Store Profile & Thermal Bill Configuration</span>
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>Store Business Name (English):</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Store Name in Tamil (தமிழ்):</label>
              <input
                type="text"
                className="form-control"
                value={formData.storeNameTamil}
                onChange={(e) => setFormData({ ...formData, storeNameTamil: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Store Address & City:</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>GSTIN Tax Identification Number:</label>
              <input
                type="text"
                className="form-control"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Store Helpline / Phone Number:</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Store UPI VPA ID (For Dynamic QR Billing):</label>
              <input
                type="text"
                className="form-control"
                placeholder="tamildress@upi"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Default Thermal Receipt Paper Width:</label>
              <select
                className="form-control"
                value={formData.printerWidth}
                onChange={(e) => setFormData({ ...formData, printerWidth: e.target.value })}
              >
                <option value="80mm">80mm Thermal Receipt (Standard 3-Inch)</option>
                <option value="58mm">58mm Thermal Receipt (Mini 2-Inch)</option>
                <option value="A4">A4 Full Sheet Tax Invoice</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
              <Save size={16} />
              <span>Save Profile Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Database Setup Info Card */}
      <div className="data-table-card" style={{ padding: 24, borderLeft: '4px solid #10b981' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Database size={18} style={{ color: '#10b981' }} />
          <span>Neon Serverless PostgreSQL Database Connection</span>
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: 12 }}>
          Your database connection string is managed in <code style={{ background: 'var(--bg-card-subtle)', padding: '2px 6px', borderRadius: 4 }}>backend/.env</code>.
          To switch or connect your cloud Neon PostgreSQL instance:
        </p>
        <ol style={{ paddingLeft: 20, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
          <li>Go to <a href="https://neon.tech" target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: 600 }}>neon.tech</a> and copy your connection string.</li>
          <li>Paste it into <code style={{ background: 'var(--bg-card-subtle)', padding: '1px 4px' }}>backend/.env</code> as <code style={{ background: 'var(--bg-card-subtle)', padding: '1px 4px' }}>DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require</code>.</li>
          <li>Run <code style={{ background: 'var(--bg-card-subtle)', padding: '1px 4px' }}>python -m app.init_db</code> in the backend folder to initialize your cloud tables.</li>
        </ol>
      </div>
    </div>
  );
}
