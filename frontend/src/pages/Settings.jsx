import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Database,
  Server,
  CheckCircle2,
  RefreshCw,
  CloudUpload,
  HardDrive,
  AlertCircle,
  Sparkles,
  Check,
} from 'lucide-react';
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

  const [dbStatus, setDbStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [isFetchingDb, setIsFetchingDb] = useState(false);

  // Fetch store settings
  useEffect(() => {
    settingsApi
      .getSettings()
      .then((data) => {
        if (data) setFormData((prev) => ({ ...prev, ...data }));
      })
      .catch((err) => showToast(err.message, 'error'));

    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    setIsFetchingDb(true);
    try {
      const data = await settingsApi.getDbStatus();
      setDbStatus(data);
    } catch (err) {
      console.warn('Failed to fetch DB status:', err);
    } finally {
      setIsFetchingDb(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingsApi.updateSettings(formData);
      showToast('Store settings saved successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSyncToNeon = async () => {
    if (!window.confirm('Are you sure you want to sync all records from SQLite to your Neon Cloud PostgreSQL database?')) {
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await settingsApi.syncToNeon();
      setSyncResult(res);
      showToast(res.message || 'Successfully synced SQLite to Neon DB!', 'success');
      await fetchDbStatus();
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || 'Failed to sync to Neon DB';
      showToast(errMsg, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: '850px' }}>
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

      {/* Database Management & Neon DB Sync Card */}
      <div className="data-table-card" style={{ padding: 24, borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={19} style={{ color: '#10b981' }} />
              <span>Neon PostgreSQL Cloud Database</span>
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
              Live cloud database synchronization and offline SQLite data migration.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                background: dbStatus?.active_engine?.includes('Neon') ? '#ecfdf5' : '#fef3c7',
                color: dbStatus?.active_engine?.includes('Neon') ? '#065f46' : '#92400e',
                border: `1px solid ${dbStatus?.active_engine?.includes('Neon') ? '#a7f3d0' : '#fde68a'}`,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: dbStatus?.active_engine?.includes('Neon') ? '#10b981' : '#f59e0b',
                }}
              />
              {dbStatus?.active_engine || 'Connecting...'}
            </span>

            <button
              className="nav-btn"
              onClick={fetchDbStatus}
              disabled={isFetchingDb}
              title="Refresh Database Status"
              style={{ padding: '6px 10px', fontSize: '12px' }}
            >
              <RefreshCw size={13} className={isFetchingDb ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* Database Metric Badges */}
        {dbStatus?.stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '10px',
              marginBottom: 18,
              padding: '12px',
              background: 'var(--bg-card-subtle)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>PRODUCTS</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{dbStatus.stats.products}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SALES INVOICES</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{dbStatus.stats.sales}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CUSTOMERS</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)' }}>{dbStatus.stats.customers}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SUPPLIERS</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{dbStatus.stats.suppliers}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORIES</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{dbStatus.stats.categories}</div>
            </div>
          </div>
        )}

        {/* Sync Trigger Action Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            padding: '16px',
            background: 'var(--bg-card)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloudUpload size={22} />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                Sync SQLite Database to Neon Cloud DB
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Migrate all local offline products, customers, and sales data directly into your Neon PostgreSQL instance.
              </div>
            </div>
          </div>

          <button
            onClick={handleSyncToNeon}
            disabled={isSyncing}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            }}
          >
            <RefreshCw size={15} className={isSyncing ? 'spin' : ''} />
            <span>{isSyncing ? 'Syncing to Neon...' : '⚡ Sync to Neon DB'}</span>
          </button>
        </div>

        {/* Sync Success Feedback Card */}
        {syncResult && (
          <div
            style={{
              marginTop: 16,
              padding: '14px 16px',
              borderRadius: '8px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '13px', marginBottom: 6 }}>
              <CheckCircle2 size={16} style={{ color: '#10b981' }} />
              <span>{syncResult.message}</span>
            </div>
            {syncResult.details && (
              <div style={{ fontSize: '11.5px', color: '#047857', display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                {Object.entries(syncResult.details).map(([tbl, count]) => (
                  <span key={tbl} style={{ background: '#d1fae5', padding: '2px 8px', borderRadius: '4px' }}>
                    <strong>{tbl}</strong>: {count}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

