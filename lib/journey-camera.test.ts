import test from "node:test";
import assert from "node:assert/strict";
import {
  computeJourneyPose,
  computeJourneyUiState,
  latLonToVector3,
  projectLavasaScreenPosition,
} from "./journey-camera";

test("latLonToVector3 places Lavasa on the globe surface with exact radius", () => {
  const vec = latLonToVector3(18.406, 73.504, 1.85);
  assert.ok(Math.abs(vec.length() - 1.85) < 1e-6);
  // Northern hemisphere -> positive Y
  assert.ok(vec.y > 0);
});

test("India / Lavasa faces the camera from p=0 through p=1 on desktop and mobile", () => {
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
  ]) {
    const start = projectLavasaScreenPosition(0, w, h);
    const mid = projectLavasaScreenPosition(0.45, w, h);
    const end = projectLavasaScreenPosition(1.0, w, h);

    assert.ok(start.dot > 0.7, `Expected India facing camera at p=0 (${w}x${h}), got dot=${start.dot}`);
    assert.ok(mid.dot > 0.85, `Expected India facing camera at p=0.45 (${w}x${h}), got dot=${mid.dot}`);
    assert.ok(end.dot > 0.85, `Expected India facing camera at p=1.0 (${w}x${h}), got dot=${end.dot}`);
  }
});

test("At p=1.0, Lavasa pinpoint projects cleanly into the unobstructed middle zone above cards", () => {
  const desktop = projectLavasaScreenPosition(1.0, 1440, 900);
  assert.ok(desktop.visible, "Pin should be visible at p=1.0");
  assert.ok(desktop.x > 550 && desktop.x < 890, `Desktop pin X out of center band: ${desktop.x}`);
  assert.ok(
    desktop.y >= 260 && desktop.y <= 470,
    `Desktop pin Y (${desktop.y}) must sit cleanly between heading and cards`
  );

  const mobile = projectLavasaScreenPosition(1.0, 390, 844);
  assert.ok(mobile.visible, "Mobile pin should be visible at p=1.0");
  assert.ok(mobile.x > 130 && mobile.x < 260, `Mobile pin X out of center band: ${mobile.x}`);
  assert.ok(
    mobile.y >= 200 && mobile.y <= 430,
    `Mobile pin Y (${mobile.y}) must sit cleanly between heading and cards`
  );
});

test("computeJourneyUiState transitions cleanly from opening intro to arrival cards", () => {
  const s0 = computeJourneyUiState(0);
  assert.equal(s0.introOpacity, 1);
  assert.equal(s0.headingOpacity, 0);
  assert.equal(s0.cardsOpacity, 0);

  const sMid = computeJourneyUiState(0.5);
  assert.equal(sMid.introOpacity, 0);
  assert.ok(sMid.headingOpacity > 0.5);
  assert.ok(sMid.pinOpacity === 1);

  const sEnd = computeJourneyUiState(1.0);
  assert.equal(sEnd.stageProgress, 1);
  assert.equal(sEnd.headingOpacity, 1);
  assert.equal(sEnd.cardsOpacity, 1);
  assert.equal(sEnd.pinOpacity, 1);
});

test("computeJourneyPose clamps out-of-range progress cleanly", () => {
  const low = computeJourneyPose(-0.5, 1440);
  const zero = computeJourneyPose(0, 1440);
  assert.deepEqual(low, zero);

  const high = computeJourneyPose(1.5, 1440);
  const one = computeJourneyPose(1, 1440);
  assert.deepEqual(high, one);
});

test("globe rotation stays completely static across progress, elapsed time, and pointer input", () => {
  const p0 = computeJourneyPose(0, 1440, 0, 0, 0);
  const pMid = computeJourneyPose(0.5, 1440, 25, 0.8, -0.6);
  const pEnd = computeJourneyPose(1.0, 1440, 120, -1, 1);

  assert.deepEqual(p0.globeRot, pMid.globeRot);
  assert.deepEqual(pMid.globeRot, pEnd.globeRot);
});
