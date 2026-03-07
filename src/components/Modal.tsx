import React from 'react';

export interface ModalButton {
  label: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  onClose: () => void;
  buttons?: ModalButton[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, type = 'info', onClose, buttons }) => {
  if (!isOpen) return null;

  const getHeaderColor = () => {
    switch (type) {
      case 'error': return '#ff6b6b';
      case 'warning': return '#feca57';
      case 'success': return '#51cf66';
      default: return '#e0e0e0';
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        padding: '24px', borderRadius: '12px', minWidth: '400px', maxWidth: '500px',
        color: '#e0e0e0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '2px solid transparent', backgroundImage: 'linear-gradient(#3a3a3a, #3a3a3a), linear-gradient(135deg, #ef4444, #3b82f6)',
        backgroundOrigin: 'padding-box, border-box', backgroundClip: 'padding-box, border-box'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: getHeaderColor(), borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', fontSize: '1.25rem' }}>{title}</h3>
        <p style={{ margin: '0 0 24px 0', lineHeight: '1.6', color: '#b0b0b0' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {buttons && buttons.length > 0 ? (
            buttons.map((btn, index) => (
              <button key={index} onClick={btn.onClick} className={`btn-action ${btn.className || ''}`} style={{ cursor: 'pointer', ...btn.style }}>
                {btn.label}
              </button>
            ))
          ) : (
            <button onClick={onClose} className="btn-action" style={{ backgroundColor: '#6c757d' }}>Close</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
