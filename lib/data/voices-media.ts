/** Source-verified portraits. Named IDs keep assignments independent of file order. */
export type PastVoice = {
  id: string;
  image: string;
  alt: string;
  width: number;
  height: number;
};

export const pastVoices: PastVoice[] = [
  { id: "amit-sawhney", image: "/media/voices/past-voice-12.webp", alt: "Dr. Amit Sawhney", width: 800, height: 800 },
  { id: "shyambahadur-prajapati", image: "/media/voices/past-voice-11.webp", alt: "Mr. Shyambahadur Prajapati", width: 800, height: 800 },
  { id: "balasubramanian-sethuraman", image: "/media/voices/past-voice-10.webp", alt: "Dr. Balasubramanian Sethuraman", width: 531, height: 531 },
  { id: "narasimha-murthy-aradhyula", image: "/media/voices/narasimha-murthy-aradhyula.webp", alt: "Mr. Narasimha Murthy Aradhyula", width: 500, height: 500 },
  { id: "rajendra-lingwal", image: "/media/voices/past-voice-08.webp", alt: "Mr. Rajendra Lingwal", width: 800, height: 800 },
  { id: "gauri-das", image: "/media/voices/past-voice-07.webp", alt: "Ms. Gauri Das", width: 800, height: 800 },
  { id: "saumya-badgayan-dutta", image: "/media/voices/saumya-badgayan-dutta.webp", alt: "Dr. Saumya Badgayan Dutta", width: 400, height: 400 },
  { id: "george-kutty", image: "/media/voices/george-kutty.webp", alt: "Mr. George Kutty", width: 600, height: 600 },
  { id: "senthil-kumar-s", image: "/media/voices/senthil-kumar-s.webp", alt: "Mr. Senthil Kumar S", width: 300, height: 300 },
  { id: "himanshu-talwar", image: "/media/voices/himanshu-talwar.webp", alt: "Dr. Himanshu Talwar", width: 200, height: 200 },
  { id: "debansh-roy", image: "/media/voices/past-voice-02.webp", alt: "Mr. Debansh Roy", width: 800, height: 800 },
  { id: "ganesh-natarajan", image: "/media/voices/ganesh-natarajan.webp", alt: "Dr. Ganesh Natarajan", width: 800, height: 640 },
  { id: "sumit-atri", image: "/media/voices/past-voice-01.webp", alt: "Mr. Sumit Atri", width: 800, height: 800 },
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
    "portraitId": "amit-sawhney",
    "portraitSource": "https://www.linkedin.com/posts/amitsawhney_history-charity-conquering-activity-7231747078245236737-PT2r"
  },
  {
    "id": "shyambahadur-prajapati",
    "name": "Mr. Shyambahadur Prajapati",
    "biography": "Head of HR & Operations at GM Infotech, Shyambahadur Prajapati is a distinguished HR leader and \"People & Culture Architect.\" Passionate about mentoring the next generation, his extensive expertise in talent acquisition and strategic human capital provides students with invaluable professional guidance, equipping them to navigate and excel in the evolving corporate landscape.",
    "linkedIn": "https://in.linkedin.com/in/shyamprajapati",
    "portraitId": "shyambahadur-prajapati",
    "portraitSource": "https://www.linkedin.com/in/shyamprajapati/"
  },
  {
    "id": "balasubramanian-sethuraman",
    "name": "Dr. Balasubramanian Sethuraman",
    "biography": "Head of HR at Parekh Integrated Services, Dr. Balasubramanian Sethuraman is a transformational HR leader and Honorary Doctorate recipient. Deeply committed to shaping the next generation, his 25+ years of strategic leadership across global markets offer students masterclass mentorship in workplace maturity, people-first culture, and boardroom-ready talent strategy.",
    "linkedIn": "https://in.linkedin.com/in/bala-s",
    "portraitId": "balasubramanian-sethuraman",
    "portraitSource": "https://bizintegration.in/india-hr-summit-mumbai-2025/speakers/"
  },
  {
    "id": "narasimha-murthy-aradhyula",
    "name": "Mr. Narasimha Murthy Aradhyula",
    "biography": "A veteran Project Management professional and strategic consultant, Narasimha Murthy Aradhyula brings deep expertise in large-scale corporate operations, governance, and organizational transformation. Dedicated to student empowerment, his extensive leadership background offers students practical masterclass mentorship in navigating complex business landscapes, agile execution, and bridging the gap between industry requirements and academic learning.",
    "portraitId": "narasimha-murthy-aradhyula",
    "portraitSource": "https://www.thebrainalytics.com/event/3rd-edition-nbfc-fintech-summit-awards-2026-3/"
  },
  {
    "id": "rajendra-lingwal",
    "name": "Mr. Rajendra Lingwal",
    "biography": "Senior Vice President of Human Resources at Persistent Systems, Rajendra Lingwal is a seasoned HR maestro specializing in workforce strategy and organizational architecture. Dedicated to nurturing academic talent, his visionary leadership provides students with transformative mentorship on skills integration, workplace dynamics, and navigating the future of tech-driven corporate ecosystems.",
    "linkedIn": "https://in.linkedin.com/in/rajendra-lingwal-7bb2161",
    "portraitId": "rajendra-lingwal",
    "portraitSource": "https://www.linkedin.com/posts/rajendra-lingwal-7bb2161_pulse-activity-7423707293625778176-49vc"
  },
  {
    "id": "gauri-das",
    "name": "Ms. Gauri Das",
    "biography": "SVP & Head of HR, Admin, and Marketing at India Factoring and Finance Solutions, Gauri Das is an award-winning strategic leader, author, and TEDx speaker. An engineer with dual master’s degrees in HR and Psychology, her cross-functional expertise offers students profound mentorship in organizational psychology, talent acquisition, and digitalizing HR workflows.",
    "linkedIn": "https://in.linkedin.com/in/gauridas",
    "portraitId": "gauri-das",
    "portraitSource": "https://in.linkedin.com/in/gauridas"
  },
  {
    "id": "saumya-badgayan-dutta",
    "name": "Dr. Saumya Badgayan Dutta",
    "biography": "Vice President of Corporate Strategy, HR & IR at Gold Star Jewellery, Dr. Saumya Badgayan Dutta is a world-record-holding leader, dual PhD, and TEDx speaker. An expert in behavioral analysis and digital HR transformation, her profound insights offer students elite mentorship in organizational psychology, talent strategy, and unlocking human potential.",
    "linkedIn": "https://in.linkedin.com/in/dr-saumya-badgayan-dutta-70b4b114",
    "portraitId": "saumya-badgayan-dutta",
    "portraitSource": "https://bizintegration.in/india-hr-summit-mumbai-2025/speakers/"
  },
  {
    "id": "george-kutty",
    "name": "Mr. George Kutty",
    "biography": "A seasoned business operations and management professional, George Kutty brings a wealth of experience in corporate strategy, organizational leadership, and driving business growth. Passionate about empowering future professionals, his practical corporate expertise offers students invaluable mentorship in operational excellence, commercial strategy, and navigating real-world industry challenges.",
    "portraitId": "george-kutty",
    "portraitSource": "https://india.techhrconference.com/agenda"
  },
  {
    "id": "senthil-kumar-s",
    "name": "Mr. Senthil Kumar S",
    "biography": "A seasoned Supply Chain and Operations leader with over two decades of experience, Senthil Kumar S excels in global logistics, strategic sourcing, and warehouse automation. Passionate about bridging industry and academia, his operational expertise provides students with invaluable mentorship in process optimization, agile supply networks, and real-world commercial execution.",
    "portraitId": "senthil-kumar-s",
    "portraitSource": "https://www.bigmarker.com/internshala8/how-hdfc-life-hires-freshers-roles-skills-and-selection-criteria"
  },
  {
    "id": "himanshu-talwar",
    "name": "Dr. Himanshu Talwar",
    "biography": "An international TEDx speaker, celebrated author, and Executive Board Member at AIMA-YLC, Dr. Himanshu Talwar is a master of strategic management and policy advocacy. Driven by his motto \"Passion with Profession,\" his extensive background across global establishments offers students elite mentorship in transformational leadership, corporate governance, and cross-cultural communication.",
    "linkedIn": "https://in.linkedin.com/in/drhimanshutalwar",
    "portraitId": "himanshu-talwar",
    "portraitSource": "https://ylc.aima.in/mentors/himanshu-talwar.php"
  },
  {
    "id": "debansh-roy",
    "name": "Mr. Debansh Roy",
    "biography": "Vice President, Head of People (India), and Board Member at AllianceBernstein, Debansh Roy is a progressive HR executive and corporate strategist. Passionate about shaping global workforce success, his deep expertise in talent architecture and people practices provides students with high-impact mentorship on career readiness, cross-border business operations, and navigating corporate leadership.",
    "linkedIn": "https://in.linkedin.com/in/debanshroy",
    "portraitId": "debansh-roy",
    "portraitSource": "https://www.linkedin.com/in/debanshroy/"
  },
  {
    "id": "ganesh-natarajan",
    "name": "Dr. Ganesh Natarajan",
    "biography": "Executive Chairman of 5F World and Honeywell Automation India, Dr. Ganesh Natarajan is a visionary technology pioneer, author, and former Chairman of NASSCOM. A Harvard Business School case-study alumnus, his legendary leadership scaling multi-billion corporate titans provides students with unparalleled masterclass mentorship in digital transformation, entrepreneurship, and future-forward global strategy.",
    "linkedIn": "https://in.linkedin.com/in/ganeshnatarajan",
    "portraitId": "ganesh-natarajan",
    "portraitSource": "https://ganeshnatarajan.in/"
  },
  {
    "id": "sumit-atri",
    "name": "Mr. Sumit Atri",
    "biography": "An accomplished Corporate Human Resources leader with extensive experience across premier Indian multinational groups, Sumit Atri excels in strategic talent acquisition, organizational health, and leadership capability building. Highly committed to student transformation, his practical business-partnering perspective provides future professionals with exceptional mentorship on modern workplace dynamics, career navigation, and matching academic skills to corporate needs.",
    "linkedIn": "https://in.linkedin.com/in/sumit-atri-a7b661b",
    "portraitId": "sumit-atri",
    "portraitSource": "https://www.linkedin.com/in/sumit-atri-a7b661b/"
  }
];
