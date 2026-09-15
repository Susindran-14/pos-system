import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Camera,
  QrCode,
  X,
  Smartphone,
  Zap,
  CheckCircle2,
  Copy,
  ExternalLink,
  Volume2,
  RefreshCw,
  ShoppingCart,
  Shirt,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { scannerApi } from '../api/client';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ScannerModal({ isOpen, onClose, onScanResult }) {
  const { totals } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'remote'
  const [sessionId, setSessionId] = useState(() => `SES-${Math.floor(1000 + Math.random() * 9000)}`);
  const [pairUrl, setPairUrl] = useState('');
  const [pairedScansCount, setPairedScansCount] = useState(0);

  // Live Camera Tab States
  const [cameraScanning, setCameraScanning] = useState(true);
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const [autoContinuous, setAutoContinuous] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const html5QrCodeRef = useRef(null);
  const scanCooldownRef = useRef(false);

  // Initialize Pair URL
  useEffect(() => {
    if (!isOpen) return;
    const origin = window.location.origin;
    setPairUrl(`${origin}/?scanner=true&session=${sessionId}`);
  }, [isOpen, sessionId]);

  // Sync Cart status with backend session so mobile phone displays live counter
  useEffect(() => {
    if (!isOpen || !sessionId) return;
    scannerApi.syncCart({
      session_id: sessionId,
      total_items: totals.totalQty || 0,
      grand_total: totals.grandTotal || 0,
      last_item_name: lastScannedItem?.name || 'POS Register Ready',
      last_item_price: lastScannedItem?.selling_price || 0,
    }).catch(() => {});
  }, [isOpen, sessionId, totals, lastScannedItem]);

  // Live Polling for Scans sent from the Smartphone
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await scannerApi.pollScans(sessionId);
        if (res?.has_scans && Array.isArray(res.scans)) {
          for (const scan of res.scans) {
            setPairedScansCount((prev) => prev + 1);
            showToast(`📲 Phone Scanned: ${scan.product?.name || scan.barcode}`);
            onScanResult(scan.barcode);
          }
        }
      } catch (e) {}
    }, 800);

    return () => clearInterval(pollInterval);
  }, [isOpen, sessionId, onScanResult, showToast]);

  // Live Camera Handler
  const startCamera = async () => {
    try {
      setCameraError(null);
      scanCooldownRef.current = false;
      setCameraScanning(true);

      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (e) {}
      }

      const qrCode = new Html5Qrcode('desktop-camera-reader');
      html5QrCodeRef.current = qrCode;

      await qrCode.start(
        { facingMode: 'environment' },
        {
          fps: 12,
          qrbox: { width: 260, height: 160 },
          aspectRatio: 1.33,
        },
        (decodedText) => {
          if (scanCooldownRef.current) return;
          scanCooldownRef.current = true;

          // Sound Beep
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.connect(ctx.destination);
            osc.frequency.setValueAtTime(1100, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
          } catch (e) {}

          setLastScannedItem({ barcode: decodedText, name: `Barcode: ${decodedText}` });
          onScanResult(decodedText);

          if (!autoContinuous) {
            stopCamera();
          } else {
            setTimeout(() => {
              scanCooldownRef.current = false;
            }, 1200);
          }
        },
        () => {}
      );
    } catch (err) {
      console.error('Desktop camera error:', err);
      setCameraError('Camera access denied or unavailable. Please allow camera permissions in your browser.');
      setCameraScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {}
    }
    setCameraScanning(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const handleScanNext = () => {
    setLastScannedItem(null);
    startCamera();
  };

  const copyPairLink = () => {
    navigator.clipboard.writeText(pairUrl);
    showToast('Pair link copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={18} style={{ color: 'var(--accent)' }} />
            <span>Barcode & Wireless Scanner Gun</span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('camera')}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'camera' ? 'var(--bg-card)' : 'var(--bg-card-subtle)',
              border: 'none',
              borderBottom: activeTab === 'camera' ? '2px solid var(--accent)' : 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: activeTab === 'camera' ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            <Camera size={16} />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => setActiveTab('remote')}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'remote' ? 'var(--bg-card)' : 'var(--bg-card-subtle)',
              border: 'none',
              borderBottom: activeTab === 'remote' ? '2px solid var(--accent)' : 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: activeTab === 'remote' ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            <Smartphone size={16} />
            <span>Pair Smartphone Gun</span>
          </button>
        </div>

        <div className="modal-body" style={{ padding: '16px 20px' }}>
          {activeTab === 'camera' ? (
            /* TAB 1: LIVE CAMERA SCANNER */
            <div>
              {/* POS Live Bill Counter Badge */}
              <div className="scanner-counter-badge">
                <ShoppingCart size={15} style={{ color: '#10b981' }} />
                <span>
                  Current POS Bill: <strong>{totals.totalQty} Items</strong> • <strong>₹{totals.grandTotal}</strong>
                </span>
              </div>

              {cameraError ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#ef4444' }}>
                  <p style={{ fontSize: '13px', marginBottom: 12 }}>{cameraError}</p>
                  <button className="btn-primary" onClick={startCamera}>
                    <RefreshCw size={14} /> Retry Camera
                  </button>
                </div>
              ) : cameraScanning ? (
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px 0', textAlign: 'center' }}>
                    Point camera at barcode or garment QR label:
                  </p>
                  <div id="desktop-camera-reader" style={{ width: '100%', borderRadius: '10px', overflow: 'hidden' }}></div>
                </div>
              ) : (
                /* Scan Success & Scan Next Item */
                <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0' }}>Item Added to POS Bill!</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
                    {lastScannedItem?.name}
                  </p>

                  <button className="btn-primary" onClick={handleScanNext} style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700 }}>
                    <Zap size={18} />
                    <span>⚡ SCAN NEXT ITEM</span>
                  </button>
                </div>
              )}

              {/* Continuous Scan Checkbox */}
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={autoContinuous}
                    onChange={(e) => setAutoContinuous(e.target.checked)}
                  />
                  <span>Continuous auto-scan (don't pause after each item)</span>
                </label>
              </div>
            </div>
          ) : (
            /* TAB 2: PAIR SMARTPHONE SCANNER GUN */
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '8px 12px', background: 'var(--bg-card-subtle)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px' }}>
                  <Smartphone size={15} style={{ color: '#3b82f6' }} />
                  <span>Session Code: <strong>{sessionId}</strong></span>
                </div>
                <span className="badge success">
                  {pairedScansCount > 0 ? `🟢 Active (${pairedScansCount} scans)` : '⏳ Listening for Scans'}
                </span>
              </div>

              <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 12px 0' }}>
                Scan this QR with your iPhone / Android phone to use it as a wireless barcode gun:
              </p>

              <div
                style={{
                  display: 'inline-block',
                  padding: '12px',
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <QRCodeSVG value={pairUrl} size={180} />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14 }}>
                <button className="nav-btn" onClick={copyPairLink} style={{ fontSize: '12px' }}>
                  <Copy size={14} /> Copy Mobile Link
                </button>
                <a
                  href={pairUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="nav-btn"
                  style={{ fontSize: '12px', textDecoration: 'none' }}
                >
                  <ExternalLink size={14} /> Test Scanner Tab
                </a>
              </div>

              <div style={{ marginTop: 12, fontSize: '11.5px', color: 'var(--text-muted)' }}>
                ✅ Works over Wi-Fi / Internet. Any barcode scanned on the phone instantly adds items to this POS cart and displays the updated bill counter!
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}
