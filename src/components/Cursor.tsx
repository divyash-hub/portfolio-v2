import { useEffect, useRef } from "react";
import "./cursor.css";

/*
 * The custom pointer: a small dot that tracks exactly, and a ring that trails it.
 * The ring grows over anything clickable, and shows a word ("Open", "Hold") over
 * elements that carry a `data-cursor="…"` attribute.
 *
 * Only on devices with a real mouse or trackpad. Touch screens never see it,
 * and text fields keep their normal text caret.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const html = document.documentElement;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let frame = 0;

    const place = () => {
      frame = 0;
      rx += (x - rx) * (still ? 1 : 0.2);
      ry += (y - ry) * (still ? 1 : 0.2);
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      if (Math.abs(x - rx) > 0.2 || Math.abs(y - ry) > 0.2) frame = requestAnimationFrame(place);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      html.classList.add("has-cursor");
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!frame) frame = requestAnimationFrame(place);

      const target = e.target instanceof Element ? e.target : null;
      const field = target?.closest("input, textarea, select");
      const worded = target?.closest<HTMLElement>("[data-cursor]");
      const clickable = target?.closest("a, button, label, [role='button']");
      const word = worded?.dataset.cursor ?? "";
      if (label.textContent !== word) label.textContent = word;
      ring.dataset.state = field ? "text" : word ? "word" : clickable ? "link" : "";
      dot.dataset.state = ring.dataset.state;
    };
    const down = () => ring.setAttribute("data-down", "");
    const up = () => ring.removeAttribute("data-down");
    const leave = () => html.classList.remove("has-cursor");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-ring" ref={ringRef}>
        <span ref={labelRef} />
      </div>
      <div className="cursor-dot" ref={dotRef} />
    </div>
  );
}
