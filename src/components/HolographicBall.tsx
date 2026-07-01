"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScroll } from "framer-motion";

interface HolographicBallProps {
  className?: string;
  themeColor?: string; // Hex color for the wireframe (e.g. luxury blue `#12224A`)
  isLightMode?: boolean;
}

export default function HolographicBall({
  className = "",
  themeColor = "#12224A",
  isLightMode = true,
}: HolographicBallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use framer-motion's scroll hooks for high-performance scroll mapping
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // --- SETUP SCENE, CAMERA, RENDERER ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    // Set fog using premium cream color in light mode, and dark slate in dark mode
    const fogColor = isLightMode ? 0xFDFBF7 : 0x0A0E17;
    scene.fog = new THREE.FogExp2(fogColor, 0.14);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- CREATE GEOMETRY (Truncated Icosahedron Wireframe) ---
    const radius = window.innerWidth < 768 ? 1.4 : 1.9;
    const geometry = new THREE.IcosahedronGeometry(radius, 1);
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    
    // Set edge wireframe material
    const colorVal = new THREE.Color(themeColor);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: colorVal,
      transparent: true,
      opacity: isLightMode ? 0.18 : 0.35,
      blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    
    const wireframe = new THREE.LineSegments(edgesGeometry, lineMaterial);
    
    // Inner mesh sphere for atmospheric depth
    const innerGeometry = new THREE.SphereGeometry(radius * 0.9, 14, 14);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: colorVal,
      wireframe: true,
      transparent: true,
      opacity: isLightMode ? 0.04 : 0.07,
      blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    
    // Vertex particles with soft glow texture
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        if (isLightMode) {
          gradient.addColorStop(0, colorVal.getStyle());
          gradient.addColorStop(0.5, colorVal.getStyle());
          gradient.addColorStop(1, "rgba(253, 251, 247, 0)"); // Fades into cream
        } else {
          gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
          gradient.addColorStop(0.3, colorVal.getStyle());
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const pointsMaterial = new THREE.PointsMaterial({
      color: isLightMode ? colorVal : 0xffffff,
      size: isLightMode ? 0.15 : 0.19,
      map: createParticleTexture(),
      transparent: true,
      blending: isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const particles = new THREE.Points(geometry, pointsMaterial);

    // Enclosing ball group
    const ballGroup = new THREE.Group();
    ballGroup.add(wireframe);
    ballGroup.add(innerSphere);
    ballGroup.add(particles);
    scene.add(ballGroup);

    // Directional lighting for subtle structural specular highlights
    const dirLight1 = new THREE.DirectionalLight(0xffffff, isLightMode ? 1.2 : 1.8);
    dirLight1.position.set(2, 4, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(colorVal, isLightMode ? 1.5 : 2.2);
    dirLight2.position.set(-2, -4, -6);
    scene.add(dirLight2);

    // --- PHYSICS & INTERPOLATION STATES ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let currentScroll = 0;
    let targetScroll = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Scroll progress subscription from Framer Motion
    const unsubscribeScroll = scrollYProgress.on("change", (latest) => {
      targetScroll = latest;
    });

    // --- ANIMATION LOOP (SPRING KINEMATICS & ELASTIC DEFORMATION) ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse positions for physical lag
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Lerp scroll progress for inertia
      currentScroll += (targetScroll - currentScroll) * 0.08;

      // Calculate scroll speed (rate of change) for elastic stretch
      const scrollSpeed = Math.abs(targetScroll - currentScroll);

      // Perpetual base rotation
      ballGroup.rotation.x = elapsedTime * 0.12;
      ballGroup.rotation.z = elapsedTime * 0.08;

      // Map scroll progress to heavy kinetic spin
      ballGroup.rotation.y = elapsedTime * 0.15 + currentScroll * Math.PI * 3.5;

      // Add mouse coordinate drift (dynamic orientation tilt)
      ballGroup.rotation.y += mouse.x * 0.35;
      ballGroup.rotation.x += mouse.y * 0.35;

      // Spatial positioning mapped to AIDA layout progress
      const isMobile = window.innerWidth < 768;
      let baseScale = 1.0;

      if (isMobile) {
        ballGroup.position.x = 0;
        ballGroup.position.y = -1.2 + currentScroll * 1.5;
        
        // Haptic coordinate drift from mouse coordinates (subtle float)
        ballGroup.position.x += mouse.x * 0.15;
        ballGroup.position.y += mouse.y * 0.15;

        baseScale = 0.85 + Math.sin(currentScroll * Math.PI) * 0.25;
      } else {
        // Desktop positioning sequences
        let targetX = 1.6;
        let targetY = 0.2;
        let targetS = 1.0;

        if (currentScroll < 0.3) {
          const p = currentScroll / 0.3;
          targetX = THREE.MathUtils.lerp(1.6, -1.8, p);
          targetY = THREE.MathUtils.lerp(0.2, -0.4, p);
          targetS = 1.0;
        } else if (currentScroll < 0.65) {
          const p = (currentScroll - 0.3) / 0.35;
          targetX = THREE.MathUtils.lerp(-1.8, 1.5, p);
          targetY = THREE.MathUtils.lerp(-0.4, 0.4, p);
          targetS = THREE.MathUtils.lerp(1.0, 1.45, p);
        } else {
          const p = (currentScroll - 0.65) / 0.35;
          targetX = THREE.MathUtils.lerp(1.5, -1.6, p);
          targetY = THREE.MathUtils.lerp(0.4, -0.5, p);
          targetS = THREE.MathUtils.lerp(1.45, 0.75, p);
        }

        // Apply mouse pointer drift coordinate offsets to position
        ballGroup.position.x = targetX + mouse.x * 0.3;
        ballGroup.position.y = targetY + mouse.y * 0.3;

        // Wave animation on Y axis
        ballGroup.position.y += Math.sin(elapsedTime * 1.5) * 0.1;
        baseScale = targetS;
      }

      // --- MOTION DESIGN PRINCIPLES: ELASTIC STRETCH & DEFORMATION ---
      // The faster the scroll speed, the more the ball stretches along Y and squashes on X/Z
      const stretchY = 1.0 + scrollSpeed * 0.65;
      const squashXZ = 1.0 - scrollSpeed * 0.32;
      
      ballGroup.scale.set(
        baseScale * squashXZ,
        baseScale * stretchY,
        baseScale * squashXZ
      );

      // Subtle breathing ripple on inner sphere
      const breathe = 1.0 + Math.sin(elapsedTime * 2.0) * 0.03;
      innerSphere.scale.setScalar(breathe);

      renderer.render(scene, camera);
    };

    animate();

    // --- HANDLE WINDOW RESIZE ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      unsubscribeScroll();
      
      geometry.dispose();
      edgesGeometry.dispose();
      innerGeometry.dispose();
      lineMaterial.dispose();
      innerMaterial.dispose();
      pointsMaterial.dispose();
      renderer.dispose();
    };
  }, [themeColor, scrollYProgress, isLightMode]);

  return (
    <div ref={containerRef} className={`w-full h-full relative select-none ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}
