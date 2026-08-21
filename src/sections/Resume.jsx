import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import AnimatedHeading from "../components/animations/AnimatedHeading";
import { StaggerReveal, StaggerItem } from "../components/animations/StaggerReveal";
import MagneticButton from "../components/animations/MagneticButton";
import "../styles/resume.css";
import DotField from "../components/animations/DotField";

const Resume = () => {
  const [downloadState, setDownloadState] = useState("idle"); // idle, downloading, downloaded
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleDownload = () => {
    if (downloadState !== "idle") return;
    setDownloadState("downloading");
    
    // Simulate download delay for interaction feedback
    setTimeout(() => {
      setDownloadState("downloaded");
      window.open('/resume.pdf?v=2', '_blank');
      
      // Revert after showing checkmark
      setTimeout(() => {
        setDownloadState("idle");
      }, 2000);
    }, 800);
  };

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section 
      id="resume" 
      className="resume-section"
      ref={sectionRef} 
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#cc771d"
          gradientTo="#cc771d"
          glowColor="transparent"
        />
      </div>
      {/* Ambient Spotlight */}
        {!shouldReduceMotion && (
          <motion.div
            animate={{ x: mousePos.x - 200, y: mousePos.y - 200 }}
            transition={{ type: "spring", damping: 40, stiffness: 100, mass: 0.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(201, 161, 90, 0.05) 0%, rgba(201, 161, 90, 0) 60%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="resume-container">
          <StaggerReveal className="resume-content">
            <StaggerItem>
              <AnimatedHeading as="h2" className="section-title" text="Resume" />
            </StaggerItem>

            <StaggerItem>
              <p className="resume-description">
                Download my complete resume to learn more about my experience and
                qualifications.
              </p>
            </StaggerItem>

            <StaggerItem>
              <motion.button 
                className="resume-download-btn"
                onClick={handleDownload}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02, y: shouldReduceMotion ? 0 : -3 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="resume-download-bg" />
                <span className="resume-download-content">
                  {downloadState === "idle" && "Download Resume"}
                  {downloadState === "downloading" && "Downloading..."}
                  {downloadState === "downloaded" && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Downloaded
                    </span>
                  )}
                </span>
                <div className="resume-download-border" />
              </motion.button>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
};

export default Resume;