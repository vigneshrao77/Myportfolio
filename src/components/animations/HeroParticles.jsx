import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

export default function HeroParticles() {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || shouldReduceMotion) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear out any previous children just in case (React StrictMode)
    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Floating Particles with Depth
    const particlesCount = 400;
    const positions = new Float32Array(particlesCount * 3);
    const originalPositions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    
    for(let i = 0; i < particlesCount; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 8;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
      
      sizes[i] = Math.random() * 0.05 + 0.01;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // The user requested gold (#C9A15A or #ffb800 from original code)
    // Using #C9A15A to match the current accent primary color
    const material = new THREE.PointsMaterial({
      color: 0xC9A15A, 
      size: 0.04,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Spring physics variables
    let currentX = 0;
    let currentY = 0;
    const stiffness = 0.05;
    const damping = 0.9;

    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      
      // Smooth magnetic easing (spring-like)
      currentX += (targetX - currentX) * stiffness;
      currentY += (targetY - currentY) * stiffness;

      const posAttr = geometry.attributes.position;
      const time = Date.now() * 0.0003;

      for(let i = 0; i < particlesCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        // Parallax & ambient drift
        const driftX = Math.sin(time + originalPositions[ix] * 0.5) * 0.2;
        const driftY = Math.cos(time + originalPositions[iy] * 0.5) * 0.2;

        // Magnetic Cursor Influence
        const dx = currentX * 2 - originalPositions[ix];
        const dy = -currentY * 2 - originalPositions[iy];
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, (3.0 - dist) / 3.0);

        posAttr.array[ix] = originalPositions[ix] + driftX + (dx * force * 0.3);
        posAttr.array[iy] = originalPositions[iy] + driftY + (dy * force * 0.3);
        
        // Depth parallax based on Z
        posAttr.array[ix] += currentX * (originalPositions[iz] * 0.1);
        posAttr.array[iy] -= currentY * (originalPositions[iz] * 0.1);
      }
      
      posAttr.needsUpdate = true;
      points.rotation.y += 0.0005;

      renderer.render(scene, camera);
    }

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'absolute', 
        inset: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        zIndex: 0,
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
      }} 
    />
  );
}
