import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration) => {
    const id = Math.random().toString(36).substring(2, 9);
    const autoDuration = duration || (type === 'error' || type === 'warning' ? 4000 : 2500);

    setToasts((prev) => {
      // Keep at most 3 active toasts so rapid scanning does not overflow the UI
      const nextToasts = [...prev, { id, message, type }];
      if (nextToasts.length > 3) {
        return nextToasts.slice(nextToasts.length - 3);
      }
      return nextToasts;
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, autoDuration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let toastTypeClass = 'toast-success';
          if (toast.type === 'error') {
            Icon = AlertCircle;
            toastTypeClass = 'toast-error';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            toastTypeClass = 'toast-warning';
          } else if (toast.type === 'info') {
            Icon = Info;
            toastTypeClass = 'toast-info';
          }

          return (
            <div
              key={toast.id}
              className={`toast-item ${toastTypeClass}`}
              onClick={() => removeToast(toast.id)}
              role="alert"
            >
              <Icon size={17} className="toast-icon" />
              <span className="toast-message">{toast.message}</span>
              <button
                type="button"
                className="toast-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
