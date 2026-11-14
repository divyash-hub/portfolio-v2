import { useEffect, useRef } from "react";
import { building, site } from "../data/site";
import { ArrowOut } from "./Icons";
import "./github-spot.css";

const MARK =
  "M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z";

/*
 * The GitHub sign-off on the homepage.
 * The mark is pulled toward the pointer like a magnet, tilts to face it, and the
 * rings around it spin faster the closer the pointer gets. Mouse and trackpad only;
 * on touch screens and for reduced motion it simply sits still.
 */
export default function GitHubSpot() {
  const stageRef = useRef<HTMLAnchorElement>(null);
  const github = site.links.find((l) => l.label === "GitHub");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0;
    let ty = 0;
    let near = 0;
    let x = 0;
    let y = 0;
    let n = 0;
    let spin = 0;
    let raf = 0;
    let last = performance.now();

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = stage.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      const reach = r.width * 1.1;
      const pull = Math.max(0, 1 - d / reach);
      tx = (dx / Math.max(d, 1)) * Math.min(d, 60) * pull;
      ty = (dy / Math.max(d, 1)) * Math.min(d, 60) * pull;
      near = pull;
    };
    const leave = () => {
      tx = ty = near = 0;
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      x += (tx - x) * 0.1;
      y += (ty - y) * 0.1;
      n += (near - n) * 0.08;
      spin += dt * (8 + n * 70);
      stage.style.setProperty("--mx", `${x.toFixed(1)}px`);
      stage.style.setProperty("--my", `${y.toFixed(1)}px`);
      stage.style.setProperty("--rx", `${(-y * 0.35).toFixed(2)}deg`);
      stage.style.setProperty("--ry", `${(x * 0.35).toFixed(2)}deg`);
      stage.style.setProperty("--near", n.toFixed(3));
      stage.style.setProperty("--spin", `${spin.toFixed(1)}deg`);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  if (!github) return null;

  return (
    <section className="shell gh" data-section="GitHub" aria-labelledby="gh-heading">
      <a
        className="gh-stage"
        ref={stageRef}
        href={github.href}
        target="_blank"
        rel="noreferrer"
        data-cursor="Open"
        aria-label={`My GitHub profile, ${github.handle} (opens in a new tab)`}
      >
        <span className="gh-ring gh-ring--outer" aria-hidden="true" />
        <span className="gh-ring gh-ring--inner" aria-hidden="true" />
        <span className="gh-glow" aria-hidden="true" />
        <svg className="gh-mark" viewBox="0 0 98 96" aria-hidden="true">
          <path d={MARK} fillRule="evenodd" clipRule="evenodd" />
        </svg>
      </a>

      <div className="gh-text">
        <p className="kicker">Where the code lives</p>
        <h2 id="gh-heading" className="gh-handle">
          <span>github.com/</span>
          {github.handle}
        </h2>
        <p className="gh-lede">
          Every project here has its code on GitHub, and {building.title} is being built there in the open right now.
          Come and see what I'm working on.
        </p>
        <a className="button button--solid" href={github.href} target="_blank" rel="noreferrer">
          Open my GitHub <ArrowOut />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
