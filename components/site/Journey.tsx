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

const Globe = dynamic(() => import("./JourneyGlobe"), {
  ssr: false,
  loading: () => <div className={styles.globePlaceholder} aria-hidden="true" />,
});
const PDF = "/brochure/HR-VISTA-3.0.pdf";
// shortcut: the distance mask matches this lettering, regenerate it when the text or font changes.
const MASK_MATRIX = "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -510 -2 0 0 ";

export function Journey() {
  const root = useRef<HTMLDivElement>(null);
  const earth = useRef<HTMLDivElement>(null);
  const photoMeta = useRef<HTMLElement>(null);
  const editionsLink = useRef<HTMLAnchorElement>(null);
  const availability = useRef<boolean | null>(null);
  const controlsVisible = useRef(true);
  const [globeAvailable, setGlobeAvailable] = useState<boolean | null>(null);
  const [maskStatus, setMaskStatus] = useState("loading");
  const motionState = useRef<JourneyMotion>({ x: 0, y: 0, visible: true });
  const reduced = useReducedMotionPreference();
  const [near, setNear] = useState(false);
  const syncControls = useCallback(() => {
    const element = earth.current;
    if (!element) return;
    const interactive = controlsVisible.current && availability.current === true;
    if (!interactive && element.contains(document.activeElement)) {
      if (photoMeta.current) {
        photoMeta.current.inert = false;
        photoMeta.current.removeAttribute("aria-hidden");
      }
      editionsLink.current?.focus({ preventScroll: true });
    }
    if (element.inert === interactive) element.inert = !interactive;
    if (element.getAttribute("aria-hidden") !== String(!interactive)) element.setAttribute("aria-hidden", String(!interactive));
  }, []);
  const onGlobeAvailability = useCallback((available: boolean) => {
    availability.current = available;
    setGlobeAvailable(available);
    syncControls();
  }, [syncControls]);

  useEffect(() => {
    const maskImage = new Image();
    maskImage.onload = () => setMaskStatus("ready");
    maskImage.onerror = () => setMaskStatus("failed");
    maskImage.src = "/media/journey/lavasa-welcome-distance.png";
    return () => { maskImage.onload = null; maskImage.onerror = null; };
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
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    let disposed = false;
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 1024px) and (min-height: 700px)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (!context.conditions?.motion) return;
      const cinematic = context.conditions.desktop;
      element.dataset.journeyMode = cinematic ? "cinematic" : "flow";
      const copy = element.querySelector(`.${styles.chapterCopy}`);
      const title = element.querySelector("h2")!;
      const photograph = element.querySelector<HTMLElement>("[data-lavasa-photo]")!;
      const placement = photograph.parentElement!;
      const image = photograph.querySelector("img");
      const maskedImage = photograph.querySelector("[data-lavasa-image]");
      const mask = photograph.querySelector("[data-lavasa-mask]");
      const welcome = element.querySelector(`.${styles.welcomeNote}`);
      const titlePosition = () => {
        const heading = title.getBoundingClientRect();
        const frame = placement.getBoundingClientRect();
        return {
          scale: heading.width / placement.offsetWidth,
          x: heading.left - frame.left,
          y: heading.top - frame.top,
        };
      };
      const syncScene = (progress: number) => {
        element.dataset.journeyProgress = progress.toFixed(3);
        const phase = progress <= .25 ? "intro" : progress < .65 ? "transition" : "place";
        if (element.dataset.journeyScene !== phase) element.dataset.journeyScene = phase;
        // The mask is fully opaque after .57; stop filtering until reverse scroll needs it.
        const photoMask = progress >= .57 ? "none" : "url(#lavasa-welcome-mask)";
        if (cinematic && maskedImage?.getAttribute("mask") !== photoMask) maskedImage?.setAttribute("mask", photoMask);
        const visible = !cinematic || progress < .5;
        if (motionState.current.visible !== visible) {
          motionState.current.visible = visible;
          earth.current?.dispatchEvent(new Event("hr-vista:globe-update"));
        }
        controlsVisible.current = !cinematic || progress <= .25;
        const copyHidden = cinematic && progress >= .42;
        if (copy?.getAttribute("aria-hidden") !== String(copyHidden)) copy?.setAttribute("aria-hidden", String(copyHidden));
        if (photoMeta.current) {
          const hidden = progress < .45 && !photoMeta.current.contains(document.activeElement);
          if (photoMeta.current.inert !== hidden) photoMeta.current.inert = hidden;
          if (photoMeta.current.getAttribute("aria-hidden") !== String(hidden)) photoMeta.current.setAttribute("aria-hidden", String(hidden));
        }
        syncControls();
      };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate() { syncScene(this.progress()); },
      });
      if (cinematic) timeline
        .fromTo(photograph, {
          x: () => titlePosition().x,
          y: () => titlePosition().y,
          scale: () => titlePosition().scale,
        }, { x: 0, y: 0, scale: 1, duration: .4 }, .25)
        .to(copy, { autoAlpha: 0, duration: .16 }, .25)
        .to(earth.current, { "--globe-controls": 0, duration: .16 }, .25)
        .to(earth.current, { autoAlpha: 0, scale: .84, y: 24, duration: .25 }, .25)
        .fromTo(mask, { attr: { values: MASK_MATRIX + 64.5 } }, {
          attr: { values: MASK_MATRIX + 364.5 }, duration: .4, ease: "power2.in",
        }, .25);
      else timeline
        .fromTo(image, { clipPath: "inset(40% 40% 40% 40%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: .4,
        }, .25)
        .fromTo(image, { opacity: 0 }, { opacity: 1, duration: .1 }, .25);
      timeline
        .fromTo(welcome, { opacity: 0 }, { opacity: 1, duration: .15 }, .5)
        .fromTo(photoMeta.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .2 }, .45)
        .to({}, { duration: .35 }, .65);
      ScrollTrigger.create({
        trigger: cinematic ? element : photograph,
        start: cinematic ? "top top" : "top 92%",
        end: cinematic ? "bottom bottom" : "center 45%",
        animation: timeline,
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: self => { timeline.progress(self.progress); syncScene(timeline.progress()); },
      });
      return () => {
        motionState.current.visible = true;
        earth.current?.dispatchEvent(new Event("hr-vista:globe-update"));
        controlsVisible.current = true;
        element.dataset.journeyProgress = "0";
        element.dataset.journeyScene = "flow";
        delete element.dataset.journeyMode;
        maskedImage?.setAttribute("mask", "url(#lavasa-welcome-mask)");
        copy?.removeAttribute("aria-hidden");
        if (photoMeta.current) {
          photoMeta.current.inert = false;
          photoMeta.current.removeAttribute("aria-hidden");
        }
        syncControls();
      };
    }, element);
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); };
  }, [syncControls]);

  return (
    <div
      className={styles.journey}
      ref={root}
      id="lavasa"
      role="region"
      aria-labelledby="lavasa-title"
      data-journey-scene="flow"
      data-journey-progress="0"
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
      <div className={styles.viewport}>
        <div className={styles.sceneGrid} aria-hidden="true" />
        <div className={styles.introduction}>
          <div className={styles.chapterCopy}>
            <p className={styles.eyebrow}>Lavasa, Pune</p>
            <h2 id="lavasa-title" aria-label="Welcome to Lavasa">
              <span>Welcome</span>
              <span>to Lavasa.</span>
            </h2>
            <p className={styles.body}>
              A campus. A community. A conversation that kept growing.
            </p>
          </div>
          <div ref={earth} className={styles.earth} data-earth inert aria-hidden="true">
            <div className={styles.globeFallback} aria-hidden="true" />
            {near ? <Globe motion={motionState} onAvailabilityChange={onGlobeAvailability} /> : <div className={styles.globePlaceholder} />}
          </div>
        </div>
        <div className={styles.photoPlacement}>
        <figure className={styles.lavasaPhoto} data-lavasa-photo>
          <div className={styles.photoMask}>
            <img
              src="/media/flickr/story-4.jpg"
              alt="Lavasa lake and the surrounding Sahyadri hills"
              width={1024}
              height={576}
              loading="lazy"
              decoding="async"
            />
            <svg className={styles.maskedLandscape} viewBox="0 0 1024 576" role="img" aria-label="Lavasa lake and the surrounding Sahyadri hills" data-mask-failed={maskStatus === "failed" ? "true" : undefined}>
              <defs>
                <filter id="lavasa-letter-expansion" filterUnits="userSpaceOnUse" x="0" y="0" width="1024" height="576" colorInterpolationFilters="sRGB">
                  <feColorMatrix type="matrix" values={MASK_MATRIX + 64.5} data-lavasa-mask />
                </filter>
                <mask id="lavasa-welcome-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="1024" height="576" style={{ maskType: "alpha" }}>
                  <g fill="white" className={styles.maskType} visibility={maskStatus === "ready" ? "hidden" : undefined}>
                    <text x="32" y="242" textLength="960" lengthAdjust="spacingAndGlyphs" data-lavasa-mask-text>Welcome</text>
                    <text x="32" y="458" textLength="960" lengthAdjust="spacingAndGlyphs" data-lavasa-mask-text>to Lavasa.</text>
                  </g>
                  <image href="/media/journey/lavasa-welcome-distance.png" width="1024" height="576" filter="url(#lavasa-letter-expansion)" />
                </mask>
              </defs>
              <image href="/media/flickr/story-4.jpg" width="1024" height="576" mask="url(#lavasa-welcome-mask)" data-lavasa-image />
            </svg>
            <div className={styles.welcomeNote}>
              <p>A warm welcome<br /><span>to our HR community.</span></p>
            </div>
          </div>
          <figcaption className={styles.photoMeta} ref={photoMeta}>
            <span className={styles.locationCaption}>Lavasa, in the Sahyadri hills</span>
            <a ref={editionsLink} className={styles.editionsLink} href="#editions" data-editions-link data-ui="text" data-ui-tone="dark">
              Explore our editions <span aria-hidden="true">↓</span>
            </a>
          </figcaption>
        </figure>
        </div>
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
