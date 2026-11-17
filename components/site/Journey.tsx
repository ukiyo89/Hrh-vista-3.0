"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Journey3DScene } from "./Journey3DScene";
import { computeJourneyUiState } from "@/lib/journey-camera";
import { ActionLink } from "./ActionLink";
import styles from "./Journey.module.css";

const PDF = "/brochure/HR-VISTA-3.0.pdf";

export const LAVASA_SCENIC_CARDS = [
  {
    id: "card-valley",
    title: "Sahyadri Valley & Hills",
    subtitle: "Elevation 640m · Western Ghats",
    caption:
      "A natural amphitheatre nestled among emerald hills where delegates step outside conference halls into mountain air.",
    src: "/media/Lavasa/pic2.jpg",
    arcRotation: -7.5,
    arcY: 16,
  },
  {
    id: "card-promenade",
    title: "Dasve Waterfront",
    subtitle: "Lakeside Promenade",
    caption:
      "Portofino-inspired architecture bordering the lake, setting the scene for evening networking and roundtables.",
    src: "/media/Lavasa/pic1.jpg",
    arcRotation: -2.5,
    arcY: 2,
  },
  {
    id: "card-lake",
    title: "Lake Warasgaon & Dam",
    subtitle: "Waters of the Sahyadri",
    caption:
      "Expansive turquoise waters and forested ridges framing the hill retreat of Lavasa.",
    src: "/media/flickr/story-4.jpg",
    arcRotation: 2.5,
    arcY: 2,
  },
  {
    id: "card-campus",
    title: "CHRIST University Campus",
    subtitle: "The Analytical Hub",
    caption:
      "The academic sanctuary where HR leaders, thinkers, and students gather to shape leadership paradigms.",
    src: "/media/Lavasa/pic3.jpg",
    arcRotation: 7.5,
    arcY: 16,
  },
] as const;

export function Journey() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isReduced, setIsReduced] = useState(false);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const pinOpacityRef = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mq.matches);
    const handler = () => setIsReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const totalDist = el.offsetHeight - window.innerHeight;

    if (totalDist <= 0) {
      targetProgress.current = 0;
      return;
    }

    const scrolled = -rect.top;
    targetProgress.current = Math.max(0, Math.min(1, scrolled / totalDist));
  }, []);

  useEffect(() => {
    if (isReduced) {
      const onScrollDirect = () => {
        handleScroll();
        setProgress(targetProgress.current);
      };
      window.addEventListener("scroll", onScrollDirect, { passive: true });
      onScrollDirect();
      return () => window.removeEventListener("scroll", onScrollDirect);
    }

    let running = true;
    const loop = () => {
      if (!running) return;

      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgress.current += diff * 0.14;
        setProgress(currentProgress.current);
      }

      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId.current = requestAnimationFrame(loop);
    handleScroll();

    return () => {
      running = false;
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, isReduced]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? 0 : (prev + 1) % LAVASA_SCENIC_CARDS.length
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? 0
            : (prev - 1 + LAVASA_SCENIC_CARDS.length) % LAVASA_SCENIC_CARDS.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  const uiState = useMemo(() => computeJourneyUiState(progress), [progress]);
  pinOpacityRef.current = uiState.pinOpacity;

  // Imperatively position the globe pinpoint without triggering 60Hz React re-renders
  const handlePinUpdate = useCallback((pos: { x: number; y: number; visible: boolean }) => {
    const el = pinRef.current;
    if (!el) return;
    if (!pos.visible || pos.x <= 0 || pos.y <= 0) {
      el.style.opacity = "0";
      return;
    }
    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    el.style.opacity = String(pinOpacityRef.current);
  }, []);

  return (
    <section
      ref={containerRef}
      id="lavasa"
      className={`${styles.journeySection} ${isReduced ? styles.journeyReduced : styles.journeyCinematic}`}
      aria-labelledby="lavasa-heading"
      data-journey-progress={progress.toFixed(3)}
    >
      <span id="journey" className="sr-only" />

      <div className={styles.viewport}>
        <Journey3DScene progress={progress} onPinPosition={handlePinUpdate} />

        <div className={styles.atmosphereScrim} aria-hidden="true" />

        {/* Clean Precision Map Pin Tracking 3D Coordinate on Earth */}
        <div
          ref={pinRef}
          className={styles.targetingBeacon}
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <span className={styles.beaconReticle}>
            <span className={styles.beaconRing} />
            <span className={styles.beaconCore} />
          </span>
          <span className={styles.beaconCallout}>
            <span className={styles.beaconLeader} />
            <span className={styles.beaconLabel}>
              <span className={styles.beaconCity}>Lavasa</span>
            </span>
          </span>
        </div>

        {/* Arrival Composition: Editorial Heading + 4 Fanned Scenic Cards */}
        <div
          className={styles.videoStage}
          style={{
            pointerEvents: uiState.cardsOpacity > 0.35 ? "auto" : "none",
          }}
        >
          <header
            className={styles.lavasaHeadingBox}
            style={{
              opacity: uiState.headingOpacity,
              transform: `translate3d(0, ${(1 - uiState.headingOpacity) * 18}px, 0)`,
            }}
          >
            <h2 id="lavasa-heading" className={styles.lavasaTitle}>
              Welcome to <em>Lavasa.</em>
            </h2>
          </header>

          <div
            className={styles.cardsArcContainer}
            style={{ opacity: uiState.cardsOpacity }}
          >
            {LAVASA_SCENIC_CARDS.map((card, index) => {
              const fanFactor = uiState.stageProgress;
              const rot = card.arcRotation * fanFactor;
              const yOffset = card.arcY * fanFactor + (1 - fanFactor) * 32;
              const centerDist = index - 1.5;
              const xOffset = centerDist * (1 - fanFactor) * -20;

              return (
                <button
                  key={card.id}
                  type="button"
                  className={styles.photoCardWrapper}
                  style={{
                    transform: `translate3d(${xOffset.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`,
                    zIndex: index === 1 || index === 2 ? 6 : 5,
                  }}
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`View photograph of ${card.title}`}
                >
                  <div className={styles.photoCard}>
                    <div className={styles.cardImageHolder}>
                      <img
                        src={card.src}
                        alt={card.title}
                        className={styles.cardImage}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.cardCaption}>
                      <h3 className={styles.cardTitle}>{card.title}</h3>
                      <p className={styles.cardSub}>{card.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Lightbox Modal */}
        {lightboxIndex !== null && (
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={LAVASA_SCENIC_CARDS[lightboxIndex].title}
            onClick={() => setLightboxIndex(null)}
          >
            <div className={styles.lightboxBox} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={styles.lightboxClose}
                onClick={() => setLightboxIndex(null)}
                aria-label="Close photo preview"
              >
                <X size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + LAVASA_SCENIC_CARDS.length) %
                      LAVASA_SCENIC_CARDS.length
                  )
                }
                aria-label="Previous Lavasa photograph"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % LAVASA_SCENIC_CARDS.length)
                }
                aria-label="Next Lavasa photograph"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
              <img
                src={LAVASA_SCENIC_CARDS[lightboxIndex].src}
                alt={LAVASA_SCENIC_CARDS[lightboxIndex].title}
                className={styles.lightboxImage}
              />
              <div className={styles.lightboxInfo}>
                <div className={styles.lightboxMetaRow}>
                  <span className={styles.lightboxMeta}>
                    {LAVASA_SCENIC_CARDS[lightboxIndex].subtitle}
                  </span>
                  <span className={styles.lightboxCounter}>
                    0{lightboxIndex + 1} / 0{LAVASA_SCENIC_CARDS.length}
                  </span>
                </div>
                <h4>{LAVASA_SCENIC_CARDS[lightboxIndex].title}</h4>
                <p className={styles.lightboxDesc}>
                  {LAVASA_SCENIC_CARDS[lightboxIndex].caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function JourneyFinale() {
  return (
    <section id="next" className={styles.finale} aria-labelledby="finale-title">
      <span id="next-chapter" className={styles.anchorAlias} aria-hidden="true" />
      <div className={styles.finaleOrbit} aria-hidden="true" />
      <h2 id="finale-title">
        When Machines Think.
        <br />
        <em>Human potential &amp; values lead.</em>
      </h2>
      <p>
        Exploring the evolution of human potential, professional values, and the future of work across
        two days of leadership keynotes, The 2030 Organisation Challenge, and the 30 Under 30 HR
        Leadership Excellence Awards in Lavasa—with Community Partner BeingHR.
      </p>
      <div className={styles.finaleActions}>
        <ActionLink href={PDF} download direction="down" variant="light">
          Download brochure
        </ActionLink>
        <a className={styles.textLink} href="/brochure" data-ui="text" data-ui-tone="dark">
          Read online <span data-ui-glyph aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
