import React from 'react';
import '../css/StatusBanner.css';

const StatusBanner = ({ 
  title, 
  description, 
  buttonText = "Cerrar ventana", 
  onClose, 
  type = "success" 
}) => {
  const isSuccess = type === "success";

  return (
    <div className="banner-overlay">
      <div className="banner-container">
        <div className="banner-icon">
          {isSuccess ? (
            <svg viewBox="0 0 24 24" className="status-icon success-icon">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="status-icon error-icon">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
            </svg>
          )}
        </div>
        <h2 className="banner-title">{title}</h2>
        <p className="banner-description">{description}</p>
        <button className="banner-button" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default StatusBanner;
