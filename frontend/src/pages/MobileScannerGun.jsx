import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  QrCode,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shirt,
  ShoppingCart,
  Send,
  Volume2,
  VolumeX,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { scannerApi } from '../api/client';

export default function MobileScannerGun({ sessionId }) {
  const [session, setSession] = useState(sessionId || 'MAIN');
  const [isScanning, setIsScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState(null);
  const [cartStatus, setCartStatus] = useState({
    total_items: 0,
    grand_total: 0,
    last_item_name: 'No items scanned yet',
  });
  const [history, setHistory] = useState([]);
  const [autoContinuous, setAutoContinuous] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [statusMsg, setStatusMsg] = useState('Camera Ready. Aim at barcode.');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraError, setCameraError] = useState(null);

  const html5QrCodeRef = useRef(null);
  const scanLockRef = useRef(false);

  // Play audio confirmation beep
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}

    // Haptic vibration on mobile
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  // Poll live cart counter from POS terminal every 2 seconds
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await scannerApi.getCartStatus(session);
        if (res?.cart_status) {
          setCartStatus(res.cart_status);
        }
        if (res?.history) {
          setHistory(res.history);
        }
      } catch (e) {}
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [session]);

  // Start Camera Scanner with robust camera selection
  const startCamera = async () => {
    try {
      setCameraError(null);
      scanLockRef.current = false;
      setIsScanning(true);
      setStatusMsg('Align barcode in viewfinder...');

      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (e) {}
      }

      const qrCodeScanner = new Html5Qrcode('mobile-scanner-viewfinder');
      html5QrCodeRef.current = qrCodeScanner;

      // First check available cameras to avoid overconstrained errors on mobile
      let cameraConfig = { facingMode: 'environment' };
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          const rearCam = cameras.find(
            (c) =>
              c.label.toLowerCase().includes('back') ||
              c.label.toLowerCase().includes('rear') ||
              c.label.toLowerCase().includes('environment')
          ) || cameras[cameras.length - 1];
          cameraConfig = rearCam.id;
        }
      } catch (e) {}

      await qrCodeScanner.start(
        cameraConfig,
        {
          fps: 15,
          qrbox: { width: 280, height: 160 },
          aspectRatio: 1.33,
        },
        onBarcodeDetected,
        (errorMessage) => {
          // Ignore frame scan errors
        }
      );
    } catch (err) {
      console.error('Camera start error:', err);
      const isHttp = window.location.protocol !== 'https:' && window.location.hostname !== 'localhost';
      if (isHttp) {
        setCameraError(
          'Mobile browsers require HTTPS to open the camera. When testing locally over Wi-Fi, enable "Insecure origins treated as secure" in Chrome flags or deploy to Vercel/HTTPS.'
        );
      } else {
        setCameraError(
          'Camera access blocked or denied. Please click the Lock icon in your browser address bar and set Camera to "Allow".'
        );
      }
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {}
    }
    setIsScanning(false);
  };

  // Handle Barcode Scanned
  const onBarcodeDetected = async (decodedText) => {
    if (scanLockRef.current) return;
    scanLockRef.current = true;

    playBeep();

    try {
      setStatusMsg(`Transmitting barcode: ${decodedText}...`);
      const res = await scannerApi.pushScan(session, decodedText);

      setLastScanned({
        barcode: decodedText,
        product: res.product,
        timestamp: new Date().toLocaleTimeString(),
      });

      if (res.cart_status) {
        setCartStatus(res.cart_status);
      }

      setStatusMsg(`✅ Sent to POS: ${res.product?.name || decodedText}`);

      // If auto-continuous is disabled, pause camera and prompt "Scan Next Item"
      if (!autoContinuous) {
        await stopCamera();
      } else {
        // In continuous mode, brief 1.2s cooldown before next scan
        setTimeout(() => {
          scanLockRef.current = false;
        }, 1200);
      }
    } catch (err) {
      setStatusMsg(`Error sending barcode: ${err.message}`);
      scanLockRef.current = false;
    }
  };

  // Handle Manual Input Submit
  const handleManualSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) return;

    try {
      playBeep();
      const res = await scannerApi.pushScan(session, manualInput.trim());
      setLastScanned({
        barcode: manualInput.trim(),
        product: res.product,
        timestamp: new Date().toLocaleTimeString(),
      });
      if (res.cart_status) setCartStatus(res.cart_status);
      setManualInput('');
      setStatusMsg(`✅ Sent SKU: ${res.product?.name || manualInput}`);
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  // Trigger "Scan Next Item" button
  const handleScanNext = () => {
    setLastScanned(null);
    startCamera();
  };

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [session]);

  return (
    <div className="mobile-gun-container">
      {/* Top Header Bar */}
      <header className="mobile-gun-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="gun-brand-badge">
            <Smartphone size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>WIRELESS SCANNER GUN</h2>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
              Terminal Session: <strong style={{ color: '#38bdf8' }}>{session}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="gun-tool-btn"
            title="Toggle Beep"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </header>

      {/* LIVE POS BILL COUNTER BANNER */}
      <div className="mobile-gun-counter-card">
        <div className="gun-counter-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShoppingCart size={16} style={{ color: '#34d399' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live POS Bill Counter
            </span>
          </div>
          <span className="gun-badge-live">🟢 Synced</span>
        </div>

        <div className="gun-counter-metrics">
          <div className="gun-metric-box">
            <span className="metric-lbl">TOTAL ITEMS</span>
            <span className="metric-val">{cartStatus.total_items}</span>
          </div>
          <div className="gun-metric-box grand">
            <span className="metric-lbl">BILL GRAND TOTAL</span>
            <span className="metric-val">₹{cartStatus.grand_total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {cartStatus.last_item_name && (
          <div className="gun-last-item-pill">
            <span>Last Added:</span>
            <strong>{cartStatus.last_item_name}</strong>
          </div>
        )}
      </div>

      {/* CAMERA VIEWFINDER OR SCAN NEXT PROMPT */}
      <div className="mobile-gun-viewfinder-box">
        {cameraError ? (
          <div className="gun-camera-error">
            <AlertTriangle size={32} style={{ color: '#f87171', marginBottom: 8 }} />
            <p style={{ fontSize: '13px', margin: '0 0 12px 0' }}>{cameraError}</p>
            <button className="btn-primary" onClick={startCamera}>
              <RefreshCw size={15} /> Try Again
            </button>
          </div>
        ) : isScanning ? (
          <div className="gun-camera-wrapper">
            <div id="mobile-scanner-viewfinder" style={{ width: '100%' }}></div>
            {/* Laser Aiming Line Overlay */}
            <div className="gun-laser-line" />
            <div className="gun-scanner-guide-text">
              Point camera at barcode or garment QR tag
            </div>
          </div>
        ) : (
          /* "SCAN NEXT ITEM" ACTION CARD */
          <div className="gun-scanned-success-card">
            <div className="gun-success-icon-wrap">
              <CheckCircle2 size={36} style={{ color: '#10b981' }} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '8px 0 4px' }}>
              Item Transmitted to POS!
            </h3>
            {lastScanned?.product && (
              <div className="gun-product-preview-box">
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {lastScanned.product.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0' }}>
                  SKU: {lastScanned.product.sku} {lastScanned.product.size && `• Size: ${lastScanned.product.size}`}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  ₹{lastScanned.product.selling_price}
                </div>
              </div>
            )}

            {/* Prominent SCAN NEXT ITEM button */}
            <button className="gun-scan-next-btn" onClick={handleScanNext}>
              <Zap size={20} />
              <span>⚡ SCAN NEXT ITEM</span>
            </button>
          </div>
        )}
      </div>

      {/* Auto-Continuous Mode Toggle */}
      <div className="gun-options-bar">
        <label className="gun-switch-label">
          <input
            type="checkbox"
            checked={autoContinuous}
            onChange={(e) => setAutoContinuous(e.target.checked)}
          />
          <span>Continuous Rapid Scan Mode (No Pause)</span>
        </label>
      </div>

      {/* Manual Barcode / SKU Fallback Input */}
      <form onSubmit={handleManualSubmit} className="gun-manual-form">
        <input
          type="text"
          placeholder="Type damaged barcode or SKU..."
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          className="form-control"
          style={{ height: '42px', fontSize: '13px' }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '0 16px', height: '42px' }}>
          <Send size={16} />
        </button>
      </form>

      {/* Scanned History Feed */}
      <div className="gun-history-section">
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
          Recent Gun Scans ({history.length})
        </div>
        <div className="gun-history-scroll">
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
              No items scanned in this session yet.
            </div>
          ) : (
            history.map((h, i) => (
              <div key={h.id || i} className="gun-history-item">
                <Shirt size={15} style={{ color: 'var(--accent)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{h.product?.name || h.barcode}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.barcode}</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>
                  ₹{h.product?.selling_price || 0}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
