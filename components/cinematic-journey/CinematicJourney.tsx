"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { StarField } from "./StarField";
import { EarthCameraScene } from "./EarthCameraScene";
import { LavasaTransition } from "./LavasaTransition";
import { LavasaGallery } from "./LavasaGallery";
import styles from "./CinematicJourney.module.css";

export function CinematicJourney() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Smooth lerp state for cinematic fluid inertia
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef<number>(0);

  // Check prefers-reduced-motion
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(media.matches);
    const updateMotion = () => setIsReducedMotion(media.matches);
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  // Viewport resize tracking
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Master scroll listener calculating normalized progress through the container
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const totalDist = el.offsetHeight - window.innerHeight;

    if (totalDist <= 0) {
      targetProgress.current = 0;
      return;
    }

    // Progress from 0 (top of section hits viewport top) to 1 (bottom hits viewport bottom)
    const scrolled = -rect.top;
    const rawProgress = Math.max(0, Math.min(1, scrolled / totalDist));
    targetProgress.current = rawProgress;
  }, []);

  // Animation loop with smooth exponential damp / lerp
  useEffect(() => {
    if (isReducedMotion) {
      const onScrollDirect = () => {
        handleScroll();
        setScrollProgress(targetProgress.current);
      };
      window.addEventListener("scroll", onScrollDirect, { passive: true });
      return () => window.removeEventListener("scroll", onScrollDirect);
    }

    let running = true;
    const loop = () => {
      if (!running) return;

      // Silky smooth interpolation (dolly camera inertia)
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * 0.09;
        setScrollProgress(currentProgress.current);
      }

      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId.current = requestAnimationFrame(loop);

    // Initial measure
    handleScroll();

    return () => {
      running = false;
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, isReducedMotion]);

  // Keyboard navigation support for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const el = containerRef.current;
    if (!el) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      window.scrollBy({ top: window.innerHeight * 0.45, behavior: "smooth" });
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      window.scrollBy({ top: -window.innerHeight * 0.45, behavior: "smooth" });
    }
  };

  // Deep space title opacity: visible at scroll 0, fades as Earth rises
  const spaceOverlayOpacity = Math.max(0, 1 - scrollProgress * 5.5);

  return (
    <section
      ref={containerRef}
      id="lavasa"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`${styles.container} ${isReducedMotion ? styles.containerReduced : styles.containerCinematic}`}
      aria-label="Cinematic journey from deep space to Earth and Lavasa"
      data-journey-progress={scrollProgress.toFixed(3)}
    >
      <span id="journey" className="sr-only" />

      {/* Pinned Sticky Viewport */}
      <div className={styles.stickyViewport}>
        {/* Layer 1: Procedural 3D Deep Space Star Field */}
        <StarField
          scrollProgress={scrollProgress}
          cameraZoom={1 + scrollProgress * 1.8}
        />

        {/* Layer 2: Initial Minimal Deep Space Viewport Content */}
        <div
          className={styles.spaceOverlay}
          style={{
            opacity: spaceOverlayOpacity,
            pointerEvents: scrollProgress < 0.06 ? "auto" : "none",
          }}
        >
          <p className={styles.spaceEyebrow}>
            CHRIST UNIVERSITY <span>·</span> FLAGSHIP HR CONCLAVE
          </p>
          <h1 className={styles.spaceTitle}>
            The Future of Work.
            <br />
            <em>The People Who Shape It.</em>
          </h1>
          <p className={styles.spaceSubtitle}>
            HR VISTA 3.0 · 21–22 November 2026. A cinematic convergence of leadership, vision, and human potential.
          </p>
          <div className={styles.spaceScrollCue} aria-hidden="true">
            <span>↓</span> SCROLL TO INITIATE DESCENT
          </div>
        </div>

        {/* Layer 3: The Reference Image Earth & Continuous Camera Dolly Zoom */}
        <EarthCameraScene
          progress={scrollProgress}
          viewportSize={viewportSize}
        />

        {/* Layer 4: Atmospheric Descent & Touchdown Telemetry */}
        <LavasaTransition progress={scrollProgress} />

        {/* Layer 5: Lavasa Ground Photographs & Welcome Destination */}
        <LavasaGallery progress={scrollProgress} />
      </div>
    </section>
  );
}
