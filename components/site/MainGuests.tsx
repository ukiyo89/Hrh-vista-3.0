"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Calendar, ExternalLink, MapPin, Sparkles, Users } from "lucide-react";
import { content } from "@/lib/data/content";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import { ActionLink } from "./ActionLink";
import styles from "./MainGuests.module.css";

export function MainGuests() {
  const reduced = useReducedMotionPreference();
  const [activeDay, setActiveDay] = useState(0);
  const { vista30 } = content;
  const currentDay = vista30.agenda[activeDay] ?? vista30.agenda[0];

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
              <Users size={14} aria-hidden="true" /> Confirmed Speakers · Lineup Expanding
            </span>
            <h3>Industry &amp; HR leaders taking the stage</h3>
          </div>

          <div className={styles.speakersGrid}>
            {vista30.speakers.map((speaker, idx) => (
              <motion.article
                key={speaker.name}
                className={styles.speakerCard}
                initial={reduced ? false : { y: 20, opacity: 0.6 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: Math.min(idx * 0.06, 0.24) }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.roleTag}>{speaker.role}</span>
                  <span className={styles.cardIndex}>0{idx + 1}</span>
                </div>
                <h4 className={styles.speakerName}>{speaker.name}</h4>
                <p className={styles.speakerMeta}>
                  {speaker.designation} · <strong>{speaker.organisation}</strong>
                </p>
                <p className={styles.speakerTopic}>“{speaker.topic}”</p>
                {speaker.linkedin && (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkedinLink}
                    data-ui="text"
                    data-ui-tone="dark"
                  >
                    LinkedIn profile <span data-ui-glyph aria-hidden="true">↗</span>
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </div>

        {/* Two-Day Agenda & 30 Under 30 Awards Felicitation */}
        <div className={styles.programmeGrid}>
          <div className={styles.agendaPanel}>
            <div className={styles.agendaHeader}>
              <div>
                <span className={styles.blockEyebrow}>
                  <Calendar size={14} aria-hidden="true" /> Two-Day Schedule
                </span>
                <h3>The Lavasa programme</h3>
              </div>
              <div className={styles.dayTabs} role="tablist" aria-label="Select event day">
                {vista30.agenda.map((day, idx) => (
                  <button
                    key={day.dayLabel}
                    type="button"
                    role="tab"
                    data-ui="tab"
                    data-ui-tone="dark"
                    aria-selected={activeDay === idx}
                    aria-pressed={activeDay === idx}
                    onClick={() => setActiveDay(idx)}
                  >
                    {day.dayLabel}
                  </button>
                ))}
              </div>
            </div>

            <p className={styles.daySub}>{currentDay.dateLabel}</p>

            <ol className={styles.sessionList}>
              {currentDay.sessions.map((session) => (
                <li key={`${currentDay.dayLabel}-${session.time}-${session.title}`} className={styles.sessionRow}>
                  <span className={styles.sessionTime}>{session.time}</span>
                  <span className={styles.sessionTitle}>{session.title}</span>
                </li>
              ))}
            </ol>
          </div>

          <aside className={styles.highlightsStack}>
            <div className={styles.awardsCard}>
              <span className={styles.awardsBadge}>
                <Award size={14} aria-hidden="true" /> {vista30.awardsHighlight.badge}
              </span>
              <h4>{vista30.awardsHighlight.title}</h4>
              <p className={styles.awardsMeta}>
                <MapPin size={13} aria-hidden="true" /> {vista30.awardsHighlight.location} ·{" "}
                {vista30.awardsHighlight.date}
              </p>
              <p className={styles.awardsCopy}>{vista30.awardsHighlight.description}</p>
              <a
                href={vista30.awardsPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.awardsLink}
                data-ui="text"
                data-ui-tone="dark"
              >
                Explore Being Networks Awards <span data-ui-glyph aria-hidden="true">↗</span>
              </a>
            </div>

            <div className={styles.themesCard}>
              <span className={styles.blockEyebrow}>
                <Sparkles size={14} aria-hidden="true" /> Central Explorations
              </span>
              <h4>{vista30.centralQuestion}</h4>
              <ul className={styles.pillarList}>
                {vista30.centralThemes.map((pillar) => (
                  <li key={pillar.title}>
                    <strong>{pillar.title}</strong>
                    <span>{pillar.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.experienceCard}>
              <span className={styles.blockEyebrow}>Delegate Hospitality</span>
              <ul>
                {vista30.experienceInclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
