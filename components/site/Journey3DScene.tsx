"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  GLOBE_RADIUS,
  LAVASA_COORDS,
  START_ROT_Y,
  computeJourneyPose,
  latLonToVector3,
} from "@/lib/journey-camera";

interface Journey3DSceneProps {
  progress: number;
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
  { lat: LAVASA_COORDS.lat, lon: LAVASA_COORDS.lon, size: 7, intensity: 1.0, name: "Lavasa" },
  { lat: 18.52, lon: 73.856, size: 8.5, intensity: 1.0, name: "Pune" },
  { lat: 19.076, lon: 72.877, size: 11.5, intensity: 1.0, name: "Mumbai" },
  { lat: 19.997, lon: 73.789, size: 6, intensity: 0.85, name: "Nashik" },
  { lat: 19.876, lon: 75.343, size: 5.5, intensity: 0.75, name: "Aurangabad" },
  { lat: 21.145, lon: 79.088, size: 7.5, intensity: 0.85, name: "Nagpur" },
  { lat: 16.705, lon: 74.243, size: 5, intensity: 0.7, name: "Kolhapur" },
  { lat: 15.299, lon: 74.124, size: 5.5, intensity: 0.75, name: "Goa" },

  { lat: 28.613, lon: 77.209, size: 12, intensity: 1.0, name: "Delhi" },
  { lat: 12.971, lon: 77.594, size: 10.5, intensity: 0.95, name: "Bengaluru" },
  { lat: 17.385, lon: 78.486, size: 9.5, intensity: 0.95, name: "Hyderabad" },
  { lat: 13.082, lon: 80.27, size: 9, intensity: 0.9, name: "Chennai" },
  { lat: 22.572, lon: 88.363, size: 10.5, intensity: 0.95, name: "Kolkata" },
  { lat: 23.022, lon: 72.571, size: 9, intensity: 0.9, name: "Ahmedabad" },
  { lat: 21.17, lon: 72.831, size: 7.5, intensity: 0.85, name: "Surat" },
  { lat: 22.307, lon: 73.181, size: 6, intensity: 0.8, name: "Vadodara" },
  { lat: 26.912, lon: 75.787, size: 8, intensity: 0.85, name: "Jaipur" },
  { lat: 26.846, lon: 80.946, size: 8, intensity: 0.85, name: "Lucknow" },
  { lat: 26.449, lon: 80.331, size: 6.5, intensity: 0.8, name: "Kanpur" },
  { lat: 22.719, lon: 75.857, size: 6.5, intensity: 0.8, name: "Indore" },
  { lat: 23.259, lon: 77.412, size: 6, intensity: 0.75, name: "Bhopal" },
  { lat: 30.733, lon: 76.779, size: 7, intensity: 0.85, name: "Chandigarh" },
  { lat: 31.634, lon: 74.872, size: 6.5, intensity: 0.8, name: "Amritsar" },
  { lat: 25.594, lon: 85.137, size: 7, intensity: 0.8, name: "Patna" },
  { lat: 25.317, lon: 82.973, size: 6.5, intensity: 0.8, name: "Varanasi" },
  { lat: 20.296, lon: 85.824, size: 6, intensity: 0.75, name: "Bhubaneswar" },
  { lat: 17.686, lon: 83.218, size: 6.5, intensity: 0.75, name: "Visakhapatnam" },
  { lat: 11.016, lon: 76.955, size: 6.5, intensity: 0.8, name: "Coimbatore" },
  { lat: 9.931, lon: 76.267, size: 6.5, intensity: 0.8, name: "Kochi" },
  { lat: 8.524, lon: 76.936, size: 6, intensity: 0.75, name: "Thiruvananthapuram" },
  { lat: 26.144, lon: 91.736, size: 6, intensity: 0.75, name: "Guwahati" },
  { lat: 24.86, lon: 67.001, size: 9.5, intensity: 0.9, name: "Karachi" },
  { lat: 31.52, lon: 74.358, size: 9, intensity: 0.85, name: "Lahore" },
  { lat: 33.684, lon: 73.047, size: 7, intensity: 0.8, name: "Islamabad" },
  { lat: 23.81, lon: 90.412, size: 9, intensity: 0.85, name: "Dhaka" },
  { lat: 6.927, lon: 79.861, size: 6.5, intensity: 0.8, name: "Colombo" },
  { lat: 27.717, lon: 85.324, size: 5.5, intensity: 0.7, name: "Kathmandu" },

  { lat: 25.204, lon: 55.27, size: 9.5, intensity: 0.9, name: "Dubai" },
  { lat: 24.453, lon: 54.377, size: 7.5, intensity: 0.8, name: "Abu Dhabi" },
  { lat: 25.285, lon: 51.531, size: 7, intensity: 0.8, name: "Doha" },
  { lat: 24.713, lon: 46.675, size: 8, intensity: 0.8, name: "Riyadh" },
  { lat: 21.485, lon: 39.192, size: 7, intensity: 0.75, name: "Jeddah" },
  { lat: 35.689, lon: 51.389, size: 8, intensity: 0.8, name: "Tehran" },
  { lat: 30.044, lon: 31.235, size: 10, intensity: 0.9, name: "Cairo" },
  { lat: 41.008, lon: 28.978, size: 9, intensity: 0.85, name: "Istanbul" },
  { lat: 1.352, lon: 103.819, size: 9, intensity: 0.9, name: "Singapore" },
  { lat: 3.139, lon: 101.686, size: 7.5, intensity: 0.8, name: "Kuala Lumpur" },
  { lat: 13.756, lon: 100.501, size: 9, intensity: 0.85, name: "Bangkok" },
  { lat: 10.823, lon: 106.629, size: 7, intensity: 0.75, name: "Ho Chi Minh City" },
  { lat: 22.319, lon: 114.169, size: 9.5, intensity: 0.9, name: "Hong Kong" },
  { lat: 31.23, lon: 121.473, size: 10, intensity: 0.9, name: "Shanghai" },
  { lat: 39.904, lon: 116.407, size: 9.5, intensity: 0.85, name: "Beijing" },
  { lat: 35.676, lon: 139.65, size: 10, intensity: 0.9, name: "Tokyo" },
  { lat: 51.507, lon: -0.127, size: 9.5, intensity: 0.85, name: "London" },
  { lat: 48.856, lon: 2.352, size: 9, intensity: 0.85, name: "Paris" },
  { lat: -6.208, lon: 106.845, size: 8, intensity: 0.8, name: "Jakarta" },
];

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const _lavasaWorld = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _surfaceNormal = new THREE.Vector3();

export function Journey3DScene({ progress, onPinPosition }: Journey3DSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const onPinPositionRef = useRef(onPinPosition);
  onPinPositionRef.current = onPinPosition;

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
    renderer.toneMappingExposure = 1.02;
    container.appendChild(renderer.domElement);

    // Subtle deep-space starfield
    const starCount = 1800;
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
      const lum = 0.38 + rngStars() * 0.56;
      if (tint > 0.82) {
        starColors[i * 3] = 0.65 * lum;
        starColors[i * 3 + 1] = 0.82 * lum;
        starColors[i * 3 + 2] = 1.0 * lum;
      } else if (tint < 0.08) {
        starColors[i * 3] = 1.0 * lum;
        starColors[i * 3 + 1] = 0.88 * lum;
        starColors[i * 3 + 2] = 0.76 * lum;
      } else {
        starColors[i * 3] = 0.92 * lum;
        starColors[i * 3 + 1] = 0.95 * lum;
        starColors[i * 3 + 2] = 1.0 * lum;
      }
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.095,
      vertexColors: true,
      transparent: true,
      opacity: 0.62,
      sizeAttenuation: true,
    });
    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    const globe = new THREE.Group();
    scene.add(globe);

    const projectTex = (lon: number, lat: number, w: number, h: number): [number, number] => [
      ((lon + 180) / 360) * w,
      ((90 - lat) / 180) * h,
    ];

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

    if (cloudCtx) {
      cloudCtx.clearRect(0, 0, 1024, 512);
      const rngCloud = seededRandom(9011);
      for (let i = 0; i < 180; i++) {
        const cx = rngCloud() * 1024;
        const cy = 48 + rngCloud() * 416;
        const rx = 24 + rngCloud() * 76;
        const ry = 4 + rngCloud() * 14;
        const alpha = 0.025 + rngCloud() * 0.06;
        const grad = cloudCtx.createRadialGradient(cx, cy, 0, cx, cy, rx);
        grad.addColorStop(0, `rgba(195, 224, 255, ${alpha})`);
        grad.addColorStop(0.55, `rgba(155, 198, 250, ${alpha * 0.4})`);
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

    if (albedoCtx) {
      const oceanGrad = albedoCtx.createLinearGradient(0, 0, 0, texHeight);
      oceanGrad.addColorStop(0, "#030a18");
      oceanGrad.addColorStop(0.5, "#06142d");
      oceanGrad.addColorStop(1, "#020713");
      albedoCtx.fillStyle = oceanGrad;
      albedoCtx.fillRect(0, 0, texWidth, texHeight);

      albedoCtx.strokeStyle = "rgba(86, 138, 214, 0.045)";
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
      // Matte midnight ocean so directional lights never leave a specular hotspot
      roughnessCtx.fillStyle = "#ebebeb";
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

        albedoCtx.save();
        albedoCtx.fillStyle = "rgba(0, 0, 0, 0)";
        albedoCtx.strokeStyle = "rgba(38, 96, 186, 0.14)";
        albedoCtx.lineWidth = 8;
        albedoCtx.lineJoin = "round";
        tracePolygons(albedoCtx, texWidth, texHeight);
        albedoCtx.strokeStyle = "rgba(68, 134, 224, 0.18)";
        albedoCtx.lineWidth = 3;
        tracePolygons(albedoCtx, texWidth, texHeight);
        albedoCtx.restore();

        const landGrad = albedoCtx.createLinearGradient(0, 0, 0, texHeight);
        landGrad.addColorStop(0, "#102140");
        landGrad.addColorStop(0.5, "#0c1933");
        landGrad.addColorStop(1, "#091326");
        albedoCtx.fillStyle = landGrad;
        albedoCtx.strokeStyle = "rgba(96, 158, 240, 0.62)";
        albedoCtx.lineWidth = 1.1;
        tracePolygons(albedoCtx, texWidth, texHeight);

        roughnessCtx.fillStyle = "#ffffff";
        roughnessCtx.strokeStyle = "#f0f0f0";
        roughnessCtx.lineWidth = 1;
        tracePolygons(roughnessCtx, 1024, 512);

        emissiveCtx.fillStyle = "#000000";
        emissiveCtx.strokeStyle = "rgba(50, 108, 190, 0.24)";
        emissiveCtx.lineWidth = 1.0;
        tracePolygons(emissiveCtx, texWidth, texHeight);

        // Crisp, non-bloated satellite city-light pinpoints
        const drawCityGlow = (
          lat: number,
          lon: number,
          radiusPx: number,
          intensity: number,
          hasHotCore = true
        ) => {
          const [cx, cy] = projectTex(lon, lat, texWidth, texHeight);
          const r = radiusPx * 1.15;

          [emissiveCtx, albedoCtx].forEach((targetCtx, layerIdx) => {
            const mult = layerIdx === 0 ? 0.68 : 0.42;
            const grad = targetCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, `rgba(255, 242, 204, ${Math.min(1, intensity * mult)})`);
            grad.addColorStop(0.28, `rgba(245, 184, 80, ${intensity * 0.55 * mult})`);
            grad.addColorStop(0.62, `rgba(218, 124, 38, ${intensity * 0.16 * mult})`);
            grad.addColorStop(1, "rgba(218, 124, 38, 0)");

            targetCtx.fillStyle = grad;
            targetCtx.beginPath();
            targetCtx.arc(cx, cy, r, 0, Math.PI * 2);
            targetCtx.fill();

            if (hasHotCore) {
              targetCtx.fillStyle = `rgba(255, 249, 232, ${Math.min(0.95, intensity * 0.92)})`;
              targetCtx.beginPath();
              targetCtx.arc(cx, cy, Math.max(0.85, radiusPx * 0.14), 0, Math.PI * 2);
              targetCtx.fill();
            }
          });
        };

        const connectLightCorridor = (a: CityNode, b: CityNode, alpha = 0.28) => {
          const [x1, y1] = projectTex(a.lon, a.lat, texWidth, texHeight);
          const [x2, y2] = projectTex(b.lon, b.lat, texWidth, texHeight);
          [emissiveCtx, albedoCtx].forEach((targetCtx) => {
            targetCtx.strokeStyle = `rgba(255, 196, 94, ${alpha})`;
            targetCtx.lineWidth = 0.85;
            targetCtx.beginPath();
            targetCtx.moveTo(x1, y1);
            targetCtx.lineTo(x2, y2);
            targetCtx.stroke();
          });
        };

        const byName = (name: string) => MAJOR_CITIES.find((c) => c.name === name)!;
        const corridors: [string, string, number][] = [
          ["Mumbai", "Lavasa", 0.56],
          ["Lavasa", "Pune", 0.62],
          ["Mumbai", "Pune", 0.54],
          ["Mumbai", "Nashik", 0.36],
          ["Pune", "Kolhapur", 0.3],
          ["Kolhapur", "Goa", 0.25],
          ["Goa", "Kochi", 0.26],
          ["Mumbai", "Surat", 0.38],
          ["Surat", "Vadodara", 0.36],
          ["Vadodara", "Ahmedabad", 0.42],
          ["Ahmedabad", "Jaipur", 0.3],
          ["Jaipur", "Delhi", 0.44],
          ["Delhi", "Chandigarh", 0.42],
          ["Chandigarh", "Amritsar", 0.32],
          ["Delhi", "Kanpur", 0.38],
          ["Kanpur", "Lucknow", 0.4],
          ["Lucknow", "Varanasi", 0.32],
          ["Varanasi", "Patna", 0.32],
          ["Patna", "Kolkata", 0.32],
          ["Pune", "Hyderabad", 0.34],
          ["Hyderabad", "Bengaluru", 0.38],
          ["Bengaluru", "Chennai", 0.42],
          ["Chennai", "Coimbatore", 0.3],
          ["Coimbatore", "Kochi", 0.3],
          ["Mumbai", "Nagpur", 0.26],
          ["Nagpur", "Hyderabad", 0.26],
          ["Indore", "Bhopal", 0.28],
          ["Ahmedabad", "Indore", 0.24],
          ["Lahore", "Islamabad", 0.32],
          ["Karachi", "Lahore", 0.24],
          ["Kolkata", "Dhaka", 0.32],
          ["Dubai", "Abu Dhabi", 0.46],
          ["Dubai", "Doha", 0.26],
        ];
        corridors.forEach(([a, b, alpha]) => connectLightCorridor(byName(a), byName(b), alpha));

        const rngCity = seededRandom(2026);
        const scatterHubs = MAJOR_CITIES.slice(0, 38);
        scatterHubs.forEach((hub) => {
          const count = hub.name === "Mumbai" || hub.name === "Delhi" || hub.name === "Pune" ? 14 : 8;
          for (let i = 0; i < count; i++) {
            const angle = rngCity() * Math.PI * 2;
            const spread = (0.3 + rngCity() * 1.9) * (hub.name === "Lavasa" ? 0.45 : 1);
            drawCityGlow(
              hub.lat + Math.sin(angle) * spread,
              hub.lon + Math.cos(angle) * spread * 1.15,
              1.0 + rngCity() * 1.4,
              0.25 + rngCity() * 0.32,
              false
            );
          }
        });

        MAJOR_CITIES.forEach((city) => {
          drawCityGlow(city.lat, city.lon, city.size * 0.5, city.intensity, true);
        });

        earthTexture.needsUpdate = true;
        emissiveTexture.needsUpdate = true;
        roughnessTexture.needsUpdate = true;
      })
      .catch(() => {});

    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: emissiveTexture,
      emissiveIntensity: 0.9,
      roughnessMap: roughnessTexture,
      roughness: 1.0,
      metalness: 0.0,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globe.add(earthMesh);

    const cloudGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.006, 64, 48);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globe.add(cloudMesh);

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
          float fresnel = pow(1.0 - ndotv, 3.2);
          vec3 skyBlue = vec3(0.18, 0.42, 0.86);
          vec3 horizonCyan = vec3(0.36, 0.64, 0.98);
          vec3 col = mix(skyBlue, horizonCyan, pow(1.0 - ndotv, 5.0));
          gl_FragColor = vec4(col, fresnel * 0.34);
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
          vec3 atmoColor = vec3(0.16, 0.38, 0.8);
          gl_FragColor = vec4(atmoColor, edge * rim * 0.4);
        }
      `,
    });
    const outerAtmoMesh = new THREE.Mesh(outerAtmoGeometry, outerAtmoMaterial);
    globe.add(outerAtmoMesh);

    const lavasaSurfaceVec = latLonToVector3(
      LAVASA_COORDS.lat,
      LAVASA_COORDS.lon,
      GLOBE_RADIUS * 1.012
    );
    const pinGeometry = new THREE.SphereGeometry(0.016, 16, 16);
    const pinMaterial = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.95,
    });
    const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
    pinMesh.position.copy(lavasaSurfaceVec);
    globe.add(pinMesh);

    const arabianSeaOrigin = latLonToVector3(24.5, 58.0, GLOBE_RADIUS * 1.012);
    const arcMid = arabianSeaOrigin
      .clone()
      .add(lavasaSurfaceVec)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(GLOBE_RADIUS * 1.11);
    const arcCurve = new THREE.QuadraticBezierCurve3(arabianSeaOrigin, arcMid, lavasaSurfaceVec);
    const arcGeometry = new THREE.TubeGeometry(arcCurve, 40, 0.004, 8, false);
    const arcMaterial = new THREE.MeshBasicMaterial({
      color: 0x5b8eff,
      transparent: true,
      opacity: 0.48,
    });
    const arcMesh = new THREE.Mesh(arcGeometry, arcMaterial);
    globe.add(arcMesh);

    // Clean celestial terminator lighting (uniform deep night ocean, grazing horizon glow)
    const hemiLight = new THREE.HemisphereLight(0x5a85cc, 0x050b18, 0.78);
    scene.add(hemiLight);

    const sunKeyLight = new THREE.DirectionalLight(0x8bb6f7, 0.95);
    sunKeyLight.position.set(-8.0, 3.5, -2.4);
    scene.add(sunKeyLight);

    const rimLight = new THREE.DirectionalLight(0x4282eb, 0.75);
    rimLight.position.set(6.2, 1.8, -3.6);
    scene.add(rimLight);

    globe.rotation.x = THREE.MathUtils.degToRad(-7.5);
    globe.rotation.z = THREE.MathUtils.degToRad(-5);
    globe.rotation.y = START_ROT_Y;

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    let animationFrameId = 0;

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

    const tick = () => {
      if (disposed) return;

      const p = progressRef.current;

      const pose = computeJourneyPose(p, width, 0, 0, 0);
      globe.position.set(...pose.globePos);
      globe.rotation.set(...pose.globeRot);
      camera.position.set(...pose.camPos);
      camera.lookAt(...pose.lookAt);

      arcMaterial.opacity = 0.22 + 0.36 * pose.ease;

      renderer.render(scene, camera);

      globe.updateMatrixWorld();
      _lavasaWorld.copy(lavasaSurfaceVec).applyMatrix4(globe.matrixWorld);
      _camDir.copy(camera.position).sub(_lavasaWorld).normalize();
      _surfaceNormal.copy(_lavasaWorld).sub(globe.position).normalize();
      const isFacing = _surfaceNormal.dot(_camDir) > 0.12;

      _lavasaWorld.project(camera);
      const screenX = (_lavasaWorld.x * 0.5 + 0.5) * width;
      const screenY = (-_lavasaWorld.y * 0.5 + 0.5) * height;

      if (onPinPositionRef.current) {
        onPinPositionRef.current({
          x: Math.round(screenX),
          y: Math.round(screenY),
          visible: isFacing && p > 0.24,
        });
      }

      if (isSoftwareGl) {
        afterDraw(() => {
          if (!disposed) tick();
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
      ro.disconnect();
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
      data-testid="journey-globe-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
