# Past voice portrait sources

Verified 24 October 2026. All thirteen profiles now have individually sourced portrait assignments in `lib/data/voices-media.ts`. The previous assumption that supplied photo order matched biography order was incorrect and has been removed.

Seven supplied photographs match the same complete photographs from named LinkedIn or speaker sources after resizing and decoding. Their whole-image pixel RMSE is 0.67–1.90; the next closest supplied images score above 59. Six profiles use named source portraits instead. These are image-asset comparisons and named source associations, not facial identification.

## Current assignments

| Profile | Displayed asset in `public/media/voices/` | Basis | Source |
| --- | --- | --- | --- |
| Dr. Amit Sawhney | `past-voice-12.webp` | Supplied photo 12; same whole-photo match | [Source](https://www.linkedin.com/posts/amitsawhney_history-charity-conquering-activity-7231747078245236737-PT2r) |
| Mr. Shyambahadur Prajapati | `past-voice-11.webp` | Supplied photo 11; same whole-photo match | [Source](https://www.linkedin.com/in/shyamprajapati/) |
| Dr. Balasubramanian Sethuraman | `past-voice-10.webp` | Supplied photo 10; same whole-photo match | [Source](https://bizintegration.in/india-hr-summit-mumbai-2025/speakers/) |
| Mr. Narasimha Murthy Aradhyula | `narasimha-murthy-aradhyula.webp` | Named source portrait | [Source](https://www.thebrainalytics.com/event/3rd-edition-nbfc-fintech-summit-awards-2026-3/) |
| Mr. Rajendra Lingwal | `past-voice-08.webp` | Supplied photo 08; same whole-photo match | [Source](https://www.linkedin.com/posts/rajendra-lingwal-7bb2161_pulse-activity-7423707293625778176-49vc) |
| Ms. Gauri Das | `past-voice-07.webp` | Supplied photo 07; same whole-photo match | [Source](https://in.linkedin.com/in/gauridas) |
| Dr. Saumya Badgayan Dutta | `saumya-badgayan-dutta.webp` | Named source portrait | [Source](https://bizintegration.in/india-hr-summit-mumbai-2025/speakers/) |
| Mr. George Kutty | `george-kutty.webp` | Named source portrait | [Source](https://india.techhrconference.com/agenda) |
| Mr. Senthil Kumar S | `senthil-kumar-s.webp` | Named source portrait | [Source](https://www.bigmarker.com/internshala8/how-hdfc-life-hires-freshers-roles-skills-and-selection-criteria) |
| Dr. Himanshu Talwar | `himanshu-talwar.webp` | Named source portrait | [Source](https://ylc.aima.in/mentors/himanshu-talwar.php) |
| Mr. Debansh Roy | `past-voice-02.webp` | Supplied photo 02; same whole-photo match | [Source](https://www.linkedin.com/in/debanshroy/) |
| Dr. Ganesh Natarajan | `ganesh-natarajan.webp` | Named source portrait | [Source](https://ganeshnatarajan.in/) |
| Mr. Sumit Atri | `past-voice-01.webp` | Supplied photo 01; same whole-photo match | [Source](https://www.linkedin.com/in/sumit-atri-a7b661b/) |

Narasimha Murthy's event card names Head – Retail Credit at John Deere Financial India. His [self-authored LinkedIn role announcement](https://www.linkedin.com/posts/narasimha-murthy-aradhyula_johndeere-johndeerefinancial-retailcredit-activity-7455939794720841728-MnXp) supplies the full surname and the same role/employer. Saumya's named event portrait uses the shorter name Saumya Dutta; the official HR VISTA attribution supplies Badgayan Dutta with the same employer and role. Senthil's presenter attribution matches the HR VISTA event's HDFC Life HR attribution.

## Evidence and maintenance

`output/sources/voices/verified-portrait-mapping.json` records each display path, source page, original source-image URL, attribution evidence, dimensions, SHA256 and comparison result where applicable. `whole-image-comparison.json` preserves the complete-photo comparison results. Temporary research pages, downloads and unused comparison assets were removed; these files record URLs and evidence rather than claiming cached pages remain available. Public CDN image links may expire, so the page serves local WebP files.

Portrait IDs are stable speaker slugs. File numbers are only archive filenames and must never determine a person's assignment. All supplied originals remain intact in `Content pics/` and the original numbered WebPs remain in `public/media/voices/`. Only the thirteen verified entries are exported in `pastVoices`, avoiding a second unnamed gallery of unused photographs.

## Biography caveats

The supplied `Content pics/Past speak pics/Website Content(Speaker feed back.txt` contains third-person biographies, not testimonials. This portrait correction preserves those biographies. Portrait/source verification does not independently verify every credential or promotional statement.

- Senthil Kumar S is attributed by the official event and his named presenter source to Human Resources at HDFC Life; the supplied biography instead describes supply-chain leadership.
- Debansh Roy's supplied AllianceBernstein role is historical relative to the researched Addepar role.
- Saumya's Gold Star Jewellery role is the historical event attribution and should not automatically be treated as current employment.

Resolve these copy/date discrepancies with the content owner before changing biography text. The earlier official event named-image references remain recorded in `named-image-sources.json`; the earlier failed expired-CDN comparison is retained in `exact-decoded-pixel-results.json` as historical evidence, superseded by the current mapping above.
