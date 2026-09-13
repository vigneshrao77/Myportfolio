import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export default function CursorSpotlight() {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);

  // Responsive soft inertia physics
  const springConfig = { damping: 28, stiffness: 280, mass: 0.28 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const moveCursor = (e) => {
      if (!isVisible) {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        smoothX.jump?.(e.clientX);
        smoothY.jump?.(e.clientY);
        setIsVisible(true);
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };

    const handleMouseOut = () => setIsVisible(false);
    const handleMouseOver = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.documentElement.addEventListener('mouseleave', handleMouseOut);
    document.documentElement.addEventListener('mouseenter', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.documentElement.removeEventListener('mouseleave', handleMouseOut);
      document.documentElement.removeEventListener('mouseenter', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: smoothX,
        y: smoothY,
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201, 161, 90, 0.15) 0%, transparent 60%)', // Soft glow without expensive blur
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'translate(-50%, -50%)', // Center on cursor
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    />
  );
}
