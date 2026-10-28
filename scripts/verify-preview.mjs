import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Verify a running preview, including bundles needed for navigation.
const origin = process.argv[2] ?? "http://127.0.0.1:3005";
const scripts = new Set();
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const coreOrder = ["Sabhya Walani", "Aditi Mishra", "Aayush Agarwal", "Kuber Arora", "Vashitav Bali", "Ameya M Laad", "Raksha Rajesh Rao", "Hanishma K", "Mrinalini Sharma", "Tanishq Kalra", "Vivaan Sud", "Harsh Maheswari", "Jose Jasmine Fernandez", "Prasanna Lakshmi K", "Rishika Ranjan", "Arva Dumbre"];
const suppliedPortraits = new Map([["Aditi Mishra", "/media/cpcg/aditi-mishra.png"], ["Vashitav Bali", "/media/cpcg/vashitav-bali.png"], ["Harsh Maheswari", "/media/cpcg/harsh-maheswari.png"]]);
for (const route of ["/", "/work", "/voices", "/brochure?page=11", "/sponsors"]) {
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, 200, `${route} must load`);
  const html = await response.text();
  assert.match(html, /HR VISTA/, `${route} must contain the site`);
  assert.doesNotMatch(html, /BKC|Jio Grounds|Bandra Kurla/i, `${route} must not advertise an unconfirmed exact venue`);
  if (route === "/") {
    assert.doesNotMatch(html, /Mumbai|data-flight-|id="mumbai"|id="journey"/i, "Homepage must not advertise the cancelled Mumbai journey");
    assert.match(html, /id="lavasa"/, "Lavasa origin must remain");
    assert.match(html, /id="next-chapter"/, "Next chapter links must retain a destination");
    const directory = html.match(/<section id="people"[\s\S]*?<\/section>/)?.[0] ?? "";
    const cards = [...directory.matchAll(/<article\b[\s\S]*?<\/article>/g)];
    assert.equal(cards.length, 67, "20 preview cards and 47 full-roster cards must be available");
    const preview = directory.split("<details")[0];
    assert.equal([...preview.matchAll(/<article\b/g)].length, 20, "Four faculty and sixteen core members are shown first");
    const names = cards.map(([card]) => card.match(/<h4>([^<]+)<\/h4>/)?.[1]);
    assert.deepEqual(names.slice(4, 20), coreOrder, "Preview follows the supplied core-team order");
    assert.deepEqual(names.slice(20, 36), coreOrder, "Full roster starts with the same core-team order");
    assert.match(directory, /<details id="cpcg-members" class="[^"]+">/, "Full roster must start closed");
    assert.match(directory, /<summary[^>]+aria-controls="all-cpcg-members"/);
    assert.match(directory, /Meet all members/);
    for (const [card] of cards) {
      const name = card.match(/<h4>([^<]+)<\/h4>/)?.[1];
      if (suppliedPortraits.has(name)) assert.ok(card.includes(`src="${suppliedPortraits.get(name)}"`), `${name}: use the supplied portrait in both views`);
      if (name === "Aditi Mishra") {
        assert.doesNotMatch(card, /<a\b|LinkedIn profile|Find on LinkedIn/, "Aditi must have no LinkedIn link or search fallback");
        continue;
      }
      const href = card.match(/<a\b[^>]*href="([^"]+)"/)?.[1];
      assert.ok(href, `${name}: retain the LinkedIn action`);
      const url = new URL(href.replaceAll("&amp;", "&"));
      assert.match(url.hostname, /^(www|in)\.linkedin\.com$/);
      if (url.pathname.startsWith("/in/")) assert.match(card, />LinkedIn profile</);
      else {
        assert.equal(url.pathname, "/search/results/people/");
        assert.equal(url.searchParams.get("keywords"), `${name} CHRIST University`);
        assert.match(card, />Find on LinkedIn</, "Searches must not be presented as confirmed profiles");
      }
    }
  }
  for (const match of html.matchAll(/<script[^>]+src="([^\"]+)"/g)) scripts.add(match[1]);
  console.log(`PASS ${route}`);
}
for (const src of scripts) {
  const response = await fetch(new URL(src, origin));
  assert.equal(response.status, 200, `JavaScript bundle missing: ${src}`);
  assert.match(response.headers.get("content-type") ?? "", /javascript/);
}
console.log(`PASS ${scripts.size} JavaScript bundles`);
for (const [name, portrait] of suppliedPortraits) {
  const response = await fetch(new URL(portrait, origin));
  assert.equal(response.status, 200, `${name}: supplied portrait must load`);
  assert.match(response.headers.get("content-type") ?? "", /^image\/png/);
  const servedImage = Buffer.from(await response.arrayBuffer());
  const localImage = await readFile(new URL(`../public${portrait}`, import.meta.url));
  assert.equal(hash(servedImage), hash(localImage), `${name}: served portrait must match the supplied local image`);
}
console.log("PASS three supplied portraits");
const pdfResponse = await fetch(new URL("/brochure/HR-VISTA-3.0.pdf", origin));
assert.equal(pdfResponse.status, 200);
const served = Buffer.from(await pdfResponse.arrayBuffer());
const source = await readFile(new URL("../public/brochure/HR-VISTA-3.0.pdf", import.meta.url));
assert.equal(served.subarray(0, 4).toString(), "%PDF");
assert.equal(hash(served), hash(source), "Download must match the complete brochure");
console.log(`PASS brochure download (${served.length.toLocaleString()} bytes)`);
const calendar = await fetch(new URL("/hr-vista-2026.ics", origin));
assert.equal(calendar.status, 200);
const calendarText = await calendar.text();
assert.match(calendarText, /DTSTART;VALUE=DATE:20261121/);
assert.match(calendarText, /DTEND;VALUE=DATE:20261123/);
assert.doesNotMatch(calendarText, /LOCATION:|Mumbai|BKC|Jio Grounds/i);
console.log("PASS all-day calendar download (21–22 November; no unconfirmed location)");
