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
          aria-label="Back to homepage top"
        >
          ↑
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
            Presented by the Centre for Placement
            <br />
            and Career Guidance.
          </p>
        </div>
        <nav aria-label="Journey chapters">
          <a href="/#lavasa">Our Lavasa roots</a>
          <a href="/#journey">The journey</a>
          <a href="/#mumbai">Hello, Mumbai</a>
          <a href="/#editions">1.0 → 2.0 → 3.0</a>
        </nav>
        <nav aria-label="More about HR Vista">
          <a href="/work">The edition archive ↗</a>
          <a href="/voices">Voices from 2.0 ↗</a>
          <a href="/#people">The people behind it ↗</a>
          <a href="/sponsors">Sponsor showcase ↗</a>
          <a href="/brochure">Read the brochure ↗</a>
          <a href="/brochure/HR-VISTA-3.0.pdf" download>
            Download brochure ↓
          </a>
        </nav>
      </div>
      <div className={styles.socials}>
        {socialGroups.map(group => (
          <section key={group.id} className={styles.socialGroup} aria-labelledby={`footer-${group.id}-socials`}>
            <h2 id={`footer-${group.id}-socials`}>{group.name}</h2>
            <nav className={styles.socialLinks} aria-label={`${group.name} social media`}>
              {group.channels.map(channel => (
                <a key={channel.href} className={styles.socialLink} href={channel.href} target="_blank" rel="noopener noreferrer" aria-label={`${group.name} on ${channel.platform}, ${channel.handle} (opens in a new tab)`}>
                  <span className={styles.socialIcon}><SocialIcon platform={channel.platform} /></span>
                  <span className={styles.socialIdentity}><strong>{channel.platform}</strong><span>{channel.handle}</span></span>
                  <span className={styles.socialArrow} aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </section>
        ))}
      </div>
      <div className={styles.bottom}>
        <span>HR VISTA 3.0 · 21–22 NOVEMBER 2026</span>
      </div>
    </footer>
  );
}
