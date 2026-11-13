"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { feedback } from "@/lib/data/voices";
import { pastVoices, speakerProfiles, voicesArchiveImages } from "@/lib/data/voices-media";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { ArchivePerspective } from "./VoicesTeaser";
import { ActionLink } from "./ActionLink";
import styles from "./Voices.module.css";

export function Voices() {
  const root = useRef<HTMLElement>(null);
  const readerHeading = useRef<HTMLHeadingElement>(null);
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotionPreference();
  const current = feedback[selected];
  const unmatchedPortraits = pastVoices.filter(portrait => !speakerProfiles.some(profile => profile.portraitId === portrait.id));

  useEffect(() => {
    const element = root.current;
    if (!element || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const opening = gsap.timeline({ scrollTrigger: {
        trigger: "[data-voice-opening]", start: "top top", end: "bottom 25%", scrub: .55,
      } });
      opening.to("[data-opening-line='first']", { xPercent: -26, y: -35, ease: "none", duration: 1 }, 0)
        .to("[data-opening-line='last']", { xPercent: 22, y: 20, ease: "none", duration: 1 }, 0)
        .fromTo("[data-voice-aperture]", { clipPath: "inset(12% 38% 12% 38%)", y: 80 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, ease: "power2.inOut", duration: .85 }, 0)
        .fromTo("[data-photo-number]", { xPercent: 80, yPercent: -40 }, { xPercent: 0, yPercent: 0, ease: "none", duration: 1 }, 0);
      const reflection = gsap.timeline({ scrollTrigger: {
        trigger: "[data-reflection-stage]", start: "top 95%", end: "top 5%", scrub: .6,
      } });
      reflection.fromTo("[data-reflection-heading]", { x: 100 }, { x: 0, duration: 1, ease: "none" }, 0)
        .fromTo("[data-perspective-line]", { scaleX: .12 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
      if (element.querySelector("[data-quote-mark]")) {
        reflection.fromTo("[data-quote-mark]", { y: 140, x: -45 }, { y: 0, x: 0, duration: 1, ease: "none" }, 0);
      }
      gsap.utils.toArray<HTMLElement>("[data-past-voice]").forEach(card => {
        const frame = card.querySelector("[data-portrait-frame]");
        if (!frame) return;
        gsap.fromTo(frame, { clipPath: "inset(12% 0% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: card, start: "top 95%", end: "top 45%", scrub: .45 },
        });
      });
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
  const jumpToProfile = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = document.getElementById(id);
    const heading = destination?.querySelector<HTMLHeadingElement>("h3");
    if (!destination || !heading) return;
    event.preventDefault();
    // Lenis also observes anchor clicks at window level. This local seek owns
    // the jump, so prevent its second scroll from overriding the destination.
    event.stopPropagation();
    const margin = parseFloat(getComputedStyle(destination).scrollMarginTop) || 0;
    const top = Math.max(0, destination.getBoundingClientRect().top + window.scrollY - margin);
    const hash = `#${id}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    window.scrollTo({ top, behavior: "instant" });
    window.dispatchEvent(new CustomEvent("hr-vista:seek", { detail: top }));
    heading.focus({ preventScroll: true });
  };

  return <main id="main-content" ref={root} className={styles.page}>
    <section className={styles.opening} data-voice-opening aria-labelledby="voices-title">
      <h1 id="voices-title"><span data-opening-line="first">What stays</span><span data-opening-line="last"><em>with us.</em></span></h1>
      <div className={styles.openingFoot}><p>The conversations end.<br />The perspectives stay.</p><ActionLink href="#speaker-profiles" variant="light" direction="down">Explore past voices</ActionLink></div>
      <figure className={styles.archivePhoto}>
        <div className={styles.aperture} data-voice-aperture><ArchivePerspective wide images={voicesArchiveImages} /><span className={styles.photoNumber} data-photo-number aria-hidden="true">2.0</span></div>
        <figcaption>From the HR VISTA archive</figcaption>
      </figure>
    </section>

    <section id="reflections" className={styles.reflections} data-reflection-stage aria-labelledby={current ? "reflections-title" : "profiles-title"}>
      <div className={styles.perspectiveRule} aria-hidden="true"><i data-perspective-line /></div>
      {current ? <div className={styles.reader}>
        <div className={styles.readerHeading}><h2 id="reflections-title" ref={readerHeading} tabIndex={-1} data-reflection-heading>In their<br /><em>own words.</em></h2><span className={styles.readerCount}>{String(selected + 1).padStart(2, "0")} / {String(feedback.length).padStart(2, "0")}</span></div>
        <span className={styles.readerMark} data-quote-mark aria-hidden="true">“</span>
        <div className={styles.quoteContent} aria-live="polite" aria-atomic="true">
          <blockquote><p>{current.quote}</p></blockquote>
          <div className={styles.attribution}>{current.portrait && <img src={current.portrait} alt="" width={72} height={72} loading="lazy" />}<div><strong>{current.name}</strong><p>{current.role}{current.role && current.org ? " · " : ""}{current.org}</p>{current.source && <a href={current.source} data-ui="text" data-ui-tone="dark" target="_blank" rel="noopener noreferrer">Original source <span data-ui-glyph aria-hidden="true">↗</span><span className={styles.srOnly}> (opens in a new tab)</span></a>}</div></div>
        </div>
        {feedback.length > 1 && <div className={styles.readerControls}><button type="button" data-ui="icon" data-ui-tone="dark" onClick={() => readFromIndex(selected - 1)} aria-label="Previous reflection"><span data-ui-glyph aria-hidden="true">←</span></button><p>Another perspective</p><button type="button" data-ui="icon" data-ui-tone="dark" onClick={() => readFromIndex(selected + 1)} aria-label="Next reflection"><span data-ui-glyph aria-hidden="true">→</span></button></div>}
        {feedback.length > 1 && <details className={styles.voiceIndex}><summary data-ui="row" data-ui-tone="dark">Browse all {feedback.length} voices <span data-ui-glyph aria-hidden="true">+</span></summary><ol>{feedback.map((item, index) => <li key={`${item.name}-${index}`}><button type="button" data-ui="row" data-ui-tone="dark" aria-pressed={selected === index} onClick={() => readFromIndex(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.name}</strong><span>{selected === index ? "Reading" : "Read reflection"}</span></button></li>)}</ol></details>}
      </div> : null}
      <section id="speaker-profiles" className={styles.profiles} aria-labelledby="profiles-title">
        <div className={styles.profileIntroduction}>
          <div><h2 id="profiles-title" data-reflection-heading>Past <em>voices.</em></h2></div>
          <p className={styles.profileIntroCopy}>Meet the leaders and practitioners who bring their experience to the conversation.</p>
        </div>
        <details className={styles.profileDirectory}>
          <summary data-ui="row" data-ui-tone="dark">Find a speaker <span>{String(speakerProfiles.length).padStart(2, "0")} profiles <span data-ui-glyph aria-hidden="true">+</span></span></summary>
          <ol>{speakerProfiles.map((profile, index) => <li key={profile.id}><a href={`#${profile.id}`} data-ui="row" data-ui-tone="dark" onClick={event => jumpToProfile(event, profile.id)}><span>{String(index + 1).padStart(2, "0")}</span>{profile.name}<span data-ui-glyph aria-hidden="true">↘</span></a></li>)}</ol>
        </details>
        <div className={styles.profileList}>
          {speakerProfiles.map((profile, index) => {
            const portrait = pastVoices.find(image => image.id === profile.portraitId);
            return <article key={profile.id} id={profile.id} className={styles.speakerProfile} data-has-portrait={Boolean(portrait)} data-past-voice aria-labelledby={`${profile.id}-name`}>
              <div className={styles.profileNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
              {portrait && <div className={styles.profilePortrait} data-portrait-frame><img src={portrait.image} alt={profile.name} width={portrait.width} height={portrait.height} loading="lazy" decoding="async" /></div>}
              <div className={styles.profileCopy}><h3 id={`${profile.id}-name`} tabIndex={-1}>{profile.name}</h3><p>{profile.biography}</p>{profile.linkedIn && <a href={profile.linkedIn} data-ui="text" data-ui-tone="dark" target="_blank" rel="noopener noreferrer">LinkedIn <span data-ui-glyph aria-hidden="true">↗</span><span className={styles.srOnly}> for {profile.name} (opens in a new tab)</span></a>}</div>
            </article>;
          })}
        </div>
      </section>
      {unmatchedPortraits.length > 0 && <section className={styles.pastVoices} aria-labelledby="portrait-archive-title">
        <div className={styles.archiveHeading}><div><h2 id="portrait-archive-title">More from <em>HR VISTA.</em></h2></div><p>Portraits from previous conversations.</p></div>
        <div className={styles.portraitGrid}>
          {unmatchedPortraits.map(voice => <figure key={voice.id} className={styles.portraitEntry} data-past-voice>
            <div className={styles.portraitFrame} data-portrait-frame><img src={voice.image} alt={voice.alt} width={voice.width} height={voice.height} loading="lazy" decoding="async" /></div>
          </figure>)}
        </div>
      </section>}
    </section>

    <section className={styles.continue} data-voice-continue aria-labelledby="continue-title"><h2 id="continue-title"><span data-continue-word>The next</span><span data-continue-word><em>conversation.</em></span></h2><div className={styles.continueFoot}><p>HR VISTA 3.0<br />November 2026</p><ActionLink href="/#next-chapter" variant="light">See what’s taking shape</ActionLink></div></section>
  </main>;
}
