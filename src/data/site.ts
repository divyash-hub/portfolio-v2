/*
 * SITE — who this is, how to reach them, and the copy for About, Capabilities,
 * Experience and Lab. Edit text here; the pages only lay it out.
 */

export const site = {
  name: "Divyash Agrawal",
  owner: "Divyash Agrawal",
  firstName: "Divyash",
  lastName: "Agrawal",
  /** One line under the name on the homepage. */
  tagline: "I build things that make complex ideas easy to see, and I question everything along the way, including myself.",
  timeZone: "Asia/Kolkata",
  location: "Bengaluru, India",
  email: "divyashforwork@gmail.com",
  /** Where the contact form sends messages (Formspree forwards them to your inbox). */
  formEndpoint: "https://formspree.io/f/mgolodbj",
  course: "BCA, 2nd semester",
  university: "Christ University, Bangalore",
  campus: "Bangalore Central Campus",
  links: [
    { label: "LinkedIn", handle: "in/divyashagrawal", href: "https://www.linkedin.com/in/divyashagrawal" },
    { label: "GitHub", handle: "divyash-hub", href: "https://github.com/divyash-hub" },
  ],
};

/* ---------------- About ---------------- */

export const about = {
  /** The big statement on the homepage. It lights up word by word as you scroll. */
  /** Words between *stars* are picked out in colour. */
  statement: "I'm Divyash, a student in Bengaluru who can't leave an idea alone. I *build it,* I *question it,* and then I ask what you think.",
  intro: [
    "Hi, I'm Divyash. I can't leave an idea alone.",
    "I'm a student in Bengaluru, pursuing my BCA at Christ University. I build things that make complex ideas easier to see, I debate whenever I get the chance, and I'm happiest in a good conversation with someone who sees things differently.",
  ],
  approach: {
    heading: "What I love building",
    body: [
      "I love the moment an idea stops being an idea. The page loads, the planet moves, the LED finally lights up, and now it's a real thing someone else can open and use.",
      "That's why the work here is such a mix. I didn't pick a lane and stay in it. I built what I was curious about, and I cared about how each one works underneath, not only how it looks. HELIOS places its planets by solving an orbital equation every frame. The dice has no code in it at all.",
    ],
  },
  background: {
    heading: "Where I am right now",
    body: [
      "I'm in the 2nd semester of my BCA at Christ University, Bangalore Central Campus. The electronic dice came out of a Digital Logic Design exhibition there, and the university is also where I debate in Asian and British Parliamentary formats.",
      "I'm early in this, and I'm fine with that. I'd rather show you a few real things that run than a long list of buzzwords.",
    ],
  },
  exploring: {
    heading: "What keeps me curious",
    body: [
      "New technology, basically all of it. When something new comes out I want to know how it works and what I could make with it. Right now that's mostly AI and cloud platforms.",
      "The thread through my work is making complicated things easy to see. HELIOS does it for the solar system, Coreframe for building a PC, and Glass Brain, which I'm building now, will do it for AI.",
    ],
  },
};

/** Who I am: three things, shown as a list on the homepage and the About page. */
export const traits = [
  {
    title: "I debate.",
    body: "Since 10th grade: MUNs, roundtable conferences, and Asian and British Parliamentary debates at Christ University. It taught me to build an argument, and to drop one when it doesn't hold.",
  },
  {
    title: "I learn most from people.",
    body: "I love meeting people and hearing how they see things, especially when it's not how I see them.",
  },
  {
    title: "I question everything.",
    body: "Concepts I'm learning, opinions I hold, the obvious answer. If I can't explain why something is true, I don't really know it yet.",
  },
];

/** The short facts beside "Who I am" on the homepage. */
export const facts = [
  { label: "Studying", value: "BCA, 2nd semester, Christ University, Bangalore Central Campus" },
  { label: "Based in", value: "Bengaluru, India" },
  { label: "Debating", value: "Honourable Mention (3rd place), Kristu Jayanti MUN 2026" },
  { label: "Off-screen", value: "Music, good conversations, helping people out" },
];

/** About page: the debating story, in order. */
export const debating = [
  { when: "10th grade", title: "First MUNs", body: "Started taking part in Model United Nations and roundtable debating conferences." },
  { when: "Christ University", title: "Parliamentary debate", body: "Asian Parliamentary and British Parliamentary debates at the university." },
  { when: "February 2026", title: "Kristu Jayanti MUN", body: "Honourable Mention, 3rd place." },
];

/** Off-screen: the things that are me but aren't projects. */
export const offScreen = ["Good conversations", "Debating", "Music", "Making friends", "Helping people out"];

/** What I'm building right now. Shown on the homepage and the About page with an "In progress" tag. */
export const building = {
  title: "Glass Brain",
  body: "A visual look inside a predictive language model: how it reads your words, weighs the possibilities and picks the next one, shown step by step so anyone can follow it.",
  status: "In progress",
  /** When it should be ready to show. */
  eta: "Launching early 2027",
  link: { label: "Follow the progress on GitHub", href: "https://github.com/divyash-hub/glassbrain" },
};

/** Homepage: "I build ..." One line per kind of work, shown one at a time as you scroll. */
export const builds = [
  { word: "Websites.", line: "Two live sites for real businesses, built from the ground up." },
  { word: "3D worlds.", line: "A solar system with every planet where it really is, and a PC you can build piece by piece." },
  { word: "Circuits.", line: "A dice wired from logic chips. No code in it at all." },
  { word: "Things that run.", line: "Everything here is something you can open, press or fly through. That is the only rule." },
];

/**
 * Homepage: four closing words. The last one is the name, which grows to fill the screen. Each one decodes on screen as you scroll.
 * The last one is the invitation.
 */
export const phases = ["Curious.", "Debater.", "Always learning.", "Divyash."];

/**
 * Skills: only things a project here actually used. `in` lists those projects (their slugs),
 * which is what the filter buttons on the homepage light up.
 */
const H = "helios";
const RWP = "royal-wedding-planners";
const AR = "ayush-raj";
const DICE = "digital-electronic-dice";
const CF = "coreframe";

export const skills = [
  {
    title: "Web",
    items: [
      { name: "HTML", in: [H, CF, RWP, AR] },
      { name: "CSS", in: [H, CF, RWP, AR] },
      { name: "JavaScript", in: [H, CF, AR] },
      { name: "Astro", in: [RWP] },
      { name: "GSAP scroll animation", in: [AR] },
      { name: "Light and dark themes", in: [CF] },
      { name: "Drag and drop", in: [CF] },
      { name: "Responsive layout", in: [H, CF, RWP, AR] },
      { name: "Multi-page site structure", in: [RWP, AR] },
    ],
  },
  {
    title: "3D and graphics",
    items: [
      { name: "Three.js", in: [H, CF] },
      { name: "WebGL", in: [H, CF] },
      { name: "3D modelling to real dimensions", in: [CF] },
      { name: "Sound with the Web Audio API", in: [CF] },
      { name: "Render performance tuning", in: [CF] },
      { name: "Orbital maths (Kepler's equation)", in: [H] },
      { name: "Real-time lighting and shadows", in: [H, CF] },
      { name: "Camera movement", in: [H, CF] },
      { name: "Interface design for 3D", in: [H, CF] },
    ],
  },
  {
    title: "Hardware and logic",
    items: [
      { name: "Digital logic design", in: [DICE] },
      { name: "Counters", in: [DICE] },
      { name: "Comparators", in: [DICE] },
      { name: "Logic gates", in: [DICE] },
      { name: "Clock circuits", in: [DICE] },
      { name: "Breadboard prototyping", in: [DICE] },
      { name: "Circuit debugging", in: [DICE] },
    ],
  },
  {
    title: "Shipping it",
    items: [
      { name: "Git and GitHub", in: [H, CF] },
      { name: "GitHub Pages", in: [H, CF] },
      { name: "Putting sites live", in: [H, CF, RWP, AR] },
      { name: "Compatibility and pricing logic", in: [CF] },
      { name: "Working in a team", in: [DICE] },
    ],
  },
];

/* ---------------- Capabilities ----------------
 * Every group points at the work that backs it up.
 * `level` is one of four honest labels. No percentages.
 */

export type CapabilityLevel = "Used in projects" | "Comfortable with" | "Familiar with" | "Currently exploring";

export type CapabilityGroup = {
  title: string;
  level: CapabilityLevel;
  description: string;
  items: string[];
  /** Slugs from projects.ts. */
  evidence: string[];
};

export const capabilities: CapabilityGroup[] = [
  {
    title: "Websites, start to finish",
    level: "Used in projects",
    description: "Multi-page sites built from the ground up and put live for real organisations.",
    items: ["HTML", "CSS", "JavaScript", "Astro", "GSAP", "Responsive layout"],
    evidence: ["royal-wedding-planners", "ayush-raj"],
  },
  {
    title: "Interactive 3D in the browser",
    level: "Used in projects",
    description: "Real-time rendering, camera movement, lighting and shadows, driven by real data.",
    items: ["Three.js", "WebGL", "Orbital calculations", "Web Audio API", "Interface design for 3D"],
    evidence: ["helios", "coreframe"],
  },
  {
    title: "Digital logic and hardware",
    level: "Used in projects",
    description: "Circuits built from logic chips on a breadboard, and the debugging that comes with them.",
    items: ["Counters", "Comparators", "Logic gates", "Clock circuits", "Breadboard prototyping"],
    evidence: ["digital-electronic-dice"],
  },
  {
    title: "Intelligent systems and cloud",
    level: "Currently exploring",
    description: "Areas I'm reading about and experimenting with. No finished work to show yet.",
    items: ["AI and intelligent systems", "Cloud platforms"],
    evidence: [],
  },
];

/* ---------------- Experience ----------------
 * Add verified entries only: exact title, organisation and dates.
 * While this list is empty, the Experience page and its nav link do not exist.
 */

export type ExperienceEntry = {
  kind: "Education" | "Internship" | "Programme" | "Certificate" | "Achievement";
  title: string;
  organisation: string;
  /** e.g. "2025 – present". Leave out if not verified. */
  dates?: string;
  detail?: string;
  link?: string;
};

export const experience: ExperienceEntry[] = [
  {
    kind: "Internship",
    title: "Web designer",
    organisation: "Ayushraj Enterprises, Jaipur",
    dates: "2026",
    detail:
      "Made the company website from scratch: the design, the written content, the build in HTML, CSS, JavaScript and GSAP, hosting, and keeping it up to date.",
    link: "/projects/ayush-raj",
  },
  {
    kind: "Internship",
    title: "Web designer",
    organisation: "Royal Wedding Planners, Jaipur",
    dates: "2026",
    detail:
      "Made the business website from scratch in Astro: the design, the written content, the build, hosting, and keeping it up to date.",
    link: "/projects/royal-wedding-planners",
  },
  {
    kind: "Education",
    title: "BCA, 2nd semester",
    organisation: "Christ University, Bangalore Central Campus",
    dates: "Now",
    detail: "Also where I debate, in Asian and British Parliamentary formats.",
  },
  {
    kind: "Achievement",
    title: "Honourable Mention (3rd place)",
    organisation: "Kristu Jayanti MUN",
    dates: "February 2026",
  },
];

/* ---------------- Lab ----------------
 * Real experiments and prototypes only.
 * While this list is empty, the Lab page and its nav link do not exist.
 */

export type LabEntry = {
  title: string;
  description: string;
  status: "Prototype" | "Experiment" | "In progress";
  link?: string;
};

export const lab: LabEntry[] = [];

/* ---------------- Navigation ---------------- */

export const navItems = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  ...(experience.length ? [{ label: "Experience", to: "/experience" }] : []),
  ...(lab.length ? [{ label: "Lab", to: "/lab" }] : []),
  { label: "Contact", to: "/contact" },
];

/** The footer lists every page, including the ones not in the top menu. */
export const footerPages = [...navItems.slice(0, -1), { label: "Skills", to: "/skills" }, navItems[navItems.length - 1]];
