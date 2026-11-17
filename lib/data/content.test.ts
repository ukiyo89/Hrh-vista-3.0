import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { content } from "./content";

test("HR VISTA 3.0 speakers contains all 27 unique speakers from Being Networks", () => {
  const { speakers } = content.vista30;
  assert.equal(speakers.length, 27);

  const normalizedNames = speakers.map((s) => s.name.trim().toLowerCase());
  assert.equal(new Set(normalizedNames).size, 27, "Speakers must not contain duplicates");
});

test("Every speaker has verified name, designation, and an existing local portrait asset", () => {
  for (const speaker of content.vista30.speakers) {
    assert.ok(speaker.name.trim().length > 0, "Speaker name must be non-empty");
    assert.ok(speaker.designation.trim().length > 0, `${speaker.name} must have a designation`);
    assert.ok(speaker.portrait.startsWith("/media/speakers/"), `${speaker.name} must use local portrait`);

    const filePath = path.join(process.cwd(), "public", speaker.portrait.replace(/^\//, ""));
    assert.equal(fs.existsSync(filePath), true, `Missing portrait file for ${speaker.name}: ${filePath}`);
    const stat = fs.statSync(filePath);
    assert.ok(stat.size > 1000, `Portrait file for ${speaker.name} is unexpectedly small: ${stat.size} bytes`);
  }
});

test("Verified LinkedIn URLs use linkedin.com/in and unavailable profiles remain omitted", () => {
  for (const speaker of content.vista30.speakers) {
    if (speaker.linkedin !== undefined) {
      assert.match(
        speaker.linkedin,
        /^https:\/\/(www|[a-z]{2})\.linkedin\.com\/in\/[a-zA-Z0-9._-]+$/,
        `Invalid LinkedIn profile URL for ${speaker.name}: ${speaker.linkedin}`
      );
    }
  }

  const jayshree = content.vista30.speakers.find((s) => s.name === "Jayshree Rao");
  assert.ok(jayshree, "Jayshree Rao should be present");
  assert.equal(jayshree.linkedin, undefined, "Jayshree Rao had no LinkedIn URL on source page");
});
