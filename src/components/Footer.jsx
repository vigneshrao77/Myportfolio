import React from 'react';
import { personalInfo } from '../data/portfolioData';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-left">
            <p className="footer-text">
              Designed & Built by <span className="highlight">{personalInfo.name}</span>
            </p>
            <p className="footer-copyright">
              © {currentYear} All rights reserved
            </p>
          </div>
          
          <div className="footer-right">
            <div className="social-links">
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="social-link">
                GitHub
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                LinkedIn
              </a>
              <a href={`mailto:${personalInfo.email}`} className="social-link">
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;