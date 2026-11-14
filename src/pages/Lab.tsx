import { lab } from "../data/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./pages.css";

/* Only routed once `lab` in src/data/site.ts has entries. */
export default function Lab() {
  usePageMeta("Lab", "Experiments, prototypes and work in progress.");

  return (
    <>
      <header className="shell page-head">
        <h1>Lab</h1>
        <p className="lede">Experiments and prototypes. Unfinished on purpose, and labelled that way.</p>
      </header>
      <ul className="shell entries">
        {lab.map((entry) => (
          <li key={entry.title} className="entry">
            <p className="label">{entry.status}</p>
            <div>
              <h2>{entry.title}</h2>
              <p className="entry-detail">{entry.description}</p>
              {entry.link && (
                <a className="link" href={entry.link} target="_blank" rel="noreferrer">
                  Open
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
