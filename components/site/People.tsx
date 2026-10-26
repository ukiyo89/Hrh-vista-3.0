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
  const [filter, setFilter] = useState<(typeof filters)[number]>("Everyone");
  const reduced = useReducedMotionPreference();
  const shown = people.filter(person => filter === "Everyone" || person.group === filter);

  return <section id="people" className={styles.section} aria-labelledby="people-title">
    <div id="people-directory" className={styles.directory}>
      <div className={styles.directoryHeading}><h2 id="people-title">The people<br /><em>behind it.</em></h2><ActionLink href="https://www.linkedin.com/company/cpcgchristlavasa/" external>Meet CPCG on LinkedIn</ActionLink></div>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter the people directory">{filters.map(value => <button key={value} type="button" data-ui="tab" data-ui-tone="dark" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div>
        <div className={styles.toolbarMeta}><span className={styles.count} role="status" aria-live="polite">{shown.length} people</span></div>
      </div>
      <motion.div layout={!reduced} className={styles.grid}>
        {shown.map(person => {
          const index = people.indexOf(person);
          return <motion.article layout={!reduced} key={person.name} className={styles.person} initial={reduced ? false : { y: 35 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .55, delay: Math.min(index * .045, .18) }}>
            <a href={person.linkedin} data-ui="media" data-ui-tone="dark" target="_blank" rel="noopener noreferrer" aria-label={`${person.name} on LinkedIn (opens in a new tab)`}>
              <div className={styles.personArt} aria-hidden="true">{person.portrait && <Portrait key={person.portrait} src={person.portrait} position={person.portraitPosition} />}<div className={styles.glyphTrack}><Initials value={person.initials} /><Initials value={person.initials} echo /></div><div className={styles.waveform}>{Array.from({ length: 13 }, (_, bar) => <i key={bar} style={{ "--bar": bar, "--bar-height": `${12 + ((bar * 7 + index * 3) % 24)}px` } as CSSProperties} />)}</div></div>
              <div className={styles.identity}><h3>{person.name}</h3><p>{person.role}</p><span className={styles.profile}><span className={styles.profileLabel}>LinkedIn profile</span><span className={styles.profileIcon} aria-hidden="true">{[0, 1].map(arrow => <svg key={arrow} viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>)}</span></span></div>
            </a>
          </motion.article>;
        })}
      </motion.div>
      <p className={styles.source}>Faculty and community roles reflect <a href="https://www.hrvista.live/contact" data-ui="text" data-ui-tone="dark" target="_blank" rel="noopener noreferrer">HR VISTA 2.0</a>; website credit is for 3.0. The 3.0 organising committee is yet to be confirmed.</p>
    </div>
  </section>;
}
