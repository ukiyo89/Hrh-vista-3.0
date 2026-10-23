"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { people } from "@/lib/data/people";
import { ActionLink } from "./ActionLink";
import styles from "./People.module.css";

const filters = ["Everyone", "Faculty & leadership", "Team & community"] as const;

function Initials({ value, echo = false }: { value: string; echo?: boolean }) {
  return <span className={echo ? styles.initialEcho : styles.initialLetters}>{[...value].map((letter, index) => <span key={`${letter}-${index}`} style={{ "--letter": index } as CSSProperties}>{letter}</span>)}</span>;
}

function Portrait({ src, position }: { src: string; position?: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const image = imageRef.current;
    // A cached image can finish before hydration attaches its load handler.
    if (image?.complete) {
      setLoaded(image.naturalWidth > 0);
      setFailed(image.naturalWidth === 0);
    }
  }, [src]);
  if (failed) return null;
  return <img ref={imageRef} className={styles.portrait} data-loaded={loaded} src={src} style={position ? { objectPosition: position } : undefined} alt="" width={400} height={400} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />;
}

export function People() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Everyone");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotionPreference();
  const shown = people.filter(person => filter === "Everyone" || person.group === filter);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const observed = [...section.querySelectorAll<HTMLElement>("[data-person-signal]")];
    const visible = new Set<HTMLElement>();
    const update = () => observed.forEach(element => {
      element.dataset.active = String(visible.has(element) && !document.hidden);
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
        else visible.delete(entry.target as HTMLElement);
      });
      update();
    }, { threshold: .08 });
    observed.forEach(element => observer.observe(element));
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [filter]);

  return <section ref={root} id="people" className={styles.section} aria-labelledby="people-title" data-paused={paused || reduced}>
    <div id="people-directory" className={styles.directory}>
      <div className={styles.directoryHeading}><h2 id="people-title">The people<br /><em>behind it.</em></h2><ActionLink href="https://www.linkedin.com/company/cpcgchristlavasa/" external>Meet CPCG on LinkedIn</ActionLink></div>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter the people directory">{filters.map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div>
        <div className={styles.toolbarMeta}><span className={styles.count} role="status" aria-live="polite">{shown.length} people</span><button className={styles.motionToggle} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)} disabled={reduced}>{reduced ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}<span aria-hidden="true">{paused || reduced ? "▶" : "Ⅱ"}</span></button></div>
      </div>
      <motion.div layout={!reduced} className={styles.grid}>
        {shown.map(person => {
          const index = people.indexOf(person);
          return <motion.article layout={!reduced} key={person.name} className={styles.person} data-person-signal style={{ "--signal-delay": `${index * -.45}s` } as CSSProperties} initial={reduced ? false : { y: 35 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .55, delay: Math.min(index * .045, .18) }}>
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on LinkedIn (opens in a new tab)`}>
              <div className={styles.personArt} aria-hidden="true">{person.portrait && <Portrait key={person.portrait} src={person.portrait} position={person.portraitPosition} />}<div className={styles.glyphTrack}><Initials value={person.initials} /><Initials value={person.initials} echo /></div><div className={styles.waveform}>{Array.from({ length: 13 }, (_, bar) => <i key={bar} style={{ "--bar": bar, "--bar-height": `${12 + ((bar * 7 + index * 3) % 24)}px` } as CSSProperties} />)}</div></div>
              <div className={styles.identity}><h3>{person.name}</h3><p>{person.role}</p><span className={styles.profile}>LinkedIn profile <b aria-hidden="true">↗</b></span></div>
            </a>
          </motion.article>;
        })}
      </motion.div>
      <p className={styles.source}>Faculty and community roles reflect <a href="https://www.hrvista.live/contact" target="_blank" rel="noopener noreferrer">HR VISTA 2.0</a>; website credit is for 3.0. The 3.0 organising committee is yet to be confirmed.</p>
    </div>
  </section>;
}
