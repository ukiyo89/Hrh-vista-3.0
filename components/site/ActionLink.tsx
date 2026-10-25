import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import styles from "./ActionLink.module.css";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light";
  external?: boolean;
  direction?: "up" | "down" | "left" | "right";
  size?: "default" | "compact";
  download?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
};

/** The arrow pocket opens into an ink fill, then hands off to the next arrow. */
export function ActionLink({ href, children, variant = "dark", external = false, direction = "up", size = "default", download = false, onClick, className = "" }: ActionLinkProps) {
  const content = <>
    <span className={styles.label}>{children}</span>
    <span className={styles.icon} data-direction={direction} aria-hidden="true">
      {[0, 1].map(index => <svg key={index} viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
    </span>
    {external && <span className={styles.srOnly}> (opens in a new tab)</span>}
  </>;
  const classes = `${styles.action} ${variant === "light" ? styles.light : ""} ${size === "compact" ? styles.compact : ""} ${className}`;
  return external || download
    ? <a href={href} className={classes} download={download || undefined} onClick={onClick} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{content}</a>
    : <Link href={href} className={classes} onClick={onClick}>{content}</Link>;
}
