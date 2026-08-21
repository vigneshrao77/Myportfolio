"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface WireframeDottedGlobeProps {
  size?: number;
  primaryColor?: string;
  glowColor?: string;
  dotColor?: string;
  arcColor?: string;
  autoRotateSpeed?: number;
  interactive?: boolean;
  className?: string;
}

export function WireframeDottedGlobe({
  size = 400,
  primaryColor = "#C9A15A",
  glowColor = "#FFD700",
  dotColor = "#FFE58F",
  arcColor = "#FFD700",
  autoRotateSpeed = 0.0025,
  interactive = true,
  className = "",
}: WireframeDottedGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 28;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 3. Globe Master Group
    const globeGroup = new THREE.Group();
    globeGroup.rotation.x = 0.22;
    globeGroup.rotation.z = -0.12;
    scene.add(globeGroup);

    const radius = 9.8;

    // 4. Dark Obsidian Inner Core Sphere (occludes back-facing lines for clean 3D depth)
    const coreGeo = new THREE.SphereGeometry(radius * 0.985, 36, 36);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x101218,
      transparent: true,
      opacity: 0.94,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 5. Wireframe Latitude Circles (Parallel rings)
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(primaryColor),
      transparent: true,
      opacity: 0.32,
      linewidth: 1,
    });

    const latitudeSteps = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
    latitudeSteps.forEach((lat) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const ringRadius = radius * Math.sin(phi);
      const ringY = radius * Math.cos(phi);

      const segments = 64;
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(ringRadius * Math.cos(theta), ringY, ringRadius * Math.sin(theta)));
      }

      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ring = new THREE.LineLoop(ringGeo, lineMat);
      globeGroup.add(ring);
    });

    // 6. Wireframe Longitude Circles (Meridian rings pole-to-pole)
    const meridianCount = 18;
    for (let i = 0; i < meridianCount; i++) {
      const theta = (i / meridianCount) * Math.PI;
      const segments = 64;
      const points: THREE.Vector3[] = [];

      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI * 2;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
      }

      const meridianGeo = new THREE.BufferGeometry().setFromPoints(points);
      const meridian = new THREE.LineLoop(meridianGeo, lineMat);
      globeGroup.add(meridian);
    }

    // 7. Fibonacci Dotted Surface Matrix
    const dotCount = 1800;
    const dotPositions = new Float32Array(dotCount * 3);
    const dotSizes = new Float32Array(dotCount);

    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = 2 * Math.PI * i / goldenRatio;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      dotPositions[i * 3] = x * radius * 1.006;
      dotPositions[i * 3 + 1] = y * radius * 1.006;
      dotPositions[i * 3 + 2] = z * radius * 1.006;

      dotSizes[i] = Math.random() < 0.15 ? 0.22 : 0.14;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));

    const dotMat = new THREE.PointsMaterial({
      color: new THREE.Color(dotColor),
      size: 0.16,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const dotsMesh = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotsMesh);

    // 8. Interactive City Beacons & Orbit Arcs
    const cities = [
      { name: "India", lat: 17.385, lon: 78.4866 },
      { name: "SF", lat: 37.7749, lon: -122.4194 },
      { name: "London", lat: 51.5074, lon: -0.1278 },
      { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
      { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    ];

    const latLonToVec3 = (lat: number, lon: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    const beaconGroup = new THREE.Group();
    globeGroup.add(beaconGroup);

    cities.forEach((city) => {
      const pos = latLonToVec3(city.lat, city.lon, radius * 1.01);
      const markerGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      beaconGroup.add(marker);

      const glowRingGeo = new THREE.RingGeometry(0.2, 0.45, 24);
      const glowRingMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(glowColor),
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
      glowRing.position.copy(pos);
      glowRing.lookAt(new THREE.Vector3(0, 0, 0));
      beaconGroup.add(glowRing);
    });

    // 10. Connecting Golden Arcs
    const createArc = (cityA: typeof cities[0], cityB: typeof cities[0]) => {
      const vA = latLonToVec3(cityA.lat, cityA.lon, radius * 1.01);
      const vB = latLonToVec3(cityB.lat, cityB.lon, radius * 1.01);
      const mid = vA.clone().add(vB).multiplyScalar(0.5);
      const midLen = mid.length();
      mid.normalize().multiplyScalar(midLen + radius * 0.38);

      const curve = new THREE.QuadraticBezierCurve3(vA, mid, vB);
      const arcPoints = curve.getPoints(48);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const arcMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(arcColor),
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Line(arcGeo, arcMaterial);
    };

    globeGroup.add(createArc(cities[0], cities[1]));
    globeGroup.add(createArc(cities[0], cities[2]));
    globeGroup.add(createArc(cities[0], cities[3]));
    globeGroup.add(createArc(cities[2], cities[1]));

    // 11. Mouse Drag & Interaction Physics
    let animId: number;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      isDraggingRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseRef.current = { x: clientX, y: clientY };
      velocityRef.current = { x: 0, y: 0 };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevMouseRef.current.x;
      const deltaY = clientY - prevMouseRef.current.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      velocityRef.current = {
        x: deltaX * 0.005,
        y: deltaY * 0.005,
      };

      prevMouseRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    dom.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // 12. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.02;

      if (!isDraggingRef.current) {
        // Inertia momentum
        globeGroup.rotation.y += velocityRef.current.x;
        globeGroup.rotation.x += velocityRef.current.y;
        velocityRef.current.x *= 0.94;
        velocityRef.current.y *= 0.94;

        // Base auto-rotation
        globeGroup.rotation.y += autoRotateSpeed;
      }

      // Beacon gentle pulsing
      beaconGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
          const scale = 1 + Math.sin(time * 3 + index) * 0.25;
          child.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      dom.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("resize", handleResize);

      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [primaryColor, glowColor, dotColor, arcColor, autoRotateSpeed, interactive, size]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "350px",
        cursor: "grab",
      }}
    />
  );
}

export default WireframeDottedGlobe;
