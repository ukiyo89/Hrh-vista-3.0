import * as THREE from "three";

export const GLOBE_RADIUS = 1.85;
export const LAVASA_COORDS = { lat: 18.406, lon: 73.504 } as const;

// Exact Y rotation so Lon 73.504°E (Lavasa, India) faces +Z camera: -(lon + 90) deg
export const TARGET_INDIA_Y = THREE.MathUtils.degToRad(-(LAVASA_COORDS.lon + 90));
export const START_ROT_Y = TARGET_INDIA_Y - THREE.MathUtils.degToRad(18);

export interface JourneyCameraPose {
  globePos: [number, number, number];
  globeRot: [number, number, number];
  camPos: [number, number, number];
  lookAt: [number, number, number];
  ease: number;
}

export interface JourneyUiState {
  stageProgress: number;
  headingOpacity: number;
  cardsOpacity: number;
  pinOpacity: number;
  introOpacity: number;
}

/** Convert geographic latitude/longitude (degrees) to Three.js SphereGeometry coordinates. */
export function latLonToVector3(lat: number, lon: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** Smooth cubic ease-in-out curve. */
export function easeInOutCubic(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

/**
 * Compute deterministic orbital camera + globe transforms across scroll progress [0..1].
 * Ensures India/Arabian Sea is always facing the viewer from p=0, and frames Lavasa
 * cleanly in the unobstructed middle band above the scenic cards by p=1.
 */
export function computeJourneyPose(
  progress: number,
  width: number,
  elapsedSec = 0,
  pointerX = 0,
  pointerY = 0
): JourneyCameraPose {
  const p = Math.min(1, Math.max(0, progress));
  const t = Math.min(1, p / 0.74);
  const ease = easeInOutCubic(t);
  const isMobile = width < 768;

  const startGlobeY = 0.04;
  const targetGlobeY = isMobile ? -0.58 : -0.72;
  const globeY = THREE.MathUtils.lerp(startGlobeY, targetGlobeY, ease);

  const startCamZ = isMobile ? 8.3 : 6.75;
  const targetCamZ = isMobile ? 6.2 : 4.95;
  const camZ = THREE.MathUtils.lerp(startCamZ, targetCamZ, ease);

  const startCamY = 0.05;
  const targetCamY = isMobile ? 0.14 : 0.12;
  const camY = THREE.MathUtils.lerp(startCamY, targetCamY, ease) - pointerY * 0.06;
  const camX = pointerX * 0.1;

  const lookAtY = THREE.MathUtils.lerp(0.0, isMobile ? -0.18 : -0.25, ease);

  const rotY =
    THREE.MathUtils.lerp(START_ROT_Y, TARGET_INDIA_Y, ease) +
    elapsedSec * 0.004 +
    pointerX * 0.025;
  const rotX = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(4, -7.5, ease));
  const rotZ = THREE.MathUtils.degToRad(-5);

  return {
    globePos: [0, globeY, 0],
    globeRot: [rotX, rotY, rotZ],
    camPos: [camX, camY, camZ],
    lookAt: [0, lookAtY, 0],
    ease,
  };
}

/**
 * Pure projection helper for unit testing and verifying Lavasa pin visibility & placement.
 */
export function projectLavasaScreenPosition(
  progress: number,
  width: number,
  height: number
): { x: number; y: number; dot: number; visible: boolean } {
  const pose = computeJourneyPose(progress, width, 0, 0, 0);
  const camera = new THREE.PerspectiveCamera(40, width / Math.max(height, 1), 0.1, 120);
  camera.position.set(...pose.camPos);
  camera.lookAt(...pose.lookAt);
  camera.updateMatrixWorld();

  const globeMatrix = new THREE.Matrix4();
  const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(...pose.globeRot, "XYZ"));
  const pos = new THREE.Vector3(...pose.globePos);
  globeMatrix.compose(pos, quat, new THREE.Vector3(1, 1, 1));

  const lavasaLocal = latLonToVector3(LAVASA_COORDS.lat, LAVASA_COORDS.lon, GLOBE_RADIUS * 1.012);
  const lavasaWorld = lavasaLocal.clone().applyMatrix4(globeMatrix);

  const camDir = camera.position.clone().sub(lavasaWorld).normalize();
  const surfaceNormal = lavasaWorld.clone().sub(pos).normalize();
  const dot = surfaceNormal.dot(camDir);

  lavasaWorld.project(camera);
  const x = (lavasaWorld.x * 0.5 + 0.5) * width;
  const y = (-lavasaWorld.y * 0.5 + 0.5) * height;

  return {
    x,
    y,
    dot,
    visible: dot > 0.12 && progress > 0.24,
  };
}

/** Compute deterministic UI overlay opacities for the Descent to Lavasa section. */
export function computeJourneyUiState(progress: number): JourneyUiState {
  const p = Math.min(1, Math.max(0, progress));
  const introOpacity = Math.max(0, 1 - p / 0.22);
  const pinOpacity = Math.min(1, Math.max(0, (p - 0.22) / 0.18));
  const headingOpacity = Math.min(1, Math.max(0, (p - 0.26) / 0.22));
  const cardsOpacity = Math.min(1, Math.max(0, (p - 0.5) / 0.22));
  const stageProgress = Math.min(1, Math.max(0, (p - 0.48) / 0.3));

  return {
    stageProgress,
    headingOpacity,
    cardsOpacity,
    pinOpacity,
    introOpacity,
  };
}
