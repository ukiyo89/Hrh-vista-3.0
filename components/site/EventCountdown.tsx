"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { event, getEventCountdown } from "@/lib/event";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import styles from "./EventCountdown.module.css";

const units = ["days", "hours", "minutes", "seconds"] as const;

export function EventCountdown() {
  const root = useRef<HTMLElement>(null);
  const [remaining, setRemaining] = useState<ReturnType<typeof getEventCountdown> | null>(null);
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    let timer: number | undefined;
    let visible = true;
    const sync = () => {
      window.clearTimeout(timer);
      if (document.hidden || !visible) return;
      setRemaining(getEventCountdown(Date.now()));
      // Recompute from wall time; a throttled tab never accumulates drift.
      timer = window.setTimeout(sync, 1000 - Date.now() % 1000 + 10);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { rootMargin: "150px" });
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!root.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const sequence = gsap.timeline({ scrollTrigger: {
        trigger: root.current, start: "top 95%", end: "top 20%", scrub: .6,
      } });
      sequence.fromTo("[data-clock-title]", { y: 54 }, { y: 0, duration: 1, ease: "power2.out" }, 0);
      sequence.fromTo("[data-clock-cell]", { y: 64, opacity: .35 }, { y: 0, opacity: 1, stagger: .1, duration: 1, ease: "power2.out" }, .12);
      sequence.fromTo("[data-clock-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "none" }, 0);
    }, root);
    return () => context.revert();
  }, [reduced]);

  const phase = remaining?.phase ?? "upcoming";
  return <section ref={root} id="countdown" className={styles.section} aria-labelledby="countdown-title">
    <div className={styles.topline}><span>THE NEXT CONVERSATION</span><span>HR VISTA / 03</span></div>
    <div className={styles.heading}>
      <h2 id="countdown-title" data-clock-title>{phase === "live" ? <>The conversation<br /><em>is happening.</em></> : phase === "ended" ? <>A chapter<br /><em>to remember.</em></> : <>A date for<br /><em>what’s next.</em></>}</h2>
      <div className={styles.date}><span className={styles.dateMark} aria-hidden="true">↗</span><p><time dateTime="2026-11-21">21</time>—<time dateTime="2026-11-22">22 November 2026</time></p><span>{event.venue}</span></div>
    </div>
    <div className={styles.clock} role="timer" aria-live="off" aria-label={phase === "live" ? "HR VISTA 3.0 event dates are here" : phase === "ended" ? "HR VISTA 3.0 countdown has ended" : remaining ? `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds until 21 November 2026, India Standard Time` : "Countdown to 21 November 2026, India Standard Time"}>
      {units.map((unit, index) => <div key={unit} className={styles.cell} data-clock-cell aria-hidden="true">
        <span className={styles.value}><span key={remaining?.[unit] ?? "pending"} className={unit === "seconds" ? styles.second : undefined}>{remaining ? String(remaining[unit]).padStart(2, "0") : "––"}</span></span>
        <span className={styles.unit}><span>0{index + 1}</span>{unit}</span>
      </div>)}
    </div>
    <div className={styles.rule} aria-hidden="true"><span data-clock-rule /></div>
    <div className={styles.foot}><p><i aria-hidden="true" />{phase === "live" ? "21–22 NOVEMBER · HR VISTA DAYS" : phase === "ended" ? "HR VISTA 3.0 · 21–22 NOVEMBER 2026" : "COUNTING TO 21 NOVEMBER · 00:00 IST"}</p><a href="/hr-vista-2026.ics" download>Save the dates <span aria-hidden="true">↓</span></a></div>
    <noscript><p className={styles.noScript}>HR VISTA 3.0 takes place on {event.dates}. Enable JavaScript for the live countdown.</p></noscript>
  </section>;
}
