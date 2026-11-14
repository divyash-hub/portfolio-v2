import { useEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "../components/Icons";
import { experience } from "../data/site";
import { usePageMeta } from "../hooks/usePageMeta";
import "./pages.css";
import "./experience.css";

gsap.registerPlugin(ScrollTrigger);

/* Only routed once `experience` in src/data/site.ts has entries. */
export default function Experience() {
  usePageMeta("Experience", "Internships, education and achievements of Divyash Agrawal.");
  const listRef = useRef<HTMLOListElement>(null);

  // the line down the left draws itself as you scroll, and each entry rises in as it arrives
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const mm = gsap.matchMedia(list);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        list,
        { "--draw": "0%" },
        { "--draw": "100%", ease: "none", scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 60%", scrub: 0.4 } },
      );
      gsap.utils.toArray<HTMLElement>(".xp", list).forEach((item) => {
        gsap.from(item, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 85%", once: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <>
      <header className="shell page-head">
        <h1>Experience</h1>
        <p className="lede">Where I've worked, where I'm studying, and what I've won along the way.</p>
      </header>

      <ol className="shell xp-list" ref={listRef}>
        {experience.map((entry) => (
          <li key={entry.title + entry.organisation} className="xp" data-kind={entry.kind}>
            <span className="xp-dot" aria-hidden="true" />
            <div className="glass xp-card">
              <p className="xp-meta">
                <span className="xp-kind">{entry.kind}</span>
                {entry.dates && <span>{entry.dates}</span>}
              </p>
              <h2 className="xp-title">{entry.title}</h2>
              <p className="xp-org">{entry.organisation}</p>
              {entry.detail && <p className="xp-detail">{entry.detail}</p>}
              {entry.link && (
                <Link to={entry.link} className="button">
                  See the website <ArrowRight />
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
