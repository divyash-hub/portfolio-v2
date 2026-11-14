import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { navItems, site } from "../data/site";
import "./nav.css";

/*
 * The floating glass pill.
 *
 * Desktop: the links sit in the pill and a soft "drop" marks the current page.
 * When you move to another page the drop's leading edge travels first and the
 * trailing edge follows, so it stretches toward the new link and settles.
 * (This is the idea from the supplied 21st.dev liquid navbar, without its WebGL shader.)
 *
 * Mobile: the pill holds the wordmark and a Menu button that opens a sheet of links.
 */

const isCurrent = (to: string, pathname: string) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

export default function Nav() {
  const { pathname } = useLocation();
  const active = navItems.findIndex((item) => isCurrent(item.to, pathname));

  const listRef = useRef<HTMLUListElement>(null);
  const [drop, setDrop] = useState<{ left: number; right: number } | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const lastActive = useRef(active);

  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const sheetId = useId();

  // Place the drop under the current link, and keep it there when sizes change.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const el = list.querySelectorAll<HTMLElement>("li")[active];
      if (!el || list.offsetWidth === 0) return setDrop(null);
      setDrop({ left: el.offsetLeft, right: list.offsetWidth - el.offsetLeft - el.offsetWidth });
    };
    if (active !== lastActive.current) {
      setDirection(active > lastActive.current ? "right" : "left");
      lastActive.current = active;
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active]);

  // The mobile sheet closes on navigation, on Escape, and on a press outside it.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <header className="nav-wrap" ref={headerRef}>
      <nav className="nav" aria-label="Main">
        <Link to="/" className="nav-mark" aria-label={`${site.name}, home`}>
          <svg width="22" height="18" viewBox="0 0 22 18" aria-hidden="true">
            <ellipse cx="11" cy="9" rx="9.5" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.1" transform="rotate(-18 11 9)" />
            <circle cx="11" cy="9" r="2.2" fill="var(--white)" />
            <circle cx="19" cy="5.2" r="1.7" fill="var(--signal)" />
          </svg>
          <span>{site.firstName}</span>
        </Link>

        <ul className="nav-links" ref={listRef} data-direction={direction}>
          {navItems.map((item, i) => (
            <li key={item.to}>
              <Link to={item.to} className="nav-link" aria-current={i === active ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
          {drop && (
            <li
              className="nav-drop"
              role="presentation"
              aria-hidden="true"
              style={{ left: drop.left, right: drop.right }}
            />
          )}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav-toggle-bars" aria-hidden="true" />
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <div className="nav-sheet" id={sheetId} hidden={!open}>
        <ul>
          {navItems.map((item, i) => (
            <li key={item.to}>
              <Link to={item.to} className="nav-sheet-link" aria-current={i === active ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
