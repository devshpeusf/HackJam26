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

  // Official HackJam 26 tracks. `stats` is flavor text for the planet modal.
  worlds: [
    {
      name: "Best Overall",
      num: "TRACK 01",
      blurb:
        "Recognizes the strongest overall project, combining creativity, technical execution, functionality, and impact. This track celebrates a well-rounded solution that stands out through both its idea and execution.",
      planetIndex: 0,
      stats: {
        orbit: "12 HOURS",
        temp: "7,800°F",
        radius: "Everything",
        atm: "PURE AMBITION",
      },
    },
    {
      name: "Home Turf",
      num: "TRACK 02",
      blurb:
        "Look around your campus, neighborhood, or community and identify something that could be improved. Build a solution that addresses a local challenge and creates meaningful impact close to home.",
      planetIndex: 3,
      stats: {
        orbit: "LOW & CLOSE",
        temp: "TAMPA WARM",
        radius: "ONE BLOCK",
        atm: "NEIGHBORLY",
      },
    },
    {
      name: "Off the Grid",
      num: "TRACK 03",
      blurb:
        "Build something that helps people live more sustainably. Think reducing waste, saving energy or water, improving transportation, growing food, or helping people make greener choices.",
      planetIndex: 1,
      stats: {
        orbit: "SOLAR-POWERED",
        temp: "NET ZERO",
        radius: "LOW FOOTPRINT",
        atm: "CLEAN AIR",
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
      photo: "/team/adriana-martinez.webp",
      linkedin: "https://www.linkedin.com/in/adrianamartinez06/",
    },
    {
      name: "Jorge Arevalo",
      role: "Judging Lead",
      team: "Executive",
      photo: "/team/jorge-arevalo.webp",
      linkedin: "https://www.linkedin.com/in/jorge-arevalo-933875332/",
    },
    {
      name: "Gregory Ramirez",
      role: "Lead",
      team: "Tech Initiatives",
      photo: "/team/gregory-ramirez.webp",
      linkedin: "https://www.linkedin.com/in/gregoryramirezf/",
    },
    {
      name: "Prachi Lohana",
      role: "Director",
      team: "Tech Initiatives",
      photo: "/team/prachi-lohana.webp",
      linkedin: "https://www.linkedin.com/in/prachi-lohana6/?skipRedirect=true",
    },
    {
      name: "Brenda Seminario",
      role: "Graphic Design Director",
      team: "Marketing",
      photo: "/team/brenda-seminario.webp",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Victoria Christoffel",
      role: "Graphic Design Director",
      team: "Marketing",
      photo: "",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Sara Suleiman",
      role: "Social Media Manager",
      team: "Marketing",
      photo: "/team/sara-suleiman.webp",
      linkedin: "https://www.linkedin.com/in/sara-s-m/",
    },
    {
      name: "Karishma Kalloo",
      role: "Lead",
      team: "Hacker's Experience",
      photo: "/team/karishma-kalloo.webp",
      linkedin: "https://www.linkedin.com/in/karishma-kalloo-93a4b7382/",
    },
    {
      name: "Andres Pistocchi",
      role: "Director",
      team: "Hacker's Experience",
      photo: "/team/andres-pistocchi.webp",
      linkedin: "https://www.linkedin.com/in/andres-pistocchi-375075296/",
    },
    {
      name: "Gerson Araujo Maciel Neto",
      role: "Director",
      team: "Hacker's Experience",
      photo: "/team/gerson-araujo-maciel-neto.webp",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Ian Lopez",
      role: "Lead",
      team: "Web Development",
      photo: "/team/ian-lopez.webp",
      linkedin: "https://www.linkedin.com/in/ian-lopez-547806311",
    },
    {
      name: "Gabriel Marchiori",
      role: "Co Lead",
      team: "Web Development",
      photo: "/team/gabriel-marchiori-de-almeida.webp",
      linkedin: "https://www.linkedin.com/in/gabrielmarchiori/",
    },
    {
      name: "Jacob Bhatt",
      role: "Design / UI-UX Lead",
      team: "Web Development",
      photo: "/team/jacob-bhatt.webp",
      linkedin: "https://www.linkedin.com/in/jacob-bhatt/",
    },
    {
      name: "Daniel Misherky",
      role: "Digital Assets Director",
      team: "Web Development",
      photo: "/team/daniel-misherky.webp",
      linkedin: "https://www.linkedin.com/in/dmish13/",
    },
    {
      name: "Alejandra Quintana Roman",
      role: "Director",
      team: "Logistics",
      photo: "/team/alejandra-quintana-roman.webp",
      linkedin: "https://www.linkedin.com/in/alejandraquintana0416/",
    },
    {
      name: "Olumoroti Ojo-Akinkunmi",
      role: "Director",
      team: "Logistics",
      photo: "/team/olumoroti-ojo-akinkunmi.webp",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Tomas Torrado",
      role: "Lead",
      team: "Tech Development",
      photo: "/team/tomas-torrado.webp",
      linkedin: "https://www.linkedin.com/in/tomas-torrado-9b3b7430b/",
    },
    {
      name: "Sayeda Zahraa Tanaaz Alam",
      role: "Co Lead",
      team: "Tech Development",
      photo: "/team/sayeda-zahraa-tanaaz-alam.webp",
      linkedin: "https://www.linkedin.com/in/zahraaalam/",
    },
    {
      name: "Juan Caicedo",
      role: "Director",
      team: "Tech Development",
      photo: "/team/juan-caicedo.webp",
      linkedin: "https://www.linkedin.com/in/juandc21/",
    },
    {
      name: "Jaden Rodriguez",
      role: "Director",
      team: "Tech Development",
      photo: "/team/jaden-rodriguez.webp",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Nishtha Krukeja",
      role: "Lead",
      team: "Workshop",
      photo: "/team/nishtha-krukeja.webp",
      linkedin: "https://www.linkedin.com/in/nishthakukreja/",
    },
    {
      name: "Mariafernanda Belisario",
      role: "Director",
      team: "Workshop",
      photo: "/team/mariafernanda-belisario.webp",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
    {
      name: "Alexander Sonkin",
      role: "Lead",
      team: "Ambassador",
      photo: "/team/alexander-sonkin.webp",
      linkedin: "https://www.linkedin.com/in/alexanderjsonkin/",
    },
    {
      name: "Jonathan Glasgow",
      role: "Engagement Director",
      team: "Ambassador",
      photo: "",
      linkedin: LINKEDIN_PLACEHOLDER,
    },
  ] satisfies TeamMember[],

  // Confirmed HackJam 26 judges. Fill in as details land:
  //  - role:   "Title, Company" (empty hides the line)
  //  - photo:  drop the headshot at public/judges/<first>-<last>.webp
  //  - socials.linkedin: profile URL (empty hides the chip)
  judges: [
    { name: "Akshay Sharma", role: "", photo: "", socials: {} },
    { name: "Danil Matrosov", role: "", photo: "/judges/Danil Matrosov.jpg", socials: {} },
    { name: "Hari Prasad", role: "", photo: "", socials: {} },
    { name: "Nandish Nanjappa", role: "", photo: "", socials: {} },
    { name: "Nutan Sahoo", role: "Applied Scientist, Microsoft", photo: "/judges/Nutan Sahoo.jpg", socials: {"linkedin": "https://www.linkedin.com/in/nutan-sahoo/"} },
    { name: "Prakshal Doshi", role: "Site Reliability Engineer, Apple", photo: "/judges/Prakshal Doshi.png", socials: {"linkedin": "https://www.linkedin.com/in/prakshal-doshi/"} },
    { name: "Sanjoy Sarkar", role: "", photo: "", socials: {} },
    { name: "Silu Panda", role: "Software Engineer, LinkedIn", photo: "/judges/Silu Panda.jpg", socials: {"linkedin": "https://www.linkedin.com/in/silupanda/"} },
    { name: "Vaibhav Jain", role: "Software Engineer, Google", photo: "/judges/Vaibhav Jain.jpg", socials: {"linkedin": "https://www.linkedin.com/in/vaibhavjain2391/"} },
    { name: "Vishal Punjabi", role: "Applied Scientist, SAP", photo: "/judges/Vishal Punjabi.jpg", socials: {"linkedin": "https://www.linkedin.com/in/vshalpnjabi/"} },
    { name: "Yesha Patel", role: "Enterprise Solution Architect, IBM", photo: "/judges/Yesha Patel.png", socials: {"linkedin": "https://www.linkedin.com/in/yesha-patel-4b645b1b/"} },
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
