"use client";

import type React from "react";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  color: string;
  glowColor: string;
  glowBlur: number;
  isAccent: boolean;
  pulsePhase: number;
}

interface TextParticleAnimationProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  particleSize?: number;
  particleColor?: string;
  particleDensity?: number;
  backgroundColor?: string;
  className?: string;
}

export function TextParticle({
  text = "Vignesh Rao",
  fontSize = 92,
  fontFamily = "'Instrument Serif', Georgia, serif",
  particleSize = 1.6,
  particleColor = "#C9A15A",
  particleDensity = 2.4,
  backgroundColor = "transparent",
  className = "",
}: TextParticleAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const animFrameRef = useRef<number | null>(null);

  const propsRef = useRef({
    text,
    fontSize,
    fontFamily,
    particleSize,
    particleColor,
    particleDensity,
    backgroundColor,
  });

  propsRef.current = {
    text,
    fontSize,
    fontFamily,
    particleSize,
    particleColor,
    particleDensity,
    backgroundColor,
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let animTime = 0;

    const colorTones = [
      { color: "#FFE89E", glow: "rgba(255, 232, 158, 0.4)", blur: 4 },
      { color: "#E8C06C", glow: "rgba(232, 192, 108, 0.35)", blur: 4 },
      { color: "#C9A15A", glow: "rgba(201, 161, 90, 0.3)", blur: 3 },
      { color: "#DFB262", glow: "rgba(223, 178, 98, 0.3)", blur: 3 },
    ];

    const accentTone = { color: "#FFF9E6", glow: "rgba(255, 255, 255, 0.55)", blur: 5 };

    const initParticles = () => {
      const p = propsRef.current;
      w = container.clientWidth || 600;
      h = container.clientHeight || 150;

      if (w === 0 || h === 0) return;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Create oversized offscreen canvas to prevent edge-clipping artifacts
      const offscreenW = w + 100;
      const offscreenH = h + 40;
      const offscreen = document.createElement("canvas");
      offscreen.width = offscreenW;
      offscreen.height = offscreenH;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.clearRect(0, 0, offscreenW, offscreenH);

      // Dynamically fit font size within container width
      let currentFontSize = p.fontSize;
      offCtx.font = `italic 400 ${currentFontSize}px ${p.fontFamily}`;
      let metrics = offCtx.measureText(p.text);

      const maxTextWidth = w * 0.98;
      if (metrics.width > maxTextWidth && metrics.width > 0) {
        currentFontSize = Math.floor(p.fontSize * (maxTextWidth / metrics.width));
        offCtx.font = `italic 400 ${currentFontSize}px ${p.fontFamily}`;
        metrics = offCtx.measureText(p.text);
      }

      offCtx.fillStyle = "#ffffff";
      offCtx.textAlign = "left";
      offCtx.textBaseline = "middle";

      const startX = 0;
      const startY = Math.round(h / 2);
      offCtx.fillText(p.text, startX, startY);

      // Strict bounding box: sample strictly inside text boundary
      const textWidth = Math.ceil(metrics.width);
      const sampleMaxX = Math.min(w, startX + textWidth);
      const textData = offCtx.getImageData(0, 0, offscreenW, offscreenH);
      const newParticles: Particle[] = [];
      const density = Math.max(2, Math.round(p.particleDensity));

      for (let y = 6; y < h - 6; y += density) {
        const intY = Math.floor(y);
        for (let x = startX; x <= sampleMaxX; x += density) {
          const intX = Math.floor(x);
          const index = (intY * offscreenW + intX) * 4;
          const alpha = textData.data[index + 3];

          // High alpha threshold ensures clean, crisp letter contours without stray noise
          if (alpha > 135) {
            const isAccent = Math.random() < 0.1;
            const tone = isAccent ? accentTone : colorTones[Math.floor(Math.random() * colorTones.length)];

            newParticles.push({
              x: intX,
              y: intY,
              baseX: intX,
              baseY: intY,
              vx: 0,
              vy: 0,
              size: isAccent ? p.particleSize * 1.15 : p.particleSize,
              color: tone.color,
              glowColor: tone.glow,
              glowBlur: tone.blur,
              isAccent,
              pulsePhase: Math.random() * Math.PI * 2,
            });
          }
        }
      }

      particlesRef.current = newParticles;
    };

    if (document.fonts) {
      document.fonts.ready.then(() => {
        initParticles();
      });
    } else {
      initParticles();
    }

    const ro = new ResizeObserver(() => {
      initParticles();
    });
    ro.observe(container);

    const animate = () => {
      animTime += 0.03;
      const p = propsRef.current;
      ctx.clearRect(0, 0, w, h);

      if (p.backgroundColor !== "transparent") {
        ctx.fillStyle = p.backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const len = particles.length;

      for (let i = 0; i < len; i++) {
        const pt = particles[i];

        // Refined localized ripple interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = pt.x - mouse.x;
          const dy = pt.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 45; // Localized ripple so letters maintain integrity

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 3.5; // Gentle fluid displacement
            const angle = Math.atan2(dy, dx);
            pt.vx += Math.cos(angle) * force;
            pt.vy += Math.sin(angle) * force;
          }
        }

        // Snappy spring return
        const homeDx = pt.baseX - pt.x;
        const homeDy = pt.baseY - pt.y;
        pt.vx += homeDx * 0.12;
        pt.vy += homeDy * 0.12;

        // Friction damping for instant smooth settling
        pt.vx *= 0.78;
        pt.vy *= 0.78;

        pt.x += pt.vx;
        pt.y += pt.vy;

        // Subtle shimmer for accent particles
        let currentSize = pt.size;
        if (pt.isAccent) {
          currentSize += Math.sin(animTime + pt.pulsePhase) * 0.15;
        }

        // Render clean, antialiased particle
        ctx.save();
        ctx.shadowColor = pt.glowColor;
        ctx.shadowBlur = pt.glowBlur;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0.6, currentSize), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "block",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default TextParticle;
