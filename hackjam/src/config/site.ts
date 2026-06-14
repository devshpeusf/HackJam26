export type FaqItem = {
  question: string;
  answer: string;
};

export type TeamMember = {
  name: string;
  role: string;
  photo: string;
  socials: { github?: string; linkedin?: string; twitter?: string };
};

export type Sponsor = {
  name: string;
  logo: string;
  url: string;
};

export const siteConfig = {
  name: "HackJam",
  tagline: "Build something legendary in 24 hours.",
  registrationUrl: "#",

  faq: [
    {
      question: "Who can participate in HackJam?",
      answer:
        "HackJam is open to all currently enrolled college students. Teams of 1–4 members are welcome.",
    },
    {
      question: "How much does it cost to attend?",
      answer:
        "HackJam is completely free to attend, including meals, swag, and workshops throughout the event.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring your laptop, chargers, a valid student ID, and your best ideas. We'll handle the rest.",
    },
  ] satisfies FaqItem[],

  team: [
    {
      name: "Alex Rivera",
      role: "Organizer Lead",
      photo: "",
      socials: { github: "#", linkedin: "#" },
    },
    {
      name: "Jordan Lee",
      role: "Logistics Director",
      photo: "",
      socials: { linkedin: "#" },
    },
    {
      name: "Sam Patel",
      role: "Tech Lead",
      photo: "",
      socials: { github: "#", twitter: "#" },
    },
  ] satisfies TeamMember[],

  sponsors: [
    {
      name: "Acme Corp",
      logo: "",
      url: "#",
    },
    {
      name: "Globex Industries",
      logo: "",
      url: "#",
    },
  ] satisfies Sponsor[],
} as const;
