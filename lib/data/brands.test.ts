import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  HR_VISTA_2_COMPANIES,
  TUBE_ASSETS,
  VISTA_CARD_COPY,
  computeRowSpeeds,
  getTubeTileIndex,
} from "./brands";

test("HR_VISTA_2_COMPANIES preserves all 19 verified partner/visiting brands", () => {
  assert.equal(HR_VISTA_2_COMPANIES.length, 19);
  const ids = new Set(HR_VISTA_2_COMPANIES.map((c) => c.id));
  assert.equal(ids.size, 19);
  for (const company of HR_VISTA_2_COMPANIES) {
    assert.ok(company.name.length > 0);
    assert.ok(company.logoSrc.startsWith("/media/"));
    assert.ok(company.tileSrc.startsWith("/media/moto-card/brands/"));
    assert.ok(company.sector.length > 0);
    assert.ok(company.speakerRole.length > 0);
  }
});

test("TUBE_ASSETS points to local GLB, shaders, matcap, custom UV map, and 19 brand tiles", () => {
  assert.equal(TUBE_ASSETS.tubeImages.length, 19);
  assert.equal(TUBE_ASSETS.cardModel, "/media/moto-card/card.glb");
  assert.equal(TUBE_ASSETS.cardVertex, "/media/moto-card/vertex_org.glsl");
  assert.equal(TUBE_ASSETS.cardFragment, "/media/moto-card/fragment_org.glsl");
  assert.equal(TUBE_ASSETS.matcap, "/media/moto-card/matcap.jpg");
  assert.equal(TUBE_ASSETS.cardUv, "/media/moto-card/hrvista-uv-map-card.jpg");
});

test("getTubeTileIndex distributes 19 brands evenly across 5x18 cylinder slots", () => {
  const counts = new Map<number, number>();
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 18; col++) {
      const idx = getTubeTileIndex(row, col, 18, HR_VISTA_2_COMPANIES.length);
      assert.ok(idx >= 0 && idx < 19);
      counts.set(idx, (counts.get(idx) ?? 0) + 1);
    }
  }
  assert.equal(counts.size, 19);
});

test("computeRowSpeeds matches moto-card 5-row speed gradient [0.65 .. 1.55]", () => {
  const speeds = computeRowSpeeds(5);
  assert.equal(speeds.length, 5);
  assert.ok(Math.abs(speeds[0] - 0.65) < 1e-6);
  assert.ok(Math.abs(speeds[4] - 1.55) < 1e-6);
});

test("all referenced public media files exist on disk", () => {
  const publicDir = path.resolve(process.cwd(), "public");
  for (const rel of [
    TUBE_ASSETS.cardModel,
    TUBE_ASSETS.cardVertex,
    TUBE_ASSETS.cardFragment,
    TUBE_ASSETS.matcap,
    TUBE_ASSETS.cardUv,
    ...TUBE_ASSETS.tubeImages,
    ...HR_VISTA_2_COMPANIES.map((c) => c.logoSrc),
  ]) {
    const abs = path.join(publicDir, rel.replace(/^\//, ""));
    assert.ok(fs.existsSync(abs), `Missing public asset: ${abs}`);
  }
  assert.ok(VISTA_CARD_COPY.headingLine1.length > 0);
  assert.ok(VISTA_CARD_COPY.ctaHref.startsWith("/"));
});
