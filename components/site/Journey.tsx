"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
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
      />
      <path
        data-route
        d="M493 450 Q480 255 294 278"
        pathLength="1"
        fill="none"
        stroke="#a8c6ff"
        strokeWidth="2"
        strokeDasharray="1"
      />
      <circle cx="493" cy="450" r="6" fill="#efc58a" />
      <circle
        cx="493"
        cy="450"
        r="17"
        fill="none"
        stroke="#efc58a"
        strokeOpacity=".45"
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
      <text x="514" y="451" fill="#fff" fontSize="21">
        Lavasa
      </text>
      <text x="272" y="242" textAnchor="end" fill="#fff" fontSize="26">
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
  const flightTrigger = useRef<ScrollTrigger | null>(null);
  const seekFlight = (progress: number) => {
    const trigger = flightTrigger.current;
    if (!trigger) return;
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: "instant" });
    ScrollTrigger.update();
    // A direct seek also crosses the globe/map handoff. Settle this journey's
    // pending scrub tweens together so the aircraft and scene agree at once.
    ScrollTrigger.getAll().forEach(sceneTrigger => {
      if (sceneTrigger.trigger && root.current?.contains(sceneTrigger.trigger)) {
        sceneTrigger.getTween()?.progress(1);
      }
    });
    trigger.animation?.progress(progress);
  };
  const motionState = useRef<JourneyMotion>({ progress: 0, x: 0, y: 0, visible: true });
  const reduced = useReducedMotionPreference();
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    motionState.current.progress = 0;
    motionState.current.visible = true;
    const element = root.current;
    if (!element) return;
    const earth = element.querySelector<HTMLElement>("[data-earth]");
    const map = element.querySelector<HTMLElement>("[data-map]");
    const city = element.querySelector<HTMLElement>("[data-city]");
    const arrivalRing = element.querySelector<SVGCircleElement>("[data-map] [data-arrival-ring]");
    if (earth) earth.inert = false;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    element.dataset.motion = "enhanced";
    const ctx = gsap.context(() => {
      // One renderer owns all scene visibility. Independent opacity tweens
      // previously restored the map underneath the globe on reverse scroll.
      const scene = { origin: 0, flight: 0, arrival: 0 };
      const clamp = (value: number) => Math.max(0, Math.min(1, value));
      const blend = (value: number) => { const p = clamp(value); return p * p * (3 - 2 * p); };
      const renderScene = () => {
        const focus = blend((scene.origin - .16) / .68);
        const handoff = blend((scene.origin - .62) / .35);
        const arrival = scene.arrival;
        const earthOpacity = 1 - handoff;
        const mapOpacity = handoff * (1 - blend(arrival / .8));
        motionState.current.progress = focus;
        motionState.current.visible = earthOpacity > .001;
        if (earth) {
          earth.style.opacity = String(earthOpacity);
          earth.style.visibility = earthOpacity < .001 ? "hidden" : "visible";
          earth.style.setProperty("--globe-controls", String(1 - blend(scene.origin / .36)));
          earth.style.setProperty("--earth-zoom", String(1 + focus * 4));
          earth.inert = scene.origin > .24;
          earth.setAttribute("aria-hidden", String(scene.origin > .24));
        }
        if (map) {
          map.style.opacity = String(mapOpacity);
          map.style.visibility = mapOpacity < .001 ? "hidden" : "visible";
          // Track the aircraft with a restrained camera drift. A single scene
          // model controls this alongside visibility, including reverse scroll.
          const cruise = Math.sin(Math.PI * scene.flight);
          map.style.transform = `translate3d(${(1 - scene.flight) * 24}px,${scene.flight * 22}px,0) scale(${.74 + handoff * .26 + cruise * .08 + arrival * .12})`;
        }
      };
      renderScene();
      gsap.to(scene, { origin: 1, ease: "none", onUpdate: renderScene,
        scrollTrigger: {
          trigger: "#lavasa", start: "top top", end: "bottom 12%", scrub: .75,
          onRefresh: self => { scene.origin = self.progress; renderScene(); },
        },
      });
      gsap.to(scene, { arrival: 1, ease: "none", onUpdate: renderScene,
        scrollTrigger: {
          trigger: "#mumbai", start: "top 95%", end: "top 10%", scrub: .7,
          onRefresh: self => { scene.arrival = self.progress; renderScene(); },
        },
      });
      // Mumbai belongs to its own chapter, so its whole frame rises with the
      // document. A smaller inner drift adds depth without pinning the image.
      if (city) {
        gsap.fromTo(city, { y: 90, clipPath: "inset(9% 7% 9% 7%)" }, {
          y: -48, clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: "#mumbai", start: "top bottom", end: "bottom top", scrub: .65 },
        });
        const photo = city.querySelector("img");
        if (photo) gsap.fromTo(photo, { yPercent: 5, scale: 1.16 }, {
          yPercent: -5, scale: 1.08, ease: "none",
          scrollTrigger: { trigger: "#mumbai", start: "top bottom", end: "bottom top", scrub: .65 },
        });
      }

      const route = element.querySelector<SVGPathElement>("[data-map] [data-route]");
      const airplane = element.querySelector<SVGGElement>("[data-map] [data-airplane]");
      const routes = element.querySelectorAll<SVGPathElement>("[data-map] [data-route]");
      const destination = element.querySelector<HTMLElement>("[data-destination]");
      const bank = element.querySelector<SVGGElement>("[data-map] [data-plane-bank]");
      const shadow = element.querySelector<SVGEllipseElement>("[data-map] [data-plane-shadow]");
      const scrubber = element.querySelector<HTMLInputElement>("[data-flight-scrubber]");
      const controls = element.querySelector<HTMLElement>("[data-flight-controls]");
      const inlinePlane = element.querySelector<SVGGElement>("[data-inline-map] [data-airplane]");
      const inlineBank = element.querySelector<SVGGElement>("[data-inline-map] [data-plane-bank]");
      const inlineRoutes = element.querySelectorAll<SVGPathElement>("[data-inline-map] [data-route]");
      if (route && airplane) {
        const length = route.getTotalLength();
        const renderFlight = () => {
          // Hold at departure and arrival; the middle distance accelerates and
          // settles naturally, rather than making the aircraft slide uniformly.
          const p = blend((scene.flight - .055) / .89);
          const altitude = Math.sin(Math.PI * p);
          const point = route.getPointAtLength(length * p);
          const before = route.getPointAtLength(Math.max(0, length * p - 1));
          const after = route.getPointAtLength(Math.min(length, length * p + 1));
          const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI + 90;
          airplane.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
          inlinePlane?.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
          bank?.setAttribute("transform", `rotate(${-altitude * 7}) scale(${1 + altitude * .17} ${1 - altitude * .06})`);
          inlineBank?.setAttribute("transform", `rotate(${-altitude * 7}) scale(${1 + altitude * .17} ${1 - altitude * .06})`);
          shadow?.setAttribute("transform", `translate(${altitude * 8} ${altitude * 13}) scale(${1 - altitude * .15})`);
          if (shadow) shadow.style.opacity = String(.38 - altitude * .15);
          routes.forEach(path => { path.style.strokeDashoffset = String(1 - p); });
          inlineRoutes.forEach(path => { path.style.strokeDashoffset = String(1 - p); });
          const phase = p < .12 ? "departure" : p > .9 ? "arrival" : "cruise";
          if (controls) {
            controls.dataset.phase = phase;
            controls.querySelectorAll<HTMLButtonElement>("[data-stop]").forEach(button => {
              button.setAttribute("aria-pressed", String(button.dataset.stop === phase));
            });
          }
          if (scrubber) {
            scrubber.value = String(Math.round(scene.flight * 100));
            scrubber.setAttribute("aria-valuetext", `${Math.round(p * 100)} percent of the illustrated Lavasa to Mumbai journey`);
          }
          if (destination) destination.dataset.arrived = String(p > .98);
          if (arrivalRing) {
            arrivalRing.setAttribute("r", String(24 + Math.max(0, p - .8) * 70));
            arrivalRing.style.opacity = String(.4 + p * .6);
          }
        };
        renderFlight();
        gsap.to(scene, {
          flight: 1, ease: "none", onUpdate: () => { renderFlight(); renderScene(); },
          scrollTrigger: {
            trigger: "#journey", start: "top top", end: () => window.innerWidth <= 700 ? "bottom 35%" : "bottom 82%", scrub: .7,
            onRefresh: self => { flightTrigger.current = self; scene.flight = self.progress; renderFlight(); renderScene(); },
            onUpdate: self => { flightTrigger.current = self; },
          },
        });
      }

      root.current?.querySelectorAll<HTMLElement>(`.${styles.travelChapter}`).forEach(chapter => {
        const heading = chapter.querySelector("h2");
        const details = chapter.querySelectorAll(`.${styles.body}, .${styles.routeLegend}, .${styles.venue}`);
        gsap.fromTo(heading, { y: 66 }, {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: chapter, start: "top 75%", end: "top 25%", scrub: .5 },
        });
        gsap.fromTo(details, { y: 32 }, {
          y: 0, opacity: 1, duration: .85, stagger: .1, ease: "power3.out",
          scrollTrigger: { trigger: chapter, start: "top 65%", end: "top 20%", scrub: .5 },
        });
        const photograph = chapter.querySelector(`.${styles.lavasaPhoto}`);
        if (photograph) gsap.fromTo(photograph, { y: 38 }, {
          y: -16, ease: "none",
          scrollTrigger: { trigger: photograph, start: "top bottom", end: "bottom 25%", scrub: .8 },
        });
      });
    }, root);
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
      flightTrigger.current = null;
      resize.disconnect();
      cancelAnimationFrame(refreshFrame);
      ctx.revert();
      delete element.dataset.motion;
      for (const layer of [earth, map, city]) {
        if (!layer) continue;
        layer.style.removeProperty("opacity");
        layer.style.removeProperty("visibility");
        layer.style.removeProperty("transform");
        layer.style.removeProperty("clip-path");
        layer.inert = false;
      }
      earth?.removeAttribute("aria-hidden");
      earth?.style.removeProperty("--globe-controls");
      earth?.style.removeProperty("--earth-zoom");
      if (city) gsap.set(city.querySelector("img"), { clearProps: "transform" });
      motionState.current.progress = 0;
      motionState.current.visible = true;
      // Staggered fromTo tweens can restore their initial pose on revert.
      // Clear those local reveal styles so a live preference change leaves
      // every paragraph and action fully visible.
      gsap.set(element.querySelectorAll(
        `.${styles.travelChapter} h2, .${styles.travelChapter} .${styles.body}, .${styles.routeLegend}, .${styles.venue}, .${styles.lavasaPhoto}`,
      ), { clearProps: "opacity,transform" });
      element.querySelectorAll<SVGPathElement>("[data-route]").forEach(path => path.style.removeProperty("stroke-dashoffset"));
      element.querySelectorAll<SVGGElement>("[data-airplane]").forEach(plane => plane.setAttribute("transform", "translate(294 278) rotate(-97)"));
      element.querySelectorAll("[data-plane-bank]").forEach(bank => bank.removeAttribute("transform"));
      element.querySelector("[data-map] [data-plane-shadow]")?.removeAttribute("transform");
      element.querySelector<SVGEllipseElement>("[data-map] [data-plane-shadow]")?.style.removeProperty("opacity");
      element.querySelector("[data-flight-controls]")?.removeAttribute("data-phase");
      element.querySelector("[data-destination]")?.removeAttribute("data-arrived");
      if (arrivalRing) { arrivalRing.setAttribute("r", "24"); arrivalRing.style.removeProperty("opacity"); }
      if (earth) earth.inert = false;
    };
  }, [reduced]);
  return (
    <div
      className={styles.journey}
      ref={root}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        motionState.current.x = (e.clientX - r.left) / r.width - 0.5;
        motionState.current.y = e.clientY / window.innerHeight - 0.5;
        e.currentTarget.style.setProperty(
          "--map-x",
          `${motionState.current.x * 12}px`,
        );
        e.currentTarget.style.setProperty(
          "--map-y",
          `${motionState.current.y * 8}px`,
        );
      }}
      onPointerLeave={(e) => {
        motionState.current.x = 0;
        motionState.current.y = 0;
        e.currentTarget.style.setProperty("--map-x", "0px");
        e.currentTarget.style.setProperty("--map-y", "0px");
      }}
    >
      <div className={styles.scene}>
        <div className={styles.sceneGrid} />
        <div className={styles.earth} data-earth>
          <div className={styles.globeFallback} />
          {near && <Globe motion={motionState} />}
        </div>
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
          <a className={styles.textLink} href="#journey">
            Follow the journey <span>↓</span>
          </a>
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
            <a className={styles.textLink} href="#mumbai">
              Meet our next destination <span>↓</span>
            </a>
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
          <a className={styles.textLink} href="#editions">
            See how we got here <span>↓</span>
          </a>
        </div>
      </section>
    </div>
  );
}

export function JourneyFinale() {
  return (
    <section id="next" className={styles.finale} aria-labelledby="finale-title">
      <div className={styles.finaleOrbit} aria-hidden="true" />
      <p className={styles.eyebrow}>LAVASA ROOTS. MUMBAI HORIZONS.</p>
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
