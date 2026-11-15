import { useEffect, useRef, useState } from "react";
import "./easter-egg.css";

/*
 * The hidden one.
 *
 * Type the Konami code (up, up, down, down, left, right, left, right, B, A), or one of
 * the secret words (warp, zesty, gudda, divyash, fair, kanye) anywhere on the site. The stars stretch into hyperspace for a couple
 * of seconds, the project orbit on the homepage spins up, and a small note says
 * you found it. A hint is left in the browser console for the curious.
 */
const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
/** Typing any of these anywhere (outside a form) also fires it. */
const WORDS = ["warp", "zesty", "gudda", "divyash", "fair", "kanye"];
const LONGEST = Math.max(...WORDS.map((w) => w.length));

export default function EasterEgg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [note, setNote] = useState(false);

  useEffect(() => {
    // a hint for anyone who opens the developer tools
    console.log(
      "%cHello, curious one.%c\nThere is a warp drive hidden on this site. Try typing the word \"warp\", or the Konami code.",
      "font: 700 14px sans-serif; color: #8fd3ff",
      "font: 12px sans-serif",
    );

    let keys: string[] = [];
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return; // never while typing in a form
      const k = e.key.toLowerCase();
      keys = [...keys, k].slice(-KONAMI.length);
      typed = (typed + (k.length === 1 ? k : " ")).slice(-LONGEST);
      if (keys.join() === KONAMI.join() || WORDS.some((w) => typed.endsWith(w))) {
        keys = [];
        typed = "";
        window.dispatchEvent(new CustomEvent("warp"));
      }
    };
    const onWarp = () => {
      setActive(true);
      setNote(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("warp", onWarp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("warp", onWarp);
    };
  }, []);

  // hyperspace: stars streak out from the middle of the screen
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || !ctx || still) {
      const id = window.setTimeout(() => setActive(false), 300);
      return () => window.clearTimeout(id);
    }
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const stars = Array.from({ length: 420 }, () => ({
      a: Math.random() * Math.PI * 2,
      d: Math.random() * 40,
      v: 0.6 + Math.random() * 2.4,
    }));
    const start = performance.now();
    const duration = 2600;
    let raf = 0;
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // speed up, hold, then slow back down
      const speed = t < 0.3 ? t / 0.3 : t > 0.75 ? (1 - t) / 0.25 : 1;
      ctx.fillStyle = `rgba(5, 7, 10, ${0.35})`;
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const s of stars) {
        const from = s.d;
        s.d += s.v * (2 + speed * 38);
        if (s.d > Math.hypot(w, h) / 2) s.d = Math.random() * 30;
        const cx = w / 2;
        const cy = h / 2;
        ctx.strokeStyle = `rgba(${Math.random() < 0.2 ? "143, 211, 255" : "241, 244, 247"}, ${0.4 + speed * 0.6})`;
        ctx.lineWidth = 1 + (s.d / Math.hypot(w, h)) * 3;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(s.a) * from, cy + Math.sin(s.a) * from);
        ctx.lineTo(cx + Math.cos(s.a) * s.d, cy + Math.sin(s.a) * s.d);
        ctx.stroke();
      }
      if (t < 1) raf = requestAnimationFrame(frame);
      else setActive(false);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  useEffect(() => {
    if (!note) return;
    const id = window.setTimeout(() => setNote(false), 5200);
    return () => window.clearTimeout(id);
  }, [note]);

  return (
    <>
      {active && <canvas ref={canvasRef} className="warp" aria-hidden="true" />}
      <p className="warp-note" data-on={note || undefined} role="status">
        {note && (
          <>
            <strong>Warp drive engaged.</strong> You found the hidden one. Nice.
          </>
        )}
      </p>
    </>
  );
}
