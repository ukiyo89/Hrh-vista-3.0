import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../lib/event.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { event, getEventCountdown } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const start = Date.parse(event.start);
assert.equal(start, Date.parse("2026-11-20T18:30:00Z"), "Event begins at midnight IST, independent of host timezone");
assert.deepEqual(getEventCountdown(start - 90061000), { phase: "upcoming", days: 1, hours: 1, minutes: 1, seconds: 1 });
assert.deepEqual(getEventCountdown(start - 86400000), { phase: "upcoming", days: 1, hours: 0, minutes: 0, seconds: 0 });
assert.deepEqual(getEventCountdown(start - 1), { phase: "upcoming", days: 0, hours: 0, minutes: 0, seconds: 1 });
assert.deepEqual(getEventCountdown(start), { phase: "live", days: 0, hours: 0, minutes: 0, seconds: 0 });
assert.equal(getEventCountdown(Date.parse(event.end) - 1).phase, "live", "Event continues through 22 November IST");
assert.deepEqual(getEventCountdown(Date.parse(event.end)), { phase: "ended", days: 0, hours: 0, minutes: 0, seconds: 0 });
assert.deepEqual(getEventCountdown(Date.parse("2030-01-01T00:00:00Z")), { phase: "ended", days: 0, hours: 0, minutes: 0, seconds: 0 });
console.log("PASS countdown: IST timezone, day/hour/minute/second rollover, start, end, no negative values");
