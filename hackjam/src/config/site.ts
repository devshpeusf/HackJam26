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

export type Judge = {
  name: string;
  role: string;
  photo: string;
  socials: { linkedin?: string; twitter?: string; website?: string };
  /** Locked-slot placeholder styling until the judge is confirmed. */
  tba?: boolean;
};

export type RocketSlot = {
  /** Pixel-art rocket sprite under /public (e.g. "/rockets/booster.png").
      null renders the code-drawn SVG fallback in LaunchReplay. */
  src: string | null;
  /** Horizontal launch position, % of viewport width. */
  xPercent: number;
  scale: number;
};

export type WorldTrack = {
  name: string;
  num: string;
  blurb: string;
  /** Index into PLANET_DEFS (lib/pixelPlanet.ts): 0 Terran, 1 Lunar, 2 Magma, 3 Ringed. */
  planetIndex: number;
  stats: { orbit: string; temp: string; radius: string; atm: string };
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
    instagram: "https://www.instagram.com/shpeusf/",
    discord: "#",
    linkedin: "https://www.linkedin.com/company/shpe-usf",
  },

  // Placeholder worlds for the Tracks section — swap names/blurbs/stats
  // when the real track info lands.
  worlds: [
    {
      name: "Deep Mind",
      num: "TRACK 01",
      blurb:
        "AI & machine learning. Train, fine-tune, or prompt your way to something clever.",
      planetIndex: 0,
      stats: {
        orbit: "24 HOURS",
        temp: "GPU-HOT",
        radius: "1B PARAMS",
        atm: "PURE HYPE",
      },
    },
    {
      name: "Cloud Nine",
      num: "TRACK 02",
      blurb:
        "Web & cloud. Full-stack apps, APIs, and tools people can use the same day.",
      planetIndex: 3,
      stats: {
        orbit: "99.9% UPTIME",
        temp: "COOL EDGE",
        radius: "GLOBAL CDN",
        atm: "VAPORWARE-FREE",
      },
    },
    {
      name: "Circuit World",
      num: "TRACK 03",
      blurb:
        "Hardware & embedded. Sensors, robots, and things that beep in real life.",
      planetIndex: 1,
      stats: {
        orbit: "60 HZ",
        temp: "+3.3 V",
        radius: "0805 SMD",
        atm: "SOLDER SMOKE",
      },
    },
  ] satisfies WorldTrack[],

  // Click-triggered launch replay (footer "PLAY AGAIN?" overlay).
  rocketLaunch: {
    rocketCount: 3,
    rockets: [
      { src: null, xPercent: 28, scale: 0.85 },
      { src: null, xPercent: 50, scale: 1 },
      { src: null, xPercent: 72, scale: 0.85 },
    ] satisfies RocketSlot[],
  },

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

  // Placeholder panel — swap names/photos/socials (and drop `tba`) as
  // judges are confirmed.
  judges: [
    { name: "To Be Announced", role: "Seat 01", photo: "", socials: {}, tba: true },
    { name: "To Be Announced", role: "Seat 02", photo: "", socials: {}, tba: true },
    { name: "To Be Announced", role: "Seat 03", photo: "", socials: {}, tba: true },
    { name: "To Be Announced", role: "Seat 04", photo: "", socials: {}, tba: true },
    { name: "To Be Announced", role: "Seat 05", photo: "", socials: {}, tba: true },
    { name: "To Be Announced", role: "Seat 06", photo: "", socials: {}, tba: true },
  ] satisfies Judge[],

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
