"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { feedback } from "@/lib/data/voices";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import styles from "./Voices.module.css";

export function Voices() {
  const root = useRef<HTMLElement>(null);
  const readerHeading = useRef<HTMLHeadingElement>(null);
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotionPreference();
  const current = feedback[selected];

  useEffect(() => {
    const element = root.current;
    if (!element || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const opening = gsap.timeline({ scrollTrigger: {
        trigger: "[data-voice-opening]", start: "top top", end: "bottom 25%", scrub: .55,
      } });
      opening.to("[data-opening-line='first']", { xPercent: -12, ease: "none", duration: 1 }, 0)
        .to("[data-opening-line='last']", { xPercent: 10, ease: "none", duration: 1 }, 0)
        .fromTo("[data-voice-aperture]", { clipPath: "inset(0% 27% 0% 27%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: .75 }, 0)
        .fromTo("[data-voice-aperture] img", { scale: 1.22, yPercent: 3 }, { scale: 1.04, yPercent: -3, ease: "none", duration: 1 }, 0);
      const reflection = gsap.timeline({ scrollTrigger: {
        trigger: "[data-reflection-stage]", start: "top 95%", end: "top 5%", scrub: .6,
      } });
      reflection.fromTo("[data-quote-mark]", { y: 140, x: -45 }, { y: 0, x: 0, duration: 1, ease: "none" }, 0)
        .fromTo("[data-reflection-heading]", { x: 100 }, { x: 0, duration: 1, ease: "none" }, 0)
        .fromTo("[data-perspective-line]", { scaleX: .12 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
      const roomImage = element.querySelector("[data-room-image]");
      if (roomImage) reflection.fromTo(roomImage, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" }, 0);
      gsap.fromTo("[data-continue-word]", { yPercent: 50 }, {
        yPercent: 0, stagger: .08, ease: "none",
        scrollTrigger: { trigger: "[data-voice-continue]", start: "top 95%", end: "top 40%", scrub: .5 },
      });
    }, element);
    let disposed = false;
    let frame = 0;
    const refresh = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => ScrollTrigger.refresh()); };
    const observer = new ResizeObserver(refresh);
    observer.observe(element);
    void document.fonts.ready.then(() => { if (!disposed) refresh(); });
    return () => { disposed = true; observer.disconnect(); cancelAnimationFrame(frame); context.revert(); };
  }, [reduced]);

  const choose = (index: number) => setSelected((index + feedback.length) % feedback.length);
  const readFromIndex = (index: number) => {
    choose(index);
    // Keep long indexes useful on touch and move keyboard focus to the full
    // reading surface, rather than leaving a selected quote above the screen.
    readerHeading.current?.focus({ preventScroll: true });
    readerHeading.current?.scrollIntoView({ block: "start", behavior: "instant" });
  };

  return <main id="main-content" ref={root} className={styles.page}>
    <section className={styles.opening} data-voice-opening aria-labelledby="voices-title">
      <div className={styles.topline}><span>VOICES / HR VISTA 2.0</span><span>LAVASA · NOVEMBER 2025</span></div>
      <h1 id="voices-title"><span data-opening-line="first">What stays</span><span data-opening-line="last"><em>with us.</em></span></h1>
      <div className={styles.openingFoot}><p>The conversations end.<br />The perspectives stay.</p><a href="#reflections">Into the conversation <span aria-hidden="true">↓</span></a></div>
      <figure className={styles.archivePhoto}>
        <div className={styles.aperture} data-voice-aperture><img src="/media/flickr/story-1.jpg" alt="Two speakers sharing perspectives on the HR VISTA 2.0 stage" width={1600} height={900} loading="eager" fetchPriority="high" /><span className={styles.photoNumber} aria-hidden="true">2.0</span></div>
        <figcaption><span>A shared stage. Different perspectives.</span><span>PHOTOGRAPH / HR VISTA 2.0</span></figcaption>
      </figure>
    </section>

    <section id="reflections" className={styles.reflections} data-reflection-stage aria-labelledby="reflections-title">
      <div className={styles.reflectionTop}><span>FROM THE ROOM</span><span>{feedback.length ? `${String(feedback.length).padStart(2, "0")} PERSONAL REFLECTIONS` : "A SPACE FOR PERSONAL REFLECTIONS"}</span></div>
      <div className={styles.perspectiveRule} aria-hidden="true"><i data-perspective-line /></div>
      {current ? <div className={styles.reader}>
        <div className={styles.readerHeading}><h2 id="reflections-title" ref={readerHeading} tabIndex={-1} data-reflection-heading>In their<br /><em>own words.</em></h2><span className={styles.readerCount}>{String(selected + 1).padStart(2, "0")} / {String(feedback.length).padStart(2, "0")}</span></div>
        <span className={styles.readerMark} data-quote-mark aria-hidden="true">“</span>
        <div className={styles.quoteContent} aria-live="polite" aria-atomic="true">
          <blockquote><p>{current.quote}</p></blockquote>
          <div className={styles.attribution}>{current.portrait && <img src={current.portrait} alt="" width={72} height={72} loading="lazy" />}<div><strong>{current.name}</strong><p>{current.role}{current.role && current.org ? " · " : ""}{current.org}</p>{current.source && <a href={current.source} target="_blank" rel="noopener noreferrer">Original source <span aria-hidden="true">↗</span><span className={styles.srOnly}> (opens in a new tab)</span></a>}</div></div>
        </div>
        {feedback.length > 1 && <div className={styles.readerControls}><button type="button" onClick={() => choose(selected - 1)} aria-label="Previous reflection">←</button><p>Another perspective</p><button type="button" onClick={() => choose(selected + 1)} aria-label="Next reflection">→</button></div>}
        {feedback.length > 1 && <details className={styles.voiceIndex}><summary>Browse all {feedback.length} voices <span aria-hidden="true">+</span></summary><ol>{feedback.map((item, index) => <li key={`${item.name}-${index}`}><button type="button" aria-pressed={selected === index} onClick={() => readFromIndex(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.name}</strong><span>{selected === index ? "Reading" : "Read reflection"}</span></button></li>)}</ol></details>}
      </div> : <div className={styles.awaiting}>
        <span className={styles.quoteMark} data-quote-mark aria-hidden="true">“</span>
        <div className={styles.awaitingCopy}><p className={styles.eyebrow}>THE MOMENT AFTER THE MOMENT.</p><h2 id="reflections-title" data-reflection-heading>Reflections<br /><em>coming soon.</em></h2><p>The people who were there.<br />The ideas they carried home.</p><p className={styles.note}>Personal reflections from HR VISTA 2.0 will be shared here. Until then, step back into the conversations that brought us together.</p><Link href="/work#hr-vista-2" className={styles.textLink}>Revisit the second edition <span aria-hidden="true">↗</span></Link></div>
        <figure className={styles.roomPhoto} data-room-image><img src="/media/flickr/room-3.jpg" alt="A moment from the HR VISTA 2.0 event archive" width={1000} height={1200} loading="lazy" /><figcaption>FROM THE 2.0 ARCHIVE<br />THE CONVERSATION CONTINUES.</figcaption></figure>
      </div>}
      <p className={styles.archiveNote}>From the HR VISTA 2.0 photography archive · Lavasa, November 2025.</p>
    </section>

    <section className={styles.continue} data-voice-continue aria-labelledby="continue-title"><p className={styles.eyebrow}>FROM WHAT WAS. TO WHAT’S NEXT.</p><h2 id="continue-title"><span data-continue-word>The next</span><span data-continue-word><em>conversation.</em></span></h2><div className={styles.continueFoot}><p>HR VISTA 3.0<br />November 2026 · Venue to be announced</p><Link href="/#next-chapter" className={styles.nextLink}>See what’s taking shape <span aria-hidden="true">↗</span></Link></div></section>
  </main>;
}
