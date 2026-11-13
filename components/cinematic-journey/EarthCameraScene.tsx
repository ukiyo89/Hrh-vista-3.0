"use client";

import { useMemo } from "react";
import styles from "./CinematicJourney.module.css";

// Exact coordinate references from the reference artwork (1367 x 768)
const EARTH_BASE = { width: 1367, height: 768 };
// Lavasa coordinates in the image: Western Maharashtra, Sahyadri range
const LAVASA_PIXEL = { x: 594, y: 510 };

interface EarthCameraSceneProps {
  progress: number; // 0 (deep space) to 1 (full Lavasa arrival)
  viewportSize: { width: number; height: number };
}

export function EarthCameraScene({ progress, viewportSize }: EarthCameraSceneProps) {
  const { width, height } = viewportSize;

  // Calculate layout & camera transform based on scroll progress
  const transform = useMemo(() => {
    if (width === 0 || height === 0) {
      return {
        earthStyle: { opacity: 0, transform: "translateY(120%) scale(0.8)" },
        markerStyle: { opacity: 0, left: "50%", top: "70%" },
        phase: "space",
        altitude: "420,000 KM",
        showHud: false,
      };
    }

    const isMobile = width < 768;

    // Base fit scale: how much to scale 1367x768 to comfortably span the viewport
    const baseFit = Math.max(width / EARTH_BASE.width, height / EARTH_BASE.height) * (isMobile ? 1.05 : 1.15);

    // Phase 1: Deep Space (0 to 0.06)
    // Earth is completely hidden below viewport
    if (progress <= 0.04) {
      return {
        earthStyle: {
          opacity: 0,
          transform: `translate3d(${(width - EARTH_BASE.width * baseFit) / 2}px, ${height + 150}px, 0) scale(${baseFit * 0.85})`,
        },
        markerStyle: { opacity: 0, left: "50%", top: "100%" },
        phase: "space",
        altitude: "DEEP SPACE",
        showHud: false,
      };
    }

    // Phase 2: Earth Horizon Enters (0.04 to 0.28)
    // Earth rises into view with the exact horizon framing of the reference photo:
    // Earth occupies the lower portion of the screen, vast space above
    if (progress <= 0.28) {
      const enterT = (progress - 0.04) / 0.24; // 0 to 1
      // Smooth cubic ease out
      const easeEnter = 1 - Math.pow(1 - enterT, 2.5);

      const startY = height + 100;
      // Target resting Y for the reference composition:
      // Horizon curves across the middle-lower screen (around 42% from top on desktop, 48% on mobile)
      const targetY = isMobile ? height * 0.22 : height * 0.16;
      const currentY = startY + (targetY - startY) * easeEnter;

      const currentX = (width - EARTH_BASE.width * baseFit) / 2;
      const opacity = Math.min(1, easeEnter * 1.5);

      const currentPinX = currentX + LAVASA_PIXEL.x * baseFit;
      const currentPinY = currentY + LAVASA_PIXEL.y * baseFit;

      return {
        earthStyle: {
          opacity,
          transform: `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) scale(${baseFit.toFixed(3)})`,
          transformOrigin: "0 0",
        },
        markerStyle: {
          opacity: 0,
          left: `${currentPinX.toFixed(1)}px`,
          top: `${currentPinY.toFixed(1)}px`,
        },
        phase: "earth-rise",
        altitude: "ORBIT · 420,000 M",
        showHud: enterT > 0.65,
      };
    }

    // Phase 3 & 4: Continuous Camera Dolly Zoom toward the Indian Subcontinent & Lavasa (0.28 to 0.78)
    // The camera continuously moves closer to the SAME Earth.
    // Horizon remains prominent at the top; curvature expands.
    const zoomProgress = Math.min(1, (progress - 0.28) / 0.46); // 0 to 1
    // Smooth cinematic camera acceleration and deceleration (power2 in-out)
    const zoomEase =
      zoomProgress < 0.5
        ? 2 * zoomProgress * zoomProgress
        : 1 - Math.pow(-2 * zoomProgress + 2, 2) / 2;

    // Zoom multiplier: from 1.0x at orbit to 3.85x desktop / 4.4x mobile
    const maxZoomMultiplier = isMobile ? 4.4 : 3.85;
    const currentZoom = baseFit * (1 + (maxZoomMultiplier - 1) * zoomEase);

    // Initial position (end of earth-rise)
    const initialX = (width - EARTH_BASE.width * baseFit) / 2;
    const initialY = isMobile ? height * 0.22 : height * 0.16;

    // Target position: centering Western Ghats / Pune / Lavasa near screen center-right
    const targetCenterX = width * (isMobile ? 0.5 : 0.48);
    const targetCenterY = height * (isMobile ? 0.44 : 0.46);

    const targetX = targetCenterX - LAVASA_PIXEL.x * currentZoom;
    const targetY = targetCenterY - LAVASA_PIXEL.y * currentZoom;

    // Blend from initial position to target locked position
    const currentX = initialX + (targetX - initialX) * zoomEase;
    const currentY = initialY + (targetY - initialY) * zoomEase;

    const currentPinX = currentX + LAVASA_PIXEL.x * currentZoom;
    const currentPinY = currentY + LAVASA_PIXEL.y * currentZoom;

    // Fade out slightly at the very end of descent as Lavasa ground photos take over
    const fadeOutT = Math.max(0, (progress - 0.74) / 0.18);
    const sceneOpacity = Math.max(0.12, 1 - fadeOutT * 0.88);

    // Calculated altitude readout
    const currentAltKm = Math.round(420 - zoomProgress * 419.36);
    const altitudeStr =
      currentAltKm > 10
        ? `APPROACH · ${currentAltKm.toLocaleString()} KM`
        : `DESCENT · 640 M`;

    return {
      earthStyle: {
        opacity: sceneOpacity,
        transform: `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) scale(${currentZoom.toFixed(3)})`,
        transformOrigin: "0 0",
      },
      markerStyle: {
        opacity: zoomProgress > 0.25 ? Math.min(1, (zoomProgress - 0.25) * 2.8) * sceneOpacity : 0,
        left: `${currentPinX.toFixed(1)}px`,
        top: `${currentPinY.toFixed(1)}px`,
      },
      phase: zoomProgress < 0.85 ? "approach" : "targeting",
      altitude: altitudeStr,
      showHud: progress < 0.82,
    };
  }, [progress, width, height]);

  return (
    <div className={styles.earthScene} aria-hidden="true">
      {/* Dynamic atmospheric rim glow - follows the horizon arc */}
      <div
        className={styles.atmosphericGlow}
        style={{
          opacity: progress > 0.05 ? Math.min(1, (progress - 0.05) * 3) : 0,
        }}
      />

      {/* The master Earth container with hardware-accelerated 3D transform */}
      <div
        className={styles.earthArtwork}
        style={transform.earthStyle}
        data-earth-artwork
      >
        {/*
          THE REFERENCE EARTH ARTWORK:
          High-definition satellite view at night: curved horizon, thin atmospheric blue rim,
          deep oceans, night-side India and South Asia with glowing golden city lights.
        */}
        <img
          src="/media/journey/earth-at-night.png"
          alt="Curved Earth horizon at night with illuminated Indian subcontinent"
          width={EARTH_BASE.width}
          height={EARTH_BASE.height}
          className={styles.earthImage}
          fetchPriority="high"
          decoding="async"
        />

        {/* Dynamic electric blue atmospheric scatter layer along the horizon edge */}
        <div className={styles.horizonScatterEdge} />

        {/* Vector Maharashtra region outline that glows during orbital approach */}
        <svg
          className={styles.regionSvg}
          viewBox={`0 0 ${EARTH_BASE.width} ${EARTH_BASE.height}`}
          preserveAspectRatio="none"
        >
          <path
            d="M518 451 540 441 558 446 575 438 594 450 616 447 632 459 653 465 672 481 665 497 670 510 656 524 651 542 635 550 630 568 615 574 601 560 584 556 574 537 557 527 550 510 536 499 532 482 520 470Z"
            className={styles.maharashtraPath}
            style={{
              opacity: progress > 0.32 ? Math.min(0.85, (progress - 0.32) * 2.5) : 0,
            }}
          />
        </svg>
      </div>

      {/* Futuristic, understated orbital targeting beacon over Lavasa */}
      <div className={styles.targetingBeacon} style={transform.markerStyle}>
        <div className={styles.beaconReticle}>
          <span className={styles.beaconRing} />
          <span className={styles.beaconRingOuter} />
          <span className={styles.beaconCrosshairH} />
          <span className={styles.beaconCrosshairV} />
          <span className={styles.beaconCore} />
        </div>
        <div className={styles.beaconTelemetry}>
          <div className={styles.beaconLabel}>
            <span className={styles.beaconPin}>LAVASA</span>
            <span className={styles.beaconCoords}>18.4065° N, 73.5042° E</span>
          </div>
          <span className={styles.beaconContext}>SAHYADRI · MAHARASHTRA</span>
        </div>
      </div>

      {/* Minimal flight telemetry HUD pinned to corners */}
      {transform.showHud && (
        <div className={styles.hudOverlay}>
          <div className={styles.hudTopLeft}>
            <span className={styles.hudLabel}>ORBITAL CAMERA</span>
            <span className={styles.hudValue}>OPTICAL ZOOM 3.8X</span>
          </div>
          <div className={styles.hudTopRight}>
            <span className={styles.hudLabel}>ALTITUDE</span>
            <span className={styles.hudValue}>{transform.altitude}</span>
          </div>
        </div>
      )}
    </div>
  );
}
