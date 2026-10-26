# CPCG roster — 27 October 2026

The organiser supplied 47 names: 40 before the CITY PUNE CAMPUS heading and seven after it. The first group is displayed as Lavasa; the second as Pune City. Names, spelling, order and first-name-only entries are preserved. Positions within CPCG were not supplied, so the directory uses “CPCG member”. The four existing faculty members remain, giving 51 people in total. Previous student/community entries were removed at the organiser's request.

Research used GPT-6.1 Sol with high reasoning. Exact names were checked against public LinkedIn profile content, campus education and, where available, official CPCG committee posts. The evidence and individual outcomes are in [batch A](cpcg-research-a.json) and [batch B](cpcg-research-b.json).

- 21 newly matched profile URLs are linked in the directory.
- Arnav Sharma's existing website credit, LinkedIn link and locally sourced portrait are retained. These assets were already in the website; they were not retrieved or reverified during this update. The original record remains in `public/media/people/sources.json`.
- The remaining 25 members have no profile link because the identity or exact profile URL could not be established. Candidate profiles are recorded only in the research files.
- No new profile portraits could be verified and downloaded. Public profile requests returned LinkedIn authwall/HTTP 999; the available Chrome session also required sign-in. Image search returned unrelated namesakes, which were rejected; one public-post portrait URL returned 404. The 46 members without a previously sourced portrait use initials.
- Kuber Arora, Aarya Karve and Amal Pillai have CPCG/Lavasa evidence, while the supplied list puts them under Pune City. The organiser's grouping is preserved; the evidence discrepancy is recorded in batch B.

To add a confirmed link or photo, update that member in `lib/data/cpcg-members.ts` and its research entry. Save confirmed portraits locally under `public/media/cpcg/` and record their profile and image source. Do not turn candidate identities into live links or portraits without matching evidence. Run `npm run check:people` after editing.

The cancelled Lavasa-to-Mumbai flight, map, Mumbai city section and navigation destinations were removed. Current event copy is venue-neutral, including homepage, edition 3.0, sponsors, shared metadata and shared content. The interactive globe and Lavasa origin remain; `#next-chapter` now points to the closing event section. Historical source documents and past-event quotations retain their original context.

Validation completed after the final roster change: production build, TypeScript without emit, `check:people`, `check:event`, `git diff --check`, and `check:preview` against port 3028. The preview check covered five routes, 19 JavaScript bundles, complete brochure download integrity and the venue-neutral calendar. Browser checks covered 51 total cards, four faculty portraits, 40 Lavasa and seven Pune City cards, keyboard filtering, reduced motion, valid local anchors and layouts at 320, 390, 768 and 1440 pixels. Globe controls, Easter egg and WebGL context-loss/recovery were checked in the development preview. The focused production browser check recorded no page exceptions or failed responses. Physical mobile hardware was not tested.
