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
const conversations = [
  { label: "People", title: "The minds behind the movement.", body: "Students, educators and industry voices. Different experiences, brought into the same conversation." },
  { label: "Ideas", title: "A conversation that moves us forward.", body: "Fresh perspectives on leadership, technology and the changing world of work. Ideas made stronger by exchange." },
  { label: "Possibilities", title: "What happens when we come together.", body: "New connections. Shared questions. A wider perspective on what the future of work could become." },
];

/** An abstract conversation diagram, never a geographic route. */
function ConnectionField({ active }: { active: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 900 900" className={styles.connectionDrawing} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glow`}><stop stopColor="#477dff" stopOpacity=".34" /><stop offset="1" stopColor="#477dff" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#6d91ce" stopOpacity=".1" /><stop offset=".65" stopColor="#9bbdff" /><stop offset="1" stopColor="#eff5ff" /></linearGradient>
      </defs>
      <circle cx="510" cy="445" r="380" fill={`url(#${id}-glow)`} />
      <g className={styles.fieldGrid}>
        {[180, 270, 360, 450, 540, 630, 720].map(n => <path key={n} d={`M80 ${n}H820M${n} 80V820`} />)}
        <circle cx="510" cy="445" r="310" /><circle cx="510" cy="445" r="215" /><path d="M70 445H850M510 65V825" />
      </g>
      <g data-orbits className={styles.orbits}>
        {[0, 1, 2, 3, 4, 5].map(n => <ellipse key={n} cx="510" cy="445" rx={105 + n * 40} ry={215 + n * 13} transform={`rotate(${-52 + n * 22} 510 445)`} />)}
      </g>
      <g className={styles.connectionPaths}>
        {["M120 240C290 50 680 170 510 445", "M105 540C165 770 650 770 510 445", "M755 200C900 400 745 650 510 445"].map((d, i) => (
          <g key={d} data-selected={active === i}><path d={d} className={styles.pathGuide} /><path d={d} data-connection-path pathLength="1" stroke={`url(#${id}-line)`} /></g>
        ))}
      </g>
      <g className={styles.fieldNodes}>
        {[[120, 240], [105, 540], [755, 200]].map(([x, y], i) => (
          <g key={i} data-field-node data-selected={active === i}><circle cx={x} cy={y} r="19" /><circle cx={x} cy={y} r="4" className={styles.nodeCore} /><text x={x + (i === 2 ? -30 : 30)} y={y + 5} textAnchor={i === 2 ? "end" : "start"}>{conversations[i].label.toUpperCase()}</text></g>
        ))}
      </g>
      <g data-field-core className={styles.fieldCore}>
        <circle cx="510" cy="445" r="77" /><circle cx="510" cy="445" r="90" className={styles.coreRing} /><text x="510" y="462" textAnchor="middle">3.0</text><text x="510" y="563" textAnchor="middle" className={styles.coreCaption}>A SHARED HORIZON</text>
      </g>
      <g className={styles.coordinateMarks}><path d="M65 115V65H115M785 65H835V115M65 785V835H115M785 835H835V785" /><text x="70" y="55">HR VISTA / CONNECTION STUDY</text></g>
    </svg>
  );
}

export function Journey() {
  const root = useRef<HTMLDivElement>(null);
  const motionState = useRef<JourneyMotion>({ progress: 0, x: 0, y: 0, visible: true });
  const reduced = useReducedMotionPreference();
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
    }, { rootMargin: "600px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const earth = el.querySelector<HTMLElement>("[data-earth]");
    motionState.current = { progress: 0, x: 0, y: 0, visible: true };
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    el.dataset.motion = "enhanced";
    const clamp = gsap.utils.clamp(0, 1);
    const smooth = (n: number) => { const p = clamp(n); return p * p * (3 - 2 * p); };
    const ctx = gsap.context(() => {
      const scene = { origin: 0, connection: 0, horizon: 0 };
      const field = el.querySelector<HTMLElement>("[data-connection-field]");
      const paths = el.querySelectorAll<SVGPathElement>("[data-connection-field] [data-connection-path]");
      const orbits = el.querySelector<SVGGElement>("[data-connection-field] [data-orbits]");
      const core = el.querySelector<SVGGElement>("[data-connection-field] [data-field-core]");
      const nodes = el.querySelector<SVGGElement>("[data-connection-field] ." + styles.fieldNodes);
      const progress = el.querySelector<HTMLElement>("[data-journey-progress]");
      const readout = el.querySelector<HTMLElement>("[data-journey-readout]");
      const render = () => {
        const handoff = smooth((scene.origin - .42) / .5);
        const horizon = smooth(scene.horizon);
        motionState.current.progress = smooth(scene.origin) * .72;
        motionState.current.visible = handoff < .995;
        if (earth) {
          earth.style.opacity = String(1 - handoff);
          earth.style.visibility = handoff > .995 ? "hidden" : "visible";
          earth.style.setProperty("--globe-controls", String(1 - smooth(scene.origin / .28)));
          earth.style.setProperty("--earth-zoom", String(1 + scene.origin * 2.8));
          earth.inert = scene.origin > .16;
          earth.setAttribute("aria-hidden", String(scene.origin > .16));
        }
        if (field) {
          field.style.opacity = String(handoff * (1 - horizon * .15));
          field.style.transform = `translate3d(${horizon * -6}%,0,0) scale(${.73 + handoff * .27 + horizon * .3})`;
        }
        paths.forEach((path, i) => { path.style.strokeDashoffset = String(1 - clamp(scene.connection * 1.4 - i * .16)); });
        orbits?.setAttribute("transform", `translate(510 445) rotate(${-38 + scene.connection * 58 + horizon * 42}) scale(${.8 + handoff * .2 + horizon * .38}) translate(-510 -445)`);
        if (core) core.style.opacity = String(.15 + smooth(scene.connection) * .85);
        if (nodes) nodes.style.opacity = String(1 - horizon * .85);
        if (progress) progress.style.transform = `scaleX(${scene.connection})`;
        if (readout) readout.textContent = `${Math.round(scene.connection * 100).toString().padStart(2, "0")}`;
      };
      render();
      gsap.to(scene, { origin: 1, ease: "none", onUpdate: render, scrollTrigger: { trigger: "#lavasa", start: "top top", end: "bottom 35%", scrub: .65, onRefresh: self => { scene.origin = self.progress; render(); } } });
      gsap.to(scene, { connection: 1, ease: "none", onUpdate: render, scrollTrigger: { trigger: "#journey", start: "top 40%", end: "bottom 85%", scrub: .8, onRefresh: self => { scene.connection = self.progress; render(); } } });
      gsap.to(scene, { horizon: 1, ease: "none", onUpdate: render, scrollTrigger: { trigger: "#next-chapter", start: "top 90%", end: "top 10%", scrub: .8, onRefresh: self => { scene.horizon = self.progress; render(); } } });
      el.querySelectorAll<HTMLElement>("[data-chapter-copy]").forEach(copy => {
        gsap.fromTo(copy.querySelectorAll("[data-reveal]"), { y: 58 }, { y: 0, stagger: .08, ease: "power2.out", scrollTrigger: { trigger: copy, start: "top 95%", end: "top 30%", scrub: .65 } });
      });
      gsap.fromTo("[data-campus-photo] img", { scale: 1.2, yPercent: 7 }, { scale: 1, yPercent: -4, ease: "none", scrollTrigger: { trigger: "[data-campus-photo]", start: "top bottom", end: "bottom top", scrub: .8 } });
      // On phones the connection drawing scrolls above the copy, keeping the
      // reading area clear while retaining a reversible route-drawing reveal.
      gsap.fromTo(`.${styles.staticField} [data-connection-path]`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: .12, ease: "none", scrollTrigger: { trigger: "#journey", start: "top 90%", end: "top 15%", scrub: .6 } });
      gsap.fromTo("[data-chapter-number]", { yPercent: 25 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: "#next-chapter", start: "top bottom", end: "bottom top", scrub: 1 } });
    }, el);
    let disposed = false;
    let frame = 0;
    const refresh = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => ScrollTrigger.refresh()); };
    void document.fonts.ready.then(() => { if (!disposed) refresh(); });
    const observer = new ResizeObserver(refresh);
    observer.observe(el);
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      ctx.revert();
      delete el.dataset.motion;
      el.querySelectorAll<HTMLElement>("[data-earth], [data-connection-field], [data-field-core], [data-journey-progress], [data-field-node], [data-reveal], [data-campus-photo] img, [data-chapter-number]").forEach(node => { node.style.removeProperty("opacity"); node.style.removeProperty("visibility"); node.style.removeProperty("transform"); });
      el.querySelectorAll<SVGPathElement>("[data-connection-path]").forEach(path => path.style.removeProperty("stroke-dashoffset"));
      el.querySelector("[data-connection-field] [data-orbits]")?.removeAttribute("transform");
      el.querySelector<SVGGElement>("[data-connection-field] ." + styles.fieldNodes)?.style.removeProperty("opacity");
      if (earth) { earth.inert = false; earth.removeAttribute("aria-hidden"); earth.style.removeProperty("--globe-controls"); earth.style.removeProperty("--earth-zoom"); }
      motionState.current = { progress: 0, x: 0, y: 0, visible: true };
    };
  }, [reduced]);

  return (
    <div className={styles.journey} ref={root}
      onPointerMove={event => {
        if (event.pointerType !== "mouse" || reduced) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        motionState.current.x = (event.clientX - bounds.left) / bounds.width - .5;
        motionState.current.y = event.clientY / window.innerHeight - .5;
        event.currentTarget.style.setProperty("--field-x", `${motionState.current.x * 16}px`);
        event.currentTarget.style.setProperty("--field-y", `${motionState.current.y * 12}px`);
      }} onPointerLeave={event => {
        motionState.current.x = 0; motionState.current.y = 0;
        event.currentTarget.style.setProperty("--field-x", "0px"); event.currentTarget.style.setProperty("--field-y", "0px");
      }}>
      <div className={styles.scene}><div className={styles.sceneGrid} /><div className={styles.earth} data-earth><div className={styles.globeFallback} />{near && <Globe motion={motionState} />}</div><div className={styles.connectionField} data-connection-field><ConnectionField active={active} /></div><div className={styles.sceneShade} /><span className={styles.sceneIndex} aria-hidden="true">THE STORY / HR VISTA</span></div>
      <section id="lavasa" className={`${styles.travelChapter} ${styles.origin}`} aria-labelledby="lavasa-title">
        <div className={styles.chapterCopy} data-chapter-copy>
          <p className={styles.eyebrow} data-reveal><span>01 / THE ORIGIN</span><span>LAVASA, PUNE</span></p>
          <h2 id="lavasa-title" data-reveal>Big ideas.<br />Quiet <em>beginnings.</em></h2>
          <p className={styles.body} data-reveal>Before the bigger stage, there was a meeting of minds in the hills. A campus. A community. A conversation that kept growing.</p>
          <figure className={styles.lavasaPhoto} data-campus-photo><div><img src="/media/flickr/story-4.jpg" alt="Lavasa lake and the surrounding Sahyadri hills" width={1024} height={576} loading="lazy" decoding="async" /></div><figcaption>ROOTED IN LAVASA <span>CHRIST UNIVERSITY ↗</span></figcaption></figure>
          <a className={styles.textLink} href="#journey">Follow the conversation <span>↓</span></a>
        </div>
      </section>
      <section id="journey" className={`${styles.travelChapter} ${styles.connectionChapter}`} aria-labelledby="journey-title">
        <div className={styles.connectionStage}>
          <div className={styles.staticField}><ConnectionField active={active} /></div>
          <div className={styles.chapterCopy} data-chapter-copy>
            <p className={styles.eyebrow} data-reveal><span className={styles.signalDot} />02 / THE CONNECTION</p>
            <h2 id="journey-title" data-reveal>Ideas travel.<br /><em>Connections grow.</em></h2>
            <p className={styles.body} data-reveal>A conversation begins with one perspective. It grows when we bring more people into it.</p>
            <div className={styles.conversationControls} role="group" aria-label="Explore the connections">{conversations.map((conversation, i) => <button key={conversation.label} type="button" aria-pressed={active === i} aria-controls="conversation-detail" onClick={() => setActive(i)}><span>0{i + 1}</span>{conversation.label}<i aria-hidden="true">↗</i></button>)}</div>
            <div id="conversation-detail" className={styles.conversationDetail} aria-live="polite" aria-atomic="true"><h3>{conversations[active].title}</h3><p>{conversations[active].body}</p></div>
            <div className={styles.progressReadout} aria-hidden="true"><div><span>BUILDING A SHARED HORIZON</span><span><b data-journey-readout>100</b> / 100</span></div><div className={styles.progressRule}><i data-journey-progress /></div></div>
            <a className={styles.textLink} href="#next-chapter">The next chapter <span>↓</span></a>
          </div>
        </div>
      </section>
      <section id="next-chapter" className={`${styles.travelChapter} ${styles.nextChapter}`} aria-labelledby="next-chapter-title">
        <div className={styles.chapterNumber} data-chapter-number aria-hidden="true">3.0</div>
        <div className={styles.chapterCopy} data-chapter-copy>
          <p className={styles.eyebrow} data-reveal>03 / A WIDER HORIZON</p>
          <h2 id="next-chapter-title" data-reveal>Same roots.<br /><em>New possibilities.</em></h2>
          <p className={styles.body} data-reveal>The next chapter of HR VISTA brings our community together around the people, ideas and questions shaping the future of work.</p>
          <div className={styles.venue} data-reveal><span>{content.hero.dates}</span><strong>Venue to be announced.</strong><p>The next setting is still taking shape. The conversation is already moving forward.</p></div>
          <a className={styles.textLink} href="#editions">See how we got here <span>↓</span></a>
        </div>
      </section>
    </div>
  );
}

export function JourneyFinale() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotionPreference();
  useEffect(() => {
    if (reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-finale-ring]", { scale: .65, rotate: -18 }, { scale: 1.15, rotate: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.fromTo("h2", { y: 85 }, { y: 0, ease: "power2.out", scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 25%", scrub: .7 } });
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <section id="next" ref={root} className={styles.finale} aria-labelledby="finale-title">
      <div className={styles.finaleOrbit} data-finale-ring aria-hidden="true"><i /><i /><i /></div>
      <p className={styles.eyebrow}>ROOTED IN LAVASA. OPEN TO WHAT’S NEXT.</p>
      <h2 id="finale-title">The future of work.<br /><em>Closer than ever.</em></h2>
      <p>Keynote conversations. Leadership panels. New connections.<br />Discover what’s ahead at HR VISTA 3.0.</p>
      <div className={styles.finaleActions}><a className={styles.button} href={PDF} download>Download brochure <span>↓</span></a><a className={styles.textLink} href="/brochure">Read online <span>↗</span></a></div>
      <div className={styles.finaleMeta}><span>{content.hero.dates}</span><span>VENUE TO BE ANNOUNCED</span><span>HR VISTA 3.0</span></div>
    </section>
  );
}
