import React from 'react';
import { personalInfo } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';
import AnimatedHeading from '../components/animations/AnimatedHeading';
import CopyEmail from '../components/animations/CopyEmail';
import ContactGlobe from '../components/animations/ContactGlobe';
import '../styles/contact.css';

const Contact = () => {
  return (
    <SectionWrapper id="contact" className="contact-section">
      <AnimatedHeading as="h2" className="section-title" text="Contact" />
      
      <div className="contact-content">
        <div className="contact-left">
          <p className="contact-description">
            I'm currently open to new opportunities. Whether you have a question or just want to say hi, feel free to reach out.
          </p>
          <div className="contact-methods">
            <CopyEmail email={personalInfo.email} className="contact-method" />
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-method">
              <span>LinkedIn ↗</span>
            </a>
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-method">
              <span>GitHub ↗</span>
            </a>
          </div>
        </div>
        
        <div className="contact-right">
          <ContactGlobe />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;