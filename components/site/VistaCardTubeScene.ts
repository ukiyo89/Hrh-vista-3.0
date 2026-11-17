import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TUBE_ASSETS,
  computeResponsiveCardScale,
  computeRowSpeeds,
  getTubeTileIndex,
} from "@/lib/data/brands";

interface RowDescriptor {
  group: THREE.Group;
  baseRow: number;
  rowIndex: number;
}

export interface VistaCardSceneOptions {
  canvas: HTMLCanvasElement;
  root: HTMLElement;
  section: HTMLElement;
  header: HTMLElement;
  reducedMotion?: boolean;
}

/**
 * 1:1 port of moto-card.com's WebGL TubeScene + ScrollTrigger timeline.
 * Renders the 5x18 cylindrical wall of HR VISTA 2.0 visiting brand plaques,
 * Kawase two-pass bottom blur/fade into #080808, and the 3D GLB metallic
 * HR VISTA 3.0 card with planar reflection, matcap shading, and UV bump map.
 */
export class VistaCardTubeScene {
  canvas: HTMLCanvasElement;
  root: HTMLElement;
  section: HTMLElement;
  header: HTMLElement;
  reducedMotion: boolean;

  isMobile: boolean;
  isSafari: boolean;
  isMac: boolean;

  ASSETS = TUBE_ASSETS;

  TUBE: {
    rows: number;
    cols: number;
    repeats: number;
    radius: number;
    tileW: number;
    tileAspect: number;
    ySpacing: number;
    scrollSpin: number;
    scrollEvenMul: number;
    idleEvenMul: number;
    tileH: number;
    totalRows: number;
    loopHeight: number;
    rowSpeed: number[];
  };

  CARD: {
    targetSize: number;
    position: THREE.Vector3;
    baseRotation: THREE.Euler;
    followAngle: boolean;
    spinScale: number;
    envEnabled: boolean;
    reflectMono: boolean;
    envMapIntensity: number;
    reflectUseBump: boolean;
    reflectSoft: number;
    reflStrength: number;
    envScale: number;
    envSamples: number;
    envUpdateEveryFrames: number;
  };

  SCROLL = {
    pinLength: 3000,
    scrub: true,
    tubeTravel: 13,
    cardTurns: 1,
  };

  BLUR: {
    enabled: boolean;
    amount: number;
    downscale: number;
    tubeScale: number;
    height: number;
    darken: number;
    tubeSamples: number;
  };

  S = {
    scrollTarget: 0,
    scrollCurrent: 0,
    spinVelocity: 0,
    naturalDir: 1,
    angle: 0,
    baseSpeed: 0.08,
    wheelScrollMul: 0.002,
    wheelSpinMul: 0.0015,
    alternateRowDir: true,
    hoverSlowdownScale: 0.35,
    rotationSpeedScaleTarget: 1,
    rotationSpeedScale: 1,
    rotationSpeedScaleLerp: 0.12,
    hovered: false,
  };

  private _timer = new THREE.Timer();
  private _running = false;
  private _disposed = false;
  private _initialized = false;
  private _cardBaseY = 0.31;
  private _cardModelMaxDim = 1;
  private _cardUnscaledCenter = new THREE.Vector3();
  private _nearViewport = true;
  private _throttleCounter = 0;
  private _maxBufferDim = 4096;
  private _maxVH = 0;
  private _lastVW = 0;
  private _lastW = 0;
  private _lastH = 0;
  private _lastDpr = 0;

  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  hemi!: THREE.HemisphereLight;

  tubeGroup: THREE.Group | null = null;
  rowDescriptors: RowDescriptor[] = [];
  interactiveTiles: THREE.Mesh[] = [];
  tubeTextures: THREE.Texture[] | null = null;
  private _tubeTexturesReady: Promise<unknown> = Promise.resolve();

  cardObject: THREE.Object3D | null = null;
  cardMaterial: THREE.ShaderMaterial | null = null;
  sceneRT: THREE.WebGLRenderTarget | null = null;
  tubeRT: THREE.WebGLRenderTarget | null = null;
  blurRT: THREE.WebGLRenderTarget | null = null;

  private _fsScene: THREE.Scene | null = null;
  private _fsCam: THREE.OrthographicCamera | null = null;
  private _fsQuad: THREE.Mesh | null = null;
  private _downMat: THREE.ShaderMaterial | null = null;
  private _compMat: THREE.ShaderMaterial | null = null;

  private _reflCam: THREE.PerspectiveCamera | null = null;
  private _textureMatrix: THREE.Matrix4 | null = null;
  private _reflMath: {
    planePoint: THREE.Vector3;
    normal: THREE.Vector3;
    camPos: THREE.Vector3;
    view: THREE.Vector3;
    target: THREE.Vector3;
    lookAt: THREE.Vector3;
    q: THREE.Quaternion;
    rot: THREE.Matrix4;
  } | null = null;

  cardLocalNormal = new THREE.Vector3(0, 0, 1);
  private _envFrameCounter = 0;

  GS = { progress: 0 };
  tubeUniforms = { uAlpha: { value: 1 } };
  scrollTL: gsap.core.Timeline | null = null;
  private _scrollAngle = 0;
  private _lastProgress = 0;
  private _io: IntersectionObserver | null = null;
  private _warmupDone = false;

  private _onResizeBound = () => this.resize();
  private _animateBound = () => this.animate();

  ready: Promise<void>;

  constructor(opts: VistaCardSceneOptions) {
    this.canvas = opts.canvas;
    this.root = opts.root;
    this.section = opts.section;
    this.header = opts.header;
    this.reducedMotion = Boolean(opts.reducedMotion);

    this.isMobile =
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      window.matchMedia("(pointer: coarse)").matches;
    this.isSafari =
      /apple/i.test(navigator.vendor || "") &&
      !/crios|fxios|edgios|chrome|android/i.test(navigator.userAgent);
    this.isMac = /Mac/i.test(navigator.userAgent) && !this.isMobile;
    this._lastVW = window.innerWidth;

    this.TUBE = {
      rows: 5,
      cols: 18,
      repeats: 1,
      radius: 11.2,
      tileW: 1.84,
      tileAspect: 4 / 6,
      ySpacing: 6.15,
      scrollSpin: 0.1,
      scrollEvenMul: 5,
      idleEvenMul: 2,
      tileH: 1.84 / (4 / 6),
      totalRows: 5,
      loopHeight: 5 * 6.15,
      rowSpeed: computeRowSpeeds(5),
    };

    this.CARD = {
      targetSize: 2.8,
      position: new THREE.Vector3(0, 0.31, 0),
      baseRotation: new THREE.Euler(0, 0, Math.PI / 2),
      followAngle: true,
      spinScale: 1,
      envEnabled: true,
      reflectMono: true,
      envMapIntensity: 0.035,
      reflectUseBump: !this.isMobile,
      reflectSoft: 0.85,
      reflStrength: 0.3,
      envScale: this.isMobile ? 0.5 : 1,
      envSamples: 0,
      envUpdateEveryFrames: 3,
    };

    this.BLUR = {
      enabled: true,
      amount: 1.5,
      downscale: 0.5,
      tubeScale: this.isMobile ? 0.5 : 1,
      height: 0.48,
      darken: 1,
      tubeSamples: this.isMac ? 2 : 3,
    };

    this.ready = this.init().catch((err) => {
      console.error("[VistaCardTubeScene] init error", err);
    });
  }

  private async init() {
    gsap.registerPlugin(ScrollTrigger);
    this.setupRenderer();
    if (this._disposed) return;
    this.setupSceneCamera();
    this.setupLights();
    this.setupSceneRT();
    this.setupTubeBlur();
    this.buildTube();
    await this.loadCard();
    if (this._disposed) return;
    this.bindEvents();
    this.resize();
    this._initialized = true;
    this.rebuildScrollTimeline();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    if (this.reducedMotion) {
      this.GS.progress = 0.72;
      this.tubeUniforms.uAlpha.value = 1;
      if (this.cardObject) {
        this.cardObject.position.y = this._cardBaseY;
        this.cardObject.rotation.y = this.CARD.baseRotation.y;
      }
      gsap.set(this.header, { opacity: 1, yPercent: 0, filter: "blur(0px)" });
      await this._tubeTexturesReady;
      if (!this._disposed) {
        this.renderFrame(0);
      }
      return;
    }

    this.start();
    await this.warmup();
  }

  private size() {
    return {
      w: this.root.clientWidth || window.innerWidth,
      h: this.root.clientHeight || window.innerHeight,
    };
  }

  private loadTexture(url: string, onConfigure?: (t: THREE.Texture) => void): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        url,
        (tex) => {
          onConfigure?.(tex);
          tex.needsUpdate = true;
          resolve(tex);
        },
        undefined,
        reject
      );
    });
  }

  private makeWhitePixelTex() {
    const data = new Uint8Array([255, 255, 255, 255]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }

  private injectEnvMap(vert: string, frag: string) {
    let v = vert.replace("void main() {", "varying vec3 vWNormal;\n\nvoid main() {");
    v = v.replace(
      "vWPosition = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;",
      "vWPosition = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;\n\tvWNormal = normalize( mat3( modelMatrix ) * displaced_normal );"
    );

    let f = frag.replace(
      "void main() {",
      "uniform sampler2D uSceneMap;\nuniform mat4 uTextureMatrix;\nuniform float envMapIntensity;\nuniform bool hasEnvMap;\nuniform float uReflectBump;\nuniform float uReflectSoft;\nuniform float uReflStrength;\nuniform float uReflectMono;\nvarying vec3 vWNormal;\n\nvoid main() {"
    );

    f = f.replace(
      "gl_FragColor = vec4( outgoingLight, accumAlpha * nodeU20 );",
      `if ( hasEnvMap ) {
    vec4 rc = uTextureMatrix * vec4( vWPosition, 1.0 );
    vec3 nrm = uReflectBump > 0.5 ? normalize( normal ) : normalize( nonPerturbedNormal );
    rc.xy += nrm.xy * uReflStrength * rc.w;
    vec3 envColor = texture2DProj( uSceneMap, rc ).rgb;
    float envLuma = max( envColor.r, max( envColor.g, envColor.b ) );
    float aa   = fwidth( envLuma );
    float mask = smoothstep( 0.0, max( uReflectSoft, 0.0001 ) + aa, envLuma ) * envMapIntensity;
    float reflM = clamp( mask, 0.0, 1.0 );
    if ( uReflectMono > 0.5 ) {
        outgoingLight += vec3( envLuma ) * reflM;
    } else {
        outgoingLight = mix( outgoingLight, envColor, reflM );
    }
}
gl_FragColor = vec4( outgoingLight, accumAlpha * nodeU20 );`
    );

    return { vertexShader: v, fragmentShader: f };
  }

  private setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
    const gl = this.renderer.getContext();
    const maxVp = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array | number[];
    this._maxBufferDim = Math.min(
      8192,
      this.renderer.capabilities.maxTextureSize,
      gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number,
      maxVp[0],
      maxVp[1]
    );

    const maxSamples = this.renderer.capabilities.maxSamples || 0;
    this.BLUR.tubeSamples = Math.min(this.BLUR.tubeSamples, maxSamples);

    this.renderer.info.autoReset = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setClearAlpha(1);
    this.renderer.setClearColor(
      new THREE.Color().setRGB(8 / 255, 8 / 255, 8 / 255, THREE.LinearSRGBColorSpace),
      1
    );
  }

  private setupSceneCamera() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.camera.position.set(0, 0, 6.5);
    this.camera.lookAt(0, 0, 0);
  }

  private setupLights() {
    this.hemi = new THREE.HemisphereLight("#ffffff", "#ffffff", 1.385);
    this.hemi.position.set(0, 1, 0);
    this.scene.add(this.hemi);
  }

  private _rtSize() {
    const v = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(v);
    return {
      x: Math.max(2, Math.floor(v.x * this.CARD.envScale)),
      y: Math.max(2, Math.floor(v.y * this.CARD.envScale)),
    };
  }

  private _tubeSize() {
    const v = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(v);
    return {
      x: Math.max(2, Math.floor(v.x * this.BLUR.tubeScale)),
      y: Math.max(2, Math.floor(v.y * this.BLUR.tubeScale)),
    };
  }

  private setupSceneRT() {
    const { x, y } = this._rtSize();
    this.sceneRT = new THREE.WebGLRenderTarget(x, y, {
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      samples: this.CARD.envSamples,
    });
    if (!this._reflCam) {
      this._reflCam = new THREE.PerspectiveCamera();
      this._textureMatrix = new THREE.Matrix4();
      this._reflMath = {
        planePoint: new THREE.Vector3(),
        normal: new THREE.Vector3(),
        camPos: new THREE.Vector3(),
        view: new THREE.Vector3(),
        target: new THREE.Vector3(),
        lookAt: new THREE.Vector3(),
        q: new THREE.Quaternion(),
        rot: new THREE.Matrix4(),
      };
    }
  }

  private setupTubeBlur() {
    const ts = this._tubeSize();
    this.tubeRT = new THREE.WebGLRenderTarget(ts.x, ts.y, {
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      samples: this.BLUR.tubeSamples,
    });

    const bw = Math.max(2, Math.floor(ts.x * this.BLUR.downscale));
    const bh = Math.max(2, Math.floor(ts.y * this.BLUR.downscale));
    this.blurRT = new THREE.WebGLRenderTarget(bw, bh, {
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    this._fsScene = new THREE.Scene();
    this._fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this._fsQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this._fsQuad.frustumCulled = false;
    this._fsScene.add(this._fsQuad);

    const fsVert =
      "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";

    this._downMat = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTex: { value: this.tubeRT.texture },
        uTexel: { value: new THREE.Vector2(1 / bw, 1 / bh) },
        uAmount: { value: this.BLUR.amount },
      },
      vertexShader: fsVert,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTex;
        uniform vec2 uTexel;
        uniform float uAmount;
        void main(){
          vec2 o = uTexel * uAmount;
          vec3 c = texture2D( uTex, vUv ).rgb * 4.0;
          c += texture2D( uTex, vUv + vec2(  o.x,  o.y ) ).rgb;
          c += texture2D( uTex, vUv + vec2( -o.x,  o.y ) ).rgb;
          c += texture2D( uTex, vUv + vec2(  o.x, -o.y ) ).rgb;
          c += texture2D( uTex, vUv + vec2( -o.x, -o.y ) ).rgb;
          gl_FragColor = vec4( c / 8.0, 1.0 );
        }
      `,
    });

    this._compMat = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uSharp: { value: this.tubeRT.texture },
        uBlur: { value: this.blurRT.texture },
        uHeight: { value: this.BLUR.height },
        uDarken: { value: this.BLUR.darken },
      },
      vertexShader: fsVert,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uSharp;
        uniform sampler2D uBlur;
        uniform float uHeight;
        uniform float uDarken;
        void main(){
          vec3 sharp = texture2D( uSharp, vUv ).rgb;
          vec3 blur  = texture2D( uBlur,  vUv ).rgb;
          float bm = smoothstep( uHeight, uHeight - 0.12, vUv.y );
          vec3 col = mix( sharp, blur, bm );
          float dk = clamp( ( uHeight - vUv.y ) / max( uHeight, 0.0001 ), 0.0, 1.0 ) * uDarken;
          col = mix( col, vec3( 8.0 / 255.0 ), dk );
          gl_FragColor = vec4( col, 1.0 );
        }
      `,
    });
  }

  private updatePlanarReflection() {
    if (!this.cardObject || !this._reflCam || !this._reflMath || !this._textureMatrix || !this.sceneRT || !this.cardMaterial) {
      return;
    }
    const cam = this.camera;
    const reflCam = this._reflCam;
    const m = this._reflMath;

    this.cardObject.getWorldPosition(m.planePoint);
    this.cardObject.getWorldQuaternion(m.q);
    m.normal.copy(this.cardLocalNormal).applyQuaternion(m.q).normalize();
    cam.getWorldPosition(m.camPos);

    if (m.normal.dot(m.view.subVectors(m.camPos, m.planePoint)) < 0) {
      m.normal.negate();
    }

    m.view.subVectors(m.planePoint, m.camPos);
    m.view.reflect(m.normal).negate().add(m.planePoint);

    m.rot.extractRotation(cam.matrixWorld);
    m.lookAt.set(0, 0, -1).applyMatrix4(m.rot).add(m.camPos);
    m.target.subVectors(m.planePoint, m.lookAt).reflect(m.normal).negate().add(m.planePoint);

    reflCam.position.copy(m.view);
    reflCam.up.set(0, 1, 0).applyMatrix4(m.rot).reflect(m.normal);
    reflCam.lookAt(m.target);
    reflCam.near = cam.near;
    reflCam.far = cam.far;
    reflCam.fov = cam.fov;
    reflCam.aspect = cam.aspect;
    reflCam.updateProjectionMatrix();
    reflCam.updateMatrixWorld();

    this._textureMatrix.set(
      0.5, 0, 0, 0.5,
      0, 0.5, 0, 0.5,
      0, 0, 0.5, 0.5,
      0, 0, 0, 1
    );
    this._textureMatrix.multiply(reflCam.projectionMatrix);
    this._textureMatrix.multiply(reflCam.matrixWorldInverse);
    this.cardMaterial.uniforms.uTextureMatrix.value.copy(this._textureMatrix);

    this.cardObject.visible = false;
    this.renderer.setRenderTarget(this.sceneRT);
    this.renderer.clear();
    this.renderer.render(this.scene, reflCam);
    this.renderer.setRenderTarget(null);
    this.cardObject.visible = true;
  }

  private loadTubeTextures() {
    if (!this.tubeTextures) {
      const maxAniso = this.renderer.capabilities.getMaxAnisotropy?.() || 1;
      const loader = new THREE.TextureLoader();
      const pending: Promise<void>[] = [];
      this.tubeTextures = this.ASSETS.tubeImages.map((url) => {
        let done!: () => void;
        pending.push(new Promise<void>((res) => (done = res)));
        const tex = loader.load(url, () => done(), undefined, () => done());
        tex.colorSpace = THREE.NoColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = maxAniso;
        return tex;
      });
      this._tubeTexturesReady = Promise.all(pending);
    }
    return this.tubeTextures;
  }

  private installTubeAlpha(mat: THREE.MeshBasicMaterial) {
    const uAlpha = this.tubeUniforms.uAlpha;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uAlpha = uAlpha;
      shader.fragmentShader = "uniform float uAlpha;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        "#include <opaque_fragment>\n\tgl_FragColor.a *= uAlpha;"
      );
    };
  }

  private buildTube() {
    const textures = this.loadTubeTextures();
    this.TUBE.tileH = this.TUBE.tileW / this.TUBE.tileAspect;
    this.TUBE.totalRows = this.TUBE.rows * this.TUBE.repeats;
    this.TUBE.loopHeight = this.TUBE.rows * this.TUBE.ySpacing;
    this.TUBE.rowSpeed = computeRowSpeeds(this.TUBE.rows);

    this.tubeGroup = new THREE.Group();
    this.scene.add(this.tubeGroup);

    const geom = new THREE.PlaneGeometry(this.TUBE.tileW, this.TUBE.tileH);

    for (let rowIdx = 0; rowIdx < this.TUBE.totalRows; rowIdx++) {
      const yPos = (rowIdx - (this.TUBE.totalRows - 1) / 2) * this.TUBE.ySpacing;
      const baseRow = rowIdx % this.TUBE.rows;
      const stagger = baseRow % 2 === 0 ? 0 : 0.5;
      const rowGroup = new THREE.Group();
      rowGroup.position.y = yPos;
      this.tubeGroup.add(rowGroup);
      this.rowDescriptors.push({ group: rowGroup, baseRow, rowIndex: rowIdx });

      for (let colIdx = 0; colIdx < this.TUBE.cols; colIdx++) {
        const angle = ((colIdx + stagger) / this.TUBE.cols) * Math.PI * 2;
        const texIdx = getTubeTileIndex(baseRow, colIdx, this.TUBE.cols, this.ASSETS.tubeImages.length);
        const mat = new THREE.MeshBasicMaterial({
          map: textures[texIdx],
          side: THREE.DoubleSide,
          toneMapped: false,
          transparent: true,
          alphaTest: 0.5,
        });
        this.installTubeAlpha(mat);
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(
          Math.cos(angle) * this.TUBE.radius,
          0,
          Math.sin(angle) * this.TUBE.radius
        );
        mesh.rotation.y = -(angle + Math.PI / 2);
        rowGroup.add(mesh);
        this.interactiveTiles.push(mesh);
      }
    }
  }

  private async loadCard() {
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy?.() || 8;
    const [vertRaw, fragRaw, matcapTex, uvTex] = await Promise.all([
      fetch(this.ASSETS.cardVertex).then((r) => r.text()),
      fetch(this.ASSETS.cardFragment).then((r) => r.text()),
      this.loadTexture(this.ASSETS.matcap, (t) => {
        t.wrapS = THREE.ClampToEdgeWrapping;
        t.wrapT = THREE.ClampToEdgeWrapping;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.flipY = true;
        t.colorSpace = THREE.NoColorSpace;
        t.anisotropy = maxAniso;
      }),
      this.loadTexture(this.ASSETS.cardUv, (t) => {
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.flipY = true;
        t.colorSpace = THREE.NoColorSpace;
        t.anisotropy = maxAniso;
      }),
    ]);

    if (this._disposed) return;

    const { vertexShader, fragmentShader } = this.injectEnvMap(vertRaw, fragRaw);
    const whitePixel = this.makeWhitePixelTex();
    const { w, h } = this.size();

    this.cardMaterial = new THREE.ShaderMaterial({
      name: "HR_VISTA_CARD",
      vertexShader,
      fragmentShader,
      lights: true,
      fog: false,
      transparent: true,
      vertexColors: true,
      toneMapped: false,
      defines: { STANDARD: 1 },
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.common,
        THREE.UniformsLib.lights,
        THREE.UniformsLib.fog,
        {
          resolution: { value: new THREE.Vector2(w, h) },
          penumbraSize: { value: [0.5, 0.5, 0.5, 0.5, 0.5] },
          aoMap: { value: whitePixel },
          aoEnabled: { value: false },
          nodeU0: { value: new THREE.Color("#ffffff") },
          nodeU1: { value: 0 },
          nodeU2: { value: 0.87 },
          nodeU3: { value: true },
          nodeU4: { value: 1 },
          nodeU5: { value: 0 },
          nodeU6: { value: matcapTex },
          nodeU7: { value: false },
          nodeU8: { value: 1 },
          nodeU9: { value: 0 },
          nodeU10: { value: 0 },
          nodeU11: { value: uvTex },
          nodeU12: { value: new THREE.Vector3(0, 0, 0) },
          nodeU13: { value: 0 },
          nodeU14: { value: new THREE.Matrix3() },
          nodeU15: { value: new THREE.Vector2(128, 128) },
          nodeU16: { value: 0 },
          nodeU17: { value: false },
          nodeU18: { value: 1 },
          nodeU19: { value: 3 },
          nodeU20: { value: 1 },
          nodeU21: { value: 0.2 },
          nodeU22: { value: 1 },
          nodeU23: { value: -0.001 },
          uTextureMatrix: { value: new THREE.Matrix4() },
          envMapIntensity: { value: this.CARD.envMapIntensity },
          hasEnvMap: { value: this.CARD.envEnabled },
          uReflectBump: { value: this.CARD.reflectUseBump ? 1 : 0 },
          uReflectSoft: { value: this.CARD.reflectSoft },
          uReflStrength: { value: this.CARD.reflStrength },
          uReflectMono: { value: this.CARD.reflectMono ? 1 : 0 },
        },
      ]),
    });

    if (this.sceneRT) {
      this.cardMaterial.uniforms.uSceneMap = { value: this.sceneRT.texture };
    }

    await new Promise<void>((resolve, reject) => {
      new GLTFLoader().load(
        this.ASSETS.cardModel,
        (gltf) => {
          if (this._disposed) {
            resolve();
            return;
          }
          const rootObj = gltf.scene;
          const invisible = rootObj.getObjectByName("buildin invisible");
          if (invisible) invisible.visible = false;

          rootObj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.material = this.cardMaterial!;
              mesh.material.needsUpdate = true;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(rootObj);
          const sz = box.getSize(new THREE.Vector3());
          this._cardModelMaxDim = Math.max(sz.x, sz.y, sz.z) || 1;
          box.getCenter(this._cardUnscaledCenter);

          if (sz.x <= sz.y && sz.x <= sz.z) this.cardLocalNormal.set(1, 0, 0);
          else if (sz.y <= sz.x && sz.y <= sz.z) this.cardLocalNormal.set(0, 1, 0);
          else this.cardLocalNormal.set(0, 0, 1);

          rootObj.rotation.copy(this.CARD.baseRotation);
          this.cardObject = rootObj;
          this.updateCardScale();
          this.scene.add(rootObj);
          resolve();
        },
        undefined,
        (err) => {
          console.error("[VistaCardTubeScene] GLB load error", err);
          reject(err);
        }
      );
    });
  }

  private bindEvents() {
    window.addEventListener("resize", this._onResizeBound);
  }

  private attachVisibilityObserver() {
    this._io = new IntersectionObserver(
      (entries) => {
        this._nearViewport = entries[0]?.isIntersecting ?? true;
      },
      { root: null, rootMargin: "400px 0px", threshold: 0 }
    );
    this._io.observe(this.root);
  }

  private _measureLargeVH() {
    try {
      const probe = document.createElement("div");
      probe.style.cssText =
        "position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none;";
      document.body.appendChild(probe);
      const h = probe.getBoundingClientRect().height;
      probe.remove();
      return h;
    } catch {
      return 0;
    }
  }

  private viewportSize() {
    const w = window.innerWidth;
    let h = window.innerHeight;
    if (this.isMobile) {
      if (w !== this._lastVW) {
        this._maxVH = 0;
        this._lastVW = w;
      }
      this._maxVH = Math.max(this._maxVH, h, this._measureLargeVH());
      h = this._maxVH;
    }
    return { w, h };
  }

  resize() {
    if (this._disposed) return;
    const { w, h } = this.viewportSize();
    const maxBufRatio = (this._maxBufferDim || this.renderer.capabilities.maxTextureSize) / Math.max(w, h);
    const dprCap = this.isMobile ? 2 : this.isSafari ? 1 : this.isMac ? 1.5 : 1.8;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap, maxBufRatio);

    if (w !== this._lastW || h !== this._lastH || dpr !== this._lastDpr) {
      this._lastW = w;
      this._lastH = h;
      this._lastDpr = dpr;
      this.renderer.setPixelRatio(dpr);
      this.renderer.setSize(w, h, true);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }

    const dbSize = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(dbSize);
    if (this.cardMaterial?.uniforms?.resolution) {
      this.cardMaterial.uniforms.resolution.value.copy(dbSize);
    }

    if (this.sceneRT) {
      const rt = this._rtSize();
      this.sceneRT.setSize(rt.x, rt.y);
    }
    if (this.tubeRT && this.blurRT && this._downMat) {
      const ts = this._tubeSize();
      this.tubeRT.setSize(ts.x, ts.y);
      const bw = Math.max(2, Math.floor(ts.x * this.BLUR.downscale));
      const bh = Math.max(2, Math.floor(ts.y * this.BLUR.downscale));
      this.blurRT.setSize(bw, bh);
      this._downMat.uniforms.uTexel.value.set(1 / bw, 1 / bh);
    }

    this.updateCardScale();
  }

  private updateCardScale() {
    if (!this.cardObject) return;
    const { w, h } = this.viewportSize();
    const scale = computeResponsiveCardScale({
      viewportWidth: w,
      viewportHeight: h,
      cameraZ: this.camera.position.z,
      fovDeg: this.camera.fov,
      targetSize: this.CARD.targetSize,
      modelMaxDim: this._cardModelMaxDim,
      maxWidthFraction: 0.84,
    });
    this.cardObject.scale.setScalar(scale);
    this.cardObject.position.set(
      this.CARD.position.x - this._cardUnscaledCenter.x * scale,
      this.CARD.position.y - this._cardUnscaledCenter.y * scale,
      this.CARD.position.z - this._cardUnscaledCenter.z * scale
    );
    this._cardBaseY = this.cardObject.position.y;
  }

  private start() {
    if (!this._running) {
      this._running = true;
      gsap.ticker.add(this._animateBound);
    }
  }

  private stop() {
    if (this._running) {
      this._running = false;
      gsap.ticker.remove(this._animateBound);
    }
  }

  private async warmup() {
    try {
      await this._tubeTexturesReady;
      this._envFrameCounter = -1;
      await new Promise<void>((res) =>
        requestAnimationFrame(() => requestAnimationFrame(() => res()))
      );
      this._warmupDone = true;
    } catch (err) {
      console.warn("[VistaCardTubeScene] warmup", err);
    }
    if (!this._disposed) {
      this.attachVisibilityObserver();
    }
  }

  private renderFrame(dt: number) {
    this.renderer.info.reset();
    const prog = this.GS.progress;

    this.S.spinVelocity *= Math.pow(0.92, 60 * dt);
    this.S.rotationSpeedScale +=
      (this.S.rotationSpeedScaleTarget - this.S.rotationSpeedScale) * this.S.rotationSpeedScaleLerp;
    const scaledDt = dt * this.S.rotationSpeedScale;
    const baseVel = this.S.naturalDir * this.S.baseSpeed;
    this.S.angle += (baseVel + this.S.spinVelocity) * scaledDt;

    if (this.tubeGroup) {
      this.tubeGroup.position.y = -this.SCROLL.tubeTravel / 2 + prog * this.SCROLL.tubeTravel;
    }

    this._scrollAngle += Math.abs(prog - this._lastProgress) * this.TUBE.scrollSpin;
    this._lastProgress = prog;

    for (const { group, baseRow, rowIndex } of this.rowDescriptors) {
      const isOdd = rowIndex % 2 === 1;
      const dir = this.S.alternateRowDir && isOdd ? -1 : 1;
      const idleRot =
        this.S.angle * this.TUBE.rowSpeed[baseRow] * (isOdd ? this.TUBE.idleEvenMul : 1);
      const scrollRot = this._scrollAngle * (isOdd ? this.TUBE.scrollEvenMul : 1);
      group.rotation.y = (idleRot + scrollRot) * dir;
    }

    if (this.cardObject) {
      this.cardObject.rotation.x = this.CARD.baseRotation.x;
      this.cardObject.rotation.z = this.CARD.baseRotation.z;
    }

    this._envFrameCounter++;
    if (
      this.CARD.envEnabled &&
      this.cardObject &&
      this.sceneRT &&
      this._envFrameCounter % this.CARD.envUpdateEveryFrames === 0
    ) {
      this.updatePlanarReflection();
    }

    if (this.cardMaterial?.uniforms?.envMapIntensity) {
      this.cardMaterial.uniforms.envMapIntensity.value = this.CARD.envMapIntensity;
      this.cardMaterial.uniforms.hasEnvMap.value = this.CARD.envEnabled;
      this.cardMaterial.uniforms.uReflectBump.value = this.CARD.reflectUseBump ? 1 : 0;
      this.cardMaterial.uniforms.uReflectSoft.value = this.CARD.reflectSoft;
      this.cardMaterial.uniforms.uReflStrength.value = this.CARD.reflStrength;
      this.cardMaterial.uniforms.uReflectMono.value = this.CARD.reflectMono ? 1 : 0;
    }

    if (this._downMat && this._compMat) {
      this._downMat.uniforms.uAmount.value = this.BLUR.amount;
      this._compMat.uniforms.uHeight.value = this.BLUR.height;
      this._compMat.uniforms.uDarken.value = this.BLUR.darken;
    }

    if (
      this.BLUR.enabled &&
      this.tubeRT &&
      this.blurRT &&
      this.cardObject &&
      this.tubeGroup &&
      this._fsScene &&
      this._fsCam &&
      this._fsQuad
    ) {
      this.cardObject.visible = false;
      this.renderer.setRenderTarget(this.tubeRT);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);

      this._fsQuad.material = this._downMat!;
      this.renderer.setRenderTarget(this.blurRT);
      this.renderer.clear();
      this.renderer.render(this._fsScene, this._fsCam);

      this.renderer.setRenderTarget(null);
      this._fsQuad.material = this._compMat!;
      this.renderer.render(this._fsScene, this._fsCam);

      this.cardObject.visible = true;
      this.tubeGroup.visible = false;
      this.renderer.autoClear = false;
      this.renderer.clearDepth();
      this.renderer.render(this.scene, this.camera);
      this.tubeGroup.visible = true;
      this.renderer.autoClear = true;
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private animate() {
    if (this._disposed) return;
    if (this._nearViewport || !this._warmupDone) {
      this._timer.update();
      const dt = Math.min(this._timer.getDelta(), 0.05);
      this.renderFrame(dt);
    } else {
      this._throttleCounter = (this._throttleCounter + 1) % 20;
      if (this._throttleCounter === 0) {
        this._timer.update();
        const dt = Math.min(this._timer.getDelta(), 0.05);
        this.renderFrame(dt);
      }
    }
  }

  private createScrollTimeline() {
    if (this.reducedMotion) return null;

    gsap.set(this.GS, { progress: 0.25 });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: this.section,
        start: "top 10%",
        end: "bottom 90%",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(this.GS, { progress: 1 }, 0);

    if (this.cardObject && this.cardMaterial) {
      const targetY = this._cardBaseY;
      const targetRotY = this.CARD.baseRotation.y;
      this.cardObject.position.y = targetY;
      this.cardObject.rotation.y = targetRotY;
      tl.fromTo(
        this.cardObject.position,
        { y: targetY - 2 },
        { y: targetY, duration: 0.5, ease: "power3.out" },
        0
      );
      tl.fromTo(
        this.cardObject.rotation,
        { y: targetRotY - this.SCROLL.cardTurns * Math.PI * 1.5 },
        { y: targetRotY, duration: 0.7, ease: "none" },
        0
      );
    }

    gsap.set(this.header, { opacity: 0, yPercent: 8, filter: "blur(10px)" });
    tl.to(
      this.header,
      { opacity: 1, yPercent: 0, duration: 0.2, filter: "blur(0px)" },
      0.4
    );
    tl.fromTo(
      this.tubeUniforms.uAlpha,
      { value: 0 },
      { value: 1, duration: 0.2, ease: "none" },
      0.075
    );

    this.scrollTL = tl;
    return tl;
  }

  rebuildScrollTimeline() {
    if (!this._initialized || this._disposed) return;
    if (this.scrollTL) {
      this.scrollTL.scrollTrigger?.kill();
      this.scrollTL.kill();
      this.scrollTL = null;
    }
    const tl = this.createScrollTimeline();
    ScrollTrigger.refresh();
    tl?.scrollTrigger?.update();
  }

  dispose() {
    this._disposed = true;
    this.stop();
    window.removeEventListener("resize", this._onResizeBound);
    this._io?.disconnect();
    this._io = null;

    if (this.scrollTL) {
      this.scrollTL.scrollTrigger?.kill();
      this.scrollTL.kill();
      this.scrollTL = null;
    }

    this.tubeGroup?.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
        else mesh.material?.dispose();
      }
    });

    this.tubeTextures?.forEach((t) => t.dispose());
    this.cardObject?.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).geometry?.dispose();
      }
    });

    this.cardMaterial?.dispose();
    this._downMat?.dispose();
    this._compMat?.dispose();
    this._fsQuad?.geometry?.dispose();
    this.sceneRT?.dispose();
    this.tubeRT?.dispose();
    this.blurRT?.dispose();
    this.renderer?.dispose();
  }
}
