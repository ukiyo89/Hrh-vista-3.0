"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { VISTA_CARD_COPY, HR_VISTA_2_COMPANIES } from "@/lib/data/brands";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { VistaCardTubeScene } from "./VistaCardTubeScene";
import styles from "./VistaCardShowcase.module.css";

export function VistaCardShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const warpRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const root = warpRef.current;
    const canvas = canvasRef.current;
    if (!section || !header || !root || !canvas) return;

    const scene = new VistaCardTubeScene({
      canvas,
      root,
      section,
      header,
      reducedMotion: reduced,
    });

    const onEntered = () => {
      scene.rebuildScrollTimeline();
    };
    window.addEventListener("hr-vista:entered", onEntered);

    return () => {
      window.removeEventListener("hr-vista:entered", onEntered);
      scene.dispose();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="hr-vista-card"
      className={`card ${styles.card}`}
      aria-labelledby="vista-card-heading"
    >
      <div className={`sticky card_sticky ${styles.cardSticky}`}>
        <div className={styles.cardContent}>
          <div ref={headerRef} className={`card_header ${styles.cardHeader}`}>
            <div className={styles.cardH2Wrap}>
              <h2 id="vista-card-heading" className={styles.cardHeading}>
                {VISTA_CARD_COPY.headingLine1}
                <br />
                {VISTA_CARD_COPY.headingLine2}
              </h2>
            </div>
            <Link href={VISTA_CARD_COPY.ctaHref} className={styles.button}>
              <span>{VISTA_CARD_COPY.ctaLabel}</span>
            </Link>
          </div>
        </div>

        <div id="card_canvas_warp" ref={warpRef} className={styles.cardCanvasWarp}>
          <canvas
            id="card_canvas"
            ref={canvasRef}
            className={styles.cardCanvas}
            role="img"
            aria-label={`3D metallic HR VISTA 3.0 pass surrounded by ${HR_VISTA_2_COMPANIES.length} visiting organisations from HR VISTA 2.0`}
          />
        </div>
      </div>
    </section>
  );
}
