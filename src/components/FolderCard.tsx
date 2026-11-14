import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router";
import "./folder-card.css";

/*
 * Glass folder — adapted from the "Glass Folder Cards" component on 21st.dev.
 *
 * Kept from the original: the three-layer construction (back panel, the files,
 * a frosted front panel hinged on its bottom edge), the lean on hover/focus,
 * and the open state where the files rise and fan out.
 *
 * Changed for this site:
 *   - Contents come from the project data and every file is a real link.
 *   - The "+" button, the "···" menu and the generated marble artwork are gone:
 *     they were demo features with nothing real behind them.
 *   - One smoked-glass tone in the site palette; movement is calmer.
 *   - Opens on tap or Enter/Space, closes on Escape or a press outside.
 */

export type FolderFile = {
  name: string;
  meta?: string;
  to: string;
  /** What the sheet shows: usually the project's cover image. */
  visual: ReactNode;
};

type Props = {
  label: string;
  files: FolderFile[];
  /** Width in px. Everything scales with it. */
  width?: number;
};

// Geometry in the folder's own units; the stage is drawn at 340 × 272 and scaled.
const W = 340;
const H = 272;
const HEADROOM = 132; // space above the folder for the files to rise into
const FRONT_TOP = 74;
const FRONT_H = H - FRONT_TOP;

const BACK_PATH =
  "M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z";
const FRONT_PATH = `M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 ${FRONT_H - 22}A22 22 0 0 1 318 ${FRONT_H}L22 ${FRONT_H}A22 22 0 0 1 0 ${FRONT_H - 22}Z`;

/** Where a file sits in the fan: -1 … 1 across the stack, 0 for a single file. */
const fanSlot = (index: number, count: number) => (count <= 1 ? 0 : (index / (count - 1)) * 2 - 1);

export default function FolderCard({ label, files, width = 340 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLUListElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const k = width / W;
  const count = files.length;
  const countLabel = `${count} ${count === 1 ? "project" : "projects"}`;

  // Light follows the cursor across the glass. Written straight to CSS, no re-renders.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let frame = 0;
    let px = 0;
    let py = 0;
    const write = () => {
      frame = 0;
      el.style.setProperty("--gf-px", px.toFixed(3));
      el.style.setProperty("--gf-py", py.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(write);
    };
    const leave = () => {
      px = 0;
      py = 0;
      if (!frame) frame = requestAnimationFrame(write);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  // While the folder is closed its files can't be tabbed to or clicked.
  useEffect(() => {
    filesRef.current?.toggleAttribute("inert", !open);
  }, [open]);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) hitRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  return (
    <div
      ref={rootRef}
      className="gf-root"
      data-open={open || undefined}
      style={{ width, height: (H + HEADROOM) * k }}
    >
      <div className="gf-stage" style={{ transform: `translateY(${HEADROOM * k}px) scale(${k})` }}>
        <div className="gf-tilt">
          <div className="gf-shadow" aria-hidden="true" />

          <div className="gf-back" style={{ clipPath: `path('${BACK_PATH}')` }} aria-hidden="true" />
          <svg className="gf-rim gf-back-rim" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <path d={BACK_PATH} />
          </svg>

          {/* the frosted front panel, hinged on its bottom edge */}
          <div className="gf-front" style={{ clipPath: `path('${FRONT_PATH}')` }}>
            <div className="gf-tint" aria-hidden="true" />
            <div className="gf-spec" aria-hidden="true" />
            <svg className="gf-rim gf-front-rim" viewBox={`0 0 ${W} ${FRONT_H}`} aria-hidden="true">
              <path d={FRONT_PATH} />
            </svg>
            <button
              ref={hitRef}
              type="button"
              className="gf-hit"
              aria-expanded={open}
              aria-label={`${open ? "Close" : "Open"} the ${label} folder, ${countLabel}`}
              onClick={() => setOpen((o) => !o)}
            />
            <div className="gf-label">
              <span className="gf-title">{label}</span>
              <span className="gf-meta">{open ? "Choose a project" : countLabel}</span>
            </div>
          </div>

          {/* the contents: after the glass in tab order, beneath it on screen */}
          <ul ref={filesRef} className="gf-files" aria-label={`${label} projects`}>
            {files.map((file, i) => (
              <li key={file.to} className="gf-sheet-slot">
                <Link
                  to={file.to}
                  className="gf-sheet"
                  style={
                    {
                      "--gf-slot": fanSlot(i, count),
                      "--gf-depth": count - 1 - i,
                      zIndex: i + 1,
                    } as CSSProperties
                  }
                >
                  <span className="gf-sheet-visual" aria-hidden="true">
                    {file.visual}
                  </span>
                  <span className="gf-sheet-head">
                    <span className="gf-sheet-name">{file.name}</span>
                    {file.meta && <span className="gf-sheet-meta">{file.meta}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
