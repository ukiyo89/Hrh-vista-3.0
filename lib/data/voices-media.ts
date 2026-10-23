/** Supplied archive photography. Portrait IDs are not speaker identities. */
export type PastVoice = {
  id: string;
  image: string;
  alt: string;
  width: number;
  height: number;
};

export const pastVoices: PastVoice[] = [
  { id: "01", image: "/media/voices/past-voice-01.webp", alt: "Past HR VISTA speaker wearing a dark suit and patterned tie", width: 800, height: 800 },
  { id: "02", image: "/media/voices/past-voice-02.webp", alt: "Past HR VISTA speaker wearing glasses and a navy suit", width: 800, height: 800 },
  { id: "03", image: "/media/voices/past-voice-03.webp", alt: "Close-up portrait of a past HR VISTA speaker wearing glasses", width: 800, height: 800 },
  { id: "04", image: "/media/voices/past-voice-04.webp", alt: "Past HR VISTA speaker wearing a grey suit and pink tie", width: 800, height: 800 },
  { id: "05", image: "/media/voices/past-voice-05.webp", alt: "Past HR VISTA speaker seated in an office", width: 800, height: 800 },
  { id: "06", image: "/media/voices/past-voice-06.webp", alt: "Past HR VISTA speaker seated in a blue armchair", width: 800, height: 800 },
  { id: "07", image: "/media/voices/past-voice-07.webp", alt: "Past HR VISTA speaker wearing a white blazer", width: 800, height: 800 },
  { id: "08", image: "/media/voices/past-voice-08.webp", alt: "Past HR VISTA speaker wearing a dark suit and red tie", width: 800, height: 800 },
  { id: "09", image: "/media/voices/past-voice-09.webp", alt: "Past HR VISTA speaker wearing a dark blazer and open-collar shirt", width: 400, height: 400 },
  { id: "10", image: "/media/voices/past-voice-10.webp", alt: "Past HR VISTA speaker wearing glasses and a grey tie", width: 531, height: 531 },
  { id: "11", image: "/media/voices/past-voice-11.webp", alt: "Past HR VISTA speaker wearing a light checked blazer", width: 800, height: 800 },
  { id: "12", image: "/media/voices/past-voice-12.webp", alt: "Past HR VISTA speaker wearing a black jacket with gold detailing", width: 800, height: 800 },
  { id: "13", image: "/media/voices/past-voice-13.webp", alt: "Past HR VISTA speaker wearing a dark waistcoat", width: 800, height: 800 },
];

export const voicesArchiveImages = [
  { src: "/media/voices/archive-audience.webp", alt: "The audience listening to a conversation at HR VISTA" },
  { src: "/media/voices/archive-conversation.webp", alt: "Two speakers in conversation on the HR VISTA stage" },
  { src: "/media/voices/archive-community.webp", alt: "The HR VISTA community gathered in the auditorium" },
];


/** Speaker biographies supplied by the HR VISTA team. These are not testimonials. */
export type SpeakerProfile = {
  id: string;
  name: string;
  biography: string;
  /** Attach only after a source confirms this archive portrait belongs to this speaker. */
  portraitId?: string;
  /** Public LinkedIn profile, when independently verified. */
  linkedIn?: string;
  /** Source supporting the portrait assignment, when one is available. */
  portraitSource?: string;
};

export const speakerProfiles: SpeakerProfile[] = [
  {
    "id": "amit-sawhney",
    "name": "Dr. Amit Sawhney",
    "biography": "Managing Director of Nippon Global SL, Dr. Amit Sawhney is a global business leader specializing in international M&A and brand strategy. Passionate about empowering the next generation, his extensive cross-border experience provides students with elite mentorship, bridging academic excellence with invaluable global market insights to shape future-ready professionals.",
    "linkedIn": "https://es.linkedin.com/in/amitsawhney",
    "portraitId": "01",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "shyambahadur-prajapati",
    "name": "Mr. Shyambahadur Prajapati",
    "biography": "Head of HR & Operations at GM Infotech, Shyambahadur Prajapati is a distinguished HR leader and \"People & Culture Architect.\" Passionate about mentoring the next generation, his extensive expertise in talent acquisition and strategic human capital provides students with invaluable professional guidance, equipping them to navigate and excel in the evolving corporate landscape.",
    "linkedIn": "https://in.linkedin.com/in/shyamprajapati",
    "portraitId": "02",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "balasubramanian-sethuraman",
    "name": "Dr. Balasubramanian Sethuraman",
    "biography": "Head of HR at Parekh Integrated Services, Dr. Balasubramanian Sethuraman is a transformational HR leader and Honorary Doctorate recipient. Deeply committed to shaping the next generation, his 25+ years of strategic leadership across global markets offer students masterclass mentorship in workplace maturity, people-first culture, and boardroom-ready talent strategy.",
    "linkedIn": "https://in.linkedin.com/in/bala-s",
    "portraitId": "03",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "narasimha-murthy-aradhyula",
    "name": "Mr. Narasimha Murthy Aradhyula",
    "biography": "A veteran Project Management professional and strategic consultant, Narasimha Murthy Aradhyula brings deep expertise in large-scale corporate operations, governance, and organizational transformation. Dedicated to student empowerment, his extensive leadership background offers students practical masterclass mentorship in navigating complex business landscapes, agile execution, and bridging the gap between industry requirements and academic learning.",
    "portraitId": "04",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "rajendra-lingwal",
    "name": "Mr. Rajendra Lingwal",
    "biography": "Senior Vice President of Human Resources at Persistent Systems, Rajendra Lingwal is a seasoned HR maestro specializing in workforce strategy and organizational architecture. Dedicated to nurturing academic talent, his visionary leadership provides students with transformative mentorship on skills integration, workplace dynamics, and navigating the future of tech-driven corporate ecosystems.",
    "linkedIn": "https://in.linkedin.com/in/rajendra-lingwal-7bb2161",
    "portraitId": "05",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "gauri-das",
    "name": "Ms. Gauri Das",
    "biography": "SVP & Head of HR, Admin, and Marketing at India Factoring and Finance Solutions, Gauri Das is an award-winning strategic leader, author, and TEDx speaker. An engineer with dual master’s degrees in HR and Psychology, her cross-functional expertise offers students profound mentorship in organizational psychology, talent acquisition, and digitalizing HR workflows.",
    "linkedIn": "https://in.linkedin.com/in/gauridas",
    "portraitId": "06",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "saumya-badgayan-dutta",
    "name": "Dr. Saumya Badgayan Dutta",
    "biography": "Vice President of Corporate Strategy, HR & IR at Gold Star Jewellery, Dr. Saumya Badgayan Dutta is a world-record-holding leader, dual PhD, and TEDx speaker. An expert in behavioral analysis and digital HR transformation, her profound insights offer students elite mentorship in organizational psychology, talent strategy, and unlocking human potential.",
    "linkedIn": "https://in.linkedin.com/in/dr-saumya-badgayan-dutta-70b4b114",
    "portraitId": "07",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "george-kutty",
    "name": "Mr. George Kutty",
    "biography": "A seasoned business operations and management professional, George Kutty brings a wealth of experience in corporate strategy, organizational leadership, and driving business growth. Passionate about empowering future professionals, his practical corporate expertise offers students invaluable mentorship in operational excellence, commercial strategy, and navigating real-world industry challenges.",
    "portraitId": "08",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "senthil-kumar-s",
    "name": "Mr. Senthil Kumar S",
    "biography": "A seasoned Supply Chain and Operations leader with over two decades of experience, Senthil Kumar S excels in global logistics, strategic sourcing, and warehouse automation. Passionate about bridging industry and academia, his operational expertise provides students with invaluable mentorship in process optimization, agile supply networks, and real-world commercial execution.",
    "portraitId": "09",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "himanshu-talwar",
    "name": "Dr. Himanshu Talwar",
    "biography": "An international TEDx speaker, celebrated author, and Executive Board Member at AIMA-YLC, Dr. Himanshu Talwar is a master of strategic management and policy advocacy. Driven by his motto \"Passion with Profession,\" his extensive background across global establishments offers students elite mentorship in transformational leadership, corporate governance, and cross-cultural communication.",
    "linkedIn": "https://in.linkedin.com/in/drhimanshutalwar",
    "portraitId": "10",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "debansh-roy",
    "name": "Mr. Debansh Roy",
    "biography": "Vice President, Head of People (India), and Board Member at AllianceBernstein, Debansh Roy is a progressive HR executive and corporate strategist. Passionate about shaping global workforce success, his deep expertise in talent architecture and people practices provides students with high-impact mentorship on career readiness, cross-border business operations, and navigating corporate leadership.",
    "linkedIn": "https://in.linkedin.com/in/debanshroy",
    "portraitId": "11",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "ganesh-natarajan",
    "name": "Dr. Ganesh Natarajan",
    "biography": "Executive Chairman of 5F World and Honeywell Automation India, Dr. Ganesh Natarajan is a visionary technology pioneer, author, and former Chairman of NASSCOM. A Harvard Business School case-study alumnus, his legendary leadership scaling multi-billion corporate titans provides students with unparalleled masterclass mentorship in digital transformation, entrepreneurship, and future-forward global strategy.",
    "linkedIn": "https://in.linkedin.com/in/ganeshnatarajan",
    "portraitId": "12",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  },
  {
    "id": "sumit-atri",
    "name": "Mr. Sumit Atri",
    "biography": "An accomplished Corporate Human Resources leader with extensive experience across premier Indian multinational groups, Sumit Atri excels in strategic talent acquisition, organizational health, and leadership capability building. Highly committed to student transformation, his practical business-partnering perspective provides future professionals with exceptional mentorship on modern workplace dynamics, career navigation, and matching academic skills to corporate needs.",
    "linkedIn": "https://in.linkedin.com/in/sumit-atri-a7b661b",
    "portraitId": "13",
    "portraitSource": "Content-owner confirmation in chat, 24 October 2026: numbered photo order matches supplied biography order"
  }
];
