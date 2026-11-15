/*
 * PROJECTS — the single source of truth for the archive and every case study.
 *
 * To add a project:
 *   1. Put screenshots in assets-source/ named "<slug>-<name>.png" and run `npm run images`.
 *   2. Copy one of the entries below, change the fields, and add it to the `projects` array.
 *   3. That's it. The archive, folders, homepage index and /projects/<slug> page all read from here.
 *
 * Rules:
 *   - `visibility: "draft"` keeps an entry completely out of the public site.
 *   - `featured: true` puts it in the homepage index.
 *   - Leave optional fields out rather than guessing. Nothing unverified goes in here.
 *   - `ownerNotes` is never rendered. Use it for facts that still need confirming.
 */

export type ProjectCategory = "Website" | "Interactive 3D" | "Hardware";

export type ProjectImage = {
  /** Path under /public, without the .webp extension. "<src>-800.webp" must also exist. */
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectSection = {
  heading: string;
  /** Paragraphs. */
  body?: string[];
  /** A bulleted list shown after the paragraphs. */
  points?: string[];
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  /** One line: what it is. */
  tagline: string;
  /** Two or three sentences for the top of the case study. */
  summary: string;
  category: ProjectCategory;
  /** Only if verified. */
  year?: string;
  featured: boolean;
  visibility: "public" | "draft";
  /** What I did, in a few words. */
  role: string;
  /** Present only for collaborative work. */
  team?: string;
  /** Only technologies verified from source or confirmed by me. */
  technologies?: string[];
  cover?: ProjectImage;
  /** Used when there is no photograph yet: an honest diagram instead of a fake image. */
  coverGraphic?: "binary-leds";
  gallery?: ProjectImage[];
  /** Photos kept out of the way: shown only when the visitor asks to see them. */
  hiddenPhotos?: ProjectImage[];
  links: ProjectLink[];
  sections: ProjectSection[];
  /** Credits for data, assets or people. */
  credits?: string[];
  /** Adds the "hold to roll" demo to the case study. */
  demo?: "dice";
  /** Colours of this project's full-screen panel on the homepage: background and text. */
  tone?: { bg: string; ink: string };
  /** One true number, shown large on the homepage panel. */
  stat?: { value: number; label: string };
  ownerNotes?: string[];
};

const img = (slug: string, name: string) => `/images/projects/${slug}/${name}`;

export const projects: Project[] = [
  {
    slug: "helios",
    stat: { value: 13, label: "moons in orbit, each where it really is" },
    tone: { bg: "#f3a21b", ink: "#0b0700" },
    title: "HELIOS",
    tagline: "The solar system in a browser tab, with every planet where it is right now.",
    summary:
      "HELIOS is an interactive 3D model of the solar system. Planets sit at their current positions and move along elliptical orbits. You can fly to any world, read live figures about it, and run time forwards or backwards.",
    category: "Interactive 3D",
    year: "2025",
    featured: true,
    visibility: "public",
    role: "Design and development",
    technologies: ["Three.js", "WebGL", "JavaScript", "HTML", "CSS"],
    cover: {
      src: img("helios", "overview"),
      alt: "HELIOS showing the Sun in 3D with a planet list on the left, a facts panel on the right and time controls along the bottom.",
    },
    gallery: [
      {
        src: img("helios", "earth"),
        alt: "HELIOS focused on Earth with live distance, orbital speed and sunlight travel time.",
        caption: "Each world has a panel with live distance, speed and light-travel time.",
      },
      {
        src: img("helios", "intro"),
        alt: "The HELIOS opening screen with the title 'Our Solar System, in real time.'",
        caption: "The opening screen. One click starts the model.",
      },
    ],
    links: [
      { label: "Open the live model", href: "https://divyash-hub.github.io/interactive-solar-sys/" },
      { label: "Source on GitHub", href: "https://github.com/divyash-hub/interactive-solar-sys" },
    ],
    sections: [
      {
        heading: "What it is",
        body: [
          "Open the page and you are looking at the solar system as it is at this moment. Pick a planet from the list, or click one, and the camera flies there. A side panel shows how far it is from the Sun and from Earth, how fast it is moving, and how long sunlight takes to reach it.",
          "Time is a control, not a fixed thing. You can leave it running live, speed it up to a year per second, run it in reverse, or jump back to now.",
        ],
      },
      {
        heading: "How the positions work",
        body: [
          "Each planet's position is calculated from published NASA/JPL orbital elements. The model solves Kepler's equation on every frame, which is what turns those numbers into a point on an ellipse for a given date.",
          "The data comes from NASA/JPL. The implementation is mine. HELIOS is a personal project: it is not a NASA product and has not been independently validated.",
        ],
      },
      {
        heading: "What's in the model",
        points: [
          "Earth with day and night sides, city lights, reflective oceans, a cloud layer and atmospheric glow.",
          "Moons that cast eclipse shadows on their planets, and Saturn and its rings shadowing each other.",
          "Halley's Comet, with a tail that grows near the Sun and points away from it.",
          "Thirteen moons, the asteroid belt and the Kuiper Belt.",
          "A guided tour, keyboard shortcuts and a layout that works on a phone.",
        ],
      },
      {
        heading: "How it's built",
        body: [
          "HELIOS uses Three.js for WebGL rendering and is written in plain HTML, CSS and JavaScript. There is no build step. The whole project is one page and a folder of textures.",
        ],
      },
    ],
    credits: [
      "Orbital elements: NASA/JPL Solar System Dynamics.",
      "Planet and Sun maps: Solar System Scope (CC BY 4.0), based on NASA imagery.",
      "Earth city lights: NASA Black Marble.",
      "Rendering: the Three.js project.",
    ],
  },
  {
    slug: "coreframe",
    stat: { value: 10, label: "cases across 5 sizes, each modelled to its real dimensions" },
    tone: { bg: "#2748d8", ink: "#f4f7ff" },
    title: "Coreframe",
    tagline: "Plan your first PC in 3D: pick real parts, watch them go into the case, and know it all fits before you buy.",
    summary:
      "Coreframe is a PC builder that runs in the browser. You pick real parts one step at a time and watch them go into a real-time 3D case. Every part is checked against what is already inside, and the power button runs a boot test that lights the RGB and spins the fans, or stops at the first real problem.",
    category: "Interactive 3D",
    year: "2025",
    featured: true,
    visibility: "public",
    role: "Design and development",
    technologies: ["Three.js", "WebGL", "JavaScript", "Web Audio API", "HTML", "CSS"],
    cover: {
      src: img("coreframe", "cover"),
      alt: "Coreframe: the headline 'Build your first PC in 3D' beside a glowing 3D computer case with its parts lit up.",
    },
    gallery: [
      {
        src: img("coreframe", "apart"),
        alt: "Coreframe with a finished build pulled apart in 3D, next to its compatibility checks and game frame-rate estimates.",
        caption: "Pull apart lifts every part out of the case. The panel on the right checks the build and estimates frame rates.",
      },
    ],
    links: [
      { label: "Open Coreframe", href: "https://divyash-hub.github.io/interactive-PC-builder/" },
      { label: "Source on GitHub", href: "https://github.com/divyash-hub/interactive-PC-builder" },
    ],
    sections: [
      {
        heading: "What it is",
        body: [
          "Building a first PC is confusing: eight kinds of part, and plenty of ways to buy two that do not fit together. Coreframe walks through it one step at a time, with official product photos and plain-English explanations, and shows the build coming together in 3D as you go.",
          "Each part is modelled to its real specs: graphics card length and thickness, cooler height, radiator size, the memory slots a board has, and the true outer size of each case.",
        ],
      },
      {
        heading: "What you can do",
        points: [
          "Orbit and zoom the build, pull every part out of the case, or turn the case to glass.",
          "Choose from 10 cases across 5 sizes, most in two colours, with the 3D case recolouring as you pick.",
          "Drag a part into the case, or tap Add.",
          "Run the boot test: a pass lights the RGB and spins every fan, a fail flashes the faulty part red.",
          "See estimated frame rates for 10 popular games at 1080p, 1440p and 4K.",
          "Ask it to build for a budget: it tries every processor and graphics card pairing for the fastest build that works.",
          "Save builds, or share one as a link. Prices show in rupees or dollars.",
        ],
      },
      {
        heading: "How it checks a build",
        body: [
          "Every part is checked against what is already in the case: processor socket, memory type, board size against the case, graphics card length, cooler height, radiator size, M.2 slots and power supply wattage. It also catches a missing cooler, missing graphics on processors without them, and cases that ship without fans.",
        ],
      },
      {
        heading: "How it's built",
        body: [
          "Coreframe uses Three.js for the 3D and is written in plain HTML, CSS and JavaScript, with no build step. All of the sound (the click of a part seating, the boot beep, the fans spinning up) is generated in the browser with the Web Audio API, so there are no audio files.",
          "It is tuned to stay light. The 3D scene loads after the page is usable, only redraws when something changes, and stops completely when it is off screen. On a slow device it lowers the render resolution instead of stuttering.",
        ],
      },
    ],
    credits: ["Rendering: the Three.js project.", "Product photographs belong to their manufacturers (credited in the repository)."],
  },
  {
    slug: "royal-wedding-planners",
    stat: { value: 5, label: "pages, from first look to planning enquiry" },
    tone: { bg: "#efe6d6", ink: "#2a0d0d" },
    title: "Royal Wedding Planners",
    tagline: "The website for a wedding planning business in Jaipur, which I made from scratch during my internship there.",
    summary:
      "Royal Wedding Planners is a wedding planning business based in Jaipur. During my internship there I made its website from scratch: a multi-page site that introduces the business, sets out its services, shows past work and gives families a clear way to get in touch.",
    category: "Website",
    year: "2026",
    featured: true,
    visibility: "public",
    role: "Web designer (internship): design, content, build, hosting and upkeep",
    technologies: ["Astro"],
    cover: {
      src: img("royal-wedding-planners", "home"),
      alt: "The Royal Wedding Planners homepage: a palace courtyard set for a wedding, with the headline 'Rooted in tradition. Shaped around you.'",
    },
    gallery: [
      {
        src: img("royal-wedding-planners", "services"),
        alt: "The services page of the Royal Wedding Planners website.",
        caption: "Services.",
      },
      {
        src: img("royal-wedding-planners", "work"),
        alt: "The 'Our Work' page of the Royal Wedding Planners website.",
        caption: "Our Work.",
      },
    ],
    links: [{ label: "Visit the live site", href: "https://royalweddingplanners.com/" }],
    sections: [
      {
        heading: "What it is",
        body: [
          "The site has five main pages: Home, About Us, Services, Our Work and Contact. A “Plan My Wedding” button stays in the header on every page.",
          "The homepage moves from an introduction to services, selected work, how the planners work, and a set of common questions before a closing invitation to begin planning.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I made the whole website during my internship at Royal Wedding Planners: the design, the written content, the build, putting it online, and keeping it up to date since. It is built with Astro.",
          "The business, its events and its photographs belong to Royal Wedding Planners. This case study is about the website.",
        ],
      },
    ],
  },
  {
    slug: "ayush-raj",
    stat: { value: 35, label: "herbal extracts in the catalogue" },
    tone: { bg: "#123a22", ink: "#eef5ea" },
    title: "Ayush Raj",
    tagline: "The website for a herbal extracts manufacturer in Jaipur, which I made from scratch during my internship there.",
    summary:
      "Ayushraj Enterprises makes standardised herbal extracts and Ayurvedic formulations at its plant in Jaipur, and tests them in its own laboratory. During my internship there I made its website from scratch: a company site covering its extracts, its facilities, its certificates and how to send an enquiry.",
    category: "Website",
    year: "2026",
    featured: true,
    visibility: "public",
    role: "Web designer (internship): design, content, build, hosting and upkeep",
    technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
    cover: {
      src: img("ayush-raj", "home"),
      alt: "The Ayushraj homepage: the headline 'Herbal extracts, made to a number' beside a photograph of the quality control laboratory team.",
    },
    gallery: [
      {
        src: img("ayush-raj", "extracts"),
        alt: "The extracts page of the Ayushraj website.",
        caption: "Extracts: the catalogue of 35 extracts.",
      },
      {
        src: img("ayush-raj", "laboratory"),
        alt: "The testing laboratory page of the Ayushraj website.",
        caption: "Testing laboratory.",
      },
    ],
    links: [{ label: "Visit the live site", href: "https://ayushraj.com/" }],
    sections: [
      {
        heading: "What it is",
        body: [
          "The site is organised around what a buyer needs to know. The homepage leads with the product (\"Herbal extracts, made to a number\"), then covers the company's contract work, its three services on one site, its 35 extracts, the route from raw herb to tested powder, and its licences and certificates.",
          "Beyond the homepage there are pages for the extracts catalogue, the company's work, herbal extraction, formulation, the testing laboratory, research and training, quality certificates, partners, a gallery, careers, and an enquiry form.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I made the whole website during my internship at Ayushraj Enterprises: the design, the written content, the build, putting it online, and keeping it up to date. It is written in plain HTML, CSS and JavaScript, with GSAP for the scroll animation.",
          "The company's content, certifications and photographs belong to Ayushraj Enterprises. This case study is about the website.",
        ],
      },
    ],
  },
  {
    slug: "digital-electronic-dice",
    stat: { value: 0, label: "lines of code inside it" },
    tone: { bg: "#b8d7ea", ink: "#080a0d" },
    title: "Digital Electronic Dice",
    tagline: "A dice built from logic chips on a breadboard. No code, no microcontroller.",
    summary:
      "My team built an electronic dice for a Digital Logic Design exhibition at Christ University. Hold a button and a counter races through the numbers. Let go and it stops on one, shown in binary on four LEDs.",
    category: "Hardware",
    featured: true,
    visibility: "public",
    role: "Team member",
    team: "Built as a team for a Digital Logic Design exhibition at Christ University.",
    coverGraphic: "binary-leds",
    demo: "dice",
    hiddenPhotos: [
      {
        src: img("digital-electronic-dice", "build-lit"),
        alt: "The real dice on a breadboard, powered on: a tangle of jumper wires over the logic chips, with LEDs lit at the front.",
        caption: "Powered on, with the result showing on the LEDs.",
      },
      {
        src: img("digital-electronic-dice", "build"),
        alt: "The same breadboard switched off, showing the chips, jumper wires, push button and the four LEDs.",
        caption: "Switched off: the chips, the wiring and the push button.",
      },
    ],
    links: [
      {
        label: "Read the LinkedIn post",
        href: "https://www.linkedin.com/posts/divyashagrawal_digitallogicdesign-christuniversity-cucs-ugcPost-7506041177943769088-gFgQ/",
      },
    ],
    sections: [
      {
        heading: "How it works",
        body: [
          "A clock ticks far faster than anyone can follow. While the button is held, the clock drives a counter. Release the button and the counter stops on whatever number it had reached.",
          "A comparator, with an inverter and an AND gate, keeps the count between 1 and 6. Four LEDs show the result in binary.",
          "The result feels random, but nothing in the circuit is. The only unpredictable part is the moment you let go.",
        ],
      },
      {
        heading: "What went wrong",
        body: [
          "For a while the circuit would not count at all. The cause was one unconnected pin that kept it held in reset. Finding it was a useful lesson in how far apart a diagram on paper and a working breadboard can be.",
        ],
      },
      {
        heading: "Who built it",
        body: [
          "This was a team project, made for the Digital Logic Design course taught by Dr. Manasa Kulkarni at Christ University. I was one member of the team.",
        ],
      },
    ],
    ownerNotes: [
      "Which parts did you personally design, wire, test or present? Add a sentence to 'Who built it'.",
      "Chip numbers, team size and teammates' names are deliberately left out until confirmed (and until teammates agree to be named).",
    ],
  },
];

/* ---- derived helpers: everything public reads through these ---- */

validate(projects);

export const publicProjects = projects.filter((p) => p.visibility === "public");
export const featuredProjects = publicProjects.filter((p) => p.featured);

export const getProject = (slug: string | undefined) => publicProjects.find((p) => p.slug === slug);

/** Categories that actually contain a public project, in first-seen order. */
export const categories = [...new Set(publicProjects.map((p) => p.category))];

export const projectsIn = (category: ProjectCategory) => publicProjects.filter((p) => p.category === category);

export function neighbours(slug: string) {
  const i = publicProjects.findIndex((p) => p.slug === slug);
  const n = publicProjects.length;
  return { previous: publicProjects[(i - 1 + n) % n], next: publicProjects[(i + 1) % n] };
}

/** Fails loudly in development if an entry is missing something the pages rely on. */
function validate(list: Project[]) {
  const seen = new Set<string>();
  for (const p of list) {
    const problems: string[] = [];
    if (!/^[a-z0-9-]+$/.test(p.slug)) problems.push("slug must be lowercase letters, numbers and hyphens");
    if (seen.has(p.slug)) problems.push("slug is used twice");
    seen.add(p.slug);
    if (!p.title || !p.tagline || !p.summary || !p.role) problems.push("title, tagline, summary and role are required");
    if (!p.cover && !p.coverGraphic) problems.push("needs a cover image or a coverGraphic");
    if (p.sections.length === 0) problems.push("needs at least one section");
    if (problems.length) throw new Error(`Project "${p.slug || p.title}": ${problems.join("; ")}`);
  }
}
