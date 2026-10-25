# Past voices

The `/voices` page presents all 13 supplied biographies as speaker profiles. The source is `Content pics/Past speak pics/Website Content(Speaker feed back.txt`. These are third-person biographies, not speaker testimonials. Biography text is preserved verbatim; honorific punctuation and spacing in display names are normalized.

All biographies appear in full in the page. A keyboard-accessible “Find a speaker” directory links to each profile. The opening archive carousel retains swipe, arrow-key and button navigation, with reduced-motion support.

## Profile content and source links

Edit `speakerProfiles` in `lib/data/voices-media.ts`. Each profile has a stable `id`, display `name` and full `biography`. The optional `linkedIn` field supplies a public attribution link. Only supported profile associations should be published; do not infer a link from a common name. See `docs/VOICE-SOURCES.md` for verified portrait sources and historical-role caveats.

The supplied biographies are published as supplied content, not as independently verified current-employment claims. The Senthil Kumar S supply-chain description conflicts with the official event HR/HDFC Life attribution. Debansh Roy's supplied AllianceBernstein role is historical relative to current profile research. Preserve source copy pending the content owner's correction.

## Match portraits safely

`pastVoices` now exports thirteen verified portraits keyed by stable speaker slugs. Each `speakerProfiles` entry uses that speaker's slug in `portraitId` and records its named source page in `portraitSource`. Do not assign photos by numbered filename or biography order. The earlier assumed number-order mapping was corrected on 24 October 2026.

Seven supplied photographs are reused after same-whole-photo comparison against named LinkedIn/speaker assets: Amit 12, Shyambahadur 11, Balasubramanian 10, Rajendra 08, Gauri 07, Debansh 02 and Sumit 01. Narasimha, Saumya, George, Senthil, Himanshu and Ganesh use local WebP portraits from explicitly named source pages. See `docs/VOICE-SOURCES.md` for the thirteen-row source table and `output/sources/voices/verified-portrait-mapping.json` for detailed evidence.

All thirteen profiles have an assigned portrait, and only those verified entries are exported, so the separate unnamed portrait archive is omitted. Original supplied files and numbered WebPs are preserved. Displayed photos live in `public/media/voices/`; their dimensions and alt text are stored in `pastVoices`. Keep source evidence and local assets together when replacing a photo.

The opening carousel uses `Event pics/WhatsApp Image 2026-10-21 at 10.20.06 PM.jpeg`, `10.20.07 PM (3).jpeg` and `10.20.07 PM.jpeg`. Its order and descriptive text are in `voicesArchiveImages` in the same data file.

## Add actual approved reflections later

The existing reflection reader is retained separately. `feedback` in `lib/data/voices.ts` remains empty. Add only actual approved quotations and their attributions there; do not put third-person biographies in its `quote` field. The reader appears above profiles only when this array has content, with previous/next controls and an index when needed.

## Verification

After content changes, run the project's TypeScript and production checks, then inspect `/voices` on mobile and desktop. Verify full text, portrait crops, directory anchors, source links and carousel controls. Include keyboard navigation and reduced motion. Check that no matched portrait remains duplicated in the unnamed archive.
