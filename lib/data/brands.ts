export type LogoTreatment = "platinum" | "silverBoost" | "screenWhite" | "screenBlack" | "native";
export type LogoShape = "wide" | "square";

export interface CompanyBrand {
  id: string;
  name: string;
  logoSrc: string;
  tileSrc: string;
  treatment: LogoTreatment;
  shape: LogoShape;
  sector: string;
  speakerRole: string;
}

// Verified organisations & visiting leaders from HR VISTA 2.0 (hrvista.live & voices archive)
export const HR_VISTA_2_COMPANIES: readonly CompanyBrand[] = [
  {
    id: "dentsu",
    name: "dentsu",
    logoSrc: "/media/logos/dentsu.svg",
    tileSrc: "/media/moto-card/brands/dentsu.png",
    treatment: "silverBoost",
    shape: "wide",
    sector: "Global Media & Creative",
    speakerRole: "Chief Guest · CPO South Asia",
  },
  {
    id: "reliance",
    name: "Reliance Industries",
    logoSrc: "/media/logos/reliance.png",
    tileSrc: "/media/moto-card/brands/reliance.png",
    treatment: "platinum",
    shape: "wide",
    sector: "Enterprise Conglomerate",
    speakerRole: "Head HR · Panelist",
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    logoSrc: "/media/logos/kotak.svg",
    tileSrc: "/media/moto-card/brands/kotak.png",
    treatment: "native",
    shape: "wide",
    sector: "Banking & Finance",
    speakerRole: "SVP & Head Training",
  },
  {
    id: "ltimindtree",
    name: "LTIMindtree",
    logoSrc: "/media/logos/ltimindtree.svg",
    tileSrc: "/media/moto-card/brands/ltimindtree.png",
    treatment: "platinum",
    shape: "wide",
    sector: "Technology Consulting",
    speakerRole: "Global HR-TA Moderator",
  },
  {
    id: "persistent",
    name: "Persistent Systems",
    logoSrc: "/media/logos/persistent.svg",
    tileSrc: "/media/moto-card/brands/persistent.png",
    treatment: "platinum",
    shape: "wide",
    sector: "Digital Engineering",
    speakerRole: "SVP Human Resources",
  },
  {
    id: "jio",
    name: "Reliance Jio",
    logoSrc: "/media/logos/jio.svg",
    tileSrc: "/media/moto-card/brands/jio.png",
    treatment: "native",
    shape: "square",
    sector: "Digital & Telecom",
    speakerRole: "General Manager · Panelist",
  },
  {
    id: "timespro",
    name: "TimesPro",
    logoSrc: "/media/logos/timespro.png",
    tileSrc: "/media/moto-card/brands/timespro.png",
    treatment: "platinum",
    shape: "square",
    sector: "Higher Ed & Leadership",
    speakerRole: "EVP & Chief People Officer",
  },
  {
    id: "sutherland",
    name: "Sutherland",
    logoSrc: "/media/logos/sutherland.png",
    tileSrc: "/media/moto-card/brands/sutherland.png",
    treatment: "native",
    shape: "wide",
    sector: "Digital Transformation",
    speakerRole: "Global Head · Learning",
  },
  {
    id: "honeywell",
    name: "Honeywell Automation",
    logoSrc: "/media/logos/honeywell.svg",
    tileSrc: "/media/moto-card/brands/honeywell.png",
    treatment: "platinum",
    shape: "wide",
    sector: "Industrial Automation",
    speakerRole: "Executive Chairman",
  },
  {
    id: "alliancebernstein",
    name: "AllianceBernstein",
    logoSrc: "/media/logos/alliancebernstein.png",
    tileSrc: "/media/moto-card/brands/alliancebernstein.png",
    treatment: "screenBlack",
    shape: "square",
    sector: "Asset Management",
    speakerRole: "VP & Head of People",
  },
  {
    id: "arvind",
    name: "Arvind Limited",
    logoSrc: "/media/logos/arvind.svg",
    tileSrc: "/media/moto-card/brands/arvind.png",
    treatment: "platinum",
    shape: "square",
    sector: "Textiles & Apparel",
    speakerRole: "CHRO · Fireside Chat",
  },
  {
    id: "omya",
    name: "Omya",
    logoSrc: "/media/logos/omya.svg",
    tileSrc: "/media/moto-card/brands/omya.png",
    treatment: "platinum",
    shape: "square",
    sector: "Specialty Minerals",
    speakerRole: "Head HR · South Asia",
  },
  {
    id: "indiafactoring",
    name: "India Factoring",
    logoSrc: "/media/logos/indiafactoring.png",
    tileSrc: "/media/moto-card/brands/indiafactoring.png",
    treatment: "screenWhite",
    shape: "square",
    sector: "Financial Solutions",
    speakerRole: "SVP & Head of HR",
  },
  {
    id: "beinghr",
    name: "BeingHR",
    logoSrc: "/media/raw/logo_beinghr.png",
    tileSrc: "/media/moto-card/brands/beinghr.png",
    treatment: "native",
    shape: "wide",
    sector: "Community Partner",
    speakerRole: "60,000+ HR Community",
  },
  {
    id: "deloitte",
    name: "Deloitte",
    logoSrc: "/media/logos/deloitte.svg",
    tileSrc: "/media/moto-card/brands/deloitte.png",
    treatment: "platinum",
    shape: "wide",
    sector: "Advisory & Consulting",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
  {
    id: "infosys",
    name: "Infosys",
    logoSrc: "/media/logos/infosys.svg",
    tileSrc: "/media/moto-card/brands/infosys.png",
    treatment: "native",
    shape: "wide",
    sector: "Global IT Services",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
  {
    id: "accenture",
    name: "Accenture",
    logoSrc: "/media/logos/accenture.svg",
    tileSrc: "/media/moto-card/brands/accenture.png",
    treatment: "platinum",
    shape: "wide",
    sector: "Technology & Strategy",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
  {
    id: "ey",
    name: "EY",
    logoSrc: "/media/logos/ey.svg",
    tileSrc: "/media/moto-card/brands/ey.png",
    treatment: "platinum",
    shape: "square",
    sector: "Assurance & Advisory",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    logoSrc: "/media/logos/hdfc.svg",
    tileSrc: "/media/moto-card/brands/hdfc.png",
    treatment: "native",
    shape: "wide",
    sector: "Banking & Financial Services",
    speakerRole: "HR VISTA Recruiting Ecosystem",
  },
];

export const TUBE_ASSETS = {
  tubeImages: HR_VISTA_2_COMPANIES.map((company) => company.tileSrc),
  cardModel: "/media/moto-card/card.glb",
  cardVertex: "/media/moto-card/vertex_org.glsl",
  cardFragment: "/media/moto-card/fragment_org.glsl",
  matcap: "/media/moto-card/matcap.jpg",
  cardUv: "/media/moto-card/hrvista-uv-map-card.jpg",
} as const;

export const VISTA_CARD_COPY = {
  headingLine1: "WHEN MACHINES THINK,",
  headingLine2: "HUMAN POTENTIAL LEADS",
  ctaLabel: "Explore the Brochure",
  ctaHref: "/brochure",
  ariaLabel: "HR VISTA 3.0 showcase with organisations from HR VISTA 2.0",
} as const;

export function getTubeTileIndex(baseRow: number, col: number, cols: number, imageCount: number): number {
  if (imageCount <= 0) return 0;
  return (baseRow * cols + col) % imageCount;
}

export function computeRowSpeeds(rows: number): number[] {
  return Array.from({ length: rows }, (_, idx) => {
    const t = rows <= 1 ? 0 : idx / (rows - 1);
    return 0.65 + 0.9 * t;
  });
}

export function computeResponsiveCardScale(params: {
  viewportWidth: number;
  viewportHeight: number;
  cameraZ: number;
  fovDeg: number;
  targetSize: number;
  modelMaxDim: number;
  maxWidthFraction?: number;
}): number {
  const aspect = Math.max(params.viewportWidth / Math.max(params.viewportHeight, 1), 0.35);
  const halfFovRad = ((params.fovDeg * 0.5) * Math.PI) / 180;
  const visibleH = 2 * params.cameraZ * Math.tan(halfFovRad);
  const visibleW = visibleH * aspect;
  const maxWidthFraction = params.maxWidthFraction ?? 0.84;
  const desiredSize = Math.min(params.targetSize, visibleW * maxWidthFraction);
  return desiredSize / Math.max(params.modelMaxDim, 1e-4);
}
