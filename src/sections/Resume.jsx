import React, { useRef } from "react";
import { motion, useReducedMotion, useMotionValue } from "framer-motion";

import AnimatedHeading from "../components/animations/AnimatedHeading";
import { StaggerReveal, StaggerItem } from "../components/animations/StaggerReveal";
import "../styles/resume.css";
import DotField from "../components/animations/DotField";
import AnimatedDownloadButton from "../components/ui/AnimatedDownloadButton";

const Resume = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  // useMotionValue avoids React state re-renders on every mousemove.
  // The spotlight motion.div reads these values directly via the 'style' prop.
  const spotlightX = useMotionValue(-200);
  const spotlightY = useMotionValue(-200);

  const handleDownload = () => {
    window.open('/resume.pdf?v=2', '_blank');
  };

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    // Set motion values imperatively — zero React state updates
    spotlightX.set(e.clientX - rect.left - 200);
    spotlightY.set(e.clientY - rect.top - 200);
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
      {/* Ambient Spotlight — driven by motion values, not React state */}
        {!shouldReduceMotion && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              x: spotlightX,
              y: spotlightY,
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
              <AnimatedDownloadButton onDownload={handleDownload} />
            </StaggerItem>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
};

export default Resume;