"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { feedback } from "@/lib/data/voices";
import styles from "./VoicesTeaser.module.css";

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
      sequence.fromTo("[data-voices-word]", { xPercent: -12, opacity: .35 }, { xPercent: 0, opacity: 1, stagger: .15, ease: "none", duration: 1 }, 0);
      sequence.fromTo("[data-voices-photo]", { clipPath: "inset(16% 18% 16% 18%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", duration: 1.2 }, 0);
      sequence.fromTo("[data-voices-photo] img", { scale: 1.2, yPercent: 5 }, { scale: 1.05, yPercent: -2, ease: "none", duration: 1.5 }, 0);
      sequence.fromTo("[data-voices-mark]", { y: 90 }, { y: -30, ease: "none", duration: 1.5 }, 0);
    }, root);
    return () => context.revert();
  }, [reduced]);
  return <section ref={root} className={styles.section} aria-labelledby="voices-teaser-title">
    <div className={styles.topline}><span>FROM THE ROOM / HR VISTA 2.0</span><span>{feedback.length ? "IN THEIR OWN WORDS" : "PERSONAL REFLECTIONS, COMING SOON"}</span></div>
    <div className={styles.layout}>
      <div className={styles.copy}>
        <h2 id="voices-teaser-title"><span data-voices-word>What stays</span><span data-voices-word><em>with you.</em></span></h2>
        <p>The conversations end.<br />The perspectives stay.</p>
        <p className={styles.description}>A space for the HR professionals who experienced 2.0 to share what they took away.</p>
        <Link href="/voices" className={styles.link}>Explore voices from 2.0 <span aria-hidden="true">↗</span></Link>
      </div>
      <Link href="/voices" className={styles.art} aria-label="Explore the Voices from HR VISTA 2.0 page">
        <span className={styles.quote} data-voices-mark aria-hidden="true">“</span>
        <figure className={styles.photo} data-voices-photo><img src="/media/flickr/story-1.jpg" alt="Two speakers sharing perspectives at HR VISTA 2.0" width={1600} height={900} loading="lazy" /><figcaption>HR VISTA 2.0 / FROM THE ARCHIVE</figcaption></figure>
        <div className={styles.artFoot}><span>DIFFERENT VOICES.<br />A SHARED EXPERIENCE.</span><span className={styles.number} aria-hidden="true">2.0</span></div>
      </Link>
    </div>
  </section>;
}
