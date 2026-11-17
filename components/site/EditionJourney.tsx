"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import styles from "./EditionJourney.module.css";

const editions = [
  {
    number: "1.0",
    kicker: "February 2025 · Lavasa",
    title: "Work Reimagined: HR for the Future",
    lines: ["Work Reimagined:", "HR for the Future"],
    nav: "Work Reimagined",
    copy: "A meeting of minds in the hills. Around 50 HR delegates came together for conversations, mentorship and a shared vision of work reimagined.",
    image: "/media/flickr/raw/hrvista1_feb21.jpg",
    alt: "HR VISTA 1.0 delegates gathered in the Lavasa amphitheatre",
    href: "/work#hr-vista-1",
    label: "Explore the first edition",
  },
  {
    number: "2.0",
    kicker: "November 2025 · Lavasa",
    title: "Human Future — Redefining Leadership in the Post-AI World",
    lines: ["Human Future —", "Redefining Leadership in the Post-AI World"],
    nav: "Human Future",
    copy: "Leadership in a post-AI world. Four panels, two round tables, and a community finding new connections—on the stage and beyond it.",
    image: "/media/flickr/story-1.jpg",
    alt: "Two speakers in conversation on stage at HR VISTA 2.0",
    href: "/work#hr-vista-2",
    label: "Revisit the second edition",
  },
  {
    number: "3.0",
    kicker: "21–22 November 2026 · Lavasa",
    title: "When Machines Think.",
    lines: ["When Machines", "Think."],
    nav: "When Machines Think",
    copy: "Evolution of Human Potential, Professional Values and the Future of Work. Co-hosted with Community Partner BeingHR (Being Networks) across two days of leadership keynotes, The 2030 Organisation Challenge, the 30 Under 30 HR Leadership Awards Felicitation, gala dinner and Being Networks Night.",
    image: "/media/flickr/editions-4.jpg",
    alt: "The HR VISTA 2.0 community whose story continues into HR VISTA 3.0 at CHRIST Lavasa",
    href: "/brochure",
    label: "Explore HR VISTA 3.0 brochure",
  },
];

const themePillars = [
  {
    code: "01",
    title: "Evolution of Human Potential",
    summary: "Judgment, empathy, adaptability, and creative agency as intelligence scales across every function.",
  },
  {
    code: "02",
    title: "Professional Values",
    summary: "Integrity, ethical stewardship, fairness, and human accountability at the core of AI-era workplaces.",
  },
  {
    code: "03",
    title: "Future of Work: When Machines Think",
    summary: "Designing human–machine collaboration, leadership capability, and culture for 2030 and beyond.",
  },
] as const;

export function EditionJourney() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const articles = Array.from(element.querySelectorAll<HTMLElement>("[data-edition]"));
    let frame = 0;
    let disposed = false;
    const update = () => {
      frame = 0;
      const reference = window.innerHeight * 0.45;
      let current = 0;
      articles.forEach((article, index) => {
        if (article.getBoundingClientRect().top <= reference) current = index;
      });
      setActive((previous) => previous === current ? previous : current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Viewport-height geometry keeps the active chapter stable on short,
    // wide screens; IntersectionObserver percentage margins use root width.
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.fromTo("[data-header-line]", { y: 32, opacity: 0.4 }, {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: "." + styles.header, start: "top 90%", end: "top 35%", scrub: 0.55 },
      });

      gsap.fromTo("[data-timeline-progress]", { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: "." + styles.story, start: "top 45%", end: "bottom 60%", scrub: 0.3 },
      });

      element.querySelectorAll<HTMLElement>("[data-edition]").forEach((article) => {
        const photograph = article.querySelector("[data-photo-reveal]");
        const image = article.querySelector("[data-photo-image]");
        const rule = article.querySelector("[data-edition-rule]");

        gsap.fromTo(photograph, {
          clipPath: "inset(8% 38% 8% 38%)",
        }, {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: photograph, start: "top 92%", end: "top 25%", scrub: 0.5 },
        });
        gsap.fromTo(image, { scale: 1.2, yPercent: 4 }, {
          scale: 1.04,
          yPercent: -2,
          ease: "none",
          scrollTrigger: { trigger: photograph, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
        gsap.fromTo(rule, { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: article, start: "top 80%", end: "top 25%", scrub: 0.4 },
        });
      });
    }, element);

    let frame = 0;
    let disposed = false;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const resize = new ResizeObserver(refresh);
    resize.observe(element);
    void document.fonts.ready.then(() => { if (!disposed) refresh(); });

    return () => {
      disposed = true;
      resize.disconnect();
      cancelAnimationFrame(frame);
      context.revert();
      gsap.set(element.querySelectorAll(
        "[data-header-line], [data-timeline-progress], [data-number], [data-photo-reveal], [data-photo-image], [data-edition-line], [data-edition-rule]",
      ), { clearProps: "transform,opacity,clipPath" });
    };
  }, [reduced]);

  return (
    <section id="editions" ref={root} className={styles.editions} aria-labelledby="editions-heading">
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h2 id="editions-heading"><span data-header-line>When machines think.</span><span data-header-line><em>Human potential evolves.</em></span></h2>
        </div>
        <div className={styles.themePillars} aria-label="HR VISTA 3.0 central theme pillars">
          {themePillars.map((pillar) => (
            <div key={pillar.code} className={styles.pillarItem}>
              <h3>{pillar.title}</h3>
              <p>{pillar.summary}</p>
            </div>
          ))}
        </div>
      </header>

      <nav className={styles.timeline} aria-label="Edition timeline">
        {editions.map((edition, index) => (
          <a key={edition.number} href={`#edition-${index + 1}`} data-ui="row" aria-current={active === index ? "step" : undefined}>
            <span className={styles.navNumber}>{edition.number}</span>
            <span className={styles.navText}>{edition.nav}</span>
            <span className={styles.navDot} aria-hidden="true" />
          </a>
        ))}
        <div className={styles.progressTrack} aria-hidden="true"><i data-timeline-progress /></div>
      </nav>

      <div className={styles.story}>
        {editions.map((edition, index) => (
          <article id={`edition-${index + 1}`} key={edition.number} className={styles.edition} data-edition={index} aria-labelledby={`edition-title-${index + 1}`}>
            <div className={styles.editionMeta}>
              <p>{edition.kicker}</p>
              <i data-edition-rule aria-hidden="true" />
            </div>

            <div className={styles.editionLayout}>
              <div className={styles.editionInfo}>
                <div className={styles.editionMark} aria-hidden="true">
                  <span data-number className={styles.editionNumber}>{edition.number.charAt(0)}<span>.0</span></span>
                </div>
                <h3 id={`edition-title-${index + 1}`} aria-label={edition.title}>
                  {edition.lines.map((line) => <span key={line} data-edition-line aria-hidden="true">{line}</span>)}
                </h3>
              </div>

              <figure className={styles.editionPhoto}>
                <div className={styles.photoReveal} data-photo-reveal>
                  <div className={styles.photoFrame}>
                    <img data-photo-image src={edition.image} alt={edition.alt} width={1600} height={900} loading="lazy" decoding="async" />
                  </div>
                </div>
              </figure>
              <div className={styles.editionDetails}>
                <p className={styles.copy}>{edition.copy}</p>
                <a href={edition.href} className={styles.textLink} data-ui="text">{edition.label}<span data-ui-glyph aria-hidden="true">↗</span></a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
