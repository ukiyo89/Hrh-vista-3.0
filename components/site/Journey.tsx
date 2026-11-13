"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Compass, MapPin, X } from "lucide-react";
import { Journey3DScene } from "./Journey3DScene";
import { content } from "@/lib/data/content";
import { ActionLink } from "./ActionLink";
import styles from "./Journey.module.css";

const PDF = "/brochure/HR-VISTA-3.0.pdf";

export const LAVASA_SCENIC_CARDS = [
  {
    id: "card-valley",
    title: "Sahyadri Valley & Hills",
    subtitle: "Elevation 640m · Western Ghats",
    tag: "Valley Horizon",
    caption:
      "A breathtaking natural amphitheatre nestled among emerald hills where delegates step outside conference halls into pristine mountain air.",
    src: "/media/Lavasa/pic2.jpg",
    arcRotation: -9.5,
    arcY: 22,
  },
  {
    id: "card-promenade",
    title: "Dasve Waterfront",
    subtitle: "Italianate Lakeside Promenade",
    tag: "Waterfront Town",
    caption:
      "Vibrant Portofino-inspired architecture bordering the lake, providing a serene setting for evening networking and conclave roundtables.",
    src: "/media/Lavasa/pic1.jpg",
    arcRotation: -3.5,
    arcY: 4,
  },
  {
    id: "card-lake",
    title: "Lake Warasgaon & Dam",
    subtitle: "Natural Waters of the Sahyadri",
    tag: "Lake Panorama",
    caption:
      "The sweeping expanse of turquoise waters and lush forested ridges framing the hill retreat of Lavasa.",
    src: "/media/flickr/story-4.jpg",
    arcRotation: 3.5,
    arcY: 4,
  },
  {
    id: "card-campus",
    title: "CHRIST University Campus",
    subtitle: "The Hub of Future of Work",
    tag: "Academic Grounds",
    caption:
      "The state-of-the-art academic sanctuary where HR leaders, thinkers, and students gather to shape leadership paradigms.",
    src: "/media/Lavasa/pic3.jpg",
    arcRotation: 9.5,
    arcY: 22,
  },
] as const;

const JOURNEY_STAGES = [
  { id: "space", code: "01", label: "Deep Space", targetProgress: 0.0 },
  { id: "approach", code: "02", label: "India Orbit", targetProgress: 0.36 },
  { id: "horizon", code: "03", label: "Lavasa Horizon", targetProgress: 0.78 },
] as const;

export function Journey() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [pinPos, setPinPos] = useState({ x: 0, y: 0, visible: false });
  const [isReduced, setIsReduced] = useState(false);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
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
    const raw = Math.max(0, Math.min(1, scrolled / totalDist));
    targetProgress.current = raw;
  }, []);

  useEffect(() => {
    if (isReduced) {
      const onScrollDirect = () => {
        handleScroll();
        setProgress(targetProgress.current);
      };
      window.addEventListener("scroll", onScrollDirect, { passive: true });
      return () => window.removeEventListener("scroll", onScrollDirect);
    }

    let running = true;
    const loop = () => {
      if (!running) return;

      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * 0.12;
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

  // Lightbox keyboard navigation
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

  const scrollToStage = useCallback((targetP: number) => {
    const el = containerRef.current;
    if (!el) return;
    const totalDist = el.offsetHeight - window.innerHeight;
    if (totalDist <= 0) return;
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: sectionTop + totalDist * targetP,
      behavior: "smooth",
    });
  }, []);

  const uiState = useMemo(() => {
    const stageProgress = Math.min(1, Math.max(0, (progress - 0.36) / 0.34));
    const headingOpacity = Math.min(1, Math.max(0, (progress - 0.32) / 0.24));
    const cardsOpacity = Math.min(1, Math.max(0, (progress - 0.4) / 0.24));
    const pinOpacity = Math.min(1, Math.max(0, (progress - 0.35) / 0.22));
    const cueOpacity = Math.max(0, 1 - progress * 4.5);

    const activeStageIndex = progress < 0.26 ? 0 : progress < 0.58 ? 1 : 2;

    return {
      stageProgress,
      headingOpacity,
      cardsOpacity,
      pinOpacity,
      cueOpacity,
      activeStageIndex,
    };
  }, [progress]);

  const handlePinUpdate = useCallback((pos: { x: number; y: number; visible: boolean }) => {
    setPinPos(pos);
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
        {/* Layer 1: High-Detail 3D WebGL Earth & Starfield */}
        <Journey3DScene progress={progress} onPinPosition={handlePinUpdate} />

        {/* Subtle legibility gradient over top/bottom edges */}
        <div className={styles.atmosphereScrim} aria-hidden="true" />

        {/* Top-left minimal orbital coordinate kicker (fades out once main heading arrives) */}
        <div
          className={styles.orbitalKicker}
          style={{ opacity: Math.max(0, 1 - uiState.headingOpacity * 1.15) }}
          aria-hidden="true"
        >
          <Compass size={13} strokeWidth={1.7} />
          <span>DESCENT TO SAHYADRI · 18°24&apos;N 73°30&apos;E</span>
        </div>

        {/* Initial Scroll Cue */}
        {progress < 0.26 && (
          <div
            className={styles.scrollCueBox}
            style={{ opacity: uiState.cueOpacity }}
          >
            <button
              type="button"
              className={styles.scrollCueBtn}
              onClick={() => scrollToStage(0.75)}
              aria-label="Scroll down to zoom into Lavasa on Earth"
            >
              <span>Scroll to descend into Lavasa</span>
              <ArrowDown size={13} className={styles.cueArrow} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Layer 2: Location Pin Tracking 3D Coordinate on Earth */}
        {pinPos.visible && pinPos.x > 0 && pinPos.y > 0 && (
          <div
            className={styles.targetingBeacon}
            style={{
              left: `${pinPos.x}px`,
              top: `${pinPos.y}px`,
              opacity: uiState.pinOpacity,
            }}
          >
            <div className={styles.beaconReticle} aria-hidden="true">
              <span className={styles.beaconRing} />
              <span className={styles.beaconCore} />
            </div>
            <div className={styles.beaconTag}>
              <span className={styles.beaconLine} aria-hidden="true" />
              <div className={styles.beaconPill}>
                <span className={styles.beaconText}>
                  <MapPin size={10} strokeWidth={2} aria-hidden="true" /> LAVASA, MAHARASHTRA
                </span>
                <span className={styles.beaconSub}>18.406° N · 73.504° E</span>
              </div>
            </div>
          </div>
        )}

        {/* Layer 3: Arrival Composition (Headline + Fanned Lavasa Scenic Cards + Actions) */}
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
              transform: `translateY(${(1 - uiState.headingOpacity) * 18}px)`,
            }}
          >
            <p className={styles.lavasaKicker}>CHRIST UNIVERSITY · SAHYADRI HILLS</p>
            <h2 id="lavasa-heading" className={styles.lavasaTitle}>
              Welcome to <em>Lavasa.</em>
            </h2>
            <p className={styles.lavasaSubtitle}>
              A campus. A community. A conversation that kept growing.
            </p>
          </header>

          <div
            className={styles.cardsArcContainer}
            style={{ opacity: uiState.cardsOpacity }}
          >
            {LAVASA_SCENIC_CARDS.map((card, index) => {
              const fanFactor = uiState.stageProgress;
              const rot = card.arcRotation * fanFactor;
              const yOffset = card.arcY * fanFactor + (1 - fanFactor) * 44;
              const centerDist = index - 1.5;
              const xOffset = centerDist * (1 - fanFactor) * -24;

              return (
                <div
                  key={card.id}
                  className={styles.photoCardWrapper}
                  style={{
                    transform: `translateX(${xOffset.toFixed(1)}px) translateY(${yOffset.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`,
                    zIndex: index === 1 || index === 2 ? 6 : 5,
                  }}
                  onClick={() => setLightboxIndex(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLightboxIndex(index);
                    }
                  }}
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
                      <span className={styles.cardTag}>{card.tag}</span>
                      <h3 className={styles.cardTitle}>{card.title}</h3>
                      <p className={styles.cardSub}>{card.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={styles.stageActions}
            style={{
              opacity:
                uiState.cardsOpacity > 0.55
                  ? Math.min(1, (uiState.cardsOpacity - 0.55) * 2.2)
                  : 0,
            }}
          >
            <a href="#editions" className={styles.exploreButton} data-ui="button">
              Explore our editions <ArrowDown size={14} aria-hidden="true" />
            </a>
            <a href="/brochure" className={styles.brochureLink} data-ui="text" data-ui-tone="dark">
              Read conclave brochure <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Sleek Unified Bottom Chapter Dock (Zero Viewport Occlusion) */}
        <nav className={styles.chapterDock} aria-label="Orbital camera stages">
          <div className={styles.dockTrack} aria-hidden="true">
            <span
              className={styles.dockFill}
              style={{ transform: `scaleX(${Math.max(0.04, progress)})` }}
            />
          </div>
          <div className={styles.dockItems}>
            {JOURNEY_STAGES.map((stage, idx) => (
              <button
                key={stage.id}
                type="button"
                className={`${styles.dockStep} ${
                  uiState.activeStageIndex === idx ? styles.dockStepActive : ""
                }`}
                onClick={() => scrollToStage(stage.targetProgress)}
                aria-current={uiState.activeStageIndex === idx ? "step" : undefined}
              >
                <span className={styles.dockCode}>{stage.code}</span>
                <span className={styles.dockLabel}>{stage.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Layer 4: Photo Lightbox Modal */}
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
                  <span className={styles.lightboxTag}>
                    {LAVASA_SCENIC_CARDS[lightboxIndex].tag}
                  </span>
                  <span className={styles.lightboxCounter}>
                    0{lightboxIndex + 1} / 0{LAVASA_SCENIC_CARDS.length}
                  </span>
                </div>
                <h4>{LAVASA_SCENIC_CARDS[lightboxIndex].title}</h4>
                <p className={styles.lightboxSub}>
                  {LAVASA_SCENIC_CARDS[lightboxIndex].subtitle}
                </p>
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
        <em>Human potential leads.</em>
      </h2>
      <p>
        Two days of leadership keynotes, The 2030 Organisation Challenge, and the 30 Under 30 HR
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
      <div className={styles.finaleMeta}>
        <span>{content.hero.dates}</span>
        <span>CHRIST UNIVERSITY, LAVASA</span>
        <span>COMMUNITY PARTNER: BEINGHR</span>
      </div>
    </section>
  );
}
