import { useState, useRef } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

export default function ProjectRow({ title, href, children }) {
  const [hovered, setHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const smokeContainerRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const lastMousePosRef = useRef(null);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 30, stiffness: 100, mass: 1.5 };
  const smokeX = useSpring(mouseX, springConfig);
  const smokeY = useSpring(mouseY, springConfig);

  const spawnParticle = (x, y) => {
    if (!smokeContainerRef.current) return;
    const particle = document.createElement('div');
    particle.className = 'dynamic-smoke';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    const driftX = (Math.random() - 0.5) * 80;
    particle.style.setProperty('--drift-x', `${driftX}px`);
    
    smokeContainerRef.current.appendChild(particle);
    
    setTimeout(() => {
      if (smokeContainerRef.current && smokeContainerRef.current.contains(particle)) {
        smokeContainerRef.current.removeChild(particle);
      }
    }, 2000);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);

    if (shouldReduceMotion) return;

    const now = Date.now();
    const lastPos = lastMousePosRef.current;

    if (!lastPos) {
      spawnParticle(x, y);
      lastMousePosRef.current = { x, y };
      lastSpawnRef.current = now;
      return;
    }

    const dist = Math.hypot(x - lastPos.x, y - lastPos.y);
    
    // Spawn particles every 15 pixels of movement to fill gaps
    if (dist > 15 || (dist > 2 && now - lastSpawnRef.current > 40)) {
      const steps = Math.max(1, Math.floor(dist / 15));
      for (let i = 1; i <= steps; i++) {
        const interpX = lastPos.x + (x - lastPos.x) * (i / steps);
        const interpY = lastPos.y + (y - lastPos.y) * (i / steps);
        spawnParticle(interpX, interpY);
      }
      lastMousePosRef.current = { x, y };
      lastSpawnRef.current = now;
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    lastMousePosRef.current = null;
  };

  return (
    <div className="project-item-wrapper">
      <motion.div
        className="project-item"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          '--mouse-x': useMotionTemplate`${smokeX}px`,
          '--mouse-y': useMotionTemplate`${smokeY}px`
        }}
      >
        <div ref={smokeContainerRef} className="smoke-container" />
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
