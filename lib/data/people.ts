import { cpcgMembers } from "./cpcg-members";

/** Names and edition roles: https://www.hrvista.live/ and /contact, retrieved 2026-10-08.
 * Profiles for Lijo and Justin are directly linked by that site.
 * Shankar and Akhil were matched to public LinkedIn profiles.
 * The first four entries retain the previous edition's faculty credits. The CPCG roster
 * is supplied by the organiser; Arnav's existing website credit is retained there.
 * Portraits were retrieved from the matching live LinkedIn profiles on
 * 2026-10-09 and stored locally; see public/media/people/sources.json.
 */
export type Person = { name: string; role: string; group: "Faculty & leadership" | "CPCG · Lavasa" | "CPCG · Pune City"; initials: string; linkedin?: string; source: string; portrait?: string; portraitPosition?: string };
export const people: Person[] = [
  { name: "Fr. Lijo Thomas", role: "Dean & Director · CHRIST Lavasa", group: "Faculty & leadership", initials: "LT", linkedin: "https://www.linkedin.com/in/lijo-thomas-1b4459218/", source: "https://www.hrvista.live/", portrait: "/media/people/lijo-thomas.webp" },
  { name: "Fr. Justin P Varghese", role: "Academic Coordinator · CHRIST Lavasa", group: "Faculty & leadership", initials: "JV", linkedin: "https://www.linkedin.com/in/justin-p-varghese-2661351a3/", source: "https://www.hrvista.live/", portrait: "/media/people/justin-varghese.webp", portraitPosition: "64% 35%" },
  { name: "Prof. Shankar Iyer", role: "Head · CPCG", group: "Faculty & leadership", initials: "SI", linkedin: "https://www.linkedin.com/in/shankarhiyer/", source: "https://www.hrvista.live/contact", portrait: "/media/people/shankar-iyer.webp" },
  { name: "Prof. Akhil Paul", role: "Placement Officer · CPCG", group: "Faculty & leadership", initials: "AP", linkedin: "https://www.linkedin.com/in/akhilpaulk/", source: "https://www.hrvista.live/contact", portrait: "/media/people/akhil-paul.webp" },
  ...cpcgMembers,
];

// Deliberately empty until the 3.0 guest lineup is supplied.
export const guests: Person[] = [];
