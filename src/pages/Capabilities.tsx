import { Link } from "react-router";
import Skills from "../components/Skills";
import { ArrowRight } from "../components/Icons";
import { about, capabilities } from "../data/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./pages.css";

/*
 * The Skills page (also served at the old /capabilities address).
 * It is the same filterable list as the homepage, plus what I'm exploring next.
 */
export default function SkillsPage() {
  usePageMeta("Skills", "Every skill Divyash Agrawal has used in a real project, and what he is exploring next.");
  const exploring = capabilities.filter((c) => c.level === "Currently exploring").flatMap((c) => c.items);

  return (
    <>
      <header className="shell page-head">
        <h1>Skills</h1>
        <p className="lede">
          Only things a finished project actually used. Pick a project to see what it took to build it.
        </p>
      </header>

      <Skills />

      <section className="shell skills-next" aria-labelledby="next-heading">
        <div className="glass skills-next-card">
          <div>
            <p className="kicker">Exploring next</p>
            <h2 id="next-heading">{exploring.join(" and ")}.</h2>
          </div>
          <p>{about.exploring.body[0]}</p>
          <Link to="/about" className="button">
            More about me <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
