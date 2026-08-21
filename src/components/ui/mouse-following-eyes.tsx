"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";

interface MouseFollowingEyesProps {
  size?: number;
  gap?: number;
  className?: string;
}

const MouseFollowingEyes: React.FC<MouseFollowingEyesProps> = ({
  size = 30,
  gap = 6,
  className = "",
}) => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isBlinking, setIsBlinking] = useState(false);
  const eye1Ref = useRef<HTMLDivElement>(null);
  const eye2Ref = useRef<HTMLDivElement>(null);

  // Global mouse tracking across viewport
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth, organic human eyelid blink cycle with occasional double-blinks
  useEffect(() => {
    let blinkTimer: NodeJS.Timeout;

    const performBlink = (onComplete?: () => void) => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        if (onComplete) {
          setTimeout(onComplete, 90);
        }
      }, 110);
    };

    const scheduleNextBlink = () => {
      const isDoubleBlink = Math.random() < 0.2;
      const nextDelay = Math.random() * 3500 + 3500;

      blinkTimer = setTimeout(() => {
        if (isDoubleBlink) {
          performBlink(() => {
            performBlink(scheduleNextBlink);
          });
        } else {
          performBlink(scheduleNextBlink);
        }
      }, nextDelay);
    };

    const firstDelay = Math.random() * 1500 + 2500;
    blinkTimer = setTimeout(scheduleNextBlink, firstDelay);

    return () => clearTimeout(blinkTimer);
  }, []);

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${gap}px`,
        verticalAlign: "middle",
        cursor: "default",
      }}
    >
      <Eye
        size={size}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        isBlinking={isBlinking}
        selfRef={eye1Ref as React.RefObject<HTMLDivElement>}
      />
      <Eye
        size={size}
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        isBlinking={isBlinking}
        selfRef={eye2Ref as React.RefObject<HTMLDivElement>}
      />
    </div>
  );
};

interface EyeProps {
  size: number;
  mouseX: number;
  mouseY: number;
  isBlinking: boolean;
  selfRef: React.RefObject<HTMLDivElement>;
}

const Eye: React.FC<EyeProps> = ({
  size,
  mouseX,
  mouseY,
  isBlinking,
  selfRef,
}) => {
  const pupilRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const centerRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const updateCenter = () => {
    if (!selfRef.current) return;
    const rect = selfRef.current.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  useEffect(() => {
    updateCenter();
    window.addEventListener("resize", updateCenter);
    window.addEventListener("scroll", updateCenter, { passive: true });
    return () => {
      window.removeEventListener("resize", updateCenter);
      window.removeEventListener("scroll", updateCenter);
    };
  }, []);

  // Compute realistic look angle with smooth depth constraint
  useEffect(() => {
    updateCenter();
    if (mouseX === -1000 && mouseY === -1000) {
      targetPos.current = { x: 0, y: 0 };
      return;
    }

    const center = centerRef.current;
    const dx = mouseX - center.x;
    const dy = mouseY - center.y;
    const dist = Math.hypot(dx, dy);

    const pupilDiameter = Math.max(12, Math.round(size * 0.48));
    const maxMove = Math.max(3.5, (size - pupilDiameter) / 2 - 1.5);

    if (dist < 3) {
      targetPos.current = { x: 0, y: 0 };
      return;
    }

    const angle = Math.atan2(dy, dx);
    const moveDist = Math.min(maxMove, Math.pow(dist / 180, 0.8) * maxMove);

    targetPos.current = {
      x: Math.cos(angle) * moveDist,
      y: Math.sin(angle) * moveDist,
    };
  }, [mouseX, mouseY, size]);

  // Smooth critically-damped spring saccades
  useEffect(() => {
    const loop = () => {
      const target = targetPos.current;
      const current = currentPos.current;

      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;

      if (pupilRef.current) {
        pupilRef.current.style.transform = `translate(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const pupilDiameter = Math.max(12, Math.round(size * 0.48));
  const innerPupilSize = Math.max(6, Math.round(pupilDiameter * 0.48));
  const glint1Size = Math.max(3.2, Math.round(pupilDiameter * 0.32));
  const glint2Size = Math.max(2, Math.round(pupilDiameter * 0.2));

  return (
    <div
      ref={selfRef}
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, #2a2d3a 0%, #191b24 55%, #0f1117 100%)",
        border: "1.5px solid #C9A15A",
        boxShadow: `
          0 0 12px rgba(201, 161, 90, 0.4),
          0 0 2px rgba(255, 232, 158, 0.6),
          inset 0 3px 5px rgba(0, 0, 0, 0.8),
          inset 0 -2px 4px rgba(201, 161, 90, 0.25)
        `,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Concentric Golden Limbal Border Ring */}
      <div
        style={{
          position: "absolute",
          width: `${size - 5}px`,
          height: `${size - 5}px`,
          borderRadius: "50%",
          border: "1px solid rgba(201, 161, 90, 0.3)",
          boxShadow: "inset 0 0 4px rgba(0,0,0,0.5)",
          pointerEvents: "none",
        }}
      />

      {/* Realistic Multi-Layer Gold Iris & Pupil */}
      <div
        ref={pupilRef}
        style={{
          position: "absolute",
          width: `${pupilDiameter}px`,
          height: `${pupilDiameter}px`,
          borderRadius: "50%",
          background: `
            radial-gradient(circle at 35% 35%, #FFF5CC 0%, #FFD666 22%, #D49E35 50%, #996B1C 80%, #3D2908 100%)
          `,
          boxShadow: "0 0 9px rgba(229, 183, 87, 0.8), 0 0 3px rgba(255, 245, 204, 0.9)",
          border: "1px solid rgba(74, 52, 14, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        {/* Deep Obsidian Core */}
        <div
          style={{
            position: "absolute",
            width: `${innerPupilSize}px`,
            height: `${innerPupilSize}px`,
            borderRadius: "50%",
            backgroundColor: "#0A0804",
            boxShadow: "0 0 2px rgba(0, 0, 0, 0.9)",
          }}
        />

        {/* Primary Specular Glint (Spherical Highlight) */}
        <div
          style={{
            position: "absolute",
            width: `${glint1Size}px`,
            height: `${glint1Size}px`,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            top: "14%",
            left: "16%",
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.95)",
          }}
        />

        {/* Secondary Warm Catchlight */}
        <div
          style={{
            position: "absolute",
            width: `${glint2Size}px`,
            height: `${glint2Size}px`,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 235, 175, 0.8)",
            bottom: "18%",
            right: "18%",
            boxShadow: "0 0 2px rgba(255, 235, 175, 0.6)",
          }}
        />
      </div>

      {/* 3D Glass Cornea Lens Sheen Reflection */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 32%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* Realistic Eyelid Blink Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 4,
        }}
      >
        {/* Upper Eyelid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "70%",
            background: "radial-gradient(ellipse at center top, #232532 0%, #151720 75%, #0e1017 100%)",
            borderBottom: "1.5px solid rgba(201, 161, 90, 0.85)",
            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.9)",
            transform: isBlinking ? "translateY(0%)" : "translateY(-110%)",
            transition: isBlinking
              ? "transform 0.09s cubic-bezier(0.4, 0, 0.7, 0.2)"
              : "transform 0.16s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }}
        />

        {/* Lower Eyelid */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "35%",
            background: "radial-gradient(ellipse at center bottom, #232532 0%, #151720 75%, #0e1017 100%)",
            borderTop: "1px solid rgba(201, 161, 90, 0.5)",
            boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.8)",
            transform: isBlinking ? "translateY(0%)" : "translateY(110%)",
            transition: isBlinking
              ? "transform 0.09s cubic-bezier(0.4, 0, 0.7, 0.2)"
              : "transform 0.16s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
};

export { MouseFollowingEyes };
export default MouseFollowingEyes;
