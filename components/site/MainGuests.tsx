"use client";

import { motion } from "framer-motion";
import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";
import styles from "./MainGuests.module.css";

export function MainGuests() {
  const reduced = useReducedMotionPreference();

  return (
    <section id="guests" className={styles.section} aria-labelledby="main-guests-title">
      <div className={styles.heading}>
        <p className={styles.edition}>HR VISTA 3.0</p>
        <motion.h2
          id="main-guests-title"
          initial={reduced ? false : { y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: .5 }}
          transition={{ duration: .7, ease: [.16, 1, .3, 1] }}
        >
          Main HR<br /><em>guests.</em>
        </motion.h2>
      </div>
      <div className={styles.announcement}>
        <motion.div
          className={styles.rule}
          aria-hidden="true"
          initial={reduced ? false : { scaleX: .25 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: .5 }}
          transition={{ duration: .9, ease: [.16, 1, .3, 1] }}
        />
        <motion.p
          initial={reduced ? false : { y: 18 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: .5 }}
          transition={{ duration: .7, delay: .1, ease: [.16, 1, .3, 1] }}
        >Adding soon</motion.p>
      </div>
    </section>
  );
}
