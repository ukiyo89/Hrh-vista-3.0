"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { people, type Person } from "@/lib/data/people";
import { cpcgMembers, committeeHeads } from "@/lib/data/cpcg-members";
import { ActionLink } from "./ActionLink";
import actionStyles from "./ActionLink.module.css";
import styles from "./People.module.css";

const filters = ["Everyone", "CPCG · Lavasa", "CPCG · Pune City"] as const;
const faculty = people.filter(person => person.group === "Faculty & leadership");

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

function PersonCard({ person, index, reduced }: { person: Person; index: number; reduced: boolean }) {
  const href = person.linkedin ?? `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${person.name} CHRIST University`)}`;
  const linkLabel = person.linkedin ? "LinkedIn profile" : "Find on LinkedIn";
  return <motion.article layout={!reduced} className={styles.person} data-member-name={person.name} initial={reduced ? false : { y: 24 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .4, delay: Math.min(index * .035, .14) }}>
    <a className={styles.personCard} href={href} data-ui="media" data-ui-tone="dark" target="_blank" rel="noopener noreferrer" aria-label={`${person.name}: ${linkLabel} (opens in a new tab)`}>
      <div className={styles.personArt} aria-hidden="true">{person.portrait && <Portrait key={person.portrait} src={person.portrait} position={person.portraitPosition} />}<div className={styles.glyphTrack}><Initials value={person.initials} /><Initials value={person.initials} echo /></div><div className={styles.waveform}>{Array.from({ length: 13 }, (_, bar) => <i key={bar} style={{ "--bar": bar, "--bar-height": `${12 + ((bar * 7 + index * 3) % 24)}px` } as CSSProperties} />)}</div></div>
      <div className={styles.identity}><h4>{person.name}</h4><p>{person.role}</p><span className={styles.profile}><span className={styles.profileLabel}>{linkLabel}</span><span className={styles.profileIcon} aria-hidden="true">{[0, 1].map(arrow => <svg key={arrow} viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>)}</span></span></div>
    </a>
  </motion.article>;
}

export function People() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Everyone");
  const reduced = useReducedMotionPreference();
  const shown = cpcgMembers.filter(person => filter === "Everyone" || person.group === filter);

  return <section id="people" className={styles.section} aria-labelledby="people-title">
    <div className={styles.directory}>
      <div className={styles.directoryHeading}><h2 id="people-title">The people<br /><em>behind it.</em></h2><ActionLink href="https://www.linkedin.com/company/cpcgchristlavasa/" external>Meet CPCG on LinkedIn</ActionLink></div>
      <div data-people-preview>
        <div className={styles.groupHeading}><h3>Faculty</h3><span>{faculty.length.toString().padStart(2, "0")}</span></div>
        <div className={styles.grid}>{faculty.map((person, index) => <PersonCard key={person.name} person={person} index={index} reduced={reduced} />)}</div>
        <div className={styles.groupHeading}><h3>CPCG leadership</h3><span>{committeeHeads.length.toString().padStart(2, "0")}</span></div>
        <div className={styles.grid}>{committeeHeads.map((person, index) => <PersonCard key={person.name} person={person} index={index} reduced={reduced} />)}</div>
      </div>
      <details id="cpcg-members" className={styles.roster} onToggle={event => {
        if (event.currentTarget.open) return;
        const element = event.currentTarget;
        const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
        const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - margin);
        window.scrollTo({ top, behavior: "instant" });
        window.dispatchEvent(new CustomEvent("hr-vista:seek", { detail: top }));
      }}>
        <summary className={`${actionStyles.action} ${styles.rosterToggle}`} aria-controls="all-cpcg-members">
          <span className={styles.rosterStack} aria-hidden="true"><i>SW</i><i>AM</i><i>RR</i></span>
          <span className={styles.rosterLabel}><span className={styles.closedLabel}>Meet all members</span><span className={styles.openLabel}>Close member list</span></span>
          <span className={styles.rosterCount}>{cpcgMembers.length}</span>
          <span className={`${actionStyles.icon} ${styles.rosterIcon}`} aria-hidden="true">{[0, 1].map(icon => <svg key={icon} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>)}</span>
        </summary>
        <div id="all-cpcg-members" className={styles.allMembers}>
          <h3 className={styles.allMembersTitle}>All CPCG members.</h3>
          <div className={styles.toolbar}>
            <div className={styles.filters} role="group" aria-label="Filter CPCG members by campus">{filters.map(value => <button key={value} type="button" data-ui="tab" data-ui-tone="dark" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}</div>
            <span className={styles.count} role="status" aria-live="polite">{shown.length} members</span>
          </div>
          <motion.div layout={!reduced} className={styles.grid}>{shown.map((person, index) => <PersonCard key={person.name} person={person} index={index} reduced={reduced} />)}</motion.div>
        </div>
      </details>
      <p className={styles.source}>Committee roles follow the supplied CPCG core list. Faculty credits reflect <a href="https://www.hrvista.live/contact" data-ui="text" data-ui-tone="dark" target="_blank" rel="noopener noreferrer">HR VISTA 2.0</a>. “Find on LinkedIn” opens a name search where a profile is unconfirmed. Portraits appear only where matched; other members are shown with initials.</p>
    </div>
  </section>;
}
