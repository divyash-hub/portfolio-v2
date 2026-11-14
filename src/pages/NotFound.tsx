import { Link } from "react-router";
import { ArrowRight } from "../components/Icons";
import { publicProjects } from "../data/projects";
import { usePageMeta } from "../hooks/usePageMeta";
import "./pages.css";

export default function NotFound() {
  usePageMeta("Not found");

  return (
    <div className="shell page-head not-found">
      <p className="label">404</p>
      <h1>Nothing is filed at this address.</h1>
      <p className="lede">The link may be old, or the page may have moved. Here is what does exist:</p>
      <ul className="not-found-list">
        {publicProjects.map((p) => (
          <li key={p.slug}>
            <Link to={`/projects/${p.slug}`} className="link">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="button-row">
        <Link to="/" className="button button--solid">
          Go to the homepage <ArrowRight />
        </Link>
        <Link to="/projects" className="button">
          All projects
        </Link>
      </div>
    </div>
  );
}
