import { building } from "../data/site";
import { ArrowOut } from "./Icons";
import "./glass-brain.css";

/*
 * The "Currently building" card for Glass Brain.
 * The drawing is a small network: words go in on the left, signals pass through two
 * hidden layers, and one word lights up on the right as the prediction. It is a
 * picture of the idea, not output from the project.
 */
const layers = [
  [30, 70, 110, 150],
  [20, 56, 92, 128, 164],
  [20, 56, 92, 128, 164],
  [60, 110],
];
const xs = [24, 104, 184, 264];

/** The network drawing on its own, for the homepage panel. */
export function GlassBrainNet() {
  const links: { x1: number; y1: number; x2: number; y2: number; k: number }[] = [];
  let k = 0;
  for (let l = 0; l < layers.length - 1; l++) {
    for (const y1 of layers[l]) {
      for (const y2 of layers[l + 1]) links.push({ x1: xs[l], y1, x2: xs[l + 1], y2, k: k++ });
    }
  }

  return (
    <svg className="gb-net" viewBox="0 0 290 184" aria-hidden="true">
      {links.map((l) => (
        <line
          key={l.k}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          style={{ animationDelay: `${(l.x1 / 80) * 0.45 + (l.k % 7) * 0.13}s` }}
        />
      ))}
      {layers.map((ys, l) =>
        ys.map((y, i) => (
          <circle
            key={`${l}-${i}`}
            cx={xs[l]}
            cy={y}
            r={l === layers.length - 1 ? 7 : 5}
            data-out={(l === layers.length - 1 && i === 0) || undefined}
            style={{ animationDelay: `${l * 0.45 + i * 0.08}s` }}
          />
        )),
      )}
    </svg>
  );
}

export default function GlassBrain({ className = "" }: { className?: string }) {
  return (
    <article className={`glass cell glass-brain ${className}`}>
      <p className="cell-kind">
        <span className="gb-live" aria-hidden="true" /> Currently building · {building.eta}
      </p>
      <div className="gb-body">
        <div className="gb-text">
          <h3 className="gb-title">{building.title}</h3>
          <p className="cell-lead">{building.body}</p>
          <a className="button" href={building.link.href} target="_blank" rel="noreferrer" data-cursor="Open">
            {building.link.label} <ArrowOut />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <GlassBrainNet />
      </div>
    </article>
  );
}
