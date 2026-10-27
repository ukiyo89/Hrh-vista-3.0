import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import ts from "typescript";

const source = await readFile(new URL("../lib/data/cpcg-members.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const membersModule = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
const { cpcgMembers, committeeHeads } = await import(membersModule);
const peopleSource = await readFile(new URL("../lib/data/people.ts", import.meta.url), "utf8");
const peopleModule = ts.transpileModule(peopleSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText.replace("./cpcg-members", membersModule);
const { people } = await import(`data:text/javascript;base64,${Buffer.from(peopleModule).toString("base64")}`);
const research = (await Promise.all(["a", "b"].map(async batch =>
  JSON.parse(await readFile(new URL(`../docs/cpcg-research-${batch}.json`, import.meta.url), "utf8"))
))).flat();

assert.equal(cpcgMembers.length, 47);
assert.equal(new Set(cpcgMembers.map(member => member.name)).size, 47, "No duplicate members");
assert.deepEqual(cpcgMembers.map(member => member.name), research.map(member => member.name), "Keep every supplied name and its order");
assert.equal(cpcgMembers.filter(member => member.group === "CPCG · Lavasa").length, 40);
assert.equal(cpcgMembers.filter(member => member.group === "CPCG · Pune City").length, 7);
assert.equal(people.length, 51, "Only the new roster and faculty remain");
assert.equal(people.filter(person => person.group === "Faculty & leadership").length, 4);
assert.deepEqual(people.slice(4), cpcgMembers);
assert.deepEqual(committeeHeads.map(person => person.name), ["Sabhya Walani", "Aditi Mishra", "Aayush Agarwal", "Raksha Rajesh Rao", "Mrinalini Sharma", "Vivaan Sud", "Jose Jasmine Fernandez", "Vashitav Bali", "Rishika Ranjan"], "Preview includes senior leaders and heads, with subheads in the full list");
assert.equal(cpcgMembers.filter(person => person.role.startsWith("Sub-head of ")).length, 6);
assert.equal(cpcgMembers.find(person => person.name === "Arva Dumbre").role, "SC Representative");
const profilePaths = cpcgMembers.filter(member => member.linkedin).map(member => new URL(member.linkedin).pathname.replace(/\/$/, ""));
assert.equal(new Set(profilePaths).size, profilePaths.length, "Different members must not share a guessed profile");

const existingPortraits = JSON.parse(await readFile(new URL("../public/media/people/sources.json", import.meta.url), "utf8"));
const portraits = (await Promise.all(["core", "lavasa", "pune"].map(async batch =>
  JSON.parse(await readFile(new URL(`../docs/cpcg-portraits-${batch}.json`, import.meta.url), "utf8"))
))).flat();
assert.equal(portraits.length, 47);
assert.deepEqual(portraits.map(person => person.name).sort(), cpcgMembers.map(person => person.name).sort(), "Every member has a portrait outcome");
for (const [index, member] of cpcgMembers.entries()) {
  assert.match(member.initials, /^[A-Z]{1,2}$/);
  const finding = research[index];
  const evidence = portraits.find(person => person.name === member.name);
  if (member.name === "Arnav Sharma") {
    const existing = existingPortraits.find(person => person.name === member.name);
    assert.equal(member.linkedin, existing.profileUrl, "Retain the previously sourced website credit");
    assert.equal(member.portrait, existing.portrait);
  } else if (finding.status === "verified" || finding.status === "matched-context") {
    assert.equal(member.linkedin, finding.linkedin, `${member.name}: link must match the documented profile`);
  } else {
    assert.equal(member.linkedin, undefined, `${member.name}: ambiguous profiles stay unlinked`);
    if (evidence.status !== "user-provided") assert.equal(member.portrait, undefined, `${member.name}: ambiguous photos stay unset`);
  }
  if (member.linkedin) assert.match(member.linkedin, /^https:\/\/(www|in)\.linkedin\.com\/in\/[^/?#]+\/?$/);
  if (member.portrait) {
    assert.ok(["verified", "retained", "user-provided"].includes(evidence.status), `${member.name}: portrait must have source evidence`);
    assert.equal(member.portrait, evidence.portrait);
    if (evidence.status !== "user-provided") assert.equal(new URL(member.linkedin).pathname.replace(/\/$/, ""), new URL(evidence.linkedin).pathname.replace(/\/$/, ""), `${member.name}: image and profile must match`);
    assert.match(member.portrait, /^\/media\/[a-z0-9/-]+\.(webp|jpg|png)$/);
    const bytes = await readFile(new URL(`../public${member.portrait}`, import.meta.url));
    assert.ok(bytes.length > 1000, `${member.name}: portrait must be a real local image`);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), evidence.sha256.toLowerCase(), `${member.name}: stored portrait must match retrieved bytes`);
    assert.ok(evidence.width > 0 && evidence.height > 0);
  }
}
console.log(`PASS 47 CPCG members, four faculty, nine preview leaders, ${cpcgMembers.filter(member => member.linkedin).length} profile links, ${cpcgMembers.filter(member => member.portrait).length} sourced member portraits`);
