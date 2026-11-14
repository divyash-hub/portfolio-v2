import { useEffect, useRef } from "react";
import { Link } from "react-router";
import type { Project } from "../data/projects";
import "./orbit-hero.css";

/*
 * The homepage backdrop: a small orbital system with one body per project.
 * Each body is a real link to that project, so the hero is also navigation.
 *
 * The canvas draws the stars, the orbit lines and the glow. The bodies are
 * ordinary links moved along their orbits, which keeps them clickable,
 * focusable and readable by screen readers.
 *
 * Motion stops while a body is hovered or focused (so it can be clicked),
 * while the hero is off screen, and entirely for people who ask for reduced motion.
 */


export default function OrbitHero({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const held = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = projects.length;

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let R = 0;
    let TILT = -0.32; // radians: how far the whole system leans
    let SQUASH = 0.36; // how flat the orbits look (1 would be a circle seen from above)
    let COS = Math.cos(TILT);
    let SIN = Math.sin(TILT);
    let stars: { x: number; y: number; r: number; p: number }[] = [];
    let time = 0;
    let last = 0;
    let frame = 0;
    let visible = true;
    // pointer position (-1…1) and its eased copy, for a little parallax
    let mx = 0;
    let my = 0;
    let px = 0;
    let py = 0;

    const radius = (i: number) => R * (0.46 + (0.54 * i) / Math.max(1, count - 1));
    // Every body turns at the same rate, so the gaps between them never change and they can't bunch up.
    // A full lap takes about 70 seconds.
    const SPEED = 0.09;
    // Spread them evenly around the circle, and step round so neighbouring orbits aren't side by side:
    // with 5 projects the bodies sit 144 degrees apart from the next orbit out.
    const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
    let stride = Math.max(1, Math.floor(count / 2));
    while (stride > 1 && gcd(stride, count) !== 1) stride--;
    const phase = (i: number) => 0.6 + ((i * stride) % count) * ((2 * Math.PI) / count);

    const point = (i: number, angle: number) => {
      const ex = Math.cos(angle) * radius(i);
      const ey = Math.sin(angle) * radius(i) * SQUASH;
      const drift = 6 + i * 5;
      return { x: cx + ex * COS - ey * SIN + px * drift, y: cy + ex * SIN + ey * COS + py * drift };
    };

    const layout = () => {
      // clientWidth/Height, not getBoundingClientRect: the scroll story zooms this whole layer,
      // and a measurement that included the zoom would place every body far off screen.
      w = root.clientWidth;
      h = root.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const wide = w >= 900;
      cx = wide ? w * 0.7 : w * 0.5;
      cy = wide ? h * 0.4 : h * 0.34;
      R = wide ? Math.min(w * 0.33, h * 0.7) : Math.min(w * 0.4, h * 0.3);
      // phones get a rounder, steeper system so the labels have room
      TILT = wide ? 0.32 : -0.55; // desktop leans away from the name
      SQUASH = wide ? 0.36 : 0.6;
      COS = Math.cos(TILT);
      SIN = Math.sin(TILT);
      // the same stars every time: a tiny seeded generator, not Math.random
      let seed = 11;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      stars = Array.from({ length: Math.round((w * h) / 8000) }, () => ({
        x: rnd() * w,
        y: rnd() * h,
        r: rnd() * 1.1 + 0.3,
        p: rnd() * 6.283,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        ctx.globalAlpha = 0.22 + 0.3 * (0.5 + 0.5 * Math.sin(s.p + time * 0.9));
        ctx.fillStyle = "#f1f4f7";
        ctx.beginPath();
        ctx.arc(s.x + px * 3, s.y + py * 3, s.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // the glow at the centre
      const sx = cx + px * 4;
      const sy = cy + py * 4;
      const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.75);
      halo.addColorStop(0, "rgba(143, 211, 255, 0.34)");
      halo.addColorStop(0.25, "rgba(143, 211, 255, 0.1)");
      halo.addColorStop(1, "rgba(143, 211, 255, 0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      const core = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.085);
      core.addColorStop(0, "#ffffff");
      core.addColorStop(0.55, "#b8d7ea");
      core.addColorStop(1, "rgba(184, 215, 234, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(sx, sy, R * 0.085, 0, 6.283);
      ctx.fill();

      for (let i = 0; i < count; i++) {
        const drift = 6 + i * 5;
        const ox = cx + px * drift;
        const oy = cy + py * drift;
        const r = radius(i);

        ctx.strokeStyle = "rgba(174, 184, 196, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(ox, oy, r, r * SQUASH, TILT, 0, 6.283);
        ctx.stroke();

        // a short bright trail behind each body
        const angle = phase(i) + time * SPEED;
        const steps = 14;
        for (let k = 0; k < steps; k++) {
          const a0 = angle - ((k + 1) / steps) * 0.85;
          const a1 = angle - (k / steps) * 0.85;
          ctx.strokeStyle = `rgba(143, 211, 255, ${0.75 * (1 - k / steps)})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.ellipse(ox, oy, r, r * SQUASH, TILT, a0, a1);
          ctx.stroke();
        }

        const node = nodeRefs.current[i];
        if (node) {
          const p = point(i, angle);
          const depth = Math.sin(angle); // +1 nearest, -1 farthest
          node.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
          node.style.setProperty("--near", ((depth + 1) / 2).toFixed(3));
          node.style.zIndex = depth > 0 ? "3" : "1";
        }
      }
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (!held.current) time += dt;
      px += (mx - px) * 0.06;
      py += (my - py) * 0.06;
      draw();
      if (visible) frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reduce || frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const resize = new ResizeObserver(() => {
      layout();
      draw();
    });
    resize.observe(root);

    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    seen.observe(root);

    layout();
    draw();
    root.dataset.ready = "";
    start();
    window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      seen.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [projects]);

  const hold = (on: boolean) => () => {
    held.current = on;
  };

  return (
    <div className="orbit" ref={rootRef}>
      <canvas ref={canvasRef} className="orbit-canvas" aria-hidden="true" />
      <nav aria-label="Projects in orbit">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            to={`/projects/${p.slug}`}
            className="orbit-node"
            data-cursor="Open"
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            onPointerEnter={hold(true)}
            onPointerLeave={hold(false)}
            onFocus={hold(true)}
            onBlur={hold(false)}
          >
            <span className="orbit-dot" aria-hidden="true" />
            <span className="orbit-label">
              <span className="orbit-name">{p.title}</span>
              <span className="orbit-kind">{p.category}</span>
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
