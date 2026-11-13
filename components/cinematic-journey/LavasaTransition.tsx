"use client";

import styles from "./CinematicJourney.module.css";

interface LavasaTransitionProps {
  progress: number; // 0 to 1
}

export function LavasaTransition({ progress }: LavasaTransitionProps) {
  // Active when progress is transitioning between orbital descent and ground arrival (0.65 to 0.90)
  if (progress < 0.60) return null;

  // 0 at 0.65, 1 at 0.85
  const transitionProgress = Math.min(1, Math.max(0, (progress - 0.62) / 0.22));

  // Atmospheric cloud/mist veil
  const mistOpacity = Math.sin(transitionProgress * Math.PI) * 0.45;

  return (
    <div
      className={styles.lavasaTransitionLayer}
      style={{ opacity: transitionProgress }}
      aria-hidden="true"
    >
      {/* Mountain atmospheric haze / mist veil during descent */}
      <div
        className={styles.atmosphericMist}
        style={{ opacity: mistOpacity }}
      />

      {/* Touchdown telemetry line */}
      <div className={styles.touchdownTelemetry}>
        <div className={styles.telemetryBeam} />
        <div className={styles.touchdownBadge}>
          <span className={styles.touchdownDot} />
          <span>TOUCHDOWN · ELEVATION 640M · SAHYADRI RANGE</span>
        </div>
      </div>
    </div>
  );
}
