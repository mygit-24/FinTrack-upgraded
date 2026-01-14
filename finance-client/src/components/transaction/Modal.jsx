import React from 'react';

const Modal = ({ onClose, children }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10000, // ערך גבוה מאוד לוודא מעל כל האלמנטים
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 8,
          position: 'relative',
          width: '90%',
          maxWidth: 500,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'transparent',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            color: '#555',
          }}
          aria-label="Close modal"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
