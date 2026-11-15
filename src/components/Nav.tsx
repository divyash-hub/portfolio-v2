import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { navItems, site } from "../data/site";
import { displacementMap, luminance, supportsLiquidGlass } from "./liquidGlass";
import "./nav.css";

/*
 * The floating glass pill.
 *
 * Desktop: the links sit in the pill and a soft "drop" marks the current page.
 * When you move to another page the drop's leading edge travels first and the
 * trailing edge follows, so it stretches toward the new link and settles.
 * (This is the idea from the supplied 21st.dev liquid navbar, without its WebGL shader.)
 *
 * The pill itself is liquid glass (see liquidGlass.ts): the page behind it bends at
 * the rim, a highlight follows the pointer across it, and it switches to dark text
 * whenever it floats over a light part of the page.
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

  const navRef = useRef<HTMLElement>(null);
  const filterId = useId().replace(/:/g, "");
  const [glass, setGlass] = useState<{ map: string; w: number; h: number } | null>(null);
  const [onLight, setOnLight] = useState(false);

  // Liquid glass: redraw the refraction map whenever the pill changes size.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !supportsLiquidGlass()) return;
    let last = "";
    const draw = () => {
      const w = Math.round(nav.offsetWidth);
      const h = Math.round(nav.offsetHeight);
      const key = `${w}x${h}`;
      if (!w || !h || key === last) return;
      last = key;
      setGlass({ map: displacementMap(w, h), w, h });
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  // A highlight that follows the pointer across the glass.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const move = (e: PointerEvent) => {
      const r = nav.getBoundingClientRect();
      nav.style.setProperty("--gx", `${e.clientX - r.left}px`);
      nav.style.setProperty("--gy", `${e.clientY - r.top}px`);
    };
    nav.addEventListener("pointermove", move);
    return () => nav.removeEventListener("pointermove", move);
  }, []);

  // Read the colour of whatever the pill is floating over, and flip to dark text on light backgrounds.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const r = nav.getBoundingClientRect();
      const below = document
        .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        .find((el) => !headerRef.current?.contains(el));
      let el: Element | null = below ?? null;
      let lum: number | null = null;
      while (el && lum === null) {
        lum = luminance(getComputedStyle(el).backgroundColor);
        el = el.parentElement;
      }
      setOnLight((lum ?? 0) > 0.3);
    };
    let lastCheck = 0;
    let settle = 0;
    const queue = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(check, 120); // once more after scrolling stops
      const now = performance.now();
      if (frame || now - lastCheck < 100) return;
      lastCheck = now;
      frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const late = window.setTimeout(check, 400);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(late);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [pathname]);

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
      {glass && (
        <svg className="nav-filter" width="0" height="0" aria-hidden="true">
          <filter
            id={filterId}
            x="0"
            y="0"
            width={glass.w}
            height={glass.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={glass.map} x="0" y="0" width={glass.w} height={glass.h} result="map" />
            {/* each colour bends by a slightly different amount: a faint prism fringe at the rim */}
            <feDisplacementMap in="SourceGraphic" in2="map" scale="44" xChannelSelector="R" yChannelSelector="G" result="dR" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="50" xChannelSelector="R" yChannelSelector="G" result="dG" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="56" xChannelSelector="R" yChannelSelector="G" result="dB" />
            <feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feColorMatrix in="dG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" />
          </filter>
        </svg>
      )}
      <nav
        className="nav"
        aria-label="Main"
        ref={navRef}
        data-liquid={glass ? "" : undefined}
        data-on-light={onLight || undefined}
        style={glass ? ({ "--liquid": `url(#${filterId})` } as React.CSSProperties) : undefined}
      >
        <span className="nav-sheen" aria-hidden="true" />
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
