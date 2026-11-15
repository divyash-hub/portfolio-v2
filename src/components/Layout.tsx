import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Cursor from "./Cursor";
import EasterEgg from "./EasterEgg";
import LocalTime from "./LocalTime";
import Nav from "./Nav";
import { usePageTransitions } from "./usePageTransitions";
import "../styles/transitions.css";
import { ArrowOut } from "./Icons";
import { publicProjects } from "../data/projects";
import { footerPages, site } from "../data/site";
import "./layout.css";

export default function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);
  const lenisRef = useRef<Lenis | null>(null);
  usePageTransitions();

  // Smooth, weighted scrolling, which the homepage's scroll story is tuned for.
  // Skipped for people who ask for reduced motion; the page then scrolls natively.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ anchors: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // A soft light follows the pointer. It moves one element directly, at most once a frame,
  // so the rest of the page never has to be restyled.
  const lightRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    let x = 0;
    let y = 0;
    let frame = 0;
    const paint = () => {
      frame = 0;
      light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  // On navigation: start at the top and hand keyboard focus to the new page.
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  const toTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0);
    else window.scrollTo(0, 0);
  };

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <div className="pointer-light" ref={lightRef} aria-hidden="true" />
      <Cursor />
      <EasterEgg />
      <Nav />
      <main id="content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="shell">
          <div className="footer-cols">
            <div className="footer-brand">
              <Link to="/" className="footer-name">
                {site.name}
              </Link>
              <p>{site.tagline}</p>
              <p className="footer-where">
                <span className="footer-pulse" aria-hidden="true" />
                {site.location}, <LocalTime />
              </p>
            </div>

            <nav aria-label="Pages">
              <h2 className="footer-heading">Pages</h2>
              <ul>
                {footerPages.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Projects">
              <h2 className="footer-heading">Projects</h2>
              <ul>
                {publicProjects.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer-reach">
              <h2 className="footer-heading">Reach me</h2>
              <ul>
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                {site.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer">
                      {l.label} <ArrowOut />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-base">
            <p>
              © {new Date().getFullYear()} {site.owner}
            </p>
            <p>
              {site.course}, {site.university}
            </p>
            <button type="button" className="footer-top" onClick={toTop}>
              Back to top
            </button>
          </div>
        </div>

        <p className="footer-giant" aria-hidden="true">
          {site.firstName}
        </p>
      </footer>
    </>
  );
}
