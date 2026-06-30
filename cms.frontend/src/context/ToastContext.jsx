import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const confirm = (options) => {
    return new Promise((resolve) => {
      setConfirmModal({
        ...options,
        onConfirm: () => {
          setConfirmModal(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmModal(null);
          resolve(false);
        }
      });
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}
      
      {/* Toast Area */}
      <div className="toast-container-custom">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-custom ${t.type}`}>
            <span className="toast-icon">
              {t.type === 'success' && <i className="fa-solid fa-circle-check"></i>}
              {t.type === 'error' && <i className="fa-solid fa-circle-xmark"></i>}
              {t.type === 'warning' && <i className="fa-solid fa-circle-exclamation"></i>}
              {t.type === 'info' && <i className="fa-solid fa-circle-info"></i>}
            </span>
            <span className="toast-message">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Custom Confirm Modal Popup */}
      {confirmModal && (
        <div className="auth-overlay" style={{ zIndex: 9999 }}>
          <div className="auth-modal-card" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem', animation: 'scaleUp 0.3s ease-out' }}>
            <div style={{ fontSize: '3.5rem', color: '#f59e0b', marginBottom: '1rem' }}>
              <i className="fa-solid fa-circle-question"></i>
            </div>
            <h4 style={{ fontWeight: '800', marginBottom: '0.5rem', color: '#111827' }}>
              {confirmModal.title || 'Xác nhận'}
            </h4>
            <p className="text-muted mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
              {confirmModal.message}
            </p>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-secondary flex-fill" 
                style={{ borderRadius: '10px', height: '42px', fontWeight: 'bold' }}
                onClick={confirmModal.onCancel}
              >
                Hủy bỏ
              </button>
              <button 
                className="btn btn-primary flex-fill" 
                style={{ borderRadius: '10px', height: '42px', fontWeight: 'bold', background: 'linear-gradient(135deg, #6366f1, #d946ef)', border: 'none' }}
                onClick={confirmModal.onConfirm}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
