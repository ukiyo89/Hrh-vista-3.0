# CPCG people — 28 October 2026

The homepage shows four faculty and sixteen core-team members in the organiser's supplied order: Sabhya Walani, Aditi Mishra, Aayush Agarwal, Kuber Arora, Vashitav Bali, Ameya M Laad, Raksha Rajesh Rao, Hanishma K, Mrinalini Sharma, Tanishq Kalra, Vivaan Sud, Harsh Maheswari, Jose Jasmine Fernandez, Prasanna Lakshmi K, Rishika Ranjan and Arva Dumbre. The full roster starts with the same core team; all other members retain their relative order. Kuber's role is Mentor and his supplied Pune City grouping remains.

“Meet all members” opens all 47 CPCG members with campus filters (40 Lavasa, seven Pune City). While open, the control becomes a single sticky cross. Closing it returns to the disclosure button and retains keyboard focus. The native disclosure remains usable without animation; reduced-motion preferences are respected.

There are 39 member portraits: 32 researched from matching LinkedIn profiles, Arnav's retained portrait and six organiser-supplied images. On 28 October, the organiser replaced Aditi Mishra, Vashitav Bali and Harsh Maheswari's portraits with attached PNG files, copied unchanged; these supersede their researched portraits. Indrajeet, Aaron Benoy and Hanishma K retain the previously supplied 200×200 PNG files. The four faculty portraits remain. Source profile URLs, image sources, dimensions, hashes and matching evidence are recorded for every member in:

- [Core portrait sources](cpcg-portraits-core.json)
- [Lavasa portrait sources](cpcg-portraits-lavasa.json)
- [Pune portrait sources](cpcg-portraits-pune.json)

Profile-sourced photos are tied to matching LinkedIn profiles; supplied photos are tied to the organiser's explicit assignment. No face matching, generated portraits or guessed namesake pictures were used. Some original LinkedIn photos include profile frames. Anushree B Nair and Prateek Niranjan have 96×96 source portraits; other profile-sourced photos are 400×400.

Eight members still use initials. Five have no resolved profile/portrait: Manne Mokshitha, Suhana Pandey, Harshit Mehra, Ankita and Rohit. Three matched profiles did not expose a usable portrait: Adone Babu (generic LinkedIn placeholder), Eligius Tiago Gracias and G Sai Shruthi. These were not replaced with unrelated photos.

There are 41 direct member profile links and five labelled LinkedIn name searches, plus four direct faculty links. Aditi has no LinkedIn action or search fallback, as explicitly requested by the organiser on 28 October; that correction supersedes the archival research. Eligius's exact profile was identified in Chrome Beta. Existing research is in [batch A](cpcg-research-a.json) and [batch B](cpcg-research-b.json). Four links retain contextual name confirmation caveats: Shachi and Samaira were supplied without surnames; Prasanna Lakshmi K and G Sai Shruthi's public profiles omit an initial. The supplied campus groupings are retained, including where LinkedIn mentions Lavasa for members grouped under Pune City.

Edit `lib/data/cpcg-members.ts` and the corresponding source record to update a role, confirmed profile or portrait. Run `npm run check:people` and the production preview checks after changes. The data check verifies the sixteen-member core order in both lists, remaining roster order, profile evidence and every stored portrait's SHA-256. Preview checks verify Aditi has no link in either view and the three replacement images are served unchanged.

The cancelled Mumbai flight and city scene remain removed. Homepage, editions, sponsors and metadata remain venue-neutral.

Verification recorded on 27 October, before the sixteen-member preview and replacement portraits: production build, TypeScript, roster/hash checks and production preview passed. Browser checks confirmed all thirteen then-current preview portraits load, the full roster opens with interpolated height and staggered cards, the cross stays at the viewport edge while scrolling on desktop and 390px mobile, and closing restores the collapsed button and keyboard focus. Reduced motion and responsive overflow checks passed. Older browsers retain a usable native disclosure where height interpolation is unavailable; physical phones were not tested.

28 October verification: production build (including type checks), roster/hash checks, event checks and production preview passed. Desktop (1440px, reduced motion) and mobile (390px, motion enabled) browser checks confirmed the supplied portraits decode and crop correctly, both views follow the sixteen-member order, Aditi has no link, campus filters retain 47/40/7 members, the disclosure opens/closes, and neither layout overflows horizontally. Keyboard disclosure toggling retains focus. No console errors occurred; Chrome reported an unused CSS preload warning. Physical phones and a deployed production site were not checked.

The organiser confirmed Hanishma K and Indrajeet's direct profile URLs. The disclosure button now uses the President, Vice President and Arnav Sharma portraits in its three fanned cards; the source note below the button was removed. Aaron Benoy's exact profile URL was supplied in the clarification reply and is now a direct link as well.
