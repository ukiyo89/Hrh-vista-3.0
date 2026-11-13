"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  hue: "pure-white" | "cool-blue" | "warm-amber";
}

interface StarFieldProps {
  scrollProgress: number; // 0 to 1
  cameraZoom?: number;   // 1 to 4
  speed?: number;
}

export function StarField({ scrollProgress, cameraZoom = 1 }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const frameRef = useRef<number>(0);
  const scrollRef = useRef(scrollProgress);
  const zoomRef = useRef(cameraZoom);

  // Keep ref up to date without rebuilding animation loop
  scrollRef.current = scrollProgress;
  zoomRef.current = cameraZoom;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Track pointer subtly for realistic parallax
    const handlePointerMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      pointerRef.current.targetX = (e.clientX - halfW) / halfW;
      pointerRef.current.targetY = (e.clientY - halfH) / halfH;
    };
    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    let width = 0;
    let height = 0;

    const initStars = (count: number) => {
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        // Distribute in a spherical cylinder field
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.6) * 1.5;
        const z = 200 + Math.random() * 2000; // depth

        // Colors: mostly pure white, some ice-blue (hot stars), tiny fraction warm
        const randHue = Math.random();
        const hue: Star["hue"] =
          randHue > 0.82 ? "cool-blue" : randHue < 0.08 ? "warm-amber" : "pure-white";

        // Extremely small, realistic subpixel to small dot sizes (0.5px to 1.6px)
        const size = Math.random() < 0.85 ? 0.6 + Math.random() * 0.7 : 1.3 + Math.random() * 0.5;

        stars.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius * 0.65, // slightly wider than tall
          z,
          size,
          baseAlpha: 0.25 + Math.random() * 0.65,
          twinkleSpeed: 0.8 + Math.random() * 2.2,
          twinkleOffset: Math.random() * Math.PI * 2,
          hue,
        });
      }
      starsRef.current = stars;
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      // Star count based on screen area (around 2200 for desktop, 1200 for mobile)
      const count = Math.min(2600, Math.max(1000, Math.floor((width * height) / 600)));
      if (starsRef.current.length === 0) {
        initStars(count);
      }
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth pointer lerp
      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.04;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.04;

      const pX = pointerRef.current.x * 24;
      const pY = pointerRef.current.y * 18;

      ctx.clearRect(0, 0, width, height);

      const halfW = width / 2;
      const halfH = height / 2;
      const fov = Math.max(width, height) * 0.85;

      const progress = scrollRef.current;
      const zoom = zoomRef.current;

      // As user scrolls, camera dollies forward in space
      // Stars drift outward with subtle perspective expansion
      const forwardDolly = progress * 320;
      const verticalPan = progress * 160;

      const stars = starsRef.current;
      const total = stars.length;

      for (let i = 0; i < total; i++) {
        const star = stars[i];

        // Effective Z after forward camera travel
        let effZ = star.z - forwardDolly;
        if (effZ < 50) {
          // Wrap around to the back so stars remain endless
          effZ += 2000;
        }

        // Project 3D -> 2D
        const k = fov / effZ;
        const screenX = halfW + (star.x * width * 0.85 + pX * (1 - effZ / 2200)) * k;
        const screenY = halfH + (star.y * height * 0.85 + pY * (1 - effZ / 2200) - verticalPan * 0.4) * k;

        // Skip off-screen
        if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
          continue;
        }

        // Depth-based size scaling
        const depthScale = Math.min(2.0, Math.max(0.4, (2000 - effZ) / 1200));
        const renderedSize = star.size * depthScale * Math.min(1.2, zoom * 0.8 + 0.2);

        // Subtle organic twinkle
        const twinkle = Math.sin(now * 0.001 * star.twinkleSpeed + star.twinkleOffset) * 0.22;
        const alpha = Math.max(0.08, Math.min(1.0, star.baseAlpha + twinkle));

        // Color styling
        if (star.hue === "cool-blue") {
          ctx.fillStyle = `rgba(180, 215, 255, ${alpha * 0.95})`;
        } else if (star.hue === "warm-amber") {
          ctx.fillStyle = `rgba(255, 225, 185, ${alpha * 0.85})`;
        } else {
          ctx.fillStyle = `rgba(240, 246, 255, ${alpha})`;
        }

        // Draw crisp round star
        ctx.beginPath();
        ctx.arc(screenX, screenY, renderedSize, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handlePointerMove);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
