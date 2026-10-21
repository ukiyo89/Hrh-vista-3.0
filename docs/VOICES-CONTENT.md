# Voices from HR VISTA 2.0

The `/voices` page is ready for approved reflections. No quotes or identities have been invented. Until content is supplied, it displays “Reflections coming soon” with clearly identified archive photography.

## Add content

Edit only `lib/data/voices.ts`. Add approved entries to the exported `feedback` array. Each entry has these fields:

```ts
{
  quote: "The exact approved reflection. Paragraph breaks may use \n\n.",
  name: "The person's approved name",
  role: "Their approved role",
  org: "Their approved organisation",
  portrait: "/media/people/approved-portrait.jpg", // optional
  source: "https://example.com/original-publication", // optional
}
```

The example above is a field template, not publishable testimonial content. Use only supplied and approved quotes, attributions and photographs. The page renders text safely and preserves paragraph breaks; do not add HTML to quotes. Use a public `https://` source URL when available, and keep local portrait files in `public/media/people/`.

The array order is the reading order. Around 20 entries are supported without layout changes. One entry displays as a full readable reflection; multiple entries add previous/next controls and a “Browse all voices” index. The default empty state disappears automatically when the array contains content. Quotes are never truncated.

## Check after adding

Run the existing TypeScript and production checks, then inspect `/voices` at mobile and desktop widths. Verify long quotes, paragraph breaks, full attribution, optional portraits, source links, previous/next buttons and the full voice index. Check reduced motion, keyboard navigation and missing images. The page metadata and homepage teaser automatically stop saying “coming soon” when the array contains entries.
