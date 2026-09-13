import React, { useRef } from 'react';
import './AnimatedDownloadButton.css';

const AnimatedDownloadButton = ({ onDownload }) => {
  const checkboxRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.checked) {
      if (onDownload) {
        // Trigger download with a small delay for animation start
        setTimeout(() => {
            onDownload();
        }, 3500); // Trigger download after the "installing" animation
      }
      
      // Reset the button state after 6 seconds total
      setTimeout(() => {
        if (checkboxRef.current) {
            checkboxRef.current.checked = false;
        }
      }, 6000); 
    }
  };

  return (
    <div className="download-btn-container">
      <label className="download-label">
        <input 
            type="checkbox" 
            className="download-input" 
            onChange={handleChange} 
            ref={checkboxRef}
        />
        <span className="download-circle">
          <svg
            className="download-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 19V5m0 14-4-4m4 4 4-4"
            ></path>
          </svg>
          <div className="download-square"></div>
        </span>
        <p className="download-title">Download</p>
        <p className="download-title">Done</p>
      </label>
    </div>
  );
};

export default AnimatedDownloadButton;
