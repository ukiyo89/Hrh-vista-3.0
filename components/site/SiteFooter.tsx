import { Globe } from "lucide-react";
import { socialGroups, type SocialChannel } from "@/lib/data/socials";
import styles from "./StoryFooter.module.css";

function SocialIcon({ platform }: { platform: SocialChannel["platform"] }) {
  return platform === "Instagram" ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.2 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM3.8 9h2.8v11H3.8V9Zm5.4 0h2.7v1.5c.7-1.1 1.8-1.8 3.5-1.8 3.2 0 4.3 2 4.3 5V20h-2.8v-5.6c0-1.8-.3-3.1-2.1-3.1-1.8 0-2.8 1.3-2.8 3.2V20H9.2V9Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <a href="/" className={styles.wordmark}>
          HR VISTA <span>3.0</span>
        </a>
        <a
          href="/#top"
          className={styles.back}
          data-ui="icon"
          aria-label="Back to homepage top"
        >
          <span data-ui-glyph aria-hidden="true">↑</span>
        </a>
      </div>
      <div className={styles.grid}>
        <div className={styles.institution}>
          <img
            src="/media/raw/logo_christ_lavasa.png"
            alt="CHRIST (Deemed to be University), Pune Lavasa Campus"
            width={280}
            height={100}
          />
          <p>
            Presented by the Centre for Placement and Career Guidance,
            <br />
            in association with Community Partner{" "}
            <a
              data-ui="text"
              href="https://www.beingnetworks.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inlinePartnerLink}
            >
              BeingHR ↗
            </a>
            .
          </p>
        </div>
        <nav className={styles.linkColumn} aria-labelledby="footer-explore">
          <h2 id="footer-explore" className={styles.columnHeading}>Explore</h2>
          <a data-ui="text" href="/#lavasa">Lavasa</a>
          <a data-ui="text" href="/#editions">Editions</a>
          <a data-ui="text" href="/#voices">Voices</a>
          <a data-ui="text" href="/#next-chapter">What’s next</a>
        </nav>
        <nav className={styles.linkColumn} aria-labelledby="footer-discover">
          <h2 id="footer-discover" className={styles.columnHeading}>Discover</h2>
          <a data-ui="text" href="/work">Archive</a>
          <a data-ui="text" href="/#people">People</a>
          <a data-ui="text" href="/voices">Voices</a>
          <a data-ui="text" href="/partners">Partners</a>
          <a data-ui="text" href="/brochure">Brochure</a>
          <a data-ui="text" href="https://www.beingnetworks.com/" target="_blank" rel="noopener noreferrer">
            BeingHR <span data-ui-glyph aria-hidden="true">↗</span>
          </a>
          <a data-ui="text" href="/brochure/HR-VISTA-3.0.pdf" download>
            Download PDF <span data-ui-glyph aria-hidden="true">↓</span>
          </a>
        </nav>
        <div className={styles.socials}>
          <h2 className={styles.columnHeading}>Connect</h2>
          <section className={styles.socialGroup} aria-labelledby="footer-beinghr-partner">
            <h3 id="footer-beinghr-partner">Community Partner</h3>
            <nav className={styles.socialLinks} aria-label="BeingHR official website">
              <a
                className={styles.socialLink}
                data-ui="text"
                href="https://www.beingnetworks.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BeingHR official website at beingnetworks.com (opens in a new tab)"
              >
                <span className={styles.socialIcon}><Globe size={16} strokeWidth={1.6} aria-hidden="true" /></span>
                <span>BeingHR</span>
                <span className={styles.socialArrow} data-ui-glyph aria-hidden="true">↗</span>
              </a>
            </nav>
          </section>
          {socialGroups.map(group => (
            <section key={group.id} className={styles.socialGroup} aria-labelledby={`footer-${group.id}-socials`}>
              <h3 id={`footer-${group.id}-socials`}>{group.name}</h3>
              <nav className={styles.socialLinks} aria-label={`${group.name} social media`}>
                {group.channels.map(channel => (
                  <a key={channel.href} className={styles.socialLink} data-ui="text" href={channel.href} target="_blank" rel="noopener noreferrer" aria-label={`${group.name} on ${channel.platform}, ${channel.handle} (opens in a new tab)`}>
                    <span className={styles.socialIcon}><SocialIcon platform={channel.platform} /></span>
                    <span>{channel.platform}</span>
                    <span className={styles.socialArrow} data-ui-glyph aria-hidden="true">↗</span>
                  </a>
                ))}
              </nav>
            </section>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>
        <span>HR VISTA 3.0 · 21–22 NOVEMBER 2026 · LAVASA · WITH COMMUNITY PARTNER BEINGHR</span>
      </div>
    </footer>
  );
}
