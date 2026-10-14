import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import './EyesLoader.css';

export default function EyesLoader({ onComplete, duration = 2.8 }) {
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const containerRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const liquidRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;
    const liquid = liquidRef.current;
    const percent = percentRef.current;
    if (!leftEye || !rightEye || !liquid || !percent) return;

    const eyes = [leftEye, rightEye];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
          if (onComplete) onComplete();
          setTimeout(() => setShouldRender(false), 950);
        }
      });

      // 1. Goldwater Liquid Filling (Rises organically from 0% to 100%)
      tl.to(liquid, {
        height: '100%',
        duration: 2.7,
        ease: 'power1.inOut',
        onUpdate: function () {
          const val = Math.min(Math.round(this.progress() * 100), 100);
          percent.textContent = `${val}%`;
        }
      }, 0);

      // 2. Eye Lifecycle with Two Truly Butter-Smooth Blinks:
      // Initial state: Start closed as 4px golden slits
      gsap.set(eyes, { height: 4, opacity: 0.5 });

      // Phase 1: Smooth luxury awaken (0.0s -> 0.55s)
      tl.to(eyes, {
        height: 70,
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out'
      }, 0.05);

      // Hold gaze (0.60s -> 1.05s) while liquid flows

      // Blink 1: Natural, unhurried, silky glide down (0.26s) and glide open (0.30s)
      tl.to(eyes, {
        height: 4,
        opacity: 0.55,
        duration: 0.26,
        ease: 'power2.inOut'
      }, 1.05);

      tl.to(eyes, {
        height: 70,
        opacity: 1,
        duration: 0.30,
        ease: 'power2.inOut'
      }, 1.31);

      // Hold gaze (1.61s -> 1.95s) while liquid fills towards 70%

      // Blink 2: Second silky glide down (0.26s) and glide open (0.30s)
      tl.to(eyes, {
        height: 4,
        opacity: 0.55,
        duration: 0.26,
        ease: 'power2.inOut'
      }, 1.95);

      tl.to(eyes, {
        height: 70,
        opacity: 1,
        duration: 0.30,
        ease: 'power2.inOut'
      }, 2.21);

      // Hold open gaze as goldwater reaches 100% and screen dissolves
      tl.to({}, { duration: 0.35 });

    }, containerRef.current || undefined);

    return () => ctx.revert();
  }, [duration, onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className={`eyes-loader-overlay ${isDone ? 'fade-out' : ''}`}
      aria-label="Loading page experience"
      role="status"
    >
      <div className="eyes-ambient-glow" />

      <div className="eyes-wrapper">
        <div className="eyes-container">
          {/* Left Eye Socket */}
          <div className="eye-socket">
            <div ref={leftEyeRef} className="eye-l">
              <div className="eye-pupil">
                <div className="eye-p5">
                  <div className="eye-pupl2">
                    <div className="eye-pupil3" />
                    <div className="eye-pupil4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Eye Socket */}
          <div className="eye-socket">
            <div ref={rightEyeRef} className="eye-m">
              <div className="eye-pupil">
                <div className="eye-p5">
                  <div className="eye-pupl2">
                    <div className="eye-pupil3" />
                    <div className="eye-pupil4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goldwater Liquid Filling Reservoir */}
      <div className="goldwater-container">
        <div className="goldwater-glow-underlay" />
        <div className="goldwater-vessel">
          {/* Dynamic rising liquid level */}
          <div ref={liquidRef} className="goldwater-liquid-level">
            <div className="goldwater-wave-back" />
            <div className="goldwater-wave-front" />
            <div className="goldwater-surface-crest" />
            <div className="goldwater-sparkle goldwater-sparkle-1" />
            <div className="goldwater-sparkle goldwater-sparkle-2" />
            <div className="goldwater-sparkle goldwater-sparkle-3" />
          </div>

          {/* Percentage Counter inside glass reservoir */}
          <span ref={percentRef} className="goldwater-percentage">0%</span>
        </div>
      </div>
    </div>
  );
}
