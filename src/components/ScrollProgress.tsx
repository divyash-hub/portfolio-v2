import { useEffect, useState } from "react";
import "./scroll-progress.css";

/**
 * The small readout in the corner: which part of the page you're in and how far down.
 * Sections announce themselves with a `data-section="Name"` attribute.
 */
export default function ScrollProgress() {
  const [state, setState] = useState({ index: 1, name: "", percent: 0 });

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const sections = [...document.querySelectorAll<HTMLElement>("[data-section]")];
      const line = window.innerHeight * 0.5;
      let index = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= line) index = i;
      });
      const room = document.documentElement.scrollHeight - window.innerHeight;
      setState({
        index: index + 1,
        name: sections[index]?.dataset.section ?? "",
        percent: room > 0 ? Math.round((window.scrollY / room) * 100) : 0,
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <aside className="progress" aria-hidden="true">
      <span>{String(state.index).padStart(2, "0")}</span>
      <span>{state.name}</span>
      <span className="progress-bar">
        <span style={{ scale: `${state.percent / 100} 1` }} />
      </span>
      <span>{state.percent}%</span>
    </aside>
  );
}
