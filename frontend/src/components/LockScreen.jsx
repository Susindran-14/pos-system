import React, { useState, useEffect, useRef } from 'react';
import {
  Shirt,
  Unlock,
  ShieldCheck,
  Eye,
  EyeOff,
  Calculator,
  Delete,
  AlertCircle,
  User,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Store,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';

export default function LockScreen() {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const { loginWithPin, loading, currentUser } = useAuth();
  const inputRef = useRef(null);

  // Live time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch available users for cashier preview
  useEffect(() => {
    authApi.getUsers()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          const current = data.find((u) => u.username === currentUser?.username) || data[0];
          setSelectedUser(current);
        }
      })
      .catch(() => {
        setSelectedUser(currentUser || { name: 'Store Administrator', role: 'ADMIN', username: 'admin' });
      });
  }, [currentUser]);

  // Keep input focused so hardware typing immediately works
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const triggerError = (msg) => {
    setLocalError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    setPin('');
    if (inputRef.current) inputRef.current.focus();
  };

  const verifyPin = async (pinToVerify) => {
    if (!pinToVerify || pinToVerify.length < 4) {
      triggerError('Please enter a 4-digit PIN');
      return;
    }
    const success = await loginWithPin(pinToVerify);
    if (!success) {
      triggerError('Invalid security PIN (Default: 1111)');
    }
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
    setLocalError('');
    if (val.length === 4) {
      setTimeout(() => verifyPin(val), 120);
    }
  };

  const handleKeypadPress = (val) => {
    if (loading) return;
    setLocalError('');
    if (val === 'CLEAR') {
      setPin('');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    if (val === 'BACK') {
      setPin((prev) => prev.slice(0, -1));
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    if (pin.length < 4) {
      const next = pin + val;
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => verifyPin(next), 120);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      verifyPin(pin);
    }
  };

  return (
    <div className="login-screen-overlay">
      {/* Ambient background glow spheres */}
      <div className="login-glow-sphere glow-1" />
      <div className="login-glow-sphere glow-2" />
      <div className="login-glow-sphere glow-3" />

      {/* Top status bar */}
      <header className="login-top-bar">
        <div className="login-top-chip">
          <Store size={14} style={{ color: 'var(--accent)' }} />
          <span>Salem Main Branch • Terminal 01</span>
        </div>
        <div className="login-top-chip">
          <Clock size={14} style={{ color: 'var(--success)' }} />
          <span>{currentTime}</span>
        </div>
      </header>

      {/* Main Glass Card */}
      <div className={`login-card ${isShaking ? 'login-shake' : ''}`}>
        {/* Brand Header */}
        <div className="login-brand-section">
          <div className="login-logo-badge">
            <Shirt size={28} className="login-logo-icon" />
            <Sparkles size={14} className="login-logo-sparkle" />
          </div>
          <h1 className="login-title">TAMIL DRESS COLLECTION</h1>
          <p className="login-subtitle-tamil">தமிழ் டிரஸ் கலெக்ஷன்</p>
          <div className="login-badge-pill">
            <ShieldCheck size={13} style={{ color: '#34d399' }} />
            <span>ENTERPRISE POS ACCESS</span>
          </div>
        </div>

        {/* User Card / Switcher */}
        <div className="login-user-box">
          <div className="login-user-avatar">
            <User size={18} />
          </div>
          <div className="login-user-info">
            <div className="login-user-name">{selectedUser?.name || 'Store Administrator'}</div>
            <div className="login-user-role">
              <span className="role-tag">{selectedUser?.role || 'ADMIN'}</span>
              <span className="station-tag">🟢 Ready for PIN</span>
            </div>
          </div>
        </div>

        {/* Hidden direct input to capture hardware keyboard seamlessly */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pin}
          onChange={handlePinChange}
          onKeyDown={handleKeyDown}
          className="login-hidden-input"
          autoFocus
          aria-label="Security PIN"
        />

        {/* PIN Digit Indicators (Ultra Sleek) */}
        <div className="login-pin-section" onClick={() => inputRef.current?.focus()}>
          <div className="login-pin-label-row">
            <span>ENTER 4-DIGIT SECURITY PIN</span>
            <button
              type="button"
              className="login-reveal-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowPin(!showPin);
              }}
              title={showPin ? 'Hide PIN' : 'Show PIN'}
            >
              {showPin ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{showPin ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          <div className="login-pin-slots">
            {[0, 1, 2, 3].map((idx) => {
              const char = pin[idx];
              const isFilled = char !== undefined;
              const isCurrent = pin.length === idx;
              return (
                <div
                  key={idx}
                  className={`login-pin-slot ${isFilled ? 'filled' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  {isFilled ? (
                    showPin ? (
                      <span className="slot-number">{char}</span>
                    ) : (
                      <div className="slot-dot" />
                    )
                  ) : (
                    <div className="slot-placeholder" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error notification banner */}
        {localError && (
          <div className="login-error-banner">
            <AlertCircle size={15} />
            <span>{localError}</span>
          </div>
        )}

        {/* Primary Unlock Button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => verifyPin(pin)}
          className="login-unlock-btn"
        >
          {loading ? (
            <>
              <div className="login-spinner" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <Unlock size={17} />
              <span>Unlock Workstation</span>
              <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
            </>
          )}
        </button>

        {/* Keypad Toggle Button (Optional on-demand Touch Keypad) */}
        <div className="login-keypad-toggle-row">
          <button
            type="button"
            className="login-keypad-toggle-btn"
            onClick={() => setShowKeypad(!showKeypad)}
          >
            <Calculator size={14} />
            <span>{showKeypad ? 'Hide Virtual Keypad' : 'Touchscreen Virtual Keypad'}</span>
            {showKeypad ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Optional Collapsible Virtual Keypad */}
        {showKeypad && (
          <div className="login-virtual-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                className="keypad-digit-btn"
                onClick={() => handleKeypadPress(num.toString())}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              className="keypad-action-btn clear"
              onClick={() => handleKeypadPress('CLEAR')}
            >
              CLEAR
            </button>
            <button
              type="button"
              className="keypad-digit-btn"
              onClick={() => handleKeypadPress('0')}
            >
              0
            </button>
            <button
              type="button"
              className="keypad-action-btn back"
              onClick={() => handleKeypadPress('BACK')}
            >
              <Delete size={17} />
            </button>
          </div>
        )}

        {/* Demo Auto-fill Helper */}
        <div className="login-footer-hint">
          <button
            type="button"
            className="login-hint-chip"
            onClick={() => {
              setPin('1111');
              setLocalError('');
              setTimeout(() => verifyPin('1111'), 120);
            }}
          >
            💡 Default Master PIN: <strong>1111</strong> (Click to Auto-fill)
          </button>
        </div>
      </div>
    </div>
  );
}
