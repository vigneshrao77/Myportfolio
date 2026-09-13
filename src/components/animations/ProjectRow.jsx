import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ProjectRow({ title, href, children }) {
  const [hovered, setHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div className="project-item-wrapper">
      <motion.div
        className="project-item"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="project-header">
          <div className="project-title-container">
            <motion.h3 
              className="project-title"
              animate={{ x: hovered && !shouldReduceMotion ? 4 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {title}
            </motion.h3>
            <motion.div 
              className="project-title-underline"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: hovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: 0 }}
            />
          </div>
          
          {href && (
            <div className="project-links">
              <a href={href} target="_blank" rel="noreferrer" className="project-github-link">
                <span className="project-github-text">GITHUB</span>
                <motion.span 
                  className="project-github-arrow"
                  animate={{ x: hovered ? 3 : 0, y: hovered ? -3 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  ↗
                </motion.span>
                <motion.div 
                  className="project-github-underline"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hovered ? 1 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ originX: 0 }}
                />
              </a>
            </div>
          )}
        </div>
        <p className="project-description">{children}</p>
      </motion.div>
    </div>
  );
}
