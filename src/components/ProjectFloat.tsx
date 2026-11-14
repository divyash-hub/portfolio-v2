import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/projects";
import DiceLeds from "./DiceLeds";
import Picture from "./Picture";
import ProjectCover from "./ProjectCover";
import "./project-float.css";

/*
 * The card that follows the pointer over the Projects list.
 * It flips through the project's own screenshots (cover, then gallery) while you
 * stay on the row. The dice has no
 * photographs yet, so its card counts through its six faces on the four LEDs instead.
 * Pictures only: the details are already in the row.
 *
 * Mouse and trackpad only; touch screens keep the thumbnails in the rows.
 */
export default function ProjectFloat({ project }: { project: Project | null }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);

  // follow the pointer with a little lag, and lean in the direction of travel
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;
    const loop = () => {
      const dx = x - cx;
      cx += dx * 0.16;
      cy += (y - cy) * 0.16;
      const lean = Math.max(-10, Math.min(10, dx * 0.08));
      card.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) rotate(${lean.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  // flip through the pictures while a row is hovered
  const shots = project ? [project.cover, ...(project.gallery ?? [])].filter(Boolean) : [];
  const steps = project?.demo === "dice" ? 6 : Math.max(1, shots.length);
  useEffect(() => {
    setFrame(0);
    if (!project || steps < 2) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % steps), project.demo === "dice" ? 420 : 1100);
    return () => window.clearInterval(id);
  }, [project, steps]);

  return (
    <div className="pfloat" ref={cardRef} data-on={project ? "" : undefined} aria-hidden="true">
      {project && (
        <div className="pfloat-card" style={{ background: project.tone?.bg }} key={project.slug}>
          <div className="pfloat-shot">
            {project.demo === "dice" ? (
              <span className="leds-cover">
                <DiceLeds value={frame + 1} />
              </span>
            ) : (
              shots.map((img, i) => (
                <div key={img!.src} className="pfloat-img" data-on={i === frame || undefined}>
                  {i === 0 ? (
                    <ProjectCover project={project} sizes="22rem" decorative />
                  ) : (
                    <Picture image={img!} sizes="22rem" decorative />
                  )}
                </div>
              ))
            )}
            {steps > 1 && (
              <span className="pfloat-dots">
                {Array.from({ length: Math.min(steps, 6) }, (_, i) => (
                  <span key={i} data-on={i === frame % 6 || undefined} />
                ))}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
