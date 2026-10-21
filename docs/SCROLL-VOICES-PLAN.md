# HR VISTA — scroll, countdown and voices

## Brief and baseline

- Branch: `codex/hr-vista-scroll-voices`, from `preview-before-major-changes-for-motion`.
- Preserve the photo drum, existing Nohemi/Manrope typography, ink/blue/paper palette and real archive photography.
- Mumbai is the approved journey destination. The exact venue is undecided: remove BKC/Jio Grounds and show venue to be announced.
- Event dates remain 21–22 November 2026. Countdown targets the beginning of 21 November in Asia/Kolkata (00:00 IST); no opening-session time has been supplied.
- The client will supply approximately 20 HR VISTA 2.0 quotes later. Build the animated design and an editable data source, with an honest pending-content state.

## Choreography

1. **Opening:** preserve the draggable/keyboard photo drum; add a bounded scroll exit and improve the handoff to the next chapter.
2. **Countdown:** a compact date rail beneath the hero, tabular numerals and live seconds. Four values on mobile too. No per-second screen reader announcements.
3. **Journey:** preserve globe → Lavasa → aircraft/map → Mumbai. Improve the same idea with takeoff/cruise/arrival pacing, tracking map camera, aircraft banking, a reversible city reveal and native flight seeking controls. One renderer owns all scene visibility.
4. **Editions:** photographic apertures, deliberate large numerals, continuous progress and chapter navigation. Avoid arbitrary rotation and idle scroll distance.
5. **People:** assembled network driven by scroll, keyboard/touch selection and useful access to each real profile. Pause preserves its pose; reduced motion keeps everything readable.
6. **Voices:** editorial animated preview on home and a dedicated `/voices` experience. Scroll shutters, opposing typography and a shared drag/swipe/keyboard photo interaction use genuine 2.0 archive images. Real quotes replace the typed empty data array without changing layout code.
7. **Sponsors:** preserve the original dimensional staircase choreography and brand-preview controls. Remove decorative microcopy while keeping the unconfirmed-sponsor state readable.
8. **Polish:** remove redundant chapter furniture, tiny counters, photo stamps and repeated labels. Give essential dates, controls, captions and attribution readable type and room to breathe.

## Engineering and acceptance

- Use existing GSAP/ScrollTrigger and React/Motion; no additional animation library.
- Keep essential content visible in served HTML, no-JS and reduced motion. Clean up observers, listeners and scroll scenes.
- Avoid frame-by-frame React state. High frequency visuals use transforms/CSS variables and GSAP.
- Countdown: deterministic parsing with explicit `+05:30`, live rollover, nonnegative values, event-in-progress and ended states, tab/background handling.
- Verify exact-venue cleanup in web source, including metadata, reader UI and archive CTAs. The printed brochure has been updated to remove the superseded exact venue.
- Run production build, TypeScript, `git diff --check`, preview routes/bundles/PDF integrity, countdown boundary checks, desktop/mobile interaction and visual QA.
- Push the completed branch; do not merge or change the production branch.

## Content handoff

Final feedback text, names, roles, organisations and optional portraits/links are pending from the client. Never fill those fields with invented endorsements.
