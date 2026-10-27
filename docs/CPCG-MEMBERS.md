# CPCG people — 27 October 2026

The homepage now shows four faculty and nine senior CPCG leaders: President, Vice President, Official Mentor and the six committee heads. The organiser's supplied core-committee sheet provides the sixteen named roles. Subheads, the SC representative and other members are inside the full roster. The sheet confirms the name Rishika Ranjan.

“Meet all members” opens all 47 CPCG members with campus filters (40 Lavasa, seven Pune City). While open, the control becomes a single sticky cross. Closing it returns to the disclosure button and retains keyboard focus. The native disclosure remains usable without animation; reduced-motion preferences are respected.

GPT-6.1 Terra with high reasoning researched portraits using the user's signed-in Chrome Beta profile and public LinkedIn sources. Thirty-five new original portraits are stored in `public/media/cpcg/`; Arnav's existing portrait is retained, giving 36 member portraits. Three additional images supplied by the organiser for Indrajeet, Aaron Benoy and Hanishma K bring the total to 39; these 200×200 PNG files were copied unchanged in the supplied order. The four faculty portraits remain. Source profile URLs, image URLs, dimensions, hashes and matching evidence are recorded for every member in:

- [Core portrait sources](cpcg-portraits-core.json)
- [Lavasa portrait sources](cpcg-portraits-lavasa.json)
- [Pune portrait sources](cpcg-portraits-pune.json)

The source ties each photo to the matching LinkedIn profile; no face matching, generated portraits or guessed namesake pictures were used. Some original LinkedIn photos include profile frames. Anushree B Nair and Prateek Niranjan have 96×96 source portraits; other newly saved photos are 400×400.

Eight members still use initials. Five have no resolved profile/portrait: Manne Mokshitha, Suhana Pandey, Harshit Mehra, Ankita and Rohit. Three matched profiles did not expose a usable portrait: Adone Babu (generic LinkedIn placeholder), Eligius Tiago Gracias and G Sai Shruthi. These were not replaced with unrelated photos.

There are 42 direct member profile links and five labelled LinkedIn name searches, plus four direct faculty links. Eligius's exact profile was identified in Chrome Beta. Existing research is in [batch A](cpcg-research-a.json) and [batch B](cpcg-research-b.json). Four links retain contextual name confirmation caveats: Shachi and Samaira were supplied without surnames; Prasanna Lakshmi K and G Sai Shruthi's public profiles omit an initial. The supplied campus groupings are retained, including where LinkedIn mentions Lavasa for members grouped under Pune City.

Edit `lib/data/cpcg-members.ts` and the corresponding source record to update a role, confirmed profile or portrait. Run `npm run check:people` and the production preview checks after changes. The data check verifies the nine preview leaders, full roster, profile evidence and every stored portrait's SHA-256.

The cancelled Mumbai flight and city scene remain removed. Homepage, editions, sponsors and metadata remain venue-neutral.

Verification: production build, TypeScript, roster/hash checks and production preview passed. Browser checks confirmed all thirteen preview portraits load, the full roster opens with interpolated height and staggered cards, the cross stays at the viewport edge while scrolling on desktop and 390px mobile, and closing restores the collapsed button and keyboard focus. Reduced motion and responsive overflow checks passed. Older browsers retain a usable native disclosure where height interpolation is unavailable; physical phones were not tested.

The organiser confirmed Hanishma K and Indrajeet's direct profile URLs. The disclosure button now uses the President, Vice President and Arnav Sharma portraits in its three fanned cards; the source note below the button was removed. Aaron Benoy's exact profile URL was supplied in the clarification reply and is now a direct link as well.
