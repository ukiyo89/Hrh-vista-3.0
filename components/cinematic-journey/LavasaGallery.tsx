"use client";

import { useState } from "react";
import styles from "./CinematicJourney.module.css";

export const LAVASA_PHOTOS = [
  {
    id: "aerial",
    src: "/media/Lavasa/pic2.jpg",
    title: "Sahyadri Hills & Lake Warasgaon",
    subtitle: "Elevation 640m · Western Ghats, Maharashtra",
    tag: "Aerial Horizon",
    caption:
      "A breathtaking natural amphitheater nestled among emerald hills. Where delegates step outside the conference hall into pristine mountain air.",
  },
  {
    id: "waterfront",
    src: "/media/Lavasa/pic1.jpg",
    title: "The Dasve Promenade & Waterfront",
    subtitle: "Italianate Architecture Meets The Lake",
    tag: "Waterfront Town",
    caption:
      "Vibrant Portofino-inspired architecture bordering the lake, providing a serene backdrop for evening networking and executive conclave roundtables.",
  },
  {
    id: "campus",
    src: "/media/Lavasa/pic3.jpg",
    title: "CHRIST University Pune Lavasa Campus",
    subtitle: "The Hub of Innovation & Future of Work",
    tag: "The Conclave Ground",
    caption:
      "The academic and corporate convergence center where HR VISTA 1.0 and 2.0 welcomed leaders from over 40 top organizations across India.",
  },
] as const;

interface LavasaGalleryProps {
  progress: number; // 0 to 1
  onSelectPhoto?: (index: number) => void;
}

export function LavasaGallery({ progress }: LavasaGalleryProps) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Gallery becomes active when progress passes 0.72
  const isVisible = progress > 0.68;
  const galleryOpacity = Math.min(1, Math.max(0, (progress - 0.70) / 0.16));
  const galleryTranslateY = (1 - galleryOpacity) * 40;

  if (!isVisible && progress < 0.65) return null;

  const current = LAVASA_PHOTOS[activePhoto];

  return (
    <div
      className={styles.lavasaGallery}
      style={{
        opacity: galleryOpacity,
        transform: `translate3d(0, ${galleryTranslateY}px, 0)`,
        pointerEvents: progress > 0.75 ? "auto" : "none",
      }}
      data-lavasa-gallery
    >
      <div className={styles.lavasaContainer}>
        {/* Arrival Header */}
        <header className={styles.lavasaHeader}>
          <div className={styles.arrivalBadge}>
            <span className={styles.pulseDot} />
            <span>DESTINATION REACHED · 18°24&apos;N, 73°30&apos;E</span>
          </div>
          <h2 className={styles.lavasaTitle}>
            Welcome to <em>Lavasa.</em>
          </h2>
          <p className={styles.lavasaIntro}>
            A campus in the hills. A community of forward thinkers. The birthplace of HR VISTA,
            where visionary HR leaders, academics, and students first gathered to explore the future of work.
          </p>
        </header>

        {/* Cinematic Main Stage */}
        <div className={styles.cinematicStage}>
          {/* Main Hero Photograph */}
          <div
            className={styles.heroPhotoWrapper}
            onClick={() => setLightboxIndex(activePhoto)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setLightboxIndex(activePhoto);
            }}
            aria-label={`Open full size photo of ${current.title}`}
          >
            <img
              src={current.src}
              alt={current.title}
              className={styles.heroPhoto}
              loading="lazy"
            />
            <div className={styles.photoOverlayGradient} />
            
            <div className={styles.photoCardCaption}>
              <span className={styles.photoBadge}>{current.tag}</span>
              <h3 className={styles.photoName}>{current.title}</h3>
              <p className={styles.photoSub}>{current.subtitle}</p>
              <p className={styles.photoDesc}>{current.caption}</p>
              <span className={styles.expandPrompt}>
                Click to expand view ↗
              </span>
            </div>
          </div>

          {/* Thumbnail / View Selector */}
          <div className={styles.selectorBar} role="tablist" aria-label="Lavasa views">
            {LAVASA_PHOTOS.map((photo, index) => {
              const selected = index === activePhoto;
              return (
                <button
                  key={photo.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`lavasa-panel-${photo.id}`}
                  className={`${styles.thumbBtn} ${selected ? styles.thumbBtnActive : ""}`}
                  onClick={() => setActivePhoto(index)}
                >
                  <img
                    src={photo.src}
                    alt=""
                    className={styles.thumbImg}
                    loading="lazy"
                  />
                  <div className={styles.thumbMeta}>
                    <span className={styles.thumbIndex}>0{index + 1}</span>
                    <span className={styles.thumbTitle}>{photo.tag}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls & Continuation to next chapters */}
        <div className={styles.lavasaActions}>
          <a
            href="#editions"
            className={styles.actionBtnPrimary}
            data-ui="button"
          >
            Explore our editions <span aria-hidden="true">↓</span>
          </a>
          <a
            href="/brochure"
            className={styles.actionBtnSecondary}
            data-ui="text"
            data-ui-tone="dark"
          >
            Read conclave brochure <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={LAVASA_PHOTOS[lightboxIndex].title}
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setLightboxIndex(null)}
              aria-label="Close photo preview"
            >
              ✕
            </button>
            <img
              src={LAVASA_PHOTOS[lightboxIndex].src}
              alt={LAVASA_PHOTOS[lightboxIndex].title}
              className={styles.lightboxImg}
            />
            <div className={styles.lightboxCaption}>
              <h4>{LAVASA_PHOTOS[lightboxIndex].title}</h4>
              <p>{LAVASA_PHOTOS[lightboxIndex].caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
