"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ActionLink } from "./ActionLink";
import styles from "./Sponsors.module.css";

const concepts = [
  { name: "Centre stage", label: "START A CONVERSATION", copy: "A bold brand presence at the centre of the HR VISTA story.", color: "#c4d7ff", turn: "-13deg" },
  { name: "In the conversation", label: "MAKE A CONNECTION", copy: "An identity woven into the moments where people and ideas meet.", color: "#e7d7ad", turn: "7deg" },
  { name: "Beyond the event", label: "KEEP THE MOMENTUM", copy: "A lasting place in the community’s next chapter.", color: "#b4d8ca", turn: "-5deg" },
];

function BrandStage({ name = "YOUR BRAND", mode = 0, compact = false }: { name?: string; mode?: number; compact?: boolean }) {
  return <div className={`${styles.stage} ${compact ? styles.compact : ""}`} style={{ "--stage-accent": concepts[mode].color, "--stage-turn": concepts[mode].turn } as CSSProperties} aria-hidden="true">
    <div className={styles.stageFloor} />
    <div className={styles.stageAssembly}>
      <div className={`${styles.stagePanel} ${styles.backPanel}`}><span>PEOPLE.</span><span>POSSIBILITY.</span></div>
      <div className={`${styles.stagePanel} ${styles.midPanel}`}><span>HR VISTA</span><strong>3.0</strong></div>
      <div className={`${styles.stagePanel} ${styles.frontPanel}`}><strong data-long={name.trim().length > 16}><span>{name.trim() || "YOUR BRAND"}</span><i>↗</i></strong></div>
    </div>
  </div>;
}

const stairCards = [
  { label: "COMMUNITY PARTNER", foot: "BEING NETWORKS · 60,000+ HR MEMBERS", background: "#c4d7f2", ink: "#172b48" },
  { label: "HOST & ORGANISER", foot: "CENTRE FOR PLACEMENT & CAREER GUIDANCE", background: "#152b47", ink: "#dce8f9" },
  { label: "OFFICIAL 3.0 THEME", foot: "HR VISTA 3.0 · 21–22 NOVEMBER 2026", background: "#d9dfce", ink: "#233a38" },
  { label: "AWARDS FELICITATION", foot: "30 UNDER 30 · 22 NOVEMBER · LAVASA", background: "#2d51ca", ink: "#e5eeff" },
  { label: "THE LAVASA EXPERIENCE", foot: "KEYNOTES · THE 2030 CHALLENGE · GALA DINNER", background: "#eae6db", ink: "#293c51" },
];

function SponsorStaircase({ name = "", paused = false, home = false }: { name?: string; paused?: boolean; home?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const brand = name.trim() || "BeingHR (Being Networks)";
  const isDefaultBrand = !name.trim();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = root.current;
      if (!section) return;
      const run = section.querySelector<HTMLElement>("[data-stair-run]");
      const cards = section.querySelectorAll<HTMLElement>("[data-sponsor-step]");
      const sequence = gsap.timeline({ scrollTrigger: {
        trigger: run, start: "top top", end: "bottom bottom", scrub: .65, invalidateOnRefresh: true,
      } });
      cards.forEach((card, i) => {
        sequence.fromTo(card, {
          xPercent: -50, yPercent: -50,
          x: () => window.innerWidth * (window.innerWidth < 700 ? -.1 + i * .13 : -.1 + i * .17),
          y: () => window.innerHeight * (.5 + i * .22),
          rotateY: -68, rotateZ: -8 + i * 3, scale: .9,
        }, {
          x: () => window.innerWidth * (window.innerWidth < 700 ? -.37 + i * .13 : -.45 + i * .17),
          y: () => window.innerHeight * (-.83 + i * .23),
          rotateY: 68, rotateZ: 7 - i * 3, scale: 1,
          duration: 1.25, ease: "none",
        }, i * .09);
      });
      sequence.fromTo(section.querySelector("[data-stair-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 1.61, ease: "none" }, 0);
      timeline.current = sequence;
      if (pausedRef.current) sequence.scrollTrigger?.disable(false);
      const heading = section.querySelector("h2");
      gsap.fromTo(heading, { y: 50, opacity: .4 }, { y: 0, opacity: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 88%", toggleActions: "play none none reverse" } });
      return () => { timeline.current = null; };
    });
    return () => media.revert();
  }, []);
  useEffect(() => {
    const trigger = timeline.current?.scrollTrigger;
    if (paused) trigger?.disable(false);
    else trigger?.enable(false, false);
  }, [paused]);
  return <section ref={root} id={home ? "sponsors" : "sponsor-staircase"} className={styles.staircase} aria-labelledby={home ? "sponsor-teaser-title" : "staircase-title"}>
    <div className={styles.stairHeading}>
      <div><p className={styles.eyebrow}>06 / PARTNERS &amp; ECOSYSTEM</p><h2 id={home ? "sponsor-teaser-title" : "staircase-title"}>BeingHR ×<br /><em>CHRIST Lavasa.</em></h2></div>
      <div className={styles.stairHeadingAside}><p>Being Networks &amp; BeingHR.<br />CPCG, CHRIST Pune Lavasa.<br />One shared HR ecosystem.</p><span className={styles.stairScroll}>SCROLL TO EXPLORE THE PARTNERSHIP <i>↓</i></span></div>
    </div>
    <div className={styles.stairRun} data-stair-run>
      <div className={styles.stairScene}>
        <div className={styles.stairSceneTop}><span>HR VISTA 3.0 × BEINGHR</span><span>05 PILLARS / LAVASA · NOV 2026</span></div>
        <div className={styles.stairGuide} aria-hidden="true" />
        {stairCards.map((card, i) => <article key={card.label} className={styles.stairCard} data-sponsor-step={i} style={{ "--step": i, "--card-bg": card.background, "--card-ink": card.ink } as CSSProperties}>
          <div className={styles.stairCardTop}><span>{card.label}</span><span>0{i + 1}</span></div>
          <div className={styles.stairIdentity}>
            {i === 0 ? <><span className={styles.collabName}>HR VISTA <i>×</i></span><strong data-long={brand.length > 15} data-cpcg={isDefaultBrand || undefined}>{brand}</strong></> :
              i === 1 ? <><span className={styles.collabName}>HOST CAMPUS</span><strong data-long>CHRIST Lavasa · CPCG</strong></> :
              i === 2 ? <><strong className={styles.stairEdition}>3.0<span>↗</span></strong><span className={styles.cardSub}>When Machines Think · Human Potential &amp; AI.</span></> :
              i === 3 ? <><strong>30 Under 30<br />Awards.</strong><span className={styles.cardSub}>HR Leadership Excellence Felicitation · 22 Nov 2026</span></> : <><span className={styles.collabName}>TWO DAYS IN LAVASA</span><strong data-long>Keynotes, The 2030 Challenge &amp; Gala Dinner<i className={styles.cardArrow}>↗</i></strong></>}
          </div>
          <div className={styles.stairCardFoot}><span>{card.foot}</span><span>↗</span></div>
        </article>)}
        <div className={styles.stairSceneFoot}><div><p>COMMUNITY PARTNER: BEINGHR (BEING NETWORKS) · HOST: CHRIST LAVASA CPCG</p><div className={styles.stairProgress}><span data-stair-progress /></div></div><Link href={home ? "/partners" : "#brand-preview"} className={styles.stairLink}>{home ? "Explore partners" : "Try your brand"}<span>↗</span></Link></div>
      </div>
    </div>
  </section>;
}

export function SponsorTeaser() {
  return <SponsorStaircase home />;
}

export function Sponsors() {
  const [mode, setMode] = useState(0);
  const [name, setName] = useState("");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotionPreference();
  return <main id="main-content" className={styles.page} data-paused={paused || !!reduced}>
    <section className={styles.hero} aria-labelledby="sponsor-title">
      <div className={styles.heroTop}><p className={styles.eyebrow}>HR VISTA 3.0 / PARTNERS &amp; SPONSORS</p><span className={styles.previewTag}>BEINGHR × CHRIST LAVASA</span></div>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}><h1 id="sponsor-title">Built with<br /><em>leaders.</em><span className={styles.headArrow} aria-hidden="true">↗</span></h1><p>Curated by CHRIST University Lavasa (CPCG) with Community Partner BeingHR and Being Networks—connecting 500+ HR leaders, CHROs and 30 Under 30 changemakers.</p><ActionLink className={styles.cta} href="#partners-confirmed" direction="down">Meet our partners</ActionLink></div>
        <BrandStage name={name || "BEINGHR × CHRIST"} mode={mode} />
      </div>
      <div className={styles.heroFoot}><span>HR VISTA 3.0 · 21—22 NOVEMBER 2026 · LAVASA</span><p>When Machines Think · What Makes Human Potential More Valuable?</p><button type="button" data-ui="control" data-ui-tone="dark" aria-pressed={paused} onClick={() => setPaused(!paused)} disabled={!!reduced}>{reduced ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}<span data-ui-glyph aria-hidden="true">{paused || reduced ? "▶" : "Ⅱ"}</span></button></div>
    </section>
    <div className={styles.ribbon} aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>HR VISTA 3.0 × BEINGHR <i>✳</i> WHEN MACHINES THINK <i>✳</i></span>)}</div></div>
    <SponsorStaircase name={name} paused={paused} />
    <section id="brand-preview" className={styles.preview} aria-labelledby="preview-title">
      <div className={styles.previewHeading}><div><h2 id="preview-title">Your brand.<br /><em>On the 3.0 stage.</em></h2></div><p>Preview how partner organisations appear alongside HR VISTA 3.0 and BeingHR at CHRIST Lavasa.</p></div>
      <div className={styles.previewGrid}>
        <div className={styles.editor}>
          <label htmlFor="brand-name">ORGANISATION / PARTNER NAME</label><input id="brand-name" value={name} onChange={event => setName(event.target.value)} maxLength={24} placeholder="BeingHR" autoComplete="organization" aria-describedby="brand-help" /><p id="brand-help">Interactive visual preview for prospective sponsors and partners.</p>
          <div className={styles.sceneOptions} role="group" aria-label="Choose a sponsor showcase scene">{concepts.map((concept, i) => <button key={concept.name} type="button" data-ui="row" aria-pressed={mode === i} onClick={() => setMode(i)}><span>0{i + 1}</span><strong>{concept.name}</strong><span data-ui-glyph aria-hidden="true">{mode === i ? "↗" : "+"}</span></button>)}</div>
          <div className={styles.sceneDescription} aria-live="polite"><span>{concepts[mode].label}</span><p>{concepts[mode].copy}</p></div>
        </div>
        <div className={styles.previewCanvas}><BrandStage name={name || "BEINGHR"} mode={mode} /></div>
      </div>
      <p className={styles.disclaimer}>For sponsorship tiers, exhibition booths and branding opportunities at Lavasa, connect directly with the CPCG &amp; Being Networks teams.</p>
    </section>
    <section id="partners-confirmed" className={styles.future} aria-labelledby="future-sponsors-title">
      <motion.div initial={reduced ? false : { y: 35 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
        <h2 id="future-sponsors-title">Confirmed<br /><em>partners.</em></h2>
        <p>HR VISTA 3.0 is presented in association with Being Networks and India’s largest HR community.</p>
        <div className={styles.partnersGrid}>
          <article className={styles.partnerCard}>
            <span className={styles.partnerBadge}>Community Partner &amp; Co-Organiser</span>
            <h3>BeingHR · Being Networks</h3>
            <p>Connecting 60,000+ HR professionals across 200+ events—powering HR VISTA 3.0 speaker curation, delegates, and the Being Networks Night in Lavasa.</p>
            <a href="https://www.beingnetworks.com/" target="_blank" rel="noopener noreferrer" data-ui="text" data-ui-tone="dark">Visit beingnetworks.com <span data-ui-glyph aria-hidden="true">↗</span></a>
          </article>
          <article className={styles.partnerCard}>
            <span className={styles.partnerBadge}>Host Institution &amp; Organiser</span>
            <h3>CHRIST University, Pune Lavasa · CPCG</h3>
            <p>The Analytical Hub of CHRIST (Deemed to be University), welcoming CHROs, industry leaders and academics for two days of dialogue.</p>
            <a href="https://www.linkedin.com/company/cpcgchristlavasa/" target="_blank" rel="noopener noreferrer" data-ui="text" data-ui-tone="dark">CPCG on LinkedIn <span data-ui-glyph aria-hidden="true">↗</span></a>
          </article>
          <article className={styles.partnerCard}>
            <span className={styles.partnerBadge}>Awards Stage · 22 Nov 2026</span>
            <h3>HR Leadership Excellence Awards</h3>
            <p>Felicitating India’s 30 Under 30 HR changemakers live on the HR VISTA 3.0 stage in Lavasa after independent jury evaluation.</p>
            <a href="https://www.beingnetworks.com/awards" target="_blank" rel="noopener noreferrer" data-ui="text" data-ui-tone="dark">View 2026 Awards <span data-ui-glyph aria-hidden="true">↗</span></a>
          </article>
        </div>
        <ActionLink className={styles.cta} href="mailto:hrvista.lavasa@christuniversity.in?subject=HR%20VISTA%203.0%20%E2%80%94%20Partnership%20enquiry">Become an HR VISTA 3.0 sponsor</ActionLink>
        <p className={styles.email}>hrvista.lavasa@christuniversity.in · +91 98922 82705</p>
      </motion.div>
    </section>
  </main>;
}
