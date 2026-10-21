# Scroll, voices and polish verification

Final direction: preserve the globe → Lavasa → illustrated flight → Mumbai story, original sponsor staircase and approved edition scene. Exact venue remains unconfirmed. Feedback content is intentionally pending.

## Automated checks

- `npm run build` passed on Next.js 15.5.27, including all 12 generated pages.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false` passed.
- `npm run check:event` passed: IST midnight, day/hour/minute/second rollover, event start/end, no negative countdown.
- `git diff --check` passed.
- `npm run check:preview -- http://127.0.0.1:3022` passed: home, archive, voices, brochure deep link and sponsors; 19 JavaScript bundles; complete PDF integrity; all-day calendar dates.
- Sponsor staircase animation-controller code compared byte-for-byte with `preview-before-major-changes-for-motion` and matches. Its text and typography were simplified.

## Rendered and interaction checks

- Desktop and 320/390px mobile compositions inspected. Reduced-motion width checks also covered 768, 1024 and 1440px with no document overflow.
- Countdown advances live seconds and occupies a compact 267px strip at 1440px width.
- Journey flight controls: departure/mid-flight/arrival and keyboard Home/End/ArrowRight; forward/reverse scrolling; globe/map/city visibility; immediate seek synchronization.
- Mobile flight has a dedicated animated map above its copy. Short screens use a natural stack. Marine Drive image credit remains readable and unclipped.
- Globe interaction and branded discovery remain; reduced-motion and no-JavaScript static map fallbacks checked.
- Voices photo arrows and keyboard controls update actual archive images. Scroll masks retain usable controls; mobile layouts and reduced motion checked.
- People portrait selection and faculty filter checked. Edition photograph aperture/type motion and footer inspected.
- Browser production pass observed no JavaScript exceptions or failed asset responses. Chrome reported one Next.js stylesheet-preload timing warning; no visible defect was observed.

Screenshots are local in `output/playwright/` (ignored by Git). Browser checks use desktop/mobile viewport emulation, not a physical-device or formal accessibility audit.

## Content handoff

Add supplied reflections to `lib/data/voices.ts`; see `docs/VOICES-CONTENT.md`. No testimonial names or quotes were fabricated. Opening-session time remains unspecified; the countdown targets 00:00 IST on 21 November 2026.

## References inspected

The live Opraah page and its public Framer entry/homepage modules were inspected for perspective, spring and masked-motion techniques. Its public carousel uses stiffness 100, damping 30 and drag sensitivity 0.5, consistent with the preserved HR VISTA drum. Igloo's entry was readable, but its 3D module returned HTTP 403 and its scene could not be visually inspected. Reference code and assets are not shipped as downloaded bundles.
