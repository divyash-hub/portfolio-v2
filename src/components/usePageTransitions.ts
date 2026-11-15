import { useEffect } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router";

/*
 * Page transitions.
 *
 * Every click on a link to another page of this site is routed through the
 * browser's View Transitions API: the old page is captured, the new one renders,
 * and the two are animated against each other (see the ::view-transition rules
 * in transitions.css). The new page opens as a circle growing from where you
 * clicked. The nav bar is named separately, so it stays put while the page changes.
 *
 * Browsers without the API, and visitors who ask for reduced motion, simply get
 * the normal instant page change.
 */
export function usePageTransitions() {
  const navigate = useNavigate();

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const samePage = url.pathname === window.location.pathname;
      if (samePage && (url.hash || url.search === window.location.search)) return; // in-page jumps stay native
      if (!document.startViewTransition || still.matches) return; // React Router handles it as usual

      e.preventDefault();
      e.stopPropagation();
      document.documentElement.style.setProperty("--vt-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--vt-y", `${e.clientY}px`);
      document.startViewTransition(() => {
        flushSync(() => navigate(url.pathname + url.search + url.hash));
      });
    };

    // capture phase, so this runs before React Router's own link handler
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate]);
}
