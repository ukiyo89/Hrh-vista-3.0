"use client";

import { ActionLink } from "./ActionLink";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import styles from "./VoicesTeaser.module.css";

const perspectives = [
  { src: "/media/flickr/story-1.jpg", alt: "Two speakers sharing perspectives on the HR VISTA 2.0 stage" },
  { src: "/media/flickr/room-3.jpg", alt: "Members of the HR VISTA 2.0 community gathered in the amphitheatre" },
  { src: "/media/flickr/editions-4.jpg", alt: "The HR VISTA 2.0 community gathered for a photograph" },
];

/** The archive is an image interaction, independent of the pending quotes. */
export function ArchivePerspective({ wide = false, teaserReveal = false, images = perspectives }: { wide?: boolean; teaserReveal?: boolean; images?: readonly { src: string; alt: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLDivElement>(null);
  const grab = useRef<{ x: number; id: number } | null>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotionPreference();
  const hintId = useId();

  useEffect(() => {
    if (!root.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const reveal = gsap.timeline({ scrollTrigger: {
        trigger: picture.current, start: "top 95%", end: "top 20%", scrub: .45,
      } });
      reveal.fromTo("[data-archive-shutter]", { scaleY: 1 }, { scaleY: 0, stagger: .12, duration: .65, ease: "power2.inOut" }, 0)
        .fromTo("[data-archive-visual]", { scale: 1.24, yPercent: 6 }, { scale: 1, yPercent: 0, duration: 1, ease: "none" }, 0);
    }, root);
    return () => context.revert();
  }, [reduced]);

  const change = (direction: number) => {
    if (root.current) root.current.dataset.direction = direction < 0 ? "previous" : "next";
    setActive(previous => (previous + direction + images.length) % images.length);
  };
  const resetCrop = () => {
    picture.current?.style.setProperty("--crop-x", "0px");
    picture.current?.style.setProperty("--crop-y", "0px");
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    grab.current = { x: event.clientX, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = grab.current ? Math.max(-30, Math.min(30, (event.clientX - grab.current.x) * .15)) : ((event.clientX - rect.left) / rect.width - .5) * 20;
    event.currentTarget.style.setProperty("--crop-x", `${x}px`);
    event.currentTarget.style.setProperty("--crop-y", `${((event.clientY - rect.top) / rect.height - .5) * 12}px`);
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    const start = grab.current;
    if (start && Math.abs(event.clientX - start.x) > 35) change(event.clientX < start.x ? 1 : -1);
    grab.current = null;
    event.currentTarget.dataset.dragging = "false";
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    resetCrop();
  };

  return <div ref={root} className={`${styles.perspective} ${wide ? styles.wide : ""}`} role="group" aria-roledescription="carousel" aria-label="Photographs from HR VISTA 2.0">
    <div ref={picture} className={styles.perspectivePicture} data-ui="media" data-ui-tone="dark" data-voices-photo={teaserReveal ? "" : undefined} tabIndex={0} role="group" aria-label={images[active].alt} aria-describedby={hintId}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { grab.current = null; if (picture.current) picture.current.dataset.dragging = "false"; resetCrop(); }} onPointerLeave={() => { if (!grab.current) resetCrop(); }}
      onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); change(event.key === "ArrowLeft" ? -1 : 1); } }}>
      <div className={styles.archiveVisual} data-archive-visual><div className={styles.cropLayer}>{images.map((image, index) => <div key={image.src} className={styles.perspectiveSlide} data-active={active === index} aria-hidden={active !== index}><img src={image.src} alt="" width={1600} height={900} loading={wide && index === 0 ? "eager" : "lazy"} fetchPriority={wide && index === 0 ? "high" : "auto"} draggable={false} /></div>)}</div></div>
      <div className={styles.shutters} aria-hidden="true">{[0, 1, 2].map(index => <i key={index} data-archive-shutter />)}</div>
      <span className={styles.srOnly} id={hintId}>Drag, swipe, or use the left and right arrow keys to explore the photographs.</span>
    </div>
    <div className={styles.perspectiveControls}><span className={styles.srOnly} aria-live="polite" aria-atomic="true">Photograph {active + 1} of {images.length}: {images[active].alt}</span><div><button type="button" data-ui="icon" data-ui-tone={wide ? "dark" : undefined} onClick={() => change(-1)} aria-label="Previous archive photograph"><span data-ui-glyph aria-hidden="true">←</span></button><button type="button" data-ui="icon" data-ui-tone={wide ? "dark" : undefined} onClick={() => change(1)} aria-label="Next archive photograph"><span data-ui-glyph aria-hidden="true">→</span></button></div></div>
  </div>;
}

export function VoicesTeaser() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotionPreference();
  useEffect(() => {
    if (!root.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const sequence = gsap.timeline({ scrollTrigger: {
        trigger: root.current, start: "top 90%", end: "bottom 55%", scrub: .7,
      } });
      sequence.fromTo("[data-voices-word]", { xPercent: (index: number) => index === 0 ? -24 : 24 }, { xPercent: 0, stagger: .12, ease: "power2.out", duration: 1 }, 0);
      sequence.fromTo("[data-voices-photo]", { clipPath: "inset(16% 32% 16% 5%)", xPercent: 15 }, { clipPath: "inset(0% 0% 0% 0%)", xPercent: 0, ease: "none", duration: 1.2 }, .1);
      sequence.fromTo("[data-quote-left]", { x: -120, y: 130, scale: 1.6 }, { x: 0, y: 0, scale: 1, ease: "none", duration: 1.2 }, 0);
      sequence.fromTo("[data-quote-right]", { x: 120, y: -80, scale: 1.6 }, { x: 0, y: 0, scale: 1, ease: "none", duration: 1.2 }, 0);
      sequence.fromTo("[data-voices-number]", { xPercent: -100 }, { xPercent: 0, ease: "none", duration: 1.2 }, .15);
    }, root);
    return () => context.revert();
  }, [reduced]);
  return <section ref={root} className={styles.section} aria-labelledby="voices-teaser-title">
    <div className={styles.layout}>
      <div className={styles.copy}>
        <h2 id="voices-teaser-title"><span data-voices-word>What stays</span><span data-voices-word><em>with you.</em></span></h2>
        <p>Perspectives from the people<br />who experienced HR VISTA 2.0.</p>
        <ActionLink href="/voices" variant="light" className={styles.link}>Explore the voices</ActionLink>
      </div>
      <div className={styles.art}>
        <span className={styles.quote} aria-hidden="true"><i data-quote-left>“</i><i data-quote-right>“</i></span>
        <div className={styles.photo}><ArchivePerspective teaserReveal /></div>
        <div className={styles.artFoot}><span className={styles.number} data-voices-number aria-hidden="true">2.0</span></div>
      </div>
    </div>
  </section>;
}
