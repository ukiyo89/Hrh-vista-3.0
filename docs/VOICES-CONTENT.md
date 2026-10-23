# Past voices

The `/voices` page presents all 13 supplied biographies as speaker profiles. The source is `Content pics/Past speak pics/Website Content(Speaker feed back.txt`. These are third-person biographies, not speaker testimonials. Biography text is preserved verbatim; honorific punctuation and spacing in display names are normalized.

All biographies appear in full in the page. A keyboard-accessible “Find a speaker” directory links to each profile. The opening archive carousel retains swipe, arrow-key and button navigation, with reduced-motion support.

## Profile content and source links

Edit `speakerProfiles` in `lib/data/voices-media.ts`. Each profile has a stable `id`, display `name` and full `biography`. The optional `linkedIn` field supplies a public attribution link. Only supported profile associations should be published; do not infer a link from a common name. See `docs/VOICE-SOURCES.md` for researched URLs, historical-role caveats and unresolved associations.

The supplied biographies are published as supplied content, not as independently verified current-employment claims. The Senthil Kumar S supply-chain description conflicts with the official event HR/HDFC Life attribution. Debansh Roy's supplied AllianceBernstein role is historical relative to current profile research. Preserve source copy pending the content owner's correction.

## Match portraits safely

`pastVoices` stores archive images with neutral descriptive alt text. Its numbered IDs identify files. On 24 October 2026, the content owner explicitly confirmed in chat that photos 01–13 match the exact order of the thirteen names in the supplied biography file. All thirteen `portraitId` assignments now follow that confirmed order. This mapping rests on content-owner confirmation, not facial comparison or independent LinkedIn portrait verification.

Attach a `portraitId` to a speaker only when named source evidence or content-owner confirmation supports that exact supplied photograph. Record the supporting URL, file or explicit content-owner confirmation in `portraitSource`. A verified assignment displays the portrait with the profile and removes it from the separate unnamed portrait archive. Unmatched photographs remain in that archive. All thirteen current portraits are assigned by the confirmed mapping, so the separate unnamed archive is omitted automatically. There are no guessed name/photo pairings or placeholder testimonials.

Optimized WebP files live in `public/media/voices/`; the original supplied files remain in `Content pics/`. Portrait IDs map to the original filenames below. Numbered files sort before the matching unnumbered filename.

| ID | Original filename in `Past speak pics` |
| --- | --- |
| 01 | WhatsApp Image 2026-10-21 at 10.06.44 PM.jpeg |
| 02 | WhatsApp Image 2026-10-21 at 10.06.45 PM (1).jpeg |
| 03 | WhatsApp Image 2026-10-21 at 10.06.45 PM.jpeg |
| 04 | WhatsApp Image 2026-10-21 at 10.06.46 PM (1).jpeg |
| 05 | WhatsApp Image 2026-10-21 at 10.06.46 PM (2).jpeg |
| 06 | WhatsApp Image 2026-10-21 at 10.06.46 PM (3).jpeg |
| 07 | WhatsApp Image 2026-10-21 at 10.06.46 PM (4).jpeg |
| 08 | WhatsApp Image 2026-10-21 at 10.06.46 PM (5).jpeg |
| 09 | WhatsApp Image 2026-10-21 at 10.06.46 PM.jpeg |
| 10 | WhatsApp Image 2026-10-21 at 10.06.47 PM (1).jpeg |
| 11 | WhatsApp Image 2026-10-21 at 10.06.47 PM (2).jpeg |
| 12 | WhatsApp Image 2026-10-21 at 10.06.47 PM (3).jpeg |
| 13 | WhatsApp Image 2026-10-21 at 10.06.47 PM.jpeg |


The opening carousel uses `Event pics/WhatsApp Image 2026-10-21 at 10.20.06 PM.jpeg`, `10.20.07 PM (3).jpeg` and `10.20.07 PM.jpeg`. Its order and descriptive text are in `voicesArchiveImages` in the same data file.

## Add actual approved reflections later

The existing reflection reader is retained separately. `feedback` in `lib/data/voices.ts` remains empty. Add only actual approved quotations and their attributions there; do not put third-person biographies in its `quote` field. The reader appears above profiles only when this array has content, with previous/next controls and an index when needed.

## Verification

After content changes, run the project's TypeScript and production checks, then inspect `/voices` on mobile and desktop. Verify full text, portrait crops, directory anchors, source links and carousel controls. Include keyboard navigation and reduced motion. Check that no matched portrait remains duplicated in the unnamed archive.
