import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function MagneticButton({ children, className = '', style = {}, onClick, ...props }) {
  const zoneRef = useRef(null);
  const btnRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    const zone = zoneRef.current;
    const btn = btnRef.current;
    const shadow = shadowRef.current;
    if (!zone || !btn || !shadow) return;

    let ctx = gsap.context(() => {
      // 1. Wiggle Loop
      // Using a timeline to simulate "ease: wiggle({wiggles:8, type:easeOut})" 
      // without requiring the premium CustomWiggle plugin.
      const wiggleTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      const dur = 1.5 / 16;
      for (let i = 8; i > 0; i--) {
        const amplitude = (i / 8) * 12; // Decaying rotation
        wiggleTl.to(btn, { rotation: amplitude, duration: dur, ease: "power1.inOut" })
                .to(btn, { rotation: -amplitude, duration: dur, ease: "power1.inOut" });
      }
      wiggleTl.to(btn, { rotation: 0, duration: dur, ease: "power1.inOut" });

      // 2. Magnetic Pull — overwrite: "auto" keeps the wiggle!
      const strength = 0.5;

      const handleMouseMove = (e) => {
        const rect = zone.getBoundingClientRect();
        // Calculate relative position based on the zone
        const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
        const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

        // Move the button itself
        gsap.to(btn, {
          x: x * strength,
          y: y * strength,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto"
        });

        // Add shadow glow on hover
        gsap.to(shadow, {
          boxShadow: '0px 8px 24px rgba(201, 161, 90, 0.2), inset 0px 0px 12px rgba(201, 161, 90, 0.1)',
          duration: 0.3,
          overwrite: "auto"
        });

        // Scale up
        gsap.to(btn, { scale: 1.03, duration: 0.3, overwrite: "auto" });
      };

      const handleMouseLeave = () => {
        gsap.to(btn, { 
          x: 0, 
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "elastic.out(1, 0.4)",
          overwrite: "auto"
        });

        gsap.to(shadow, {
          boxShadow: '0px 0px 0px rgba(201, 161, 90, 0)',
          duration: 0.7,
          overwrite: "auto"
        });
      };

      const handleMouseDown = () => {
        gsap.to(btn, { scale: 0.97, duration: 0.1, overwrite: "auto" });
      };

      const handleMouseUp = () => {
        gsap.to(btn, { scale: 1.03, duration: 0.1, overwrite: "auto" });
      };

      zone.addEventListener("mousemove", handleMouseMove);
      zone.addEventListener("mouseleave", handleMouseLeave);
      zone.addEventListener("mousedown", handleMouseDown);
      zone.addEventListener("mouseup", handleMouseUp);

      return () => {
        zone.removeEventListener("mousemove", handleMouseMove);
        zone.removeEventListener("mouseleave", handleMouseLeave);
        zone.removeEventListener("mousedown", handleMouseDown);
        zone.removeEventListener("mouseup", handleMouseUp);
      };
    }, zoneRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={zoneRef}
      onClick={onClick}
      style={{ 
        display: 'inline-block', 
        padding: '1rem', // Creates a magnetic catch area around the button
        margin: '-1rem', // Offsets the padding so it doesn't break layout
        cursor: 'pointer' 
      }}
    >
      <button
        ref={btnRef}
        className={className}
        style={{
          ...style,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none', // Let the outer zone handle all mouse events
          transformOrigin: 'center center' // Important for wiggle rotation
        }}
        {...props}
      >
        <div
          ref={shadowRef}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 0,
            boxShadow: '0px 0px 0px rgba(201, 161, 90, 0)'
          }}
        />
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      </button>
    </div>
  );
}
