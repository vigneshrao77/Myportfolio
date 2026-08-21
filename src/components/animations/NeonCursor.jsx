import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import './NeonCursor.css';

const NeonCursor = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse coordinates initialized offscreen
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs for each layer (Configured for an elegant trailing lag effect)
  const springDot = { stiffness: 400, damping: 28, mass: 0.25 };
  const springRing1 = { stiffness: 260, damping: 24, mass: 0.4 };
  const springRing2 = { stiffness: 170, damping: 20, mass: 0.6 };
  const springRing3 = { stiffness: 100, damping: 16, mass: 0.85 };

  const dotX = useSpring(cursorX, springDot);
  const dotY = useSpring(cursorY, springDot);

  const ring1X = useSpring(cursorX, springRing1);
  const ring1Y = useSpring(cursorY, springRing1);

  const ring2X = useSpring(cursorX, springRing2);
  const ring2Y = useSpring(cursorY, springRing2);

  const ring3X = useSpring(cursorX, springRing3);
  const ring3Y = useSpring(cursorY, springRing3);

  // Handle cursor visibility and movements
  const handleMouseMove = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    if (!isVisible) setIsVisible(true);
  }, [cursorX, cursorY, isVisible]);

  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);

  const handleMouseOver = useCallback((e) => {
    const target = e.target;
    if (!target) return;
    
    // Check if hovering over interactive elements
    const interactiveEl = target.closest('a, button, input, textarea, select, [data-hover="true"], [role="button"]');
    if (
      interactiveEl || 
      window.getComputedStyle(target).cursor === 'pointer'
    ) {
      setIsHovering(true);
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Inject global styles to force hide default cursor
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [shouldReduceMotion, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseOver, handleMouseOut, handleMouseEnter, handleMouseLeave]);

  if (shouldReduceMotion) return null;

  return (
    <div 
      className="neon-cursor-container"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.25s ease' }}
    >
      {/* Ring 3 (Outer subtle glow ring) */}
      <motion.div
        className="cursor-ring cursor-ring-3"
        style={{ 
          x: ring3X, 
          y: ring3Y,
        }}
        animate={{
          scale: isClicking ? 0.75 : isHovering ? 1.25 : 1,
          borderColor: isHovering ? 'rgba(201, 161, 90, 0.85)' : 'rgba(201, 161, 90, 0.45)',
          backgroundColor: isHovering ? 'rgba(201, 161, 90, 0.08)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      />

      {/* Ring 2 (Middle golden ring) */}
      <motion.div
        className="cursor-ring cursor-ring-2"
        style={{ x: ring2X, y: ring2Y }}
        animate={{
          scale: isClicking ? 0.6 : isHovering ? 1.15 : 1,
          opacity: isHovering ? 0.7 : 1,
          borderColor: isHovering ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 215, 0, 0.75)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      />

      {/* Ring 1 (Inner bright ring) */}
      <motion.div
        className="cursor-ring cursor-ring-1"
        style={{ x: ring1X, y: ring1Y }}
        animate={{
          scale: isClicking ? 0.65 : isHovering ? 1.1 : 1,
          opacity: isHovering ? 0.85 : 1,
          borderColor: isHovering ? 'rgba(255, 239, 166, 1)' : 'rgba(255, 239, 166, 0.9)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      />

      {/* Center Dot */}
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: isClicking ? 0.75 : isHovering ? 1.25 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      />
    </div>
  );
};

export default NeonCursor;
