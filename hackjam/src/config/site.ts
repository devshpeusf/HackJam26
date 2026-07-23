export type FaqItem = {
  question: string;
  answer: string;
};

export type TeamMember = {
  name: string;
  role: string;
  team: string;
  photo: string;
  /** LinkedIn profile URL — the whole card links here. */
  linkedin: string;
};

// TODO: swap "#" for each member's real LinkedIn URL when links are provided.
const LINKEDIN_PLACEHOLDER = "#";

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
  tagline: "Build something legendary in 12 hours.",
  registrationUrl: "https://events.mlh.com/events/14412-hackjam-26",
  eventDate: "Fall 2026",
  venue: "University of South Florida",
  mlh: {
    label: "An MLH Member Event",
    codeOfConductUrl: "https://mlh.io/code-of-conduct",
    siteUrl: "https://mlh.io",
  },
  socials: {
    instagram: "https://www.instagram.com/hackabull/?hl=en",
    discord: "https://discord.com/invite/hxfC5sp6H6",
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
        orbit: "12 HOURS",
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
        "HackJam is open to all currently enrolled college students. Teams of 1–3 members are welcome.",
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
      name: "Adriana Martinez",
      role: "President",
      team: "Executive",
      photo: "/team/adriana-martinez.jpg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Jorge Arevalo",
      role: "Assistant Lead",
      team: "Executive",
      photo: "",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Gregory Ramirez",
      role: "Lead",
      team: "Tech Initiatives",
      photo: "/team/gregory-ramirez.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Prachi Lohana",
      role: "Director",
      team: "Tech Initiatives",
      photo: "/team/prachi-lohana.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Sara Suleiman",
      role: "Social Media Manager",
      team: "Marketing",
      photo: "/team/sara-suleiman.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Karishma Kalloo",
      role: "Lead",
      team: "Hacker's Experience",
      photo: "/team/karishma-kalloo.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Andres Pistocchi",
      role: "Director",
      team: "Hacker's Experience",
      photo: "/team/andres-pistocchi.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Ian Lopez",
      role: "Lead",
      team: "Web Development",
      photo: "/team/ian-lopez.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Gabriel Marchiori de Almeida",
      role: "Co Lead",
      team: "Web Development",
      photo: "/team/gabriel-marchiori-de-almeida.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Jacob Bhatt",
      role: "Design / UI-UX Lead",
      team: "Web Development",
      photo: "/team/jacob-bhatt.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Daniel Misherky",
      role: "Digital Assets Director",
      team: "Web Development",
      photo: "/team/daniel-misherky.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Alejandra Quintana Roman",
      role: "Director",
      team: "Logistics",
      photo: "/team/alejandra-quintana-roman.jpg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Tomas Torrado",
      role: "Lead",
      team: "Tech Development",
      photo: "/team/tomas-torrado.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Sayeda Zahraa Tanaaz Alam",
      role: "Co Lead",
      team: "Tech Development",
      photo: "/team/sayeda-zahraa-tanaaz-alam.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Juan Caicedo",
      role: "Director",
      team: "Tech Development",
      photo: "/team/juan-caicedo.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Nishtha Krukeja",
      role: "Lead",
      team: "Workshop",
      photo: "/team/nishtha-krukeja.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Alexander Sonkin",
      role: "Lead",
      team: "Ambassador",
      photo: "/team/alexander-sonkin.jpeg",
      linkedin: LINKEDIN_PLACEHOLDER,
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
