import { Link } from "react-router";
import { ArrowRight } from "../components/Icons";
import { publicProjects } from "../data/projects";
import { usePageMeta } from "../hooks/usePageMeta";
import "./pages.css";
import "./not-found.css";

/* "Lost in orbit": the 0 of 404 is a small planet with a moon going round it. */
export default function NotFound() {
  usePageMeta("Lost in orbit");

  return (
    <div className="shell lost">
      <div className="lost-code" aria-hidden="true">
        <span>4</span>
        <Link to="/" className="lost-planet" tabIndex={-1} data-cursor="Home">
          <span className="lost-ring" />
          <span className="lost-orbit">
            <span className="lost-moon" />
          </span>
        </Link>
        <span>4</span>
      </div>

      <div className="lost-text">
        <p className="kicker">Error 404</p>
        <h1>This page drifted out of orbit.</h1>
        <p className="lede">
          The link may be old, or the page may have moved. Click the planet to fly home, or pick a project to get back on
          course.
        </p>
        <ul className="lost-list">
          {publicProjects.map((p) => (
            <li key={p.slug}>
              <Link to={`/projects/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
        <div className="button-row">
          <Link to="/" className="button button--solid">
            Fly me home <ArrowRight />
          </Link>
          <Link to="/projects" className="button">
            All projects
          </Link>
        </div>
      </div>
    </div>
  );
}
