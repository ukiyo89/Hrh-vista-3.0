"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ActionLink } from "./ActionLink";
import styles from "./SiteHeader.module.css";

const LINKS = [
  { label: "Our journey", href: "/#lavasa" },
  { label: "Editions", href: "/#editions" },
  { label: "People", href: "/#people" },
  { label: "Voices", href: "/voices" },
  { label: "Partners", href: "/partners" },
  { label: "Brochure", href: "/brochure" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const resolve = (href: string) => home && href.startsWith("/#") ? href.slice(1) : href;
  const isCurrent = (href: string) =>
    pathname === href || (href === "/partners" && pathname === "/sponsors");

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 24);
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    const panel = panelRef.current;
    panel?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key !== "Tab") return;
      const links = Array.from(headerRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [])
        .filter((element) => element.tabIndex >= 0 && !element.closest("[inert]") && element.getClientRects().length > 0);
      const first = links[0];
      const last = links.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      } else if (!links.some((element) => element === document.activeElement)) {
        event.preventDefault(); (event.shiftKey ? last : first)?.focus();
      }
    };
    const media = window.matchMedia("(min-width: 1100px)");
    const resize = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", resize);
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      document.removeEventListener("keydown", keydown);
      media.removeEventListener("change", resize);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <header ref={headerRef} role={open ? "dialog" : undefined} aria-modal={open || undefined} aria-label={open ? "Site navigation" : undefined} data-lenis-prevent={open ? "" : undefined} className={[styles.header, home ? styles.home : styles.paper, scrolled ? styles.scrolled : ""].join(" ")}>
      <a href="#main-content" className={styles.skip} inert={open}>Skip to content</a>
      <div className={styles.bar}>
        <Link href={home ? "#top" : "/"} className={styles.wordmark} aria-label="HR VISTA 3.0 home" onClick={() => setOpen(false)}>
          <img className={styles.logo} src="/media/raw/logo_hr_vista.png" alt="" width={34} height={34} />
          <span>HR VISTA <span className={styles.version}>3.0</span></span>
        </Link>
        <nav className={styles.desktop} aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={resolve(link.href)}
              className={styles.navTab}
              data-ui-tone="dark"
              aria-current={isCurrent(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <ActionLink href="/brochure/HR-VISTA-3.0.pdf" download size="compact" direction="down" className={styles.join}><span className={styles.downloadFull}>Download brochure</span><span className={styles.downloadShort}><span className={styles.srOnly}>Download </span>Brochure</span></ActionLink>
          <button ref={toggleRef} className={styles.toggle} data-ui="icon" data-ui-tone="dark" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
            <span className={open ? styles.topOpen : ""} />
            <span className={open ? styles.bottomOpen : ""} />
          </button>
        </div>
      </div>
      <div className={styles.readingProgress} aria-hidden="true"><span ref={progressRef} /></div>
      {open && <>
      <button type="button" className={styles.backdrop} aria-label="Close navigation" tabIndex={-1} onClick={() => setOpen(false)} />
      <div ref={panelRef} className={styles.panel} id="mobile-navigation" data-lenis-prevent>
        <nav aria-label="Mobile">
          {LINKS.map((link, index) => <Link key={link.label} href={resolve(link.href)} data-ui="row" data-ui-tone="dark" aria-current={isCurrent(link.href) ? "page" : undefined} style={{ animationDelay: `${index * 24}ms` }} onClick={() => setOpen(false)}><span className={styles.number} aria-hidden="true">0{index + 1}</span>{link.label}<span data-ui-glyph aria-hidden="true">↗</span></Link>)}
          <ActionLink href="/brochure" className={styles.mobileJoin} onClick={() => setOpen(false)}>Explore the brochure</ActionLink>
        </nav>
        <p>21–22 November 2026 · Lavasa</p>
      </div></>}
    </header>
  );
}
