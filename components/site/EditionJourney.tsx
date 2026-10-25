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
    title: "The first spark.",
    lines: ["The first", "spark."],
    nav: "The spark",
    copy: "A meeting of minds in the hills. Around 50 HR delegates came together for conversations, mentorship and a shared vision of work reimagined.",
    image: "/media/flickr/raw/hrvista1_feb21.jpg",
    alt: "HR VISTA 1.0 delegates gathered in the Lavasa amphitheatre",
    caption: "The community takes shape · HR VISTA 1.0",
    href: "/work#hr-vista-1",
    label: "Explore the first edition",
  },
  {
    number: "2.0",
    kicker: "November 2025 · Lavasa",
    title: "The conversation grows.",
    lines: ["The conversation", "grows."],
    nav: "The conversation",
    copy: "Leadership in a post-AI world. Four panels, two round tables, and a community finding new connections—on the stage and beyond it.",
    image: "/media/flickr/story-1.jpg",
    alt: "Two speakers in conversation on stage at HR VISTA 2.0",
    caption: "Perspectives in conversation · HR VISTA 2.0",
    href: "/work#hr-vista-2",
    label: "Revisit the second edition",
  },
  {
    number: "3.0",
    kicker: "November 2026 · Mumbai · Venue to be announced",
    title: "A wider horizon.",
    lines: ["A wider", "horizon."],
    nav: "The horizon",
    copy: "Our most ambitious chapter yet. A new gathering is taking shape in Mumbai for November 2026. The same purpose, imagined at a new scale. Venue to be announced.",
    image: "/media/flickr/editions-4.jpg",
    alt: "The HR VISTA 2.0 community whose story continues into the planned third edition",
    caption: "Our community, looking ahead · Photograph from HR VISTA 2.0",
    href: "/brochure",
    label: "Discover the vision for 3.0",
  },
];

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

      element.querySelectorAll<HTMLElement>("[data-edition]").forEach((article, index) => {
        const number = article.querySelector("[data-number]");
        const photograph = article.querySelector("[data-photo-reveal]");
        const image = article.querySelector("[data-photo-image]");
        const type = article.querySelectorAll("[data-edition-line]");
        const rule = article.querySelector("[data-edition-rule]");

        // The chapter grows from a narrow photographic aperture into a full
        // archive sheet. Every stage follows native scroll in both directions.
        gsap.fromTo(number, { xPercent: index === 1 ? 28 : -28, yPercent: 12 }, {
          yPercent: -8,
          xPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: article, start: "top bottom", end: "top 20%", scrub: 0.6 },
        });
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
        gsap.fromTo(type, { x: (lineIndex: number) => (lineIndex === 0 ? -1 : 1) * Math.min(window.innerWidth * .12, 160), y: 30 }, {
          x: 0,
          y: 0,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: article, start: "top 88%", end: "top 15%", scrub: 0.5 },
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
          <h2 id="editions-heading"><span data-header-line>Every chapter.</span><span data-header-line><em>More possibility.</em></span></h2>
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
                  <a href={edition.href} className={styles.photoFrame} data-ui="media" data-ui-tone="dark" aria-label={edition.label}>
                    <img data-photo-image src={edition.image} alt={edition.alt} width={1600} height={900} loading="lazy" decoding="async" />
                    <span className={styles.photoArrow} data-ui-glyph aria-hidden="true">↗</span>
                  </a>
                </div>
                <figcaption>{edition.caption}</figcaption>
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
