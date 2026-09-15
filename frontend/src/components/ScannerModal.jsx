import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, QrCode, X, Smartphone } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScannerModal({ isOpen, onClose, onScanResult }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'remote'
  const [pairUrl, setPairUrl] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const origin = window.location.origin;
    setPairUrl(`${origin}/remote-scanner.html?session=${Date.now()}`);

    if (activeTab === 'camera') {
      const scanner = new Html5QrcodeScanner(
        'camera-barcode-reader',
        { fps: 10, qrbox: { width: 250, height: 150 } },
        false
      );

      scanner.render(
        (decodedText) => {
          onScanResult(decodedText);
          scanner.clear();
          onClose();
        },
        (error) => {
          // scanning frame errors
        }
      );

      return () => {
        try {
          scanner.clear();
        } catch (e) {}
      };
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={18} />
            <span>Barcode & Remote Scanner</span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('camera')}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'camera' ? 'var(--bg-card)' : 'var(--bg-card-subtle)',
              border: 'none',
              borderBottom: activeTab === 'camera' ? '2px solid var(--accent)' : 'none',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Camera size={16} />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => setActiveTab('remote')}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'remote' ? 'var(--bg-card)' : 'var(--bg-card-subtle)',
              border: 'none',
              borderBottom: activeTab === 'remote' ? '2px solid var(--accent)' : 'none',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Smartphone size={16} />
            <span>Pair Smartphone</span>
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '14px 20px' }}>
          {activeTab === 'camera' ? (
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Point webcam / camera at barcode or QR label on the garment tag:
              </p>
              <div id="camera-barcode-reader" style={{ width: '100%' }}></div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 10px 0' }}>
                Scan this QR with your smartphone to use it as a wireless barcode gun:
              </p>
              <div
                style={{
                  display: 'inline-block',
                  padding: '10px',
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <QRCodeSVG value={pairUrl} size={170} />
              </div>
              <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                No app installation required. Works on iOS Safari & Android Chrome.
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
