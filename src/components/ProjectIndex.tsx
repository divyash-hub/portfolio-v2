import { useState, type CSSProperties } from "react";
import { Link } from "react-router";
import type { Project } from "../data/projects";
import ProjectCover from "./ProjectCover";
import ProjectFloat from "./ProjectFloat";
import { ArrowRight } from "./Icons";
import "./project-index.css";

/*
 * The index of work: one row per project.
 * With `preview`, a large frame beside the list shows whichever row is hovered
 * or focused (desktop). On small screens every row carries its own image instead,
 * so nothing depends on hover.
 */
export default function ProjectIndex({ projects, preview = false }: { projects: Project[]; preview?: boolean }) {
  const [current, setCurrent] = useState(0);
  // the plain list (Projects page) shows a card that follows the pointer instead of a fixed preview
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="index" data-preview={preview || undefined}>
      <ol className="index-list">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Link
              to={`/projects/${p.slug}`}
              className="index-row"
              data-current={(preview && i === current) || undefined}
              style={{ "--tone": p.tone?.bg ?? "#8fd3ff" } as CSSProperties}
              onMouseEnter={() => {
                setCurrent(i);
                if (!preview) setHovered(i);
              }}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setCurrent(i)}
            >
              <span className="index-thumb frame">
                <ProjectCover project={p} sizes="(max-width: 60rem) 92vw, 8rem" decorative />
              </span>
              <span className="index-text">
                <span className="index-title">{p.title}</span>
                <span className="index-tagline">{p.tagline}</span>
              </span>
              <span className="index-kind label">{p.category}</span>
              <span className="index-arrow">
                <ArrowRight />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {!preview && <ProjectFloat project={hovered === null ? null : projects[hovered]} />}

      {preview && (
        <div className="index-preview" aria-hidden="true">
          <div className="index-preview-frame frame">
            {projects.map((p, i) => (
              <div key={p.slug} className="index-preview-item" data-current={i === current || undefined}>
                <ProjectCover project={p} sizes="(max-width: 60rem) 1px, 46rem" eager={i === 0} decorative />
              </div>
            ))}
          </div>
          {/* The facts for whichever project is showing. The same details are on its page. */}
          <dl className="index-preview-facts">
            <div>
              <dt className="label">My part</dt>
              <dd>{projects[current].role}</dd>
            </div>
            {projects[current].technologies && (
              <div>
                <dt className="label">Built with</dt>
                <dd>{projects[current].technologies.join(", ")}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
