import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import './NeonCursor.css';

const NeonCursor = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMagnetized, setIsMagnetized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePosRef = useRef({ x: -100, y: -100 });
  const isClickingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const lastMagneticUpdate = useRef(0);
  const magneticTimeoutRef = useRef(null);

  // Raw mouse coordinates initialized offscreen
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Target coordinates for outer ring (ring 3) which separates to latch onto magnetic buttons
  const ring3TargetX = useMotionValue(-100);
  const ring3TargetY = useMotionValue(-100);
  const ring3ScaleVal = useMotionValue(1);

  // Springs for each layer (Tuned for responsive, accurate momentum without sluggish lag)
  const springRing1 = { stiffness: 750, damping: 38, mass: 0.16 };
  const springRing2 = { stiffness: 460, damping: 28, mass: 0.24 };
  const springRing3 = { stiffness: 340, damping: 24, mass: 0.28 };
  const springScale = { stiffness: 350, damping: 24 };

  const ring1X = useSpring(cursorX, springRing1);
  const ring1Y = useSpring(cursorY, springRing1);

  const ring2X = useSpring(cursorX, springRing2);
  const ring2Y = useSpring(cursorY, springRing2);

  const ring3X = useSpring(ring3TargetX, springRing3);
  const ring3Y = useSpring(ring3TargetY, springRing3);
  const ring3Scale = useSpring(ring3ScaleVal, springScale);

  // Function to calculate magnetic attraction toward buttons/dock items
  const updateMagneticCursor = useCallback((clientX, clientY) => {
    mousePosRef.current = { x: clientX, y: clientY };

    cursorX.set(clientX);
    cursorY.set(clientY);

    const performMagneticCheck = () => {
      lastMagneticUpdate.current = performance.now();
      const currentX = mousePosRef.current.x;
      const currentY = mousePosRef.current.y;

      // Restrict magnetic attraction strictly to header buttons (floating dock navigation items)
      const headerMagneticSelector = '.dock-item, .mobile-item, .mobile-toggle, .navbar-floating-dock-container [data-magnetic="true"]';
      const candidates = document.querySelectorAll(headerMagneticSelector);

      let bestTarget = null;
      let closestDist = Infinity;
      let closestRect = null;
      let closestBtnRadius = 0;

      // 1. Direct hit check under cursor
      const directHit = document.elementFromPoint(currentX, currentY);
      const directTarget = directHit?.closest?.(headerMagneticSelector);

      if (directTarget) {
        const rect = directTarget.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          bestTarget = directTarget;
          closestRect = rect;
          closestBtnRadius = Math.max(rect.width, rect.height) / 2;
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          closestDist = Math.hypot(cx - currentX, cy - currentY);
        }
      }

      // 2. Proximity check across visible candidates (e.g. gaps between dock icons or approaching buttons)
      if (!bestTarget) {
        for (let i = 0; i < candidates.length; i++) {
          const el = candidates[i];
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          if (
            rect.bottom < -20 ||
            rect.top > window.innerHeight + 20 ||
            rect.right < -20 ||
            rect.left > window.innerWidth + 20
          ) {
            continue;
          }

          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(cx - currentX, cy - currentY);
          const btnRadius = Math.max(rect.width, rect.height) / 2;
          const reach = btnRadius + 60; // 60px magnetic catch zone around button perimeter

          if (dist < reach && dist < closestDist) {
            closestDist = dist;
            bestTarget = el;
            closestRect = rect;
            closestBtnRadius = btnRadius;
          }
        }
      }

      // Apply magnetic pull if a target is found
      if (bestTarget && closestRect) {
        const cx = closestRect.left + closestRect.width / 2;
        const cy = closestRect.top + closestRect.height / 2;
        const reach = closestBtnRadius + 60;
        const dist = Math.hypot(cx - currentX, cy - currentY);

        if (dist < reach) {
          // High attraction towards center of button with subtle elastic follow
          let pull = 0.88;
          if (dist > closestBtnRadius) {
            const t = (dist - closestBtnRadius) / (reach - closestBtnRadius);
            pull = 0.88 * Math.pow(1 - t, 1.8);
          }

          const targetX = currentX + (cx - currentX) * pull;
          const targetY = currentY + (cy - currentY) * pull;

          ring3TargetX.set(targetX);
          ring3TargetY.set(targetY);

          // Dynamically scale the outer ring to comfortably frame the button
          const desiredDiameter = Math.max(closestRect.width, closestRect.height) + 12;
          const maxScale = Math.max(1.22, Math.min(2.1, desiredDiameter / 52));
          const currentScale = 1 + (maxScale - 1) * (pull / 0.88);

          ring3ScaleVal.set(isClickingRef.current ? currentScale * 0.82 : currentScale);
          setIsMagnetized(true);
          setIsHovering(true);
          return;
        }
      }

      // Default tracking when not magnetized
      ring3TargetX.set(currentX);
      ring3TargetY.set(currentY);
      const regularScale = isClickingRef.current ? 0.75 : isHoveringRef.current ? 1.25 : 1;
      ring3ScaleVal.set(regularScale);
      setIsMagnetized(false);
    };

    const now = performance.now();
    if (now - lastMagneticUpdate.current > 40) {
      if (magneticTimeoutRef.current) clearTimeout(magneticTimeoutRef.current);
      performMagneticCheck();
    } else {
      if (magneticTimeoutRef.current) clearTimeout(magneticTimeoutRef.current);
      magneticTimeoutRef.current = setTimeout(performMagneticCheck, 40);
    }
  }, [cursorX, cursorY, ring3TargetX, ring3TargetY, ring3ScaleVal]);

  // Handle cursor visibility and movements
  const handleMouseMove = useCallback((e) => {
    if (!isVisible) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ring1X.jump?.(e.clientX);
      ring1Y.jump?.(e.clientY);
      ring2X.jump?.(e.clientX);
      ring2Y.jump?.(e.clientY);
      ring3TargetX.set(e.clientX);
      ring3TargetY.set(e.clientY);
      ring3X.jump?.(e.clientX);
      ring3Y.jump?.(e.clientY);
      setIsVisible(true);
    }
    updateMagneticCursor(e.clientX, e.clientY);
  }, [cursorX, cursorY, ring1X, ring1Y, ring2X, ring2Y, ring3TargetX, ring3TargetY, ring3X, ring3Y, isVisible, updateMagneticCursor]);

  // Handle scroll events (updates magnetic lock as buttons scroll under or near cursor)
  const handleScroll = useCallback(() => {
    if (mousePosRef.current.x < 0) return;
    updateMagneticCursor(mousePosRef.current.x, mousePosRef.current.y);
  }, [updateMagneticCursor]);

  const handleMouseDown = useCallback(() => {
    isClickingRef.current = true;
    setIsClicking(true);
    ring3ScaleVal.set(ring3ScaleVal.get() * 0.82);
  }, [ring3ScaleVal]);

  const handleMouseUp = useCallback(() => {
    isClickingRef.current = false;
    setIsClicking(false);
    updateMagneticCursor(mousePosRef.current.x, mousePosRef.current.y);
  }, [updateMagneticCursor]);

  const handleMouseOver = useCallback((e) => {
    const target = e.target;
    if (!target) return;
    
    // Check if hovering over interactive elements
    const interactiveEl = target.closest('a, button, input, textarea, select, [data-hover="true"], [role="button"], [data-magnetic="true"]');
    if (
      interactiveEl || 
      window.getComputedStyle(target).cursor === 'pointer'
    ) {
      isHoveringRef.current = true;
      setIsHovering(true);
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    isHoveringRef.current = false;
    setIsHovering(false);
  }, []);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
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
      window.removeEventListener('scroll', handleScroll);
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
  }, [shouldReduceMotion, handleMouseMove, handleScroll, handleMouseDown, handleMouseUp, handleMouseOver, handleMouseOut, handleMouseEnter, handleMouseLeave]);

  if (shouldReduceMotion) return null;

  return (
    <div 
      className="neon-cursor-container"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.25s ease' }}
    >
      {/* Ring 3 (Outer ring that attracts magnetically to buttons) */}
      <motion.div
        className={`cursor-ring cursor-ring-3 ${isMagnetized ? 'is-magnetized' : ''}`}
        style={{ 
          x: ring3X, 
          y: ring3Y,
          scale: ring3Scale,
        }}
        animate={{
          borderColor: isMagnetized
            ? 'rgba(255, 215, 0, 0.95)'
            : isHovering 
            ? 'rgba(201, 161, 90, 0.85)' 
            : 'rgba(201, 161, 90, 0.45)',
          backgroundColor: isMagnetized
            ? 'rgba(201, 161, 90, 0.12)'
            : isHovering 
            ? 'rgba(201, 161, 90, 0.08)' 
            : 'transparent',
          boxShadow: isMagnetized
            ? '0 0 18px rgba(255, 215, 0, 0.45), inset 0 0 10px rgba(255, 215, 0, 0.15)'
            : isHovering
            ? '0 0 12px rgba(201, 161, 90, 0.25)'
            : '0 0 14px rgba(201, 161, 90, 0.15)',
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

      {/* Center Dot (1:1 instant hardware tracking for pinpoint accuracy) */}
      <motion.div
        className="cursor-dot"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: isClicking ? 0.75 : isHovering ? 1.25 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      />
    </div>
  );
};

export default NeonCursor;
