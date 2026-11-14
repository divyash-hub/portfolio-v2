import { useState } from "react";
import { publicProjects } from "../data/projects";
import { skills } from "../data/site";
import "./skills.css";

/**
 * Every skill a project here actually used, grouped by kind.
 * Pick a project and the skills it used stay lit while the rest dim.
 */
export default function Skills() {
  const [pick, setPick] = useState<string | null>(null);
  const total = skills.reduce((sum, group) => sum + group.items.length, 0);
  const lit = pick ? skills.flatMap((g) => g.items).filter((s) => s.in.includes(pick)).length : total;

  return (
    <section className="shell skills" data-section="Skills" aria-labelledby="skills-heading">
      <header className="skills-head">
        <p className="kicker">Skills</p>
        <h2 id="skills-heading" className="skills-title">
          Everything my projects made me learn.
        </h2>
      </header>

      <div className="skills-filter" role="group" aria-label="Show the skills used in one project">
        <button type="button" aria-pressed={pick === null} onClick={() => setPick(null)}>
          All
        </button>
        {publicProjects.map((p) => (
          <button key={p.slug} type="button" aria-pressed={pick === p.slug} onClick={() => setPick(p.slug)}>
            {p.title}
          </button>
        ))}
        <p className="skills-count" role="status">
          {lit} of {total} skills
        </p>
      </div>

      <div className="skills-grid">
        {skills.map((group) => (
          <article key={group.title} className="glass cell skills-group">
            <h3 className="cell-kind">{group.title}</h3>
            <ul className="chips">
              {group.items.map((skill) => (
                <li key={skill.name} data-off={(pick !== null && !skill.in.includes(pick)) || undefined}>
                  {skill.name}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
