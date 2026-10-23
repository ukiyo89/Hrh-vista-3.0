import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ActionLink.module.css";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light";
  external?: boolean;
  direction?: "up" | "down";
  className?: string;
};

/** Shared chapter action, with a sliding fill and a continuous arrow on hover. */
export function ActionLink({ href, children, variant = "dark", external = false, direction = "up", className = "" }: ActionLinkProps) {
  const content = <>
    <span className={styles.label}>{children}</span>
    <span className={styles.icon} data-direction={direction} aria-hidden="true">
      {[0, 1].map(index => <svg key={index} viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
    </span>
    {external && <span className={styles.srOnly}> (opens in a new tab)</span>}
  </>;
  const classes = `${styles.action} ${variant === "light" ? styles.light : ""} ${className}`;
  return external
    ? <a href={href} className={classes} target="_blank" rel="noopener noreferrer">{content}</a>
    : <Link href={href} className={classes}>{content}</Link>;
}
