import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router";
import LocalTime from "../components/LocalTime";
import OrbitHero from "../components/OrbitHero";
import DiceDemo from "../components/DiceDemo";
import { GlassBrainNet } from "../components/GlassBrain";
import GitHubSpot from "../components/GitHubSpot";
import ProjectCover from "../components/ProjectCover";
import ScrollProgress from "../components/ScrollProgress";
import Skills from "../components/Skills";
import { ArrowRight, ArrowOut } from "../components/Icons";
import { featuredProjects } from "../data/projects";
import { about, building, builds, facts, phases, site, traits } from "../data/site";
import { usePageMeta } from "../hooks/usePageMeta";
import { setupHomeMotion } from "./home-motion";
import "../components/dice.css";
import "./home.css";

/** A word split into letters that can move on their own. Screen readers get the whole word from the heading's label. */
const Letters = ({ text }: { text: string }) => (
  <span className="hero-line" aria-hidden="true">
    {[...text].map((ch, i) => (
      <span key={i} className="ch">
        {ch}
      </span>
    ))}
  </span>
);

export default function Home() {
  usePageMeta(
    null,
    "Divyash Agrawal's portfolio: websites built from the ground up, an interactive 3D solar system, and a dice made from logic chips.",
  );

  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => (rootRef.current ? setupHomeMotion(rootRef.current) : undefined), []);

  const total = String(featuredProjects.length + 1).padStart(2, "0"); // + Glass Brain

  // The statement, split into words. Words between *stars* get the accent colour.
  const words = about.statement.split("*").flatMap((part, i) =>
    part
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text, accent: i % 2 === 1 })),
  );


  return (
    <div className="home" ref={rootRef}>
      {/* ---- Intro: the name, and the work in orbit around it ---- */}
      <section className="hero" data-section="Intro">
        <div className="hero-orbit">
          <OrbitHero projects={featuredProjects} />
        </div>
        <div className="shell hero-inner">
          <p className="hero-status">
            <span className="hero-pulse" aria-hidden="true" />
            <span>{site.location}</span>
            <LocalTime />
          </p>
          <h1 className="hero-name" aria-label={site.owner}>
            <Letters text={site.firstName} />
            <Letters text={site.lastName} />
          </h1>
          <div className="hero-foot">
            <p className="hero-tagline">{site.tagline}</p>
            <p className="hero-scroll">Scroll</p>
          </div>
        </div>
      </section>

      {/* ---- About: one short statement that swings into place as you scroll ---- */}
      <section className="shell about-scroll" data-section="About" aria-labelledby="about-heading">
        <h2 id="about-heading" className="kicker">
          Who's this?
        </h2>
        <p className="reveal" aria-label={about.statement.replace(/\*/g, "")}>
          {words.map((w, i) => (
            <span key={i} className="w" aria-hidden="true">
              <span className="wi" data-accent={w.accent || undefined}>
                {w.text}
              </span>
            </span>
          ))}
        </p>

        <div className="who">
          <ul className="who-list">
            {traits.map((t) => (
              <li key={t.title}>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </li>
            ))}
          </ul>
          <aside className="who-facts" aria-label="Quick facts">
            <dl>
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link to="/about" className="button">
              More about me <ArrowRight />
            </Link>
          </aside>
        </div>
      </section>

      {/* ---- I build …: the sentence holds, the ending changes ---- */}
      <section className="build" data-section="What I build" aria-labelledby="build-heading">
        <div className="shell build-inner">
          <div className="build-side">
            <p className="kicker">What I build</p>
            <ol className="build-list">
              {builds.map((b) => (
                <li key={b.word}>{b.word.replace(".", "")}</li>
              ))}
            </ol>
          </div>
          <div className="build-main">
            <h2 id="build-heading" className="build-lead">
              I build
            </h2>
            <div className="build-words">
              {builds.map((b) => (
                <div key={b.word} className="build-word">
                  <p className="build-big">{b.word}</p>
                  <p className="build-line">{b.line}</p>
                </div>
              ))}
            </div>
          </div>
          <span className="build-count" aria-hidden="true">
            01
          </span>
        </div>
      </section>

      {/* ---- Skills: everything the projects used, filterable by project ---- */}
      <Skills />

      {/* ---- Work: one full-screen panel per project ---- */}
      <section className="work" id="work" data-section="Work" aria-labelledby="work-heading">
        <h2 id="work-heading" className="work-marquee" aria-label="Things I've made">
          <span className="work-marquee-track" aria-hidden="true">
            <span>Things I've made</span>
            <span className="is-outline">Things I've made</span>
            <span>Things I've made</span>
            <span className="is-outline">Things I've made</span>
          </span>
        </h2>

        <div className="work-stack">
          {featuredProjects.map((p, i) => (
            <article
              key={p.slug}
              className="work-card"
              style={{ "--bg": p.tone?.bg ?? "#171e26", "--ink": p.tone?.ink ?? "#f1f4f7" } as CSSProperties}
            >
              <div className="shell work-card-inner">
                <div className="work-card-info">
                  <p className="work-card-kind">{p.category}</p>
                  <h3 className="work-card-title">{p.title}</h3>
                  <p className="work-card-tagline">{p.tagline}</p>
                  {p.stat && (
                    <p className="work-card-stat">
                      <span className="number" data-value={p.stat.value}>
                        {p.stat.value}
                      </span>
                      <span>{p.stat.label}</span>
                    </p>
                  )}
                  <p className="work-card-meta">
                    {[p.role, ...(p.technologies ?? [])].join(" / ")}
                  </p>
                  <Link to={`/projects/${p.slug}`} className="work-card-button" aria-label={`Open ${p.title}`}>
                    Open the project <ArrowOut />
                  </Link>
                </div>
                {p.demo === "dice" ? (
                  /* no photo of the dice yet, so here it is to play with */
                  <div className="work-card-shot work-card-shot--live">
                    <DiceDemo />
                  </div>
                ) : (
                  <Link to={`/projects/${p.slug}`} className="work-card-shot" tabIndex={-1} aria-hidden="true" data-cursor="Open">
                    <span className="work-card-tilt">
                      <ProjectCover project={p} sizes="(max-width: 60rem) 92vw, 48rem" decorative />
                    </span>
                  </Link>
                )}
                <p className="work-card-count" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")} / {total}
                </p>
              </div>
            </article>
          ))}

          {/* the one still being built: last in the stack, linked to its repository */}
          <article className="work-card" style={{ "--bg": "#0d1116", "--ink": "#f1f4f7" } as CSSProperties}>
            <div className="shell work-card-inner">
              <div className="work-card-info">
                <p className="work-card-kind">
                  <span className="work-card-live" aria-hidden="true" /> {building.status} · {building.eta}
                </p>
                <h3 className="work-card-title">{building.title}</h3>
                <p className="work-card-tagline">{building.body}</p>
                <p className="work-card-meta">Building it now, in the open</p>
                <a className="work-card-button" href={building.link.href} target="_blank" rel="noreferrer">
                  {building.link.label} <ArrowOut />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
              <div className="work-card-shot work-card-shot--brain" aria-hidden="true">
                <GlassBrainNet />
              </div>
              <p className="work-card-count" aria-hidden="true">
                {total} / {total}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ---- How a project of mine goes: four beats that decode as you scroll ---- */}
      <section className="phases" data-section="How it goes" aria-labelledby="phases-heading">
        <h2 id="phases-heading" className="kicker phases-kicker">
          In a word
        </h2>
        <svg className="phase-ring" viewBox="0 0 400 400" aria-hidden="true">
          <circle cx="200" cy="200" r="190" />
          <circle className="phase-ring-dot" cx="200" cy="10" r="5" />
        </svg>
        <ol className="phase-list">
          {phases.map((line) => (
            <li key={line} className="phase-line">
              {line}
            </li>
          ))}
        </ol>
        <p className="phase-text" aria-hidden="true" />
        <p className="phase-meter" aria-hidden="true" />
      </section>

      {/* ---- GitHub: right after the name, where the work actually lives ---- */}
      <GitHubSpot />

      {/* ---- Contact ---- */}
      <section className="shell home-contact" data-section="Contact" aria-labelledby="contact-heading">
        <div className="glass invite">
          <h2 id="contact-heading" className="invite-title">
            Tell me what you're building.
          </h2>
          <p className="invite-text">A project, an internship, or a question about something here. I read everything.</p>
          <div className="button-row">
            <Link to="/contact" className="button button--solid">
              Send me a message <ArrowRight />
            </Link>
            <a href={`mailto:${site.email}`} className="button">
              {site.email}
            </a>
          </div>
        </div>
      </section>

      <ScrollProgress />
    </div>
  );
}
