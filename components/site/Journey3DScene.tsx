"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface Journey3DSceneProps {
  progress: number; // 0 to 1 scroll progression
  onPinPosition?: (pos: { x: number; y: number; visible: boolean }) => void;
}

interface CityNode {
  lat: number;
  lon: number;
  size: number;
  intensity: number;
  name: string;
}

const MAJOR_CITIES: CityNode[] = [
  // Western India & Maharashtra cluster
  { lat: 18.406, lon: 73.504, size: 9, intensity: 1.0, name: "Lavasa" },
  { lat: 18.52, lon: 73.856, size: 11, intensity: 1.0, name: "Pune" },
  { lat: 19.076, lon: 72.877, size: 16, intensity: 1.0, name: "Mumbai" },
  { lat: 19.997, lon: 73.789, size: 8, intensity: 0.9, name: "Nashik" },
  { lat: 19.876, lon: 75.343, size: 7, intensity: 0.8, name: "Aurangabad" },
  { lat: 21.145, lon: 79.088, size: 10, intensity: 0.9, name: "Nagpur" },
  { lat: 16.705, lon: 74.243, size: 6, intensity: 0.75, name: "Kolhapur" },
  { lat: 15.299, lon: 74.124, size: 7, intensity: 0.8, name: "Goa" },

  // Wider India & South Asia
  { lat: 28.613, lon: 77.209, size: 18, intensity: 1.0, name: "Delhi" },
  { lat: 12.971, lon: 77.594, size: 15, intensity: 1.0, name: "Bengaluru" },
  { lat: 17.385, lon: 78.486, size: 14, intensity: 1.0, name: "Hyderabad" },
  { lat: 13.082, lon: 80.27, size: 13, intensity: 1.0, name: "Chennai" },
  { lat: 22.572, lon: 88.363, size: 15, intensity: 1.0, name: "Kolkata" },
  { lat: 23.022, lon: 72.571, size: 13, intensity: 0.95, name: "Ahmedabad" },
  { lat: 21.17, lon: 72.831, size: 10, intensity: 0.9, name: "Surat" },
  { lat: 22.307, lon: 73.181, size: 8, intensity: 0.85, name: "Vadodara" },
  { lat: 26.912, lon: 75.787, size: 11, intensity: 0.9, name: "Jaipur" },
  { lat: 26.846, lon: 80.946, size: 11, intensity: 0.9, name: "Lucknow" },
  { lat: 26.449, lon: 80.331, size: 9, intensity: 0.85, name: "Kanpur" },
  { lat: 22.719, lon: 75.857, size: 9, intensity: 0.85, name: "Indore" },
  { lat: 23.259, lon: 77.412, size: 8, intensity: 0.8, name: "Bhopal" },
  { lat: 30.733, lon: 76.779, size: 10, intensity: 0.9, name: "Chandigarh" },
  { lat: 31.634, lon: 74.872, size: 9, intensity: 0.85, name: "Amritsar" },
  { lat: 25.594, lon: 85.137, size: 10, intensity: 0.85, name: "Patna" },
  { lat: 25.317, lon: 82.973, size: 9, intensity: 0.85, name: "Varanasi" },
  { lat: 20.296, lon: 85.824, size: 8, intensity: 0.8, name: "Bhubaneswar" },
  { lat: 17.686, lon: 83.218, size: 9, intensity: 0.8, name: "Visakhapatnam" },
  { lat: 11.016, lon: 76.955, size: 9, intensity: 0.85, name: "Coimbatore" },
  { lat: 9.931, lon: 76.267, size: 9, intensity: 0.85, name: "Kochi" },
  { lat: 8.524, lon: 76.936, size: 8, intensity: 0.8, name: "Thiruvananthapuram" },
  { lat: 26.144, lon: 91.736, size: 8, intensity: 0.8, name: "Guwahati" },
  { lat: 24.86, lon: 67.001, size: 14, intensity: 0.95, name: "Karachi" },
  { lat: 31.52, lon: 74.358, size: 13, intensity: 0.9, name: "Lahore" },
  { lat: 33.684, lon: 73.047, size: 10, intensity: 0.85, name: "Islamabad" },
  { lat: 23.81, lon: 90.412, size: 13, intensity: 0.9, name: "Dhaka" },
  { lat: 6.927, lon: 79.861, size: 9, intensity: 0.85, name: "Colombo" },
  { lat: 27.717, lon: 85.324, size: 8, intensity: 0.75, name: "Kathmandu" },

  // Middle East, Asia & Europe
  { lat: 25.204, lon: 55.27, size: 14, intensity: 0.95, name: "Dubai" },
  { lat: 24.453, lon: 54.377, size: 11, intensity: 0.85, name: "Abu Dhabi" },
  { lat: 25.285, lon: 51.531, size: 10, intensity: 0.85, name: "Doha" },
  { lat: 24.713, lon: 46.675, size: 12, intensity: 0.85, name: "Riyadh" },
  { lat: 21.485, lon: 39.192, size: 10, intensity: 0.8, name: "Jeddah" },
  { lat: 35.689, lon: 51.389, size: 12, intensity: 0.85, name: "Tehran" },
  { lat: 30.044, lon: 31.235, size: 15, intensity: 0.95, name: "Cairo" },
  { lat: 41.008, lon: 28.978, size: 13, intensity: 0.9, name: "Istanbul" },
  { lat: 1.352, lon: 103.819, size: 13, intensity: 0.95, name: "Singapore" },
  { lat: 3.139, lon: 101.686, size: 11, intensity: 0.85, name: "Kuala Lumpur" },
  { lat: 13.756, lon: 100.501, size: 13, intensity: 0.9, name: "Bangkok" },
  { lat: 10.823, lon: 106.629, size: 10, intensity: 0.8, name: "Ho Chi Minh City" },
  { lat: 22.319, lon: 114.169, size: 14, intensity: 0.95, name: "Hong Kong" },
  { lat: 31.23, lon: 121.473, size: 15, intensity: 0.95, name: "Shanghai" },
  { lat: 39.904, lon: 116.407, size: 14, intensity: 0.9, name: "Beijing" },
  { lat: 35.676, lon: 139.65, size: 15, intensity: 0.95, name: "Tokyo" },
  { lat: 51.507, lon: -0.127, size: 14, intensity: 0.9, name: "London" },
  { lat: 48.856, lon: 2.352, size: 13, intensity: 0.9, name: "Paris" },
  { lat: -6.208, lon: 106.845, size: 12, intensity: 0.85, name: "Jakarta" },
];

// Deterministic pseudo-random generator for crisp, consistent city cluster specks
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Reusable scratch vectors (Zero GC inside render loop)
const _lavasaWorld = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _surfaceNormal = new THREE.Vector3();

export function Journey3DScene({ progress, onPinPosition }: Journey3DSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const onPinPositionRef = useRef(onPinPosition);
  onPinPositionRef.current = onPinPosition;

  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    let disposed = false;

    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement("canvas");
        const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
        if (!gl) return true;
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || "");
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / Math.max(height, 1), 0.1, 120);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    container.appendChild(renderer.domElement);

    // Subtle orbital reflection environment for delicate ocean glint
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.14;
    pmremGenerator.dispose();

    // 2. Layered Deep-Space Starfield (Distant subtle stars + foreground twinkle dust)
    const starCount = 2200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const rngStars = seededRandom(4207);

    for (let i = 0; i < starCount; i++) {
      const theta = rngStars() * Math.PI * 2;
      const phi = Math.acos(rngStars() * 2 - 1);
      const dist = 28 + rngStars() * 55;

      starPositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = dist * Math.cos(phi);

      const tint = rngStars();
      const lum = 0.45 + rngStars() * 0.55;
      if (tint > 0.82) {
        // Cool sapphire blue star
        starColors[i * 3] = 0.65 * lum;
        starColors[i * 3 + 1] = 0.82 * lum;
        starColors[i * 3 + 2] = 1.0 * lum;
      } else if (tint < 0.1) {
        // Subtle warm star
        starColors[i * 3] = 1.0 * lum;
        starColors[i * 3 + 1] = 0.88 * lum;
        starColors[i * 3 + 2] = 0.74 * lum;
      } else {
        starColors[i * 3] = 0.92 * lum;
        starColors[i * 3 + 1] = 0.95 * lum;
        starColors[i * 3 + 2] = 1.0 * lum;
      }
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.68,
      sizeAttenuation: true,
    });
    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    // 3. Globe Root Group
    const globe = new THREE.Group();
    scene.add(globe);

    const GLOBE_RADIUS = 1.85;

    // Converts geographic lat/lon to sphere position matching Three.js SphereGeometry UV mapping
    const latLonToVector3 = (lat: number, lon: number, radius = GLOBE_RADIUS) => {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon + 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const projectTex = (lon: number, lat: number, w: number, h: number): [number, number] => [
      ((lon + 180) / 360) * w,
      ((90 - lat) / 180) * h,
    ];

    // 4. Procedural Equirectangular Maps (Albedo + Emissive City Lights + Ocean Roughness + Cloud Veil)
    const texWidth = 2048;
    const texHeight = 1024;

    const albedoCanvas = document.createElement("canvas");
    albedoCanvas.width = texWidth;
    albedoCanvas.height = texHeight;
    const albedoCtx = albedoCanvas.getContext("2d");

    const emissiveCanvas = document.createElement("canvas");
    emissiveCanvas.width = texWidth;
    emissiveCanvas.height = texHeight;
    const emissiveCtx = emissiveCanvas.getContext("2d");

    const roughnessCanvas = document.createElement("canvas");
    roughnessCanvas.width = 1024;
    roughnessCanvas.height = 512;
    const roughnessCtx = roughnessCanvas.getContext("2d");

    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cloudCtx = cloudCanvas.getContext("2d");

    const earthTexture = new THREE.CanvasTexture(albedoCanvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const emissiveTexture = new THREE.CanvasTexture(emissiveCanvas);
    emissiveTexture.colorSpace = THREE.SRGBColorSpace;
    emissiveTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const roughnessTexture = new THREE.CanvasTexture(roughnessCanvas);
    roughnessTexture.colorSpace = THREE.NoColorSpace;

    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    cloudTexture.colorSpace = THREE.SRGBColorSpace;

    // Paint subtle procedural cloud wisps
    if (cloudCtx) {
      cloudCtx.clearRect(0, 0, 1024, 512);
      const rngCloud = seededRandom(9011);
      for (let i = 0; i < 220; i++) {
        const cx = rngCloud() * 1024;
        const cy = 40 + rngCloud() * 432;
        const rx = 28 + rngCloud() * 90;
        const ry = 5 + rngCloud() * 16;
        const alpha = 0.03 + rngCloud() * 0.08;
        const grad = cloudCtx.createRadialGradient(cx, cy, 0, cx, cy, rx);
        grad.addColorStop(0, `rgba(195, 224, 255, ${alpha})`);
        grad.addColorStop(0.55, `rgba(155, 198, 250, ${alpha * 0.45})`);
        grad.addColorStop(1, "rgba(155, 198, 250, 0)");
        cloudCtx.save();
        cloudCtx.translate(cx, cy);
        cloudCtx.rotate((rngCloud() - 0.5) * 0.25);
        cloudCtx.scale(1, ry / rx);
        cloudCtx.translate(-cx, -cy);
        cloudCtx.fillStyle = grad;
        cloudCtx.beginPath();
        cloudCtx.arc(cx, cy, rx, 0, Math.PI * 2);
        cloudCtx.fill();
        cloudCtx.restore();
      }
      cloudTexture.needsUpdate = true;
    }

    // Initialize deep midnight-navy Ocean base so the globe matches the dark site palette
    if (albedoCtx) {
      const oceanGrad = albedoCtx.createLinearGradient(0, 0, 0, texHeight);
      oceanGrad.addColorStop(0, "#040b1a");
      oceanGrad.addColorStop(0.5, "#06132b");
      oceanGrad.addColorStop(1, "#030814");
      albedoCtx.fillStyle = oceanGrad;
      albedoCtx.fillRect(0, 0, texWidth, texHeight);

      // Faint orbital graticule lines
      albedoCtx.strokeStyle = "rgba(86, 138, 214, 0.05)";
      albedoCtx.lineWidth = 1;
      for (let lon = -180; lon <= 180; lon += 15) {
        const [x] = projectTex(lon, 0, texWidth, texHeight);
        albedoCtx.beginPath();
        albedoCtx.moveTo(x, 0);
        albedoCtx.lineTo(x, texHeight);
        albedoCtx.stroke();
      }
      for (let lat = -75; lat <= 75; lat += 15) {
        const [, y] = projectTex(0, lat, texWidth, texHeight);
        albedoCtx.beginPath();
        albedoCtx.moveTo(0, y);
        albedoCtx.lineTo(texWidth, y);
        albedoCtx.stroke();
      }
      earthTexture.needsUpdate = true;
    }

    if (emissiveCtx) {
      emissiveCtx.fillStyle = "#000000";
      emissiveCtx.fillRect(0, 0, texWidth, texHeight);
      emissiveTexture.needsUpdate = true;
    }

    if (roughnessCtx) {
      // Oceans are glossier (darker gray -> roughness ~0.34) for sunlit marine glint
      roughnessCtx.fillStyle = "#565656";
      roughnessCtx.fillRect(0, 0, 1024, 512);
      roughnessTexture.needsUpdate = true;
    }

    const abortController = new AbortController();

    fetch("/media/journey/world.geojson", { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        if (disposed || !albedoCtx || !emissiveCtx || !roughnessCtx) return;

        const tracePolygons = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
          data.features.forEach((feature: { geometry: { type: string; coordinates: unknown } }) => {
            const geom = feature.geometry;
            const polygons =
              geom.type === "Polygon"
                ? [geom.coordinates as number[][][]]
                : (geom.coordinates as number[][][][]);

            polygons.forEach((polygon) => {
              ctx.beginPath();
              polygon.forEach((ring) => {
                ring.forEach(([lon, lat], idx) => {
                  const [x, y] = projectTex(lon, lat, w, h);
                  if (idx === 0) ctx.moveTo(x, y);
                  else ctx.lineTo(x, y);
                });
              });
              ctx.closePath();
              ctx.fill("evenodd");
              ctx.stroke();
            });
          });
        };

        // 1) Subtle bathymetric coastal contour on deep ocean
        albedoCtx.save();
        albedoCtx.fillStyle = "rgba(0, 0, 0, 0)";
        albedoCtx.strokeStyle = "rgba(32, 82, 162, 0.14)";
        albedoCtx.lineWidth = 10;
        albedoCtx.lineJoin = "round";
        tracePolygons(albedoCtx, texWidth, texHeight);
        albedoCtx.strokeStyle = "rgba(62, 122, 208, 0.18)";
        albedoCtx.lineWidth = 3.5;
        tracePolygons(albedoCtx, texWidth, texHeight);
        albedoCtx.restore();

        // 2) Continents in deep obsidian-slate indigo with crisp muted coastlines
        const landGrad = albedoCtx.createLinearGradient(0, 0, 0, texHeight);
        landGrad.addColorStop(0, "#0e1d38");
        landGrad.addColorStop(0.5, "#0b172e");
        landGrad.addColorStop(1, "#081224");
        albedoCtx.fillStyle = landGrad;
        albedoCtx.strokeStyle = "rgba(82, 142, 224, 0.56)";
        albedoCtx.lineWidth = 1.05;
        tracePolygons(albedoCtx, texWidth, texHeight);

        // 3) Roughness mask: Land matte (#dcdcdc), oceans subtly glossy (#6a6a6a)
        roughnessCtx.fillStyle = "#dcdcdc";
        roughnessCtx.strokeStyle = "#b8b8b8";
        roughnessCtx.lineWidth = 1;
        tracePolygons(roughnessCtx, 1024, 512);

        // 4) Emissive Night Lights Map: Pure night continents + restrained warm city pinpoints
        emissiveCtx.fillStyle = "#000000";
        emissiveCtx.strokeStyle = "rgba(44, 96, 175, 0.22)";
        emissiveCtx.lineWidth = 1.0;
        tracePolygons(emissiveCtx, texWidth, texHeight);

        // Helper for drawing a realistic, non-bloated city-light pinpoint
        const drawCityGlow = (
          lat: number,
          lon: number,
          radiusPx: number,
          intensity: number,
          hasHotCore = true
        ) => {
          const [cx, cy] = projectTex(lon, lat, texWidth, texHeight);
          const r = radiusPx * 1.95;

          [emissiveCtx, albedoCtx].forEach((targetCtx, layerIdx) => {
            const mult = layerIdx === 0 ? 0.78 : 0.45;
            const grad = targetCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, `rgba(255, 240, 194, ${Math.min(1, intensity * mult)})`);
            grad.addColorStop(0.32, `rgba(245, 182, 74, ${intensity * 0.65 * mult})`);
            grad.addColorStop(0.68, `rgba(218, 120, 32, ${intensity * 0.24 * mult})`);
            grad.addColorStop(1, "rgba(218, 120, 32, 0)");

            targetCtx.fillStyle = grad;
            targetCtx.beginPath();
            targetCtx.arc(cx, cy, r, 0, Math.PI * 2);
            targetCtx.fill();

            if (hasHotCore) {
              targetCtx.fillStyle = `rgba(255, 248, 224, ${Math.min(0.9, intensity * 0.88)})`;
              targetCtx.beginPath();
              targetCtx.arc(cx, cy, Math.max(1.0, radiusPx * 0.2), 0, Math.PI * 2);
              targetCtx.fill();
            }
          });
        };

        // City arterial light corridors across South Asia
        const connectLightCorridor = (a: CityNode, b: CityNode, alpha = 0.42) => {
          const [x1, y1] = projectTex(a.lon, a.lat, texWidth, texHeight);
          const [x2, y2] = projectTex(b.lon, b.lat, texWidth, texHeight);
          [emissiveCtx, albedoCtx].forEach((targetCtx) => {
            targetCtx.strokeStyle = `rgba(255, 192, 82, ${alpha})`;
            targetCtx.lineWidth = 1.15;
            targetCtx.beginPath();
            targetCtx.moveTo(x1, y1);
            targetCtx.lineTo(x2, y2);
            targetCtx.stroke();
          });
        };

        const byName = (name: string) => MAJOR_CITIES.find((c) => c.name === name)!;
        const corridors: [string, string, number][] = [
          ["Mumbai", "Lavasa", 0.72],
          ["Lavasa", "Pune", 0.78],
          ["Mumbai", "Pune", 0.75],
          ["Mumbai", "Nashik", 0.52],
          ["Pune", "Kolhapur", 0.45],
          ["Kolhapur", "Goa", 0.38],
          ["Goa", "Kochi", 0.4],
          ["Mumbai", "Surat", 0.58],
          ["Surat", "Vadodara", 0.55],
          ["Vadodara", "Ahmedabad", 0.62],
          ["Ahmedabad", "Jaipur", 0.46],
          ["Jaipur", "Delhi", 0.65],
          ["Delhi", "Chandigarh", 0.62],
          ["Chandigarh", "Amritsar", 0.52],
          ["Delhi", "Kanpur", 0.58],
          ["Kanpur", "Lucknow", 0.62],
          ["Lucknow", "Varanasi", 0.52],
          ["Varanasi", "Patna", 0.52],
          ["Patna", "Kolkata", 0.52],
          ["Pune", "Hyderabad", 0.52],
          ["Hyderabad", "Bengaluru", 0.56],
          ["Bengaluru", "Chennai", 0.62],
          ["Chennai", "Coimbatore", 0.48],
          ["Coimbatore", "Kochi", 0.48],
          ["Mumbai", "Nagpur", 0.42],
          ["Nagpur", "Hyderabad", 0.42],
          ["Indore", "Bhopal", 0.45],
          ["Ahmedabad", "Indore", 0.4],
          ["Lahore", "Islamabad", 0.5],
          ["Karachi", "Lahore", 0.38],
          ["Kolkata", "Dhaka", 0.5],
          ["Dubai", "Abu Dhabi", 0.68],
          ["Dubai", "Doha", 0.42],
        ];
        corridors.forEach(([a, b, alpha]) => connectLightCorridor(byName(a), byName(b), alpha));

        // Micro-settlement scatter around Indian, Gulf, European & East Asian hubs for satellite realism
        const rngCity = seededRandom(2026);
        const scatterHubs = MAJOR_CITIES.slice(0, 38);
        scatterHubs.forEach((hub) => {
          const count = hub.name === "Mumbai" || hub.name === "Delhi" || hub.name === "Pune" ? 18 : 10;
          for (let i = 0; i < count; i++) {
            const angle = rngCity() * Math.PI * 2;
            const spread = (0.35 + rngCity() * 2.2) * (hub.name === "Lavasa" ? 0.55 : 1);
            drawCityGlow(
              hub.lat + Math.sin(angle) * spread,
              hub.lon + Math.cos(angle) * spread * 1.15,
              1.6 + rngCity() * 2.4,
              0.35 + rngCity() * 0.42,
              false
            );
          }
        });

        // Primary bright city hubs
        MAJOR_CITIES.forEach((city) => {
          drawCityGlow(city.lat, city.lon, city.size * 0.62, city.intensity, true);
        });

        earthTexture.needsUpdate = true;
        emissiveTexture.needsUpdate = true;
        roughnessTexture.needsUpdate = true;
      })
      .catch(() => {});

    // 5. Earth Sphere Mesh (PBR + Restrained Night Emissive Layer)
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: emissiveTexture,
      emissiveIntensity: 0.92,
      roughnessMap: roughnessTexture,
      roughness: 0.92,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globe.add(earthMesh);

    // 6. Subtle High-Altitude Cloud Layer
    const cloudGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.007, 64, 48);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globe.add(cloudMesh);

    // 7. Restrained Dual Atmospheric Scatter (Subtle Limb + Quiet Orbital Halo)
    const innerAtmoGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.003, 64, 64);
    const innerAtmoMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float ndotv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
          float fresnel = pow(1.0 - ndotv, 3.1);
          vec3 skyBlue = vec3(0.16, 0.38, 0.78);
          vec3 horizonCyan = vec3(0.32, 0.58, 0.92);
          vec3 col = mix(skyBlue, horizonCyan, pow(1.0 - ndotv, 5.0));
          gl_FragColor = vec4(col, fresnel * 0.28);
        }
      `,
    });
    const innerAtmoMesh = new THREE.Mesh(innerAtmoGeometry, innerAtmoMaterial);
    globe.add(innerAtmoMesh);

    const outerAtmoGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.045, 64, 64);
    const outerAtmoMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float rim = pow(clamp(dot(normalize(vNormal), normalize(vViewDir)) + 0.52, 0.0, 1.0), 4.0);
          float edge = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 2.8);
          vec3 atmoColor = vec3(0.14, 0.34, 0.72);
          gl_FragColor = vec4(atmoColor, edge * rim * 0.36);
        }
      `,
    });
    const outerAtmoMesh = new THREE.Mesh(outerAtmoGeometry, outerAtmoMaterial);
    globe.add(outerAtmoMesh);

    // 8. Lavasa Marker Pin & Orbital Arrival Trajectory Arc
    const lavasaSurfaceVec = latLonToVector3(18.406, 73.504, GLOBE_RADIUS * 1.012);
    const pinGeometry = new THREE.SphereGeometry(0.018, 16, 16);
    const pinMaterial = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.92,
    });
    const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
    pinMesh.position.copy(lavasaSurfaceVec);
    globe.add(pinMesh);

    // Trajectory arc sweeping across the Arabian Sea into Lavasa
    const arabianSeaOrigin = latLonToVector3(24.5, 58.0, GLOBE_RADIUS * 1.012);
    const arcMid = arabianSeaOrigin
      .clone()
      .add(lavasaSurfaceVec)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(GLOBE_RADIUS * 1.12);
    const arcCurve = new THREE.QuadraticBezierCurve3(arabianSeaOrigin, arcMid, lavasaSurfaceVec);
    const arcGeometry = new THREE.TubeGeometry(arcCurve, 40, 0.0045, 8, false);
    const arcMaterial = new THREE.MeshBasicMaterial({
      color: 0x4d8de8,
      transparent: true,
      opacity: 0.5,
    });
    const arcMesh = new THREE.Mesh(arcGeometry, arcMaterial);
    globe.add(arcMesh);

    // 9. Balanced Midnight-Space Lighting Rig (Low ambient fill for real day/night terminator)
    const hemiLight = new THREE.HemisphereLight(0x4168a8, 0x02060f, 0.42);
    scene.add(hemiLight);

    const sunKeyLight = new THREE.DirectionalLight(0xb8d2f5, 1.15);
    sunKeyLight.position.set(-5.0, 3.4, 4.4);
    scene.add(sunKeyLight);

    const rimLight = new THREE.DirectionalLight(0x2d62b8, 0.68);
    rimLight.position.set(5.2, 1.6, -3.2);
    scene.add(rimLight);

    // Exact Y rotation so Lon 73.504°E (Lavasa, India) faces +Z camera:
    // -(lon + 90) deg = -163.504 deg
    const TARGET_INDIA_Y = THREE.MathUtils.degToRad(-163.5);
    const START_ROT_Y = TARGET_INDIA_Y - THREE.MathUtils.degToRad(26);

    globe.rotation.z = THREE.MathUtils.degToRad(-8);
    globe.rotation.y = START_ROT_Y;

    // Warm-up shader compilation on GPU devices
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 10. Pointer Parallax & Resize Handling
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const ny = (e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
      pointerRef.current.x = THREE.MathUtils.clamp(nx, -1, 1);
      pointerRef.current.y = THREE.MathUtils.clamp(ny, -1, 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // 11. Main Animation Loop
    let animationFrameId = 0;
    let lastNow = performance.now();
    let smoothPointerX = 0;
    let smoothPointerY = 0;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== "function") {
        animationFrameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 80);
        }
      };
      animationFrameId = window.setTimeout(poll, 5);
    };

    const tick = (now = performance.now()) => {
      if (disposed) return;

      const delta = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;
      const elapsed = now * 0.001;

      const p = progressRef.current; // 0 to 1

      // Smooth damped pointer parallax
      smoothPointerX = THREE.MathUtils.damp(smoothPointerX, pointerRef.current.x, 4.5, delta);
      smoothPointerY = THREE.MathUtils.damp(smoothPointerY, pointerRef.current.y, 4.5, delta);

      // Smooth cubic ease-in-out dolly curve over [0 .. 0.72] scroll progress
      const t = Math.min(1, Math.max(0, p / 0.72));
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const isMobile = width < 768;

      // Globe begins centered & compact in deep space (~56% viewport) -> glides smoothly into a clean lower horizon arc
      const startGlobeY = 0.08;
      const targetGlobeY = isMobile ? -1.42 : -1.28;
      globe.position.y = startGlobeY + (targetGlobeY - startGlobeY) * ease;

      // Camera keeps comfortable orbital distance so planet never swallows the viewport
      const startCamZ = isMobile ? 8.2 : 6.95;
      const targetCamZ = isMobile ? 5.25 : 4.35;
      camera.position.z = startCamZ + (targetCamZ - startCamZ) * ease;

      // Gentle pointer attitude + slight orbital rise
      const targetCamY = isMobile ? 0.34 : 0.32;
      camera.position.y = targetCamY * ease - smoothPointerY * 0.07;
      camera.position.x = smoothPointerX * 0.12;

      // Earth rotates westward so India & Arabian Sea sweep smoothly onto the upper curved horizon
      globe.rotation.y =
        THREE.MathUtils.lerp(START_ROT_Y, TARGET_INDIA_Y, ease) +
        elapsed * 0.005 +
        smoothPointerX * 0.03;
      globe.rotation.x = THREE.MathUtils.degToRad(6 + 11 * ease);

      camera.lookAt(0, -0.3 * ease, 0);

      // Slow cloud drift & subtle trajectory pulse
      cloudMesh.rotation.y = elapsed * 0.007;
      arcMaterial.opacity = 0.18 + 0.42 * ease;

      // Slowly drift deep starfield
      starMesh.rotation.y = elapsed * 0.004;

      renderer.render(scene, camera);

      // Project 3D Lavasa coordinate to 2D Screen coordinate
      globe.updateMatrixWorld();
      _lavasaWorld.copy(lavasaSurfaceVec).applyMatrix4(globe.matrixWorld);
      _camDir.copy(camera.position).sub(_lavasaWorld).normalize();
      _surfaceNormal.copy(_lavasaWorld).sub(globe.position).normalize();
      const isFacing = _surfaceNormal.dot(_camDir) > 0.08;

      _lavasaWorld.project(camera);
      const screenX = (_lavasaWorld.x * 0.5 + 0.5) * width;
      const screenY = (-_lavasaWorld.y * 0.5 + 0.5) * height;

      if (onPinPositionRef.current) {
        onPinPositionRef.current({
          x: Math.round(screenX),
          y: Math.round(screenY),
          visible: isFacing && p > 0.26,
        });
      }

      if (isSoftwareGl) {
        afterDraw(() => {
          if (!disposed) tick(performance.now());
        });
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      abortController.abort();
      cancelAnimationFrame(animationFrameId);
      clearTimeout(animationFrameId);
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      envTarget.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      starGeometry.dispose();
      starMaterial.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      innerAtmoGeometry.dispose();
      innerAtmoMaterial.dispose();
      outerAtmoGeometry.dispose();
      outerAtmoMaterial.dispose();
      pinGeometry.dispose();
      pinMaterial.dispose();
      arcGeometry.dispose();
      arcMaterial.dispose();
      earthTexture.dispose();
      emissiveTexture.dispose();
      roughnessTexture.dispose();
      cloudTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
