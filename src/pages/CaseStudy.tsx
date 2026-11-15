import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation, useParams } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DiceDemo from "../components/DiceDemo";
import Picture from "../components/Picture";
import ProjectCover from "../components/ProjectCover";
import { ArrowLeft, ArrowOut, ArrowRight } from "../components/Icons";
import { getProject, neighbours, type ProjectImage } from "../data/projects";
import { usePageMeta } from "../hooks/usePageMeta";
import NotFound from "./NotFound";
import "../components/dice.css";
import "./case-study.css";

gsap.registerPlugin(ScrollTrigger);

const anchor = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* One template for every project. Blocks appear only when the entry has the data for them. */
export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProject(slug);
  usePageMeta(project ? project.title : "Not found", project?.tagline);

  const rootRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [enlarged, setEnlarged] = useState<ProjectImage | null>(null);
  const [active, setActive] = useState("");
  const [showPhotos, setShowPhotos] = useState(false);
  const { hash } = useLocation();

  // arriving from "See the real build": open the photos and bring them into view
  useEffect(() => {
    if (hash !== "#the-real-build") return;
    setShowPhotos(true);
    const id = window.setTimeout(() => document.getElementById("the-real-build")?.scrollIntoView({ block: "start" }), 120);
    return () => window.clearTimeout(id);
  }, [hash, slug]);

  // the cover tilts back as you scroll into the page, sections rise in, and the side index follows along
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cover = root.querySelector(".cs-cover-tilt");
      if (cover) {
        gsap.fromTo(
          cover,
          { rotateX: 14, scale: 0.94, y: 30 },
          { rotateX: 0, scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: cover, start: "top 95%", end: "top 25%", scrub: 0.4 } },
        );
      }
      gsap.utils.toArray<HTMLElement>(".cs-section, .cs-gallery li", root).forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    });
    const triggers = gsap.utils.toArray<HTMLElement>(".cs-section", root).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(el.id),
      }),
    );
    return () => {
      triggers.forEach((t) => t.kill());
      mm.revert();
    };
  }, [slug]);

  if (!project) return <NotFound />;

  const { previous, next } = neighbours(project.slug);
  const enlarge = (image: ProjectImage) => {
    setEnlarged(image);
    dialogRef.current?.showModal();
  };
  const tone = { "--bg": project.tone?.bg ?? "#171e26", "--ink": project.tone?.ink ?? "#f1f4f7" } as CSSProperties;
  const sections = [
    ...project.sections.map((s) => ({ id: anchor(s.heading), heading: s.heading })),
    ...(project.gallery?.length ? [{ id: "more-views", heading: "More views" }] : []),
    ...(project.hiddenPhotos?.length ? [{ id: "the-real-build", heading: "The real build" }] : []),
    ...(project.credits ? [{ id: "credits", heading: "Credits" }] : []),
  ];

  return (
    <article className="cs" ref={rootRef} key={project.slug}>
      {/* ---- hero, in the project's own colours ---- */}
      <header className="cs-hero" style={tone}>
        <div className="shell cs-hero-inner">
          <p className="cs-crumb">
            <Link to="/projects">Projects</Link>
            <span aria-hidden="true">/</span>
            <span>{project.category}</span>
            {project.year && (
              <>
                <span aria-hidden="true">/</span>
                <span>{project.year}</span>
              </>
            )}
          </p>
          <h1 className="cs-title">{project.title}</h1>
          <p className="cs-tagline">{project.tagline}</p>

          <div className="cs-facts">
            {project.stat && (
              <p className="cs-stat">
                <strong>{project.stat.value}</strong>
                <span>{project.stat.label}</span>
              </p>
            )}
            <dl className="cs-meta">
              <div>
                <dt>My part</dt>
                <dd>{project.role}</dd>
              </div>
              {project.team && (
                <div>
                  <dt>Team</dt>
                  <dd>{project.team}</dd>
                </div>
              )}
              {project.technologies && (
                <div>
                  <dt>Built with</dt>
                  <dd>{project.technologies.join(", ")}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="cs-links">
            {project.links.map((link, i) => (
              <a
                key={link.href}
                className={i === 0 ? "cs-button cs-button--solid" : "cs-button"}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label} <ArrowOut />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* ---- the cover, overlapping the hero ---- */}
      <div className="shell cs-cover">
        <div className="cs-cover-tilt">
          {project.demo === "dice" ? (
            <DiceDemo />
          ) : (
            project.cover && (
              <div className="frame cs-cover-frame">
                <Picture image={project.cover} sizes="(max-width: 80rem) 94vw, 78rem" eager />
              </div>
            )
          )}
        </div>
      </div>

      {/* ---- the story, with an index that follows you down the page ---- */}
      <div className="shell cs-body">
        <nav className="cs-index" aria-label="On this page">
          <p className="kicker">{project.summary.split(". ")[0]}.</p>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? "location" : undefined}>
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="cs-content">
          <p className="cs-summary">{project.summary}</p>

          {project.sections.map((section) => (
            <section key={section.heading} id={anchor(section.heading)} className="cs-section">
              <h2>{section.heading}</h2>
              {section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.points && (
                <ul className="cs-points">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {project.gallery && project.gallery.length > 0 && (
            <section id="more-views" className="cs-section">
              <h2>More views</h2>
              <ul className="cs-gallery">
                {project.gallery.map((image) => (
                  <li key={image.src}>
                    <figure>
                      <button
                        type="button"
                        className="frame cs-shot"
                        onClick={() => enlarge(image)}
                        aria-label={`Enlarge image: ${image.alt}`}
                        data-cursor="View"
                      >
                        <Picture image={image} sizes="(max-width: 48rem) 94vw, 28rem" decorative />
                      </button>
                      {image.caption && <figcaption>{image.caption}</figcaption>}
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.hiddenPhotos && project.hiddenPhotos.length > 0 && (
            <section id="the-real-build" className="cs-section">
              <h2>The real build</h2>
              <p>
                The browser version above is the idea. Here is the actual breadboard: every wire placed by hand, and
                not one line of code.
              </p>
              <button
                type="button"
                className="button cs-reveal"
                aria-expanded={showPhotos}
                aria-controls="real-build-photos"
                onClick={() => setShowPhotos((v) => !v)}
              >
                {showPhotos ? "Hide the photos" : "Show the photos"}
                <span className="cs-reveal-icon" aria-hidden="true" />
              </button>
              <div id="real-build-photos" className="cs-hidden" data-open={showPhotos || undefined} hidden={!showPhotos}>
                <ul className="cs-gallery">
                  {project.hiddenPhotos.map((image) => (
                    <li key={image.src}>
                      <figure>
                        <button
                          type="button"
                          className="frame cs-shot cs-shot--photo"
                          onClick={() => enlarge(image)}
                          aria-label={`Enlarge photo: ${image.alt}`}
                          data-cursor="View"
                        >
                          <img
                            src={`${image.src}-800.webp`}
                            srcSet={`${image.src}-800.webp 800w, ${image.src}.webp 1440w`}
                            sizes="(max-width: 48rem) 94vw, 28rem"
                            alt=""
                            loading="lazy"
                          />
                        </button>
                        {image.caption && <figcaption>{image.caption}</figcaption>}
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {project.credits && (
            <section id="credits" className="cs-section">
              <h2>Credits</h2>
              <ul className="cs-credits">
                {project.credits.map((credit) => (
                  <li key={credit}>{credit}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* ---- previous and next, as small posters in their own colours ---- */}
      <nav className="shell cs-next" aria-label="More projects">
        {[
          { p: previous, label: "Previous", icon: <ArrowLeft /> },
          { p: next, label: "Next", icon: <ArrowRight /> },
        ].map(({ p, label, icon }) => (
          <Link
            key={label}
            to={`/projects/${p.slug}`}
            className="cs-next-card"
            data-dir={label}
            style={{ "--bg": p.tone?.bg ?? "#171e26", "--ink": p.tone?.ink ?? "#f1f4f7" } as CSSProperties}
          >
            <span className="cs-next-text">
              <span className="cs-next-label">
                {label === "Previous" && icon} {label} {label === "Next" && icon}
              </span>
              <span className="cs-next-title">{p.title}</span>
            </span>
            <span className="cs-next-thumb frame" aria-hidden="true">
              <ProjectCover project={p} sizes="14rem" decorative />
            </span>
          </Link>
        ))}
      </nav>

      {/* Image viewer. A native dialog: it traps focus and closes on Escape by itself. */}
      <dialog
        ref={dialogRef}
        className="viewer"
        aria-label="Enlarged image"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        onClose={() => setEnlarged(null)}
      >
        {enlarged && (
          <figure>
            <img src={`${enlarged.src}.webp`} alt={enlarged.alt} />
            <figcaption>
              <span>{enlarged.caption ?? enlarged.alt}</span>
              <button type="button" className="button" onClick={() => dialogRef.current?.close()} autoFocus>
                Close
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </article>
  );
}
