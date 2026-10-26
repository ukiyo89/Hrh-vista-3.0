# CPCG roster — 27 October 2026

The organiser supplied 47 names: 40 before the CITY PUNE CAMPUS heading and seven after it. The first group is displayed as Lavasa; the second as Pune City. Names, spelling, order and first-name-only entries are preserved. Positions within CPCG were not supplied, so the directory uses “CPCG member”. The four existing faculty members remain, giving 51 people in total. Previous student/community entries were removed at the organiser's request.

Research used GPT-6.1 Sol with high reasoning. Names were checked against public LinkedIn profile content, campus education and official CPCG committee posts. A second pass used Agent Reach's public web search to discover additional profile URLs and followed tagged names from original public posts. The evidence and individual outcomes are in [batch A](cpcg-research-a.json) and [batch B](cpcg-research-b.json).

- 38 members have direct profile links: 16 were added during the second pass. The four faculty also retain their existing direct profile links.
- Arnav Sharma's existing website credit, LinkedIn link and locally sourced portrait are retained. These assets were already in the website; they were not retrieved or reverified during this update. The original record remains in `public/media/people/sources.json`.
- All 47 members have a LinkedIn action. Nine members use a name search labelled “Find on LinkedIn” because an exact profile could not be established: Hanishma, Aaron Benoy, Indrajeet, Eligius Tiago Gracias, Manne Mokshitha, Suhana Pandey, Harshit Mehra, Ankita and Rohit. Search destinations are generated from the supplied name plus CHRIST University and are never presented as confirmed profiles.
- Five direct links are contextual matches: rishika, Shachi and Samaira were supplied without surnames; Prasanna Lakshmi K and G Sai Shruthi have matching public campus/peer evidence but profiles omit an initial. These entries have `matched-context` research status and retain the supplied display names. Other abbreviated/reordered names have additional campus or official-tag corroboration recorded in their entries. No new portraits were assigned from contextual inference.
- No new profile portraits could be verified and downloaded. Public profile requests returned LinkedIn authwall/HTTP 999; the available Chrome session also required sign-in. Image search returned unrelated namesakes, which were rejected; one public-post portrait URL returned 404. The 46 members without a previously sourced portrait use initials.
- Kuber Arora, Aarya Karve and Amal Pillai have CPCG/Lavasa evidence, while the supplied list puts them under Pune City. The organiser's grouping is preserved; the evidence discrepancy is recorded in batch B.

To add a confirmed link or photo, update that member in `lib/data/cpcg-members.ts` and its research entry. Adding a documented profile automatically replaces the search action. Save confirmed portraits locally under `public/media/cpcg/` and record their profile and image source. Do not turn unresolved candidate identities into direct profile links or portraits without matching evidence. Run `npm run check:people` after editing.

The cancelled Lavasa-to-Mumbai flight, map, Mumbai city section and navigation destinations were removed. Current event copy is venue-neutral, including homepage, edition 3.0, sponsors, shared metadata and shared content. The interactive globe and Lavasa origin remain; `#next-chapter` now points to the closing event section. Historical source documents and past-event quotations retain their original context.

Validation completed after the final roster change: production build, TypeScript without emit, `check:people`, `check:event`, `git diff --check`, and `check:preview` against port 3028. The preview check covered five routes, 19 JavaScript bundles, complete brochure download integrity and the venue-neutral calendar. Browser checks covered 51 total cards, four faculty portraits, 40 Lavasa and seven Pune City cards, keyboard filtering, reduced motion, valid local anchors and layouts at 320, 390, 768 and 1440 pixels. Globe controls, Easter egg and WebGL context-loss/recovery were checked in the development preview. The focused production browser check recorded no page exceptions or failed responses. Physical mobile hardware was not tested.

Names needing confirmation:

| Supplied name | What remains uncertain |
| --- | --- |
| Hanishma | A Lavasa student named Hanishma K exists, but CPCG/HR VISTA identity is not established. |
| Aaron Benoy | Two exact-name profiles found; no campus/CPCG evidence selects the correct one. |
| Indrajeet | Multiple possible surnames; no unique CPCG match. |
| Eligius Tiago Gracias | No matching public profile found. |
| Manne Mokshitha | No matching public profile found, including reversed-name/spelling variants. |
| Suhana Pandey | Same-name profiles found at other institutions; no matching campus evidence. |
| Harshit Mehra | Same-name profiles found without matching campus/CPCG evidence. |
| Ankita | Several possible people, including a campus peer and a former CPCG member; first name does not select one. |
| Rohit | Campus/placement-training candidates exist; no unique current CPCG match. |

Linked contextual matches to confirm:

| Supplied name | Linked public profile | Basis and remaining gap |
| --- | --- | --- |
| rishika | [Rishika Ranjan](https://in.linkedin.com/in/rishika-ranjan-b84934302) | Explicit CPCG/Lavasa affiliation; surname not supplied. |
| Shachi | [Shachi Tiwari](https://in.linkedin.com/in/shachi-tiwari-12999b214) | Official CPCG employee link; surname not supplied. |
| Samaira | [Samaira Sharma](https://www.linkedin.com/in/samaira-sharma-640538258) | Own HR VISTA/CPCG posts and Pune City training; surname not supplied. |
| Prasanna Lakshmi K | [Prasanna Lakshmi](https://www.linkedin.com/in/prasanna-lakshmi-510029291/) | Lavasa education and peer project corroboration; initial K not established. |
| G Sai Shruthi | [Sai Shruthi](https://www.linkedin.com/in/sai-shruthi-823447387/) | Matching Lavasa education; initial G not established. |

Second-pass validation: build and TypeScript passed, roster/source and duplicate-profile checks passed, and production preview passed all five routes, 19 bundles, PDF integrity and calendar checks. All 51 rendered cards have a LinkedIn action: 42 direct profiles including faculty and nine correctly labelled name searches. Browser checks verified name-specific search queries, safe new-tab attributes, campus filters, visible keyboard focus, no horizontal overflow at 320/390/1440 pixels, and no page exceptions or failed responses during the focused production check. External LinkedIn pages were not verified in an authenticated session; photos were unchanged.
