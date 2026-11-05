"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content } from "@/lib/data/content";
import { ActionLink } from "./ActionLink";
import styles from "./Journey.module.css";

const PDF = "/brochure/HR-VISTA-3.0.pdf";
const EARTH_IMAGE = { width: 1367, height: 768 };
const LAVASA_POINT = { x: 594, y: 510 };

const lavasaPhotos = [
  { src: "/media/Lavasa/pic2.jpg", alt: "Aerial view of Lavasa lake and the surrounding green hills", width: 1170, height: 768 },
  { src: "/media/Lavasa/pic1.jpg", alt: "Waterfront buildings and the lake at Lavasa", width: 1200, height: 675 },
  { src: "/media/Lavasa/pic3.jpg", alt: "Lavasa waterfront and hillside buildings", width: 810, height: 540 },
];

export function Journey() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const viewport = element.querySelector<HTMLElement>(`.${styles.viewport}`)!;
    const measure = () => {
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      const fit = Math.max(width / EARTH_IMAGE.width, height / EARTH_IMAGE.height);
      const imageWidth = EARTH_IMAGE.width * fit;
      const imageHeight = EARTH_IMAGE.height * fit;
      const left = (width - imageWidth) / 2;
      const top = (height - imageHeight) / 2;
      const pinX = left + LAVASA_POINT.x * fit;
      const pinY = top + LAVASA_POINT.y * fit;
      viewport.style.setProperty("--pin-x", `${pinX}px`);
      viewport.style.setProperty("--pin-y", `${pinY}px`);
      return { width, height, fit, left, top, pinX, pinY };
    };
    let layout = measure();
    const resizeObserver = new ResizeObserver(() => {
      layout = measure();
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(viewport);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      element.dataset.journeyMode = "cinematic";
      const artwork = element.querySelector<HTMLElement>("[data-earth-artwork]")!;
      const marker = element.querySelector<HTMLElement>("[data-lavasa-marker]")!;
      const region = element.querySelector<SVGPathElement>("[data-maharashtra]")!;
      const welcome = element.querySelector<HTMLElement>("[data-welcome-copy]")!;
      const explore = element.querySelector<HTMLElement>("[data-explore-link]")!;
      const cards = Array.from(element.querySelectorAll<HTMLElement>("[data-lavasa-card]"));
      const initial = measure();
      gsap.set(artwork, {
        width: EARTH_IMAGE.width,
        height: EARTH_IMAGE.height,
        x: initial.left,
        y: initial.top,
        scale: initial.fit,
        transformOrigin: "0 0",
      });
      gsap.set(marker, {
        left: initial.pinX,
        top: initial.pinY,
        xPercent: -50,
        yPercent: -50,
      });
      gsap.set(welcome, { autoAlpha: 0, y: 24 });
      gsap.set(explore, { autoAlpha: 0, y: 16 });
      gsap.set(region, { autoAlpha: 0 });
      gsap.set(marker, { autoAlpha: 0, scale: 0.5 });
      cards.forEach((card, index) => {
        const offset = (index - 1) * Math.min(viewport.clientWidth * 0.24, 310);
        const rotation = (index - 1) * 9;
        gsap.set(card, {
          xPercent: -50,
          x: offset,
          y: 120,
          rotation,
          scale: index === 1 ? 0.92 : 0.82,
          autoAlpha: 0,
          transformOrigin: "50% 100%",
        });
      });

      const syncScene = (progress: number) => {
        element.dataset.journeyProgress = progress.toFixed(3);
        const phase = progress < 0.36 ? "orbit" : progress < 0.68 ? "arrival" : "lavasa";
        if (element.dataset.journeyScene !== phase) element.dataset.journeyScene = phase;
      };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate() { syncScene(this.progress()); },
      });
      timeline
        .to(artwork, {
          scale: () => layout.fit * 3.2,
          x: () => viewport.clientWidth / 2 - LAVASA_POINT.x * layout.fit * 3.2,
          y: () => viewport.clientHeight * 0.48 - LAVASA_POINT.y * layout.fit * 3.2,
          duration: 0.72,
          ease: "power2.inOut",
        }, 0)
        .to(region, { autoAlpha: 1, duration: 0.2 }, 0.29)
        .to(marker, {
          left: () => viewport.clientWidth / 2,
          top: () => viewport.clientHeight * 0.48,
          scale: 1,
          autoAlpha: 1,
          duration: 0.18,
          ease: "back.out(1.5)",
        }, 0.34)
        .to(welcome, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.43)
        .to(explore, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.55);
      cards.forEach((card, index) => {
        timeline.to(card, {
          x: () => (index - 1) * Math.min(viewport.clientWidth * 0.24, 310),
          y: 0,
          rotation: (index - 1) * 9,
          scale: index === 1 ? 1 : 0.88,
          autoAlpha: 1,
          duration: 0.28,
          ease: "power2.out",
        }, 0.56 + index * 0.065);
      });
      timeline.to({}, { duration: 0.12 }, 0.88);

      ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: "bottom bottom",
        animation: timeline,
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          layout = measure();
          gsap.set(artwork, {
            width: EARTH_IMAGE.width,
            height: EARTH_IMAGE.height,
            x: layout.left,
            y: layout.top,
            scale: layout.fit,
          });
          gsap.set(marker, { left: layout.pinX, top: layout.pinY });
          timeline.invalidate();
          timeline.progress(self.progress);
          syncScene(self.progress);
        },
      });
      return () => {
        element.dataset.journeyProgress = "0";
        element.dataset.journeyScene = "orbit";
        delete element.dataset.journeyMode;
      };
    }, element);
    return () => {
      resizeObserver.disconnect();
      media.revert();
    };
  }, []);

  return (
    <div
      className={styles.journey}
      ref={root}
      id="lavasa"
      role="region"
      aria-labelledby="lavasa-title"
      data-journey-scene="orbit"
      data-journey-progress="0"
    >
      <div className={styles.viewport}>
        <div className={styles.spaceGlow} aria-hidden="true" />
        <div className={styles.earthArtwork} data-earth-artwork aria-hidden="true">
          <img
            className={styles.earthImage}
            src="/media/journey/earth-at-night.png"
            alt=""
            width={EARTH_IMAGE.width}
            height={EARTH_IMAGE.height}
            fetchPriority="high"
            decoding="async"
          />
          <svg
            className={styles.regionMap}
            viewBox={`0 0 ${EARTH_IMAGE.width} ${EARTH_IMAGE.height}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path
              d="M518 451 540 441 558 446 575 438 594 450 616 447 632 459 653 465 672 481 665 497 670 510 656 524 651 542 635 550 630 568 615 574 601 560 584 556 574 537 557 527 550 510 536 499 532 482 520 470Z"
              data-maharashtra
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div className={styles.lavasaMarker} data-lavasa-marker aria-hidden="true">
          <span className={styles.markerPulse} />
          <span className={styles.markerDot} />
          <span className={styles.markerLabel}>Lavasa, Pune</span>
        </div>
        <header className={styles.welcomeCopy} data-welcome-copy>
          <p className={styles.eyebrow}>HR VISTA 3.0 <span>·</span> SAHYADRI, INDIA</p>
          <h2 id="lavasa-title">Welcome to <em>Lavasa.</em></h2>
          <p className={styles.body}>A campus. A community. A conversation that kept growing.</p>
        </header>
        <a className={styles.editionsLink} href="#editions" data-explore-link data-ui="text" data-ui-tone="dark">
          Explore our editions <span aria-hidden="true">↓</span>
        </a>
        <div className={styles.photoArc} role="group" aria-label="Lavasa photo gallery">
          {lavasaPhotos.map((photo) => (
            <figure className={styles.photoCard} data-lavasa-card key={photo.src}>
              <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} decoding="async" />
            </figure>
          ))}
        </div>
        <p className={styles.scrollCue} aria-hidden="true">Scroll to explore <span>↓</span></p>
      </div>
    </div>
  );
}

export function JourneyFinale() {
  return (
    <section id="next" className={styles.finale} aria-labelledby="finale-title">
      <span id="next-chapter" className={styles.anchorAlias} aria-hidden="true" />
      <div className={styles.finaleOrbit} aria-hidden="true" />
      <h2 id="finale-title">
        The future of work.
        <br />
        <em>Closer than ever.</em>
      </h2>
      <p>
        Keynote conversations. Leadership panels. New connections.
        <br />
        Discover what’s ahead at HR VISTA 3.0.
      </p>
      <div className={styles.finaleActions}>
        <ActionLink href={PDF} download direction="down">Download brochure</ActionLink>
        <a className={styles.textLink} href="/brochure" data-ui="text" data-ui-tone="dark">
          Read online <span data-ui-glyph aria-hidden="true">↗</span>
        </a>
      </div>
      <div className={styles.finaleMeta}>
        <span>{content.hero.dates}</span>
        <span>VENUE TO BE ANNOUNCED</span>
        <span>HR VISTA 3.0</span>
      </div>
    </section>
  );
}
