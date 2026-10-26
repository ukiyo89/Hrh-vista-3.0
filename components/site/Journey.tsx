"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { JourneyMotion } from "./JourneyGlobe";
import { content } from "@/lib/data/content";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { ActionLink } from "./ActionLink";
import styles from "./Journey.module.css";

const Globe = dynamic(() => import("./JourneyGlobe"), { ssr: false });
const PDF = "/brochure/HR-VISTA-3.0.pdf";

export function Journey() {
  const root = useRef<HTMLDivElement>(null);
  const [globeAvailable, setGlobeAvailable] = useState<boolean | null>(null);
  const motionState = useRef<JourneyMotion>({ x: 0, y: 0, visible: true });
  const reduced = useReducedMotionPreference();
  const [near, setNear] = useState(false);
  const onGlobeAvailability = useCallback((available: boolean) => {
    motionState.current.visible = available;
    setGlobeAvailable(available);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
    }, { rootMargin: "600px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(element.querySelector("h2"), { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: .6, ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 78%", toggleActions: "play none none reverse" },
      });
      const photograph = element.querySelector(`.${styles.lavasaPhoto}`);
      gsap.fromTo(photograph, { y: 16 }, {
        y: -8, ease: "none",
        scrollTrigger: { trigger: photograph, start: "top bottom", end: "bottom 25%", scrub: .45 },
      });
    }, element);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      className={styles.journey}
      ref={root}
      data-globe-status={globeAvailable === null ? "loading" : globeAvailable ? "ready" : "fallback"}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        motionState.current.x = (e.clientX - r.left) / r.width - 0.5;
        motionState.current.y = e.clientY / window.innerHeight - 0.5;
      }}
      onPointerLeave={() => {
        motionState.current.x = 0;
        motionState.current.y = 0;
      }}
    >
      <div className={styles.scene}>
        <div className={styles.sceneGrid} />
        <div className={styles.earth} data-earth>
          <div className={styles.globeFallback} aria-hidden="true" />
          {near && <Globe motion={motionState} onAvailabilityChange={onGlobeAvailability} />}
        </div>
        <div className={styles.sceneShade} />
      </div>
      <section
        id="lavasa"
        className={styles.travelChapter}
        aria-labelledby="lavasa-title"
      >
        <div className={styles.chapterCopy}>
          <p className={styles.eyebrow}>Lavasa, Pune</p>
          <h2 id="lavasa-title">
            Big ideas.
            <br />
            Quiet <em>beginnings.</em>
          </h2>
          <p className={styles.body}>
            It began with a meeting of minds in the hills.
            A campus. A community. A conversation that kept growing.
          </p>
          <figure className={styles.lavasaPhoto}>
            <img
              src="/media/flickr/story-4.jpg"
              alt="Lavasa lake and the surrounding Sahyadri hills"
              width={1024}
              height={576}
              loading="lazy"
            />
            <figcaption>Lavasa, in the Sahyadri hills</figcaption>
          </figure>
        </div>
      </section>
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
