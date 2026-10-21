# HR VISTA — scroll, countdown and voices

## Brief and baseline

- Branch: `codex/hr-vista-scroll-voices`, from `preview-before-major-changes-for-motion`.
- Preserve the photo drum, existing Nohemi/Manrope typography, ink/blue/paper palette and real archive photography.
- The 3.0 venue is undecided. Remove the former location from current web copy and replace the geographic destination scene.
- Event dates remain 21–22 November 2026. Countdown targets the beginning of 21 November in Asia/Kolkata (00:00 IST); no opening-session time has been supplied.
- The client will supply approximately 20 HR VISTA 2.0 quotes later. Build the animated design and an editable data source, with an honest pending-content state.

## Choreography

1. **Opening:** preserve the draggable/keyboard photo drum; add a bounded scroll exit and improve the handoff to the next chapter.
2. **Countdown:** oversize tabular typography, restrained live seconds, fine rules and a scroll-drawn time rail. Four values on mobile too. No per-second screen reader announcements.
3. **Journey:** interactive earth and Lavasa roots transition into an abstract connection field and an open 3.0 horizon. One reversible scene state; no invented destination.
4. **Editions:** photographic apertures, deliberate large numerals, continuous progress and chapter navigation. Avoid arbitrary rotation and idle scroll distance.
5. **People:** assembled network driven by scroll, keyboard/touch selection and useful access to each real profile. Pause preserves its pose; reduced motion keeps everything readable.
6. **Voices:** editorial animated preview on home and a dedicated `/voices` experience. Real quotes replace the typed empty data array without changing layout code.
7. **Sponsors:** flat, dimensional proof-sheet choreography, with existing brand-preview controls and explicit concept labels retained.

## Engineering and acceptance

- Use existing GSAP/ScrollTrigger and React/Motion; no additional animation library.
- Keep essential content visible in served HTML, no-JS and reduced motion. Clean up observers, listeners and scroll scenes.
- Avoid frame-by-frame React state. High frequency visuals use transforms/CSS variables and GSAP.
- Countdown: deterministic parsing with explicit `+05:30`, live rollover, nonnegative values, event-in-progress and ended states, tab/background handling.
- Verify venue cleanup in web source, including metadata, reader UI and archive CTAs. Printed brochure needs separate treatment if its original artwork retains superseded details.
- Run production build, TypeScript, `git diff --check`, preview routes/bundles/PDF integrity, countdown boundary checks, desktop/mobile interaction and visual QA.
- Push the completed branch; do not merge or change the production branch.

## Content handoff

Final feedback text, names, roles, organisations and optional portraits/links are pending from the client. Never fill those fields with invented endorsements.
