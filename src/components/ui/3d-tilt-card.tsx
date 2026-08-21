"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareColor?: string;
  borderColor?: string;
  scale?: number;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  glareColor = "rgba(201, 161, 90, 0.16)",
  borderColor = "rgba(201, 161, 90, 0.4)",
  scale = 1.025,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 200, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);

    setGlarePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      animate={{
        scale: isHovered ? scale : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`relative rounded-xl overflow-hidden ${className}`}
    >
      {/* Dynamic Cursor Spotlight Glare */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.25s ease",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Dynamic Border Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: `1px solid ${borderColor}`,
          opacity: isHovered ? 1 : 0.3,
          transition: "opacity 0.25s ease, border-color 0.25s ease",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* 3D Elevated Content Layer */}
      <div
        style={{
          transform: "translateZ(25px)",
          transformStyle: "preserve-3d",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default TiltCard;
