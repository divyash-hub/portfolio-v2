import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * The homepage's scroll story. Everything here is tied to the scrollbar, so it
 * runs forwards and backwards with the visitor and never plays on its own.
 *
 *   hero     the name splits apart and the camera flies into the orbit
 *   about    the statement's words swing up into place
 *   build    "I build …" holds still while the answers change
 *   work     full-screen project panels stack over one another
 *   numbers  count up; the toolbox rows slide against each other
 *   phases   four beats of how a project goes, each decoding out of noise
 *
 * People who ask for reduced motion get none of this: the same content sits
 * in the page as ordinary sections.
 */
export function setupHomeMotion(root: HTMLElement) {
  const mm = gsap.matchMedia(root);

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    root.classList.add("motion");
    const all = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, root);

    /* ---- hero ---- */
    const lines = all(".hero-line");
    const hero = gsap.timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: "+=100%", pin: true, scrub: 0.5 },
    });
    // fromTo, not to: these two fade in on load, and a plain "to" would read that faded state as the start
    hero.fromTo(".hero-status, .hero-foot", { opacity: 1, y: 0 }, { opacity: 0, y: -24, duration: 0.25, ease: "none", immediateRender: false }, 0);
    lines.forEach((line, row) => {
      const chars = gsap.utils.toArray<HTMLElement>(".ch", line);
      const mid = (chars.length - 1) / 2;
      hero.to(
        chars,
        {
          x: (i) => `${(i - mid) * 5.5}vw`,
          y: (i) => `${(row === 0 ? -1 : 1) * (16 + Math.abs(i - mid) * 5)}vh`,
          rotation: (i) => (i - mid) * (row === 0 ? 7 : -7),
          opacity: 0,
          duration: 0.8,
          ease: "power1.in",
          stagger: { each: 0.02, from: "center" },
        },
        0.05,
      );
    });
    hero.to(".hero-orbit", { scale: window.innerWidth < 900 ? 1.8 : 2.6, duration: 1, ease: "power1.in" }, 0);
    hero.to(".hero-orbit", { opacity: 0, duration: 0.15, ease: "none" }, 0.85);

    /* ---- about: each word swings up from behind its own line ---- */
    gsap.fromTo(
      all(".reveal .wi"),
      { yPercent: 115, rotation: 8 },
      {
        yPercent: 0,
        rotation: 0,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".reveal", start: "top 88%", end: "top 30%", scrub: 0.4 },
      },
    );

    /* ---- who I am: each line slides in as it arrives ---- */
    gsap.from(all(".who-list li, .who-facts"), {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: { trigger: ".who", start: "top 80%", once: true },
    });

    /* ---- numbers count to their value the first time they come into view ---- */
    all(".number").forEach((el) => {
      const target = Number(el.dataset.value);
      // zero is the punchline, so it counts down to it
      const counter = { v: target === 0 ? 99 : 0 };
      el.textContent = String(counter.v);
      gsap.to(counter, {
        v: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => (el.textContent = String(Math.round(counter.v))),
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    /* ---- glass cards rise in, and their skill chips follow ---- */
    all(".skills-grid").forEach((grid) => {
      gsap.from(grid.querySelectorAll(".cell"), {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: grid, start: "top 82%", once: true },
      });
    });

    /* ---- "I build …" ---- */
    const words = all(".build-word");
    const rows = all(".build-list li");
    const count = root.querySelector(".build-count");
    const mark = (index: number) => {
      rows.forEach((row, i) => row.toggleAttribute("data-on", i === index));
      if (count) count.textContent = String(index + 1).padStart(2, "0");
    };
    gsap.set(words.slice(1), { opacity: 0, yPercent: 40 });
    mark(0);
    const build = gsap.timeline({
      scrollTrigger: {
        trigger: ".build",
        start: "top top",
        end: `+=${words.length * 85}%`,
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => mark(Math.min(words.length - 1, Math.floor(self.progress * words.length))),
      },
    });
    words.forEach((word, i) => {
      if (i === 0) return;
      build
        .to(words[i - 1], { opacity: 0, yPercent: -40, duration: 0.4, ease: "power2.in" }, i - 0.4)
        .to(word, { opacity: 1, yPercent: 0, duration: 0.4, ease: "power2.out" }, i);
    });
    build.to({}, { duration: 0.6 });

    /* ---- work: sliding title, stacking panels ---- */
    gsap.to(".work-marquee-track", {
      xPercent: -40,
      ease: "none",
      scrollTrigger: { trigger: ".work-marquee", start: "top bottom", end: "bottom top", scrub: true },
    });
    const cards = all(".work-card");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card.querySelector(".work-card-shot"),
        { yPercent: 22, rotation: 7 },
        {
          yPercent: 0,
          rotation: -3,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
        },
      );
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card.querySelector(".work-card-inner"), {
        scale: 0.9,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
      });
    });

    /* ---- the accent colour shifts as the page moves through its sections ---- */
    const html = document.documentElement;
    const accents: Record<string, string> = {
      Intro: "143, 211, 255", // ice
      About: "143, 211, 255",
      "What I build": "167, 139, 250", // violet
      Skills: "94, 234, 212", // mint
      Work: "94, 234, 212",
      "How it goes": "244, 114, 182", // magenta
      GitHub: "143, 211, 255",
      Contact: "143, 211, 255",
    };
    all("[data-section]").forEach((section) => {
      const rgb = accents[section.dataset.section ?? ""];
      if (!rgb) return;
      // a pinned section is wrapped in a taller spacer; that is the part that scrolls
      const box = section.parentElement?.classList.contains("pin-spacer") ? section.parentElement : section;
      ScrollTrigger.create({
        trigger: box,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) gsap.to(html, { "--signal-rgb": rgb, duration: 0.9, ease: "power2.out", overwrite: "auto" });
        },
      });
    });

    /* ---- glass cards catch the light where the pointer is ---- */
    const light = (e: PointerEvent) => {
      const cell = e.target instanceof Element ? e.target.closest<HTMLElement>(".cell") : null;
      if (!cell) return;
      const r = cell.getBoundingClientRect();
      cell.style.setProperty("--px", `${e.clientX - r.left}px`);
      cell.style.setProperty("--py", `${e.clientY - r.top}px`);
    };
    root.addEventListener("pointermove", light);

    /* ---- screenshots lean toward the pointer ---- */
    const tilts = cards.map((card) => {
      const shot = card.querySelector<HTMLElement>(".work-card-tilt");
      if (!shot) return () => {};
      const move = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = card.getBoundingClientRect();
        shot.style.setProperty("--tx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        shot.style.setProperty("--ty", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      };
      const leave = () => {
        shot.style.setProperty("--tx", "0");
        shot.style.setProperty("--ty", "0");
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      return () => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      };
    });

    /* ---- four beats that decode out of noise ---- */
    const beats = all(".phase-line").map((el) => el.textContent ?? "");
    const stage = root.querySelector<HTMLElement>(".phase-text");
    const meter = root.querySelector<HTMLElement>(".phase-meter");
    const NOISE = "/\_-=+*#?!01[]{}";
    const state = { p: 0 };
    // the last beat (the name) gets more scroll than the others: it settles, then grows to fill the screen
    const weights = beats.map((_, k) => (k === beats.length - 1 ? 2.4 : 1));
    const total = weights.reduce((a, b) => a + b, 0);
    const ring = root.querySelector<HTMLElement>(".phase-ring");
    // Longer words ("Always learning.") are shrunk so every beat fits inside the screen.
    const fit: number[] = [];
    const fitFor = (k: number) => {
      if (fit[k] !== undefined || !stage) return fit[k] ?? 1;
      stage.style.fontSize = "";
      stage.textContent = beats[k];
      const room = window.innerWidth * 0.9;
      fit[k] = Math.min(1, room / Math.max(1, stage.scrollWidth));
      return fit[k];
    };
    window.addEventListener("resize", () => (fit.length = 0));
    const render = () => {
      if (!stage || !beats.length) return;
      let pos = state.p * total;
      let i = 0;
      while (i < beats.length - 1 && pos >= weights[i]) pos -= weights[i++];
      const local = Math.min(1, pos / weights[i]);
      const last = i === beats.length - 1;
      // settle in over the first part, hold, then (except the last) break up again
      const settleAt = last ? 0.22 : 0.5;
      const settledShare = local < settleAt ? local / settleAt : last || local < 0.82 ? 1 : 1 - (local - 0.82) / 0.18;
      // the name: after it has settled, it swells until the letters pass the edges of the screen
      const grow = last ? Math.max(0, (local - 0.4) / 0.6) : 0;
      stage.style.transform = grow ? `scale(${(1 + Math.pow(grow, 2.2) * 11).toFixed(3)})` : "";
      stage.style.opacity = last ? String(Math.max(0, Math.min(1, (1 - grow) * 5))) : "1";
      stage.style.letterSpacing = last ? `${(-0.06 + grow * 0.05).toFixed(3)}em` : "";
      if (ring) ring.style.opacity = String(last ? Math.max(0, 1 - local * 4) : 1);
      const text = beats[i];
      const size = fitFor(i);
      stage.style.fontSize = size < 1 ? `calc(${size.toFixed(3)} * clamp(2.25rem, 0.5rem + 7.4vw, 8rem))` : "";
      const settled = Math.round(settledShare * text.length);
      const tick = Math.floor(state.p * 500);
      let html = "";
      for (let k = 0; k < text.length; k++) {
        const ch = text[k];
        if (k < settled || ch === " ") html += ch;
        else html += `<span class="g">${NOISE[(k * 7 + tick) % NOISE.length]}</span>`;
      }
      stage.innerHTML = html;
      stage.toggleAttribute("data-last", last);
      if (meter) meter.textContent = `${i + 1} / ${beats.length}`;
    };
    render();
    gsap.to(state, {
      p: 1,
      ease: "none",
      onUpdate: render,
      scrollTrigger: { trigger: ".phases", start: "top top", end: `+=${total * 80}%`, pin: true, scrub: 0.3 },
    });
    gsap.to(".phase-ring", {
      rotation: 360,
      ease: "none",
      scrollTrigger: { trigger: ".phases", start: "top bottom", end: `+=${total * 80 + 200}%`, scrub: 0.6 },
    });

    /* ---- the name in the intro is a force field: letters are pushed away from the pointer on springs,
          light up as it gets close, and a click sends a shockwave through all of them ---- */
    const letters = all(".hero-line .ch");
    const sim = letters.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, h: 0 }));
    let pointer: { x: number; y: number } | null = null;
    let loop = 0;
    const live = () => window.scrollY < window.innerHeight * 0.25;
    const step = () => {
      loop = 0;
      const reach = Math.max(150, window.innerWidth * 0.13);
      let busy = false;
      letters.forEach((el, k) => {
        const st = sim[k];
        let tx = 0;
        let ty = 0;
        let heat = 0;
        if (pointer && live()) {
          // where this letter would be if it were not displaced
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2 - st.x;
          const cy = r.top + r.height / 2 - st.y;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const d = Math.max(1, Math.hypot(dx, dy));
          const f = Math.max(0, 1 - d / reach);
          tx = (dx / d) * f * reach * 0.5;
          ty = (dy / d) * f * reach * 0.5;
          heat = f;
        }
        // a spring toward the target; a little under-damped so letters wobble when they settle
        st.vx += (tx - st.x) * 0.12;
        st.vy += (ty - st.y) * 0.12;
        st.vx *= 0.8;
        st.vy *= 0.8;
        st.x += st.vx;
        st.y += st.vy;
        st.h += (heat - st.h) * 0.18;
        if (Math.abs(st.vx) + Math.abs(st.vy) + Math.abs(st.x) + Math.abs(st.y) + st.h > 0.05) busy = true;
        el.style.setProperty("--tx", `${st.x.toFixed(1)}px`);
        el.style.setProperty("--ty", `${st.y.toFixed(1)}px`);
        el.style.setProperty("--rot", `${(st.x * 0.12).toFixed(2)}deg`);
        el.style.setProperty("--h", st.h.toFixed(3));
      });
      if (busy || pointer) loop = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!loop) loop = requestAnimationFrame(step);
    };
    const nameMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer = { x: e.clientX, y: e.clientY };
      kick();
    };
    const nameLeave = () => {
      pointer = null;
      kick();
    };
    const nameClick = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !live()) return;
      // shockwave: every letter gets a shove away from the click, stronger the closer it is
      letters.forEach((el, k) => {
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - e.clientX;
        const dy = r.top + r.height / 2 - e.clientY;
        const d = Math.max(30, Math.hypot(dx, dy));
        const force = Math.min(60, 9000 / d);
        sim[k].vx += (dx / d) * force;
        sim[k].vy += (dy / d) * force - 6;
      });
      kick();
    };
    window.addEventListener("pointermove", nameMove, { passive: true });
    window.addEventListener("pointerdown", nameClick);
    document.addEventListener("pointerleave", nameLeave);

    return () => {
      tilts.forEach((off) => off());
      cancelAnimationFrame(loop);
      window.removeEventListener("pointermove", nameMove);
      window.removeEventListener("pointerdown", nameClick);
      document.removeEventListener("pointerleave", nameLeave);
      root.removeEventListener("pointermove", light);
      gsap.killTweensOf(html);
      html.style.removeProperty("--signal-rgb");
      root.classList.remove("motion");
    };
  });

  return () => mm.revert();
}
