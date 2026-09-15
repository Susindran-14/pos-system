import React, { useState, useEffect } from 'react';
import { History, ShieldAlert } from 'lucide-react';
import { reportsApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function AuditLogs() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsApi
      .getAuditLogs(100)
      .then((data) => setLogs(data || []))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="data-table-card">
      <div className="table-header-toolbar">
        <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <History size={18} />
          <span>Chronological System Audit Trail</span>
        </h3>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Staff / User</th>
            <th>Action Type</th>
            <th>Activity Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No audit logs recorded yet.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td style={{ fontWeight: 600 }}>{log.user}</td>
                <td>
                  <span className="badge info">{log.action}</span>
                </td>
                <td>{log.details || '—'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
