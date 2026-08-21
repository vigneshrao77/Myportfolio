import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LensflareBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let camera, scene, renderer;
    let timer;
    let isDisposed = false;
    
    // Interactive mouse tracking
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    let scrollY = 0;

    const onMouseMove = (event) => {
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const init = () => {
      const container = containerRef.current;
      if (!container) return;

      // camera
      camera = new THREE.PerspectiveCamera( 40, container.clientWidth / container.clientHeight, 1, 15000 );
      camera.position.z = 250;

      // scene
      scene = new THREE.Scene();
      const bgColor = 0x12141A;
      // Removed scene.background so canvas is transparent
      scene.fog = new THREE.FogExp2( bgColor, 0.00015 );

      // ----- LIGHTS -----
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      dirLight.position.set( 1, 1, 0 ).normalize();
      dirLight.color.setHSL( 0.1, 0.7, 0.5 );
      scene.add( dirLight );

      // Mouse interactive light
      const mouseLight = new THREE.PointLight(0xC9A15A, 0, 800);
      scene.add(mouseLight);

      // ----- MAIN CUBE LIGHT -----
      const mainLight = new THREE.PointLight( 0xffffff, 1.5, 3000, 0 );
      mainLight.color.setHSL( 0.08, 0.9, 0.5 );
      mainLight.position.set( 0, 0, -500 );
      scene.add( mainLight );

      // ----- CUBES (InstancedMesh) -----
      const cubeCount = 500;
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      
      const material = new THREE.MeshStandardMaterial({
        color: 0xC9A15A,
        metalness: 0.8,
        roughness: 0.2,
      });

      const instancedCubes = new THREE.InstancedMesh(geometry, material, cubeCount);
      
      const dummy = new THREE.Object3D();
      const cubeData = []; // Store velocities and rotation speeds

      for (let i = 0; i < cubeCount; i++) {
        // Distribute cubes in 3 layers roughly
        const layer = Math.random();
        let z, s;
        if (layer < 0.2) {
          // Foreground
          z = (Math.random() * 300) + 50;
          s = (Math.random() * 15) + 5;
        } else if (layer < 0.7) {
          // Midground
          z = (Math.random() * 2000) - 1000;
          s = (Math.random() * 40) + 15;
        } else {
          // Background
          z = (Math.random() * 4000) - 3000;
          s = (Math.random() * 80) + 40;
        }

        const x = (Math.random() * 2 - 1) * 4000;
        const y = (Math.random() * 2 - 1) * 4000;

        dummy.position.set(x, y, z);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        instancedCubes.setMatrixAt(i, dummy.matrix);

        cubeData.push({
          x, y, z, s,
          rx: dummy.rotation.x,
          ry: dummy.rotation.y,
          rz: dummy.rotation.z,
          vrx: (Math.random() - 0.5) * 0.02,
          vry: (Math.random() - 0.5) * 0.02,
          vy: (Math.random() * 0.5) + 0.1 // floating upwards
        });
      }
      scene.add(instancedCubes);

      // ----- DUST PARTICLES -----
      const dustCount = 1500;
      const dustGeom = new THREE.BufferGeometry();
      const dustPos = new Float32Array(dustCount * 3);
      for(let i=0; i < dustCount * 3; i++) {
        dustPos[i] = (Math.random() - 0.5) * 3000;
      }
      dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
      
      // Create a soft circle texture for dust
      const canvas = document.createElement('canvas');
      canvas.width = 16; canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
      const dustTexture = new THREE.CanvasTexture(canvas);

      const dustMaterial = new THREE.PointsMaterial({
        color: 0xC9A15A,
        size: 8,
        map: dustTexture,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const dustPoints = new THREE.Points(dustGeom, dustMaterial);
      scene.add(dustPoints);

      // renderer
      renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
      renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) ); // Cap pixel ratio for performance
      renderer.setSize( container.clientWidth, container.clientHeight );
      container.appendChild( renderer.domElement );

      timer = new THREE.Timer();
      timer.connect( document );

      renderer.setAnimationLoop( () => {
        if (!timer) return;
        timer.update();
        const delta = timer.getDelta();
        const elapsedTime = timer.getElapsed();
        
        // Smooth mouse interpolation
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        // Camera Parallax & Scroll Integration
        // Scroll pushes the camera down slightly
        const scrollOffset = scrollY * 0.05; 
        camera.position.x = mouse.x * 150 + Math.sin(elapsedTime * 0.1) * 100;
        camera.position.y = mouse.y * 150 - scrollOffset + Math.cos(elapsedTime * 0.1) * 100;
        camera.lookAt(0, -scrollOffset, -1000);

        // Update Mouse Light
        mouseLight.position.set(mouse.x * 500, mouse.y * 500, 100);
        mouseLight.intensity = 2.0;

        // Animate Main Lensflare Breathing
        mainLight.intensity = 1.5 + Math.sin(elapsedTime * 1.5) * 0.5;

        // Animate Cubes
        for (let i = 0; i < cubeCount; i++) {
          const data = cubeData[i];
          data.y += data.vy; // Float up
          if (data.y > 2000) data.y = -2000; // Reset
          
          data.rx += data.vrx;
          data.ry += data.vry;

          dummy.position.set(data.x, data.y, data.z);
          dummy.rotation.set(data.rx, data.ry, data.rz);
          dummy.scale.set(data.s, data.s, data.s);
          dummy.updateMatrix();
          instancedCubes.setMatrixAt(i, dummy.matrix);
        }
        instancedCubes.instanceMatrix.needsUpdate = true;

        // Animate Dust
        dustPoints.rotation.y = elapsedTime * 0.02;
        dustPoints.rotation.x = elapsedTime * 0.01;

        renderer.render( scene, camera );
      } );
    };

    const handleResize = () => {
      if ( camera && renderer && containerRef.current ) {
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( containerRef.current.clientWidth, containerRef.current.clientHeight );
      }
    };

    window.addEventListener( 'resize', handleResize );
    window.addEventListener( 'mousemove', onMouseMove );
    window.addEventListener( 'scroll', onScroll );
    init();

    return () => {
      isDisposed = true;
      window.removeEventListener( 'resize', handleResize );
      window.removeEventListener( 'mousemove', onMouseMove );
      window.removeEventListener( 'scroll', onScroll );
      if ( renderer ) {
        renderer.setAnimationLoop( null );
        renderer.dispose();
      }
      if ( timer ) {
        timer.dispose();
      }
      if ( containerRef.current ) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [] );

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
      }} 
    />
  );
};

export default LensflareBackground;
