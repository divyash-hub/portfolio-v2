import { useEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "../components/Icons";
import GlassBrain from "../components/GlassBrain";
import ProjectCover from "../components/ProjectCover";
import { publicProjects } from "../data/projects";
import { about, debating, facts, offScreen, site, traits } from "../data/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./pages.css";
import "./about.css";

gsap.registerPlugin(ScrollTrigger);

/* One small drawing per trait, in the same order as `traits` in site.ts. */
const traitIcons = [
  // I debate: two speech bubbles facing each other
  <svg key="debate" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M6 10h20a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H15l-6 5v-5H6a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3Z" />
    <path d="M42 20H33v9a3 3 0 0 1-3 3h-6v2a3 3 0 0 0 3 3h7l6 5v-5h2a3 3 0 0 0 3-3V23a3 3 0 0 0-3-3Z" />
  </svg>,
  // I learn most from people: two figures
  <svg key="people" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="17" cy="15" r="6" />
    <circle cx="33" cy="17" r="5" />
    <path d="M5 40c0-7 5.4-12 12-12s12 5 12 12" />
    <path d="M27 31c1.6-1.6 3.8-2.5 6-2.5 5.5 0 10 4.4 10 10.5" />
  </svg>,
  // I question everything: a question mark in a circle
  <svg key="question" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="19" />
    <path d="M18.5 19a5.5 5.5 0 1 1 8.2 4.8c-1.7 1-2.7 2.2-2.7 4.2v1" />
    <circle cx="24" cy="35" r="1.2" className="fill" />
  </svg>,
];

export default function About() {
  usePageMeta("About", `About ${site.owner}: who I am, how I think, and what I'm building.`);
  const rootRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLElement>(null);

  // Each block rises in once as it reaches the screen. Nothing moves for reduced-motion visitors.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // the three traits fill in with colour, left to right, as each one scrolls past
      gsap.utils.toArray<HTMLElement>(".trait-word", root).forEach((word) => {
        gsap.fromTo(
          word,
          { "--fill": "0%" },
          { "--fill": "100%", ease: "none", scrollTrigger: { trigger: word, start: "top 85%", end: "top 40%", scrub: 0.4 } },
        );
      });

      // the photo leans toward the pointer
      const photo = photoRef.current;
      const lean = (e: PointerEvent) => {
        if (!photo || e.pointerType === "touch") return;
        const r = photo.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        photo.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
        photo.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
      };
      window.addEventListener("pointermove", lean, { passive: true });

      gsap.utils.toArray<HTMLElement>("[data-rise]", root).forEach((group) => {
        gsap.from(group.children, {
          y: 44,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 85%", once: true },
        });
      });
      return () => window.removeEventListener("pointermove", lean);
    });
    return () => mm.revert();
  }, []);

  return (
    <div className="about" ref={rootRef}>
      {/* ---- intro ---- */}
      <header className="shell about-hero">
        <div className="about-hero-text">
          <p className="kicker">About me</p>
          <h1 className="about-hello">
            Hi, I'm {site.firstName}.<span>I can't leave an idea alone.</span>
          </h1>
          <p className="about-lede">{about.intro[1]}</p>
        </div>
        <figure className="about-photo" ref={photoRef}>
          <img
            src="/images/me/divyash.webp"
            srcSet="/images/me/divyash-600.webp 600w, /images/me/divyash.webp 960w"
            sizes="(max-width: 60rem) 80vw, 26rem"
            width={960}
            height={1200}
            alt="Divyash Agrawal in a dark suit and red tie, smiling."
          />
          <figcaption>
            <span className="hero-pulse" aria-hidden="true" /> {site.location}
          </figcaption>
        </figure>
        <dl className="glass about-strip" data-rise>
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ---- who I am ---- */}
      <section className="shell about-block" aria-labelledby="who-heading">
        <header className="about-head">
          <p className="kicker">Who I am</p>
          <h2 id="who-heading">Three things that explain most of me.</h2>
        </header>
        <ol className="traits-big">
          {traits.map((t, i) => (
            <li key={t.title}>
              <h3 className="trait-word">{t.title}</h3>
              <div className="trait-detail">
                <span className="trait-icon">{traitIcons[i]}</span>
                <p>{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- debating ---- */}
      <section className="shell about-block" aria-labelledby="debate-heading">
        <header className="about-head">
          <p className="kicker">Debating</p>
          <h2 id="debate-heading">Where the arguing started.</h2>
        </header>
        <ol className="timeline" data-rise>
          {debating.map((d, i) => (
            <li key={d.title} data-last={i === debating.length - 1 || undefined}>
              <span className="timeline-dot" aria-hidden="true" />
              <p className="timeline-when">{d.when}</p>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- building ---- */}
      <section className="shell about-block" aria-labelledby="build-heading">
        <header className="about-head">
          <p className="kicker">What I love building</p>
          <h2 id="build-heading" className="about-quote">
            {about.approach.body[0]}
          </h2>
        </header>
        <p className="about-body">{about.approach.body[1]}</p>
        <ul className="about-projects" data-rise>
          {publicProjects.map((p) => (
            <li key={p.slug}>
              <Link to={`/projects/${p.slug}`} data-cursor="Open">
                <span className="frame">
                  <ProjectCover project={p} sizes="16rem" decorative />
                </span>
                <span className="about-project-name">{p.title}</span>
                <span className="about-project-kind">{p.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- curious about next ---- */}
      <section className="shell about-block" aria-labelledby="next-heading">
        <header className="about-head">
          <p className="kicker">What keeps me curious</p>
          <h2 id="next-heading">New technology, basically all of it.</h2>
        </header>
        <div className="about-next" data-rise>
          <div className="about-next-text">
            <p>{about.exploring.body[0].replace("New technology, basically all of it. ", "")}</p>
            <p>{about.exploring.body[1]}</p>
          </div>
          <GlassBrain />
        </div>
      </section>

      {/* ---- off-screen and a way to reach me ---- */}
      <section className="shell about-block" aria-labelledby="off-heading">
        <div className="glass about-close" data-rise>
          <div>
            <p className="kicker" id="off-heading">
              Off-screen
            </p>
            <ul className="chips chips--big">
              {offScreen.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="about-close-cta">
            <p>Got an idea, a project, or an opinion I should hear?</p>
            <div className="button-row">
              <Link to="/contact" className="button button--solid">
                Get in touch <ArrowRight />
              </Link>
              <Link to="/projects" className="button">
                See the projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
