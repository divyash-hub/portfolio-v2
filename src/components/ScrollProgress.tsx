import { useEffect, useRef } from "react";
import "./scroll-progress.css";

/**
 * The small readout in the corner: which part of the page you're in and how far down.
 * Sections announce themselves with a `data-section="Name"` attribute.
 *
 * It writes straight to its own four elements, and only when a value changes, so
 * scrolling never re-renders anything in React.
 */
export default function ScrollProgress() {
  const indexRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let sections: HTMLElement[] = [];
    let last = { index: -1, name: "", percent: -1 };

    const collect = () => {
      sections = [...document.querySelectorAll<HTMLElement>("[data-section]")];
    };
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      let index = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= line) index = i;
        else break; // sections are in page order
      }
      const room = document.documentElement.scrollHeight - window.innerHeight;
      const percent = room > 0 ? Math.round((window.scrollY / room) * 100) : 0;
      const name = sections[index]?.dataset.section ?? "";
      if (index !== last.index && indexRef.current) indexRef.current.textContent = String(index + 1).padStart(2, "0");
      if (name !== last.name && nameRef.current) nameRef.current.textContent = name;
      if (percent !== last.percent) {
        if (percentRef.current) percentRef.current.textContent = `${percent}%`;
        if (barRef.current) barRef.current.style.transform = `scaleX(${percent / 100})`;
      }
      last = { index, name, percent };
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const onResize = () => {
      collect();
      onScroll();
    };

    collect();
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <aside className="progress" aria-hidden="true">
      <span ref={indexRef}>01</span>
      <span ref={nameRef} />
      <span className="progress-bar">
        <span ref={barRef} style={{ transform: "scaleX(0)" }} />
      </span>
      <span ref={percentRef}>0%</span>
    </aside>
  );
}
