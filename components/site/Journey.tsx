"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { JourneyMotion } from "./JourneyGlobe";
import { content } from "@/lib/data/content";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import styles from "./Journey.module.css";

const Globe = dynamic(() => import("./JourneyGlobe"), { ssr: false });
const PDF = "/brochure/HR-VISTA-3.0.pdf";

function RegionalMap({ completed = false, compact = false }: { completed?: boolean; compact?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={styles.mapDrawing}
      viewBox={compact ? "175 195 460 330" : "0 0 760 720"}
      role="img"
      aria-label="Illustrated connection from Lavasa in the Pune region to Mumbai on India's west coast"
    >
      <defs>
        <pattern
          id={`${id}-grid`}
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M60 0H0V60"
            fill="none"
            stroke="#7997bc"
            strokeOpacity=".12"
          />
        </pattern>
        <linearGradient id={`${id}-land`} x2="1" y2="1">
          <stop stopColor="#172d49" />
          <stop offset="1" stopColor="#091424" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <linearGradient id={`${id}-plane`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#a6c5ff" />
        </linearGradient>
      </defs>
      <rect width="760" height="720" fill="#071323" />
      <rect width="760" height="720" fill={`url(#${id}-grid)`} />
      <path
        d="M280 0 269 65 285 107 262 148 277 178 266 211 281 234 272 257 290 281 283 306 304 332 300 367 315 395 310 426 333 470 339 512 366 568 373 610 401 674 406 720H760V0Z"
        fill={`url(#${id}-land)`}
        stroke="#6585a7"
        strokeWidth="1.5"
      />
      {[0, 1, 2, 3, 4].map((n) => (
        <path
          key={n}
          d={`M${360 + n * 32} 0 Q${300 + n * 45} 180 ${380 + n * 34} 345 T${440 + n * 30} 720`}
          fill="none"
          stroke="#91aed0"
          strokeOpacity=".09"
        />
      ))}
      <circle cx="493" cy="450" r="6" fill="#efc58a" />
      <circle cx="493" cy="450" r="17" fill="none" stroke="#efc58a" strokeOpacity=".45" />
      <g data-map-details>
      <path
        d="M493 450 Q480 255 294 278"
        fill="none"
        stroke="#afc8ef"
        strokeOpacity=".25"
        strokeWidth="1"
        strokeDasharray="3 7"
      />
      <path
        data-route
        d="M493 450 Q480 255 294 278"
        pathLength="1"
        strokeDasharray="1"
        fill="none"
        stroke="#78a5ff"
        strokeWidth="9"
        filter={`url(#${id}-glow)`}
        opacity=".5"
        style={{ strokeDashoffset: completed ? 0 : 1 }}
      />
      <path
        data-route
        d="M493 450 Q480 255 294 278"
        pathLength="1"
        fill="none"
        stroke="#a8c6ff"
        strokeWidth="2"
        strokeDasharray="1"
        style={{ strokeDashoffset: completed ? 0 : 1 }}
      />
      <circle cx="294" cy="278" r="7" fill="#bfd5ff" />
      <circle
        data-arrival-ring
        cx="294"
        cy="278"
        r="24"
        fill="none"
        stroke="#93b9ff"
        strokeOpacity=".5"
      />
      <text x="526" y="478" fill="#fff" fontSize="21">
        Lavasa
      </text>
      <text x="272" y="224" textAnchor="end" fill="#fff" fontSize="26">
        Mumbai
      </text>
      <g data-airplane transform={completed ? "translate(294 278) rotate(-97)" : "translate(493 450) rotate(-4)"}>
        <ellipse data-plane-shadow cx="7" cy="12" rx="15" ry="22" fill="#030a16" opacity=".4" />
        <circle r="30" fill="#a6c5ff" opacity=".06" />
        <g data-plane-bank>
        <g className={styles.airplane}>
          <path d="M0-23C-2-23-3-18-3-13V-5L-19 5V9L-3 4V15L-9 20V23L0 20 9 23V20L3 15V4L19 9V5L3-5V-13C3-18 2-23 0-23Z" fill={`url(#${id}-plane)`} stroke="#e4eeff" strokeWidth=".7" />
          <path d="M0-17V16" stroke="#6789bd" strokeWidth="1" opacity=".55" />
          <path d="M-3-11Q0-14 3-11" fill="none" stroke="#355c8c" strokeWidth="1.2" />
        </g>
        </g>
      </g>
      </g>
    </svg>
  );
}

function MumbaiSetting() {
  return (
    <figure className={styles.cityScene} data-city>
      <img
        className={styles.cityPhoto}
        src="/media/mumbai/marine-drive-blue-hour.webp"
        alt="Mumbai’s Marine Drive waterfront and skyline at blue hour, with golden lights along the bay"
        width={2000}
        height={1334}
        loading="lazy"
        decoding="async"
      />
      <figcaption className={styles.cityCaption}>
        <span className={styles.cityLocation}>Marine Drive, Mumbai</span>
        <div className={styles.cityCredits}>
          <span>Photo: <a href="https://commons.wikimedia.org/wiki/File:Marine_Lines_Mumbai_2021.jpg" target="_blank" rel="noreferrer">Dr Vikramjit Kakati</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Cropped and compressed.</span>
        </div>
      </figcaption>
    </figure>
  );
}

export function Journey() {
  const root = useRef<HTMLDivElement>(null);
  const seekScene = useRef<((progress: number) => void) | null>(null);
  const renderCurrentScene = useRef<() => void>(() => {});
  const availability = useRef<boolean | null>(null);
  const [globeAvailable, setGlobeAvailable] = useState<boolean | null>(null);
  const motionState = useRef<JourneyMotion>({ cameraProgress: 0, handoffProgress: 0, x: 0, y: 0, visible: true });
  const reduced = useReducedMotionPreference();
  const [near, setNear] = useState(false);
  const onGlobeAvailability = useCallback((available: boolean) => {
    availability.current = available;
    motionState.current.visible = available;
    setGlobeAvailable(available);
    renderCurrentScene.current();
  }, []);
  const seekFlight = (progress: number) => seekScene.current?.(progress);

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
    const earth = element.querySelector<HTMLElement>("[data-earth]");
    const map = element.querySelector<HTMLElement>("[data-map]");
    const atmosphere = element.querySelector<HTMLElement>("[data-handoff-atmosphere]");
    const city = element.querySelector<HTMLElement>("[data-city]");
    const lavasa = element.querySelector<HTMLElement>("#lavasa");
    const flightChapter = element.querySelector<HTMLElement>("#journey");
    const mumbai = element.querySelector<HTMLElement>("#mumbai");
    const route = map?.querySelector<SVGPathElement>("[data-route]");
    if (!earth || !map || !lavasa || !flightChapter || !mumbai || !route) return;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const blend = (value: number) => { const p = clamp(value); return p * p * (3 - 2 * p); };
    const length = route.getTotalLength();
    const maps = element.querySelectorAll<HTMLElement>("[data-map], [data-inline-map]");
    const scrubber = element.querySelector<HTMLInputElement>("[data-flight-scrubber]");
    const controls = element.querySelector<HTMLElement>("[data-flight-controls]");
    const destination = element.querySelector<HTMLElement>("[data-destination]");
    const renderFlight = (flight: number) => {
      const p = blend((flight - .055) / .89);
      const altitude = Math.sin(Math.PI * p);
      const point = route.getPointAtLength(length * p);
      const before = route.getPointAtLength(Math.max(0, length * p - 1));
      const after = route.getPointAtLength(Math.min(length, length * p + 1));
      const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI + 90;
      maps.forEach(drawing => {
        drawing.querySelector("[data-airplane]")?.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
        drawing.querySelector("[data-plane-bank]")?.setAttribute("transform", `rotate(${-altitude * 5}) scale(${1 + altitude * .1} ${1 - altitude * .04})`);
        const shadow = drawing.querySelector<SVGEllipseElement>("[data-plane-shadow]");
        shadow?.setAttribute("transform", `translate(${altitude * 6} ${altitude * 10}) scale(${1 - altitude * .12})`);
        if (shadow) shadow.style.opacity = String(.38 - altitude * .15);
        drawing.querySelectorAll<SVGPathElement>("[data-route]").forEach(path => { path.style.strokeDashoffset = String(1 - p); });
        const ring = drawing.querySelector<SVGCircleElement>("[data-arrival-ring]");
        if (ring) {
          ring.setAttribute("r", String(24 + Math.max(0, p - .8) * 50));
          ring.style.opacity = String(.4 + p * .6);
        }
      });
      const phase = p < .12 ? "departure" : p > .9 ? "arrival" : "cruise";
      if (controls) {
        controls.dataset.phase = phase;
        controls.style.setProperty("--flight-progress", `${Math.round(flight * 100)}%`);
        controls.querySelectorAll<HTMLButtonElement>("[data-stop]").forEach(button => {
          button.setAttribute("aria-pressed", String(button.dataset.stop === phase));
        });
      }
      if (scrubber) {
        scrubber.value = String(Math.round(flight * 100));
        scrubber.setAttribute("aria-valuetext", `${Math.round(p * 100)} percent of the illustrated Lavasa to Mumbai journey`);
      }
      if (destination) destination.dataset.arrived = String(p > .98);
      element.dataset.flightProgress = p.toFixed(3);
    };

    // Reduced motion retains a complete route and direct, non-spatial seeking.
    if (reduced) {
      motionState.current.cameraProgress = 0;
      motionState.current.handoffProgress = 0;
      motionState.current.visible = availability.current !== false;
      seekScene.current = progress => renderFlight(clamp(progress));
      renderFlight(1);
      return () => { seekScene.current = null; };
    }

    gsap.registerPlugin(ScrollTrigger);
    element.dataset.motion = "enhanced";
    const scene = { position: 0 };
    const bounds = { start: 0, end: 1, originStart: 0, originEnd: 1, flightStart: 0, flightEnd: 1, arrivalStart: 0, arrivalEnd: 1, mumbaiTop: 0, mumbaiHeight: 1 };
    let trigger: ScrollTrigger | null = null;
    const measure = () => {
      const y = window.scrollY;
      const viewport = window.innerHeight;
      const top = (node: HTMLElement) => node.getBoundingClientRect().top + y;
      bounds.start = top(element);
      bounds.end = Math.max(bounds.start + 1, bounds.start + element.offsetHeight - viewport);
      bounds.originStart = top(lavasa);
      bounds.originEnd = bounds.originStart + lavasa.offsetHeight - viewport * .12;
      bounds.flightStart = top(flightChapter);
      bounds.flightEnd = Math.max(bounds.flightStart + 1, bounds.flightStart + flightChapter.offsetHeight - viewport * (window.innerWidth <= 700 ? .35 : .82));
      bounds.mumbaiTop = top(mumbai);
      bounds.mumbaiHeight = mumbai.offsetHeight;
      bounds.arrivalStart = bounds.mumbaiTop - viewport * .95;
      bounds.arrivalEnd = bounds.mumbaiTop - viewport * .1;
    };
    const renderScene = () => {
      const scroll = bounds.start + (bounds.end - bounds.start) * scene.position;
      const origin = clamp((scroll - bounds.originStart) / Math.max(1, bounds.originEnd - bounds.originStart));
      const flight = clamp((scroll - bounds.flightStart) / (bounds.flightEnd - bounds.flightStart));
      const arrival = clamp((scroll - bounds.arrivalStart) / (bounds.arrivalEnd - bounds.arrivalStart));
      const handoff = blend((origin - .35) / .3);
      const earthOpacity = 1 - blend(handoff / .72);
      const mapOpacity = blend((handoff - .12) / .88) * (1 - blend(arrival / .8));
      motionState.current.cameraProgress = blend(origin / .65);
      motionState.current.handoffProgress = handoff;
      motionState.current.visible = earthOpacity > .001 && availability.current !== false;
      earth.style.opacity = String(earthOpacity);
      earth.style.visibility = earthOpacity < .001 ? "hidden" : "visible";
      earth.style.setProperty("--globe-controls", String(1 - blend(origin / .2)));
      earth.inert = origin > .12 || availability.current === false;
      earth.setAttribute("aria-hidden", String(earth.inert));
      map.style.opacity = String(mapOpacity);
      map.style.visibility = mapOpacity < .001 ? "hidden" : "visible";
      map.querySelector<SVGGElement>("[data-map-details]")?.style.setProperty("opacity", String(blend((handoff - .82) / .18)));
      if (atmosphere) atmosphere.style.opacity = String(Math.sin(Math.PI * handoff) * .82);
      // The regional illustration stays fixed; only the aircraft follows its
      // route. Tracking the globe marker here made the entire map wander.
      renderFlight(flight);
      if (city) {
        const depth = clamp((scroll - bounds.mumbaiTop + window.innerHeight) / (bounds.mumbaiHeight + window.innerHeight));
        const inset = 6 * (1 - blend(arrival));
        city.style.transform = `translate3d(0,${24 - depth * 48}px,0)`;
        city.style.clipPath = `inset(${inset}% ${inset * .8}% ${inset}% ${inset * .8}%)`;
        const photo = city.querySelector("img");
        if (photo) photo.style.transform = `translate3d(0,${2 - depth * 4}%,0) scale(1.04)`;
      }
      element.dataset.handoffProgress = handoff.toFixed(3);
      element.dataset.cameraProgress = motionState.current.cameraProgress.toFixed(3);
    };
    renderCurrentScene.current = renderScene;
    measure();
    const ctx = gsap.context(() => {
      // Every visible scene property derives from this one scrubbed position.
      // Direct seeking settles this same tween, so all layers agree immediately.
      gsap.to(scene, {
        position: 1, ease: "none", onUpdate: renderScene,
        scrollTrigger: {
          trigger: element, start: "top top", end: "bottom bottom", scrub: .45,
          onRefresh: self => { trigger = self; measure(); scene.position = self.progress; renderScene(); },
          onUpdate: self => { trigger = self; },
        },
      });
      element.querySelectorAll<HTMLElement>(`.${styles.travelChapter}`).forEach(chapter => {
        gsap.fromTo(chapter.querySelector("h2"), { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: .6, ease: "power3.out",
          scrollTrigger: { trigger: chapter, start: "top 78%", toggleActions: "play none none reverse" },
        });
        const photograph = chapter.querySelector(`.${styles.lavasaPhoto}`);
        if (photograph) gsap.fromTo(photograph, { y: 16 }, {
          y: -8, ease: "none",
          scrollTrigger: { trigger: photograph, start: "top bottom", end: "bottom 25%", scrub: .45 },
        });
      });
    }, element);
    seekScene.current = progress => {
      const scroll = bounds.flightStart + (bounds.flightEnd - bounds.flightStart) * clamp(progress);
      window.scrollTo({ top: scroll, behavior: "instant" });
      window.dispatchEvent(new CustomEvent("hr-vista:seek", { detail: scroll }));
      ScrollTrigger.update();
      trigger?.getTween()?.progress(1);
      scene.position = clamp((scroll - bounds.start) / (bounds.end - bounds.start));
      renderScene();
    };
    renderScene();
    let refreshFrame = 0;
    let disposed = false;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const resize = new ResizeObserver(refresh);
    resize.observe(element);
    void document.fonts.ready.then(() => { if (!disposed) refresh(); });
    return () => {
      disposed = true;
      seekScene.current = null;
      renderCurrentScene.current = () => {};
      motionState.current.cameraProgress = 0;
      motionState.current.handoffProgress = 0;
      motionState.current.visible = availability.current !== false;
      resize.disconnect();
      cancelAnimationFrame(refreshFrame);
      ctx.revert();
      delete element.dataset.motion;
      for (const layer of [earth, map, city, atmosphere]) {
        if (!layer) continue;
        ["opacity", "visibility", "transform", "clip-path"].forEach(property => layer.style.removeProperty(property));
        layer.inert = false;
      }
      earth.removeAttribute("aria-hidden");
      earth.style.removeProperty("--globe-controls");
      if (city) gsap.set(city.querySelector("img"), { clearProps: "transform" });
      gsap.set(element.querySelectorAll(`.${styles.travelChapter} h2, .${styles.lavasaPhoto}`), { clearProps: "opacity,transform" });
      map.querySelector<SVGGElement>("[data-map-details]")?.style.removeProperty("opacity");
    };
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
          <div className={styles.globeFallback} aria-hidden="true">
            {globeAvailable === false && <RegionalMap />}
          </div>
          {near && <Globe motion={motionState} onAvailabilityChange={onGlobeAvailability} />}
        </div>
        <div className={styles.handoffAtmosphere} data-handoff-atmosphere aria-hidden="true" />
        <div className={styles.regionalMap} data-map aria-hidden="true">
          <RegionalMap />
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
            Before the bigger stage, there was a meeting of minds in the hills.
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
      <section
        id="journey"
        className={`${styles.travelChapter} ${styles.flightChapter}`}
        aria-labelledby="journey-title"
      >
        <div className={styles.flightStage}>
          <div className={styles.staticMap} data-inline-map><RegionalMap completed compact /></div>
          <div className={styles.chapterCopy}>
            <h2 id="journey-title">
              Ideas travel.
              <br />
              So <em>do we.</em>
            </h2>
            <p className={styles.body}>
              From the Sahyadri hills to the pulse of Mumbai. Taking the spirit of
              Lavasa to a wider world of people, possibilities and perspectives.
            </p>
            <div className={styles.routeLegend}>
              <span>Lavasa</span>
              <i />
              <span data-destination>
                Mumbai
              </span>
            </div>
            <div className={styles.flightControls} data-flight-controls>
              <label htmlFor="journey-flight">Explore the flight</label>
              <input id="journey-flight" data-flight-scrubber type="range" min="0" max="100" defaultValue="0" aria-label="Scroll through the illustrated Lavasa to Mumbai flight" onChange={event => seekFlight(Number(event.currentTarget.value) / 100)} />
              <div><button type="button" data-stop="departure" onClick={() => seekFlight(0)}>Departure</button><button type="button" data-stop="cruise" onClick={() => seekFlight(.5)}>In flight</button><button type="button" data-stop="arrival" onClick={() => seekFlight(1)}>Arrival</button></div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="mumbai"
        className={`${styles.travelChapter} ${styles.arrival}`}
        aria-labelledby="mumbai-title"
      >
        <span id="next-chapter" className={styles.anchorAlias} aria-hidden="true" />
        <div className={styles.arrivalVisual}><MumbaiSetting /></div>
        <div className={styles.chapterCopy}>
          <h2 id="mumbai-title">
            Hello,
            <br />
            <em>Mumbai.</em>
          </h2>
          <p className={styles.body}>
            A bigger stage for the people shaping the future of work. HR VISTA
            3.0 arrives at the heart of India’s corporate conversation.
          </p>
          <div className={styles.venue}>
            <span>21—22 NOVEMBER 2026</span>
            <strong>Mumbai. Venue to be announced.</strong>
            <details>
              <summary>
                About the next chapter <span>+</span>
              </summary>
              <p>
                Mumbai brings together business, finance and professional
                communities. Our next chapter carries Lavasa’s spirit into this
                wider conversation. The exact venue is still being finalised.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}

export function JourneyFinale() {
  return (
    <section id="next" className={styles.finale} aria-labelledby="finale-title">
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
        <a className={styles.button} href={PDF} download>
          Download brochure <span>↓</span>
        </a>
        <a className={styles.textLink} href="/brochure">
          Read online <span>↗</span>
        </a>
      </div>
      <div className={styles.finaleMeta}>
        <span>{content.hero.dates}</span>
        <span>MUMBAI · VENUE TO BE ANNOUNCED</span>
        <span>HR VISTA 3.0</span>
      </div>
    </section>
  );
}
