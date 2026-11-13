"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import styles from "./VistaCardShowcase.module.css";

type LogoTreatment = "platinum" | "silverBoost" | "screenWhite" | "native";
type LogoShape = "wide" | "square";

interface CompanyLogo {
  id: string;
  name: string;
  logoSrc: string;
  treatment: LogoTreatment;
  shape: LogoShape;
  sector: string;
  speakerRole: string;
}

// Verified organisations & visiting leaders from HR VISTA 2.0 (hrvista.live & voices archive)
const HR_VISTA_2_COMPANIES: CompanyLogo[] = [
  {
    id: "dentsu",
    name: "dentsu",
    logoSrc: "/media/logos/dentsu.svg",
    treatment: "silverBoost",
    shape: "wide",
    sector: "Global Media & Creative",
    speakerRole: "Chief Guest · CPO South Asia",
  },
  {
    id: "reliance",
    name: "Reliance Industries",
    logoSrc: "/media/logos/reliance.png",
    treatment: "platinum",
    shape: "wide",
    sector: "Enterprise Conglomerate",
    speakerRole: "Head HR · Panelist",
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    logoSrc: "/media/logos/kotak.svg",
    treatment: "native",
    shape: "wide",
    sector: "Banking & Finance",
    speakerRole: "SVP & Head Training",
  },
  {
    id: "ltimindtree",
    name: "LTIMindtree",
    logoSrc: "/media/logos/ltimindtree.svg",
    treatment: "platinum",
    shape: "wide",
    sector: "Technology Consulting",
    speakerRole: "Global HR-TA Moderator",
  },
  {
    id: "persistent",
    name: "Persistent Systems",
    logoSrc: "/media/logos/persistent.svg",
    treatment: "platinum",
    shape: "wide",
    sector: "Digital Engineering",
    speakerRole: "SVP Human Resources",
  },
  {
    id: "jio",
    name: "Reliance Jio",
    logoSrc: "/media/logos/jio.svg",
    treatment: "native",
    shape: "square",
    sector: "Digital & Telecom",
    speakerRole: "General Manager · Panelist",
  },
  {
    id: "timespro",
    name: "TimesPro",
    logoSrc: "/media/logos/timespro.png",
    treatment: "platinum",
    shape: "square",
    sector: "Higher Ed & Leadership",
    speakerRole: "EVP & Chief People Officer",
  },
  {
    id: "sutherland",
    name: "Sutherland",
    logoSrc: "/media/logos/sutherland.png",
    treatment: "native",
    shape: "wide",
    sector: "Digital Transformation",
    speakerRole: "Global Head · Learning",
  },
  {
    id: "honeywell",
    name: "Honeywell Automation",
    logoSrc: "/media/logos/honeywell.svg",
    treatment: "platinum",
    shape: "wide",
    sector: "Industrial Automation",
    speakerRole: "Executive Chairman",
  },
  {
    id: "alliancebernstein",
    name: "AllianceBernstein",
    logoSrc: "/media/logos/alliancebernstein.png",
    treatment: "screenWhite",
    shape: "square",
    sector: "Asset Management",
    speakerRole: "VP & Head of People",
  },
  {
    id: "arvind",
    name: "Arvind Limited",
    logoSrc: "/media/logos/arvind.svg",
    treatment: "platinum",
    shape: "square",
    sector: "Textiles & Apparel",
    speakerRole: "CHRO · Fireside Chat",
  },
  {
    id: "omya",
    name: "Omya",
    logoSrc: "/media/logos/omya.svg",
    treatment: "platinum",
    shape: "square",
    sector: "Specialty Minerals",
    speakerRole: "Head HR · South Asia",
  },
  {
    id: "indiafactoring",
    name: "India Factoring",
    logoSrc: "/media/logos/indiafactoring.png",
    treatment: "platinum",
    shape: "square",
    sector: "Financial Solutions",
    speakerRole: "SVP & Head of HR",
  },
  {
    id: "beinghr",
    name: "BeingHR",
    logoSrc: "/media/raw/logo_beinghr.png",
    treatment: "native",
    shape: "wide",
    sector: "Community Partner",
    speakerRole: "60,000+ HR Community",
  },
  {
    id: "deloitte",
    name: "Deloitte",
    logoSrc: "/media/logos/deloitte.svg",
    treatment: "platinum",
    shape: "wide",
    sector: "Advisory & Consulting",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
  {
    id: "infosys",
    name: "Infosys",
    logoSrc: "/media/logos/infosys.svg",
    treatment: "native",
    shape: "wide",
    sector: "Global IT Services",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
  {
    id: "accenture",
    name: "Accenture",
    logoSrc: "/media/logos/accenture.svg",
    treatment: "platinum",
    shape: "wide",
    sector: "Technology & Strategy",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
  {
    id: "ey",
    name: "EY",
    logoSrc: "/media/logos/ey.svg",
    treatment: "platinum",
    shape: "square",
    sector: "Assurance & Advisory",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    logoSrc: "/media/logos/hdfc.svg",
    treatment: "native",
    shape: "wide",
    sector: "Banking & Financial Services",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
];

const ROW_CONFIGS = [
  { id: "top", yOffset: -206, speed: 0.042, offset: 0, baseOpacity: 0.78 },
  { id: "mid", yOffset: -6, speed: -0.052, offset: 6, baseOpacity: 0.88 },
  { id: "bot", yOffset: 196, speed: 0.036, offset: 12, baseOpacity: 0.42 },
] as const;

const SLOTS_PER_ROW = 9;

export function VistaCardShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [hoveredCompany, setHoveredCompany] = useState<CompanyLogo | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const cardFlippedRef = useRef(false);
  cardFlippedRef.current = cardFlipped;
  const reduced = useReducedMotionPreference();

  const pointerRef = useRef({ x: 0, y: 0, smoothX: 0, smoothY: 0, active: false });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let phase = 0;
    let smoothFlip = 0;

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (!reduced) {
        phase += dt;
      }

      // Smooth pointer damping for card 3D tilt, flip, and specular glare
      const p = pointerRef.current;
      p.smoothX += (p.x - p.smoothX) * Math.min(1, dt * 8);
      p.smoothY += (p.y - p.smoothY) * Math.min(1, dt * 8);
      const targetFlip = cardFlippedRef.current ? 180 : 0;
      smoothFlip += (targetFlip - smoothFlip) * (reduced ? 1 : Math.min(1, dt * 8.5));

      const cardEl = cardRef.current;
      if (cardEl) {
        const tiltY = p.smoothX * 14 + (reduced ? 0 : Math.sin(phase * 0.7) * 2.2);
        const tiltX = -p.smoothY * 10 + (reduced ? 0 : Math.cos(phase * 0.55) * 1.6);
        const floatY = reduced ? 0 : Math.sin(phase * 1.1) * 5;

        cardEl.style.transform = `translate3d(0, ${floatY.toFixed(2)}px, 0) rotateX(${tiltX.toFixed(2)}deg) rotateY(${(tiltY + smoothFlip).toFixed(2)}deg)`;
        cardEl.style.setProperty("--glare-x", `${(50 + p.smoothX * 36).toFixed(1)}%`);
        cardEl.style.setProperty("--glare-y", `${(42 + p.smoothY * 34).toFixed(1)}%`);
      }

      const vw = section.clientWidth || 1440;
      const spreadX = Math.max(vw * 0.6, 540);
      const isCompact = vw < 768;
      const rowScaleY = isCompact ? 0.68 : 1;

      ROW_CONFIGS.forEach((row, rowIdx) => {
        for (let slot = 0; slot < SLOTS_PER_ROW; slot++) {
          const el = tileRefs.current[rowIdx * SLOTS_PER_ROW + slot];
          if (!el) continue;

          // Continuous normalized wrap across [-1.15 .. +1.15]
          const scrollOffset = reduced ? 0 : phase * row.speed;
          const raw = ((slot / SLOTS_PER_ROW + scrollOffset) % 1 + 1) % 1;
          const u = (raw - 0.5) * 2.24; // centered range [-1.12, 1.12]

          // Concave cylindrical perspective arc: outer tiles sweep toward viewer & curve inward
          const theta = u * 0.92;
          const tx = Math.sin(theta) * spreadX + p.smoothX * (rowIdx - 1) * 14;
          const tz = (1 - Math.cos(theta)) * 220 - 150;
          const ry = -(theta * 180) / Math.PI * 0.68;
          const rz = u * (rowIdx === 0 ? -3.5 : rowIdx === 2 ? 3.2 : -1.2);
          const ty = row.yOffset * rowScaleY + (1 - Math.cos(theta)) * (rowIdx === 0 ? 34 : -26);
          const scale = (isCompact ? 0.72 : 0.86) + Math.pow(Math.abs(u), 1.4) * 0.34;

          // Fade smoothly at extreme edges & dim center band directly behind foreground text
          const edgeFade = Math.max(0, 1 - Math.max(0, Math.abs(u) - 0.88) / 0.24);
          const centerDip = rowIdx === 1 && Math.abs(u) < 0.28 ? 0.55 + Math.abs(u) * 1.4 : 1;
          const opacity = row.baseOpacity * edgeFade * centerDip;

          el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateY(${ry.toFixed(1)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          el.style.opacity = opacity.toFixed(3);
        }
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
    pointerRef.current.x = Math.max(-1, Math.min(1, nx));
    pointerRef.current.y = Math.max(-1, Math.min(1, ny));
    pointerRef.current.active = true;
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
    pointerRef.current.active = false;
    setHoveredCompany(null);
  };

  return (
    <section
      ref={sectionRef}
      id="hr-vista-card"
      className={styles.showcaseSection}
      aria-labelledby="vista-card-heading"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Top corner bar matching moto-card composition */}
      <div className={styles.topChrome}>
        <div className={styles.brandBadge}>
          <span className={styles.brandSeal} aria-hidden="true">HV</span>
          <span className={styles.brandWord}>HR VISTA 3.0</span>
        </div>
        <a href="/partners" className={styles.topActionPill}>
          <span>2.0 Visiting Companies</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>

      {/* 3D Curved Background Wall of HR VISTA 2.0 Company Logos */}
      <div className={styles.cylindricalStage} aria-label="Organisations that visited HR VISTA 2.0">
        {ROW_CONFIGS.map((row, rowIdx) =>
          Array.from({ length: SLOTS_PER_ROW }).map((_, slotIdx) => {
            const company =
              HR_VISTA_2_COMPANIES[(row.offset + slotIdx) % HR_VISTA_2_COMPANIES.length];
            const refIndex = rowIdx * SLOTS_PER_ROW + slotIdx;
            const isActive = hoveredCompany?.id === company.id;

            return (
              <div
                key={`${row.id}-${slotIdx}`}
                ref={(el) => {
                  tileRefs.current[refIndex] = el;
                }}
                className={`${styles.companyTile} ${isActive ? styles.companyTileActive : ""}`}
                onMouseEnter={() => setHoveredCompany(company)}
                onFocus={() => setHoveredCompany(company)}
                tabIndex={0}
                role="button"
                aria-label={`${company.name} — ${company.sector} (${company.speakerRole})`}
              >
                <div className={styles.tileSheen} aria-hidden="true" />
                <div className={styles.tileInner}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company.logoSrc}
                    alt={`${company.name} logo`}
                    referrerPolicy="no-referrer"
                    className={`${styles.companyLogoImg} ${
                      company.shape === "square" ? styles.logoSquare : styles.logoWide
                    } ${styles[`treat_${company.treatment}`]}`}
                  />
                </div>
                <div className={styles.tileFooter}>
                  <span className={styles.tileCompanyName}>{company.name}</span>
                  <span className={styles.tileCompanySector}>{company.sector}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Atmospheric black radial depth vignette keeping foreground razor sharp */}
      <div className={styles.vignetteOverlay} aria-hidden="true" />

      {/* Centerpiece Vertical Metallic Card ("HR VISTA 3.0") */}
      <div className={styles.foregroundStage}>
        <div className={styles.cardPerspective}>
          <div
            ref={cardRef}
            className={styles.metalCard}
            onClick={() => setCardFlipped((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setCardFlipped((prev) => !prev);
              }
            }}
            aria-label="HR VISTA 3.0 metallic delegate pass — click to flip"
          >
            {/* Front Face — Classic uncluttered surface with centered sculptural crest */}
            <div className={`${styles.cardFace} ${styles.cardFront}`}>
              <div className={styles.cardSpecularGlare} aria-hidden="true" />

              {/* Centered Sculptural Sphere Crest ("the ball") */}
              <div className={styles.centerCrest} aria-hidden="true">
                <div className={styles.crestOuterRing}>
                  <div className={styles.crestSphere}>
                    <div className={styles.crestSphereGlint} />
                    <div className={styles.crestSphereEquator} />
                    <span className={styles.crestEdition}>HR VISTA</span>
                    <strong className={styles.crestNumber}>3.0</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Face — Revealed cleanly on click/flip */}
            <div className={`${styles.cardFace} ${styles.cardBack}`}>
              <div className={styles.cardMagStrip} aria-hidden="true" />
              <div className={styles.cardBackContent}>
                <p className={styles.backEyebrow}>HR VISTA 3.0 · WHEN MACHINES THINK</p>
                <h4>21–22 November 2026</h4>
                <p className={styles.backVenue}>
                  CHRIST (Deemed to be University)
                  <br />
                  Pune Lavasa Campus
                </p>
                <div className={styles.backStats}>
                  <div>
                    <strong>500+</strong>
                    <span>HR Leaders</span>
                  </div>
                  <div>
                    <strong>50+</strong>
                    <span>Organisations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic hover readout for hovered company logo OR quiet subtitle */}
        <div className={styles.headlineStack}>
          <p className={styles.companyReadout} aria-live="polite">
            {hoveredCompany
              ? `${hoveredCompany.name} · ${hoveredCompany.speakerRole}`
              : "Organisations from HR VISTA 2.0 · Tap card to flip"}
          </p>
          <h2 id="vista-card-heading" className={styles.mainStatement}>
            THE CONCLAVE IS ONLY
            <br />
            THE BEGINNING
          </h2>
          <a href="/brochure" className={styles.pillCta}>
            Explore the Brochure
          </a>
        </div>
      </div>
    </section>
  );
}
