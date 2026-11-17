/** Official channels checked on 24 October 2026. See docs/SOCIAL-LINKS.md. */
export type SocialChannel = {
  platform: "Instagram" | "LinkedIn";
  handle: string;
  href: string;
};

export const socialGroups: { id: string; name: string; channels: SocialChannel[] }[] = [
  {
    id: "hr-vista",
    name: "HR VISTA",
    channels: [
      { platform: "Instagram", handle: "@hrvista_culavasa", href: "https://www.instagram.com/hrvista_culavasa/" },
    ],
  },
  {
    id: "cpcg",
    name: "CPCG",
    channels: [
      { platform: "Instagram", handle: "@cpcglavasa", href: "https://www.instagram.com/cpcglavasa/" },
      { platform: "LinkedIn", handle: "cpcgchristlavasa", href: "https://www.linkedin.com/company/cpcgchristlavasa/" },
    ],
  },
  {
    id: "christ-lavasa",
    name: "CHRIST University Lavasa",
    channels: [
      { platform: "Instagram", handle: "@christ_university_lavasa", href: "https://www.instagram.com/christ_university_lavasa/" },
      { platform: "LinkedIn", handle: "christlavasa", href: "https://www.linkedin.com/in/christlavasa/" },
    ],
  },
];
