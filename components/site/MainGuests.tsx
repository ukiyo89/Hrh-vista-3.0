"use client";

import { motion } from "framer-motion";
import { ExternalLink, Users } from "lucide-react";
import { content } from "@/lib/data/content";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { ActionLink } from "./ActionLink";
import styles from "./MainGuests.module.css";

export function MainGuests() {
  const reduced = useReducedMotionPreference();
  const { vista30 } = content;

  return (
    <section id="guests" className={styles.section} aria-labelledby="main-guests-title">
      <div className={styles.inner}>
        <div className={styles.headingRow}>
          <div className={styles.heading}>
            <p className={styles.edition}>HR VISTA 3.0 · {vista30.themeTitle}</p>
            <motion.h2
              id="main-guests-title"
              initial={reduced ? false : { y: 24 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              When Machines
              <br />
              <em>Think.</em>
            </motion.h2>
          </div>

          <div className={styles.themeSummary}>
            <motion.div
              className={styles.rule}
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0.25 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <p className={styles.centralQuestion}>{vista30.themeSubtitle}</p>
            <p className={styles.partnerLine}>
              Organised with{" "}
              <a
                href={vista30.communityPartnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inlineLink}
              >
                {vista30.communityPartner} <ExternalLink size={13} aria-hidden="true" />
              </a>
              {" · "}21–22 November 2026 at CHRIST University, Lavasa
            </p>
            <div className={styles.ctaRow}>
              <ActionLink href={vista30.eventPageUrl} external variant="light" size="compact">
                Register on Being Networks
              </ActionLink>
            </div>
          </div>
        </div>

        {/* Confirmed HR VISTA 3.0 Speakers */}
        <div className={styles.block}>
          <div className={styles.blockHeader}>
            <span className={styles.blockEyebrow}>
              <Users size={14} aria-hidden="true" /> Guest Speakers · {vista30.speakers.length} Confirmed Leaders
            </span>
            <h3>Industry &amp; HR leaders taking the stage</h3>
          </div>

          <div className={styles.speakersGrid} data-testid="speakers-grid">
            {vista30.speakers.map((speaker, idx) => (
              <motion.article
                key={speaker.name}
                className={styles.speakerCard}
                data-speaker-card
                initial={reduced ? false : { y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: 0.4, delay: Math.min((idx % 4) * 0.04, 0.14) }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.roleTag}>{speaker.role}</span>
                  <span className={styles.cardIndex}>{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <div className={styles.photoFrame}>
                  <img
                    src={speaker.portrait}
                    alt={speaker.name}
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className={styles.speakerPhoto}
                  />
                </div>
                <h4 className={styles.speakerName}>{speaker.name}</h4>
                <p className={styles.speakerDesignation}>
                  <em>{speaker.designation}</em>
                </p>
                {speaker.organisation && (
                  <p className={styles.speakerOrganisation}>{speaker.organisation}</p>
                )}
                {speaker.topic && (
                  <p className={styles.speakerTopic}>“{speaker.topic}”</p>
                )}
                {speaker.linkedin ? (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkedinLink}
                    data-ui="text"
                    data-ui-tone="dark"
                    aria-label={`LinkedIn profile of ${speaker.name} (opens in a new tab)`}
                  >
                    LinkedIn <span data-ui-glyph aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className={styles.linkedinUnavailable}>LinkedIn unavailable</span>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
