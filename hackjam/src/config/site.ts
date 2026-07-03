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
  tier: "gold" | "silver";
};

export type Track = {
  name: string;
  description: string;
  /** Drop a sprite exported from deep-fold.itch.io/pixel-planet-generator
      into /public/planets and set its path here to replace the code-drawn
      placeholder planet. */
  sprite?: string;
  /** Placeholder planet colors (base surface, darker shade, highlight, glow). */
  palette: { base: string; shade: string; highlight: string; glow: string };
  ring?: boolean;
};

export const siteConfig = {
  name: "HackJam",
  tagline: "Build something legendary in 24 hours.",
  // TODO: replace with the real MLH OrganizerHQ registration link
  registrationUrl: "#register",
  eventDate: "Spring 2026",
  venue: "University of South Florida",
  mlh: {
    label: "An MLH Member Event",
    codeOfConductUrl: "https://mlh.io/code-of-conduct",
    siteUrl: "https://mlh.io",
  },
  socials: {
    instagram: "#",
    discord: "#",
    linkedin: "#",
  },

  // Placeholder tracks — rename freely; each renders as a pixel planet.
  tracks: [
    {
      name: "Deep Mind",
      description:
        "AI & machine learning. Train, fine-tune, or prompt your way to something clever.",
      palette: {
        base: "#7b2ff7",
        shade: "#4a1b9e",
        highlight: "#b78aff",
        glow: "#9d5cff",
      },
    },
    {
      name: "Cloud Nine",
      description:
        "Web & cloud. Full-stack apps, APIs, and tools people can use the same day.",
      palette: {
        base: "#21b6e6",
        shade: "#0f6fa0",
        highlight: "#9be4ff",
        glow: "#3ec9f0",
      },
      ring: true,
    },
    {
      name: "Circuit World",
      description:
        "Hardware & embedded. Sensors, robots, and things that beep in real life.",
      palette: {
        base: "#ef6359",
        shade: "#9f1823",
        highlight: "#ffb199",
        glow: "#ff7a5c",
      },
    },
    {
      name: "Pixel Playground",
      description:
        "Games & creative tech. Build something playful — engines, art tools, or worlds.",
      palette: {
        base: "#4caf50",
        shade: "#2c6b30",
        highlight: "#a8e6a1",
        glow: "#6fdd74",
      },
    },
  ] satisfies Track[],

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
    {
      question: "Do I need to know how to code?",
      answer:
        "Not at all. First-time hackers are encouraged to join — there will be workshops, mentors, and teammates to learn with.",
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
    { name: "Gold Sponsor", logo: "", url: "#", tier: "gold" },
    { name: "Gold Sponsor", logo: "", url: "#", tier: "gold" },
    { name: "Gold Sponsor", logo: "", url: "#", tier: "gold" },
    { name: "Silver Sponsor", logo: "", url: "#", tier: "silver" },
    { name: "Silver Sponsor", logo: "", url: "#", tier: "silver" },
    { name: "Silver Sponsor", logo: "", url: "#", tier: "silver" },
    { name: "Silver Sponsor", logo: "", url: "#", tier: "silver" },
  ] satisfies Sponsor[],
} as const;
