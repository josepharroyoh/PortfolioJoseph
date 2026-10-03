import { useEffect, useRef } from "react";
import clsx from "clsx";
import { SHAPES, SHAPE_VIEW, sectionShape } from "./universe-shapes";
import type { ShapeKey } from "./universe-shapes";

type Props = {
  /** Current section; drives the morphing figure. */
  active?: string;
  /** Draw the morphing figure (off for the contact sky). */
  morph?: boolean;
  /** Fixed behind the whole page, or filling its parent. */
  fixed?: boolean;
  className?: string;
};

type Star = { x: number; y: number; z: number; tw: number; ph: number; c: number };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * The background universe, rebuilt from the original site's three effects:
 * a deep starfield that warps with scroll speed, a constellation that links the
 * stars around your cursor, and a particle figure that morphs per section
 * (galaxy, atmosphere, Lorenz attractor, lightning, magnetic field, waves).
 * Light theme reads like an ink star atlas; dark theme is the night sky.
 */
export function Universe({ active = "home", morph = true, fixed = true, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const shape = sectionShape(active);
  const shapeRef = useRef<ShapeKey>(shape);

  useEffect(() => {
    shapeRef.current = shape;
  }, [shape]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    const N = morph ? (small ? 1200 : 3000) : 0;
    const STARS = small ? 220 : 460;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let night = false;
    const colors = { ink: "#1b1b1d", accent: "#9b1c2e", star: "#1b1b1d" };
    // Star-temperature palette: blue-white, cyan, violet, gold. Vivid at night, ink-deep by day.
    const NIGHT = ["#f4f6ff", "#8fc3ff", "#6fe3f0", "#b9a2ff", "#ffd27a"];
    const DAY = ["#1b1b1d", "#1f4fa8", "#0e7a86", "#5b3fb0", "#a8730c"];
    let pal = DAY;
    // Each figure has its own vivid set (same five slots: base, three hues, highlight).
    const FIGURE: Record<ShapeKey, string[]> = {
      galaxy: ["#f4f6ff", "#7fb2ff", "#62e0f0", "#a990ff", "#ffcf70"],
      atmosphere: ["#e8fbff", "#4fa8ff", "#3ee0d0", "#7cc4ff", "#a6f0ff"],
      lorenz: ["#f1edff", "#8f7bff", "#4cc9f0", "#c08cff", "#ffd166"],
      lightning: ["#ffffff", "#9ecbff", "#d9c2ff", "#6fb7ff", "#fff1a8"],
      dipole: ["#effff8", "#4ade9a", "#38d6e8", "#9f8bff", "#c4f56a"],
      wave: ["#eefcff", "#2fd3c4", "#5aa7ff", "#8be0ff", "#ffd88a"],
    };
    const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const mix = (a: string, b: string, t: number) => {
      const A = hex(a), B = hex(b);
      return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
    };
    let prevShape: ShapeKey = shapeRef.current;

    // Starfield in a unit box; z is depth (small = close).
    const stars: Star[] = Array.from({ length: STARS }, () => ({
      x: (Math.random() * 2 - 1) * 1.4,
      y: (Math.random() * 2 - 1) * 1.4,
      z: Math.random() * 0.95 + 0.05,
      tw: 0.0008 + Math.random() * 0.002,
      ph: Math.random() * Math.PI * 2,
      c: Math.random() < 0.6 ? 0 : 1 + Math.floor(Math.random() * 4),
    }));

    // Morph state.
    const cache = new Map<ShapeKey, Float32Array>();
    const get = (k: ShapeKey) => {
      let s = cache.get(k);
      if (!s) cache.set(k, (s = SHAPES[k](N)));
      return s;
    };
    let current: ShapeKey = shapeRef.current;
    const from = new Float32Array(N * 3);
    const cur = new Float32Array(N * 3);
    let to = N ? get(current) : new Float32Array(0);
    from.set(to);
    cur.set(to);
    let progress = 1;
    const view = { tilt: SHAPE_VIEW[current].tilt, spin: SHAPE_VIEW[current].spin, scale: SHAPE_VIEW[current].scale, home: current === "galaxy" ? 1 : 0 };
    // Colour per particle: a warm golden core, arms in blue, cyan, violet and white.
    const colorIdx = new Uint8Array(N).map((_, i) => {
      if (i < N * 0.16) return Math.random() < 0.7 ? 4 : 0;
      const r = Math.random();
      return r < 0.34 ? 1 : r < 0.56 ? 2 : r < 0.76 ? 3 : r < 0.84 ? 4 : 0;
    });

    const pointer = { x: -9999, y: -9999, sx: 0, sy: 0, tx: 0, ty: 0 };
    let scrollPrev = window.scrollY;
    let impulse = 0;
    let yaw = 0;
    const meteor = { x: 0, y: 0, vx: 0, vy: 0, life: 0, next: performance.now() + 3500 };

    const readColors = () => {
      const cs = getComputedStyle(canvas);
      colors.ink = cs.getPropertyValue("--ink").trim() || colors.ink;
      colors.accent = cs.getPropertyValue("--accent").trim() || colors.accent;
      const bg = cs.getPropertyValue("--bg").trim() || "#ffffff";
      const n = parseInt(bg.replace("#", "").slice(0, 6), 16);
      const lum = ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
      night = lum < 90;
      colors.star = night ? "#f4f6ff" : colors.ink;
      pal = night ? NIGHT : DAY;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawNebula = (t: number) => {
      if (!night) return;
      const blobs = [
        { x: 0.72 + Math.sin(t * 0.00004) * 0.05, y: 0.3, r: 0.55, c: "#3b6fe0", a: 0.1 },
        { x: 0.22, y: 0.75 + Math.cos(t * 0.00003) * 0.05, r: 0.5, c: "#7a4fd6", a: 0.08 },
        { x: 0.5 + Math.cos(t * 0.00002) * 0.08, y: 0.55, r: 0.4, c: "#1fa3b5", a: 0.05 },
      ];
      for (const b of blobs) {
        const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r * Math.max(w, h));
        g.addColorStop(0, b.c);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = b.a;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = 1;
    };

    const drawStars = (t: number, dt: number) => {
      const speed = 0.000035 * dt + impulse * dt;
      const cx = w / 2 + pointer.sx * 30;
      const cy = h / 2 + pointer.sy * 22;
      const focal = Math.max(w, h) * 0.5;
      const near: { x: number; y: number }[] = [];
      for (const s of stars) {
        const pz = s.z;
        s.z -= speed;
        if (s.z < 0.05) {
          s.z = 1;
          s.x = (Math.random() * 2 - 1) * 1.4;
          s.y = (Math.random() * 2 - 1) * 1.4;
          continue;
        }
        if (s.z > 1) {
          s.z = 0.05;
          continue;
        }
        const x = cx + (s.x / s.z) * focal * 0.5;
        const y = cy + (s.y / s.z) * focal * 0.5;
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;
        const depth = 1 - s.z;
        const tw = 0.6 + 0.4 * Math.sin(t * s.tw + s.ph);
        const a = (night ? 0.25 + depth * 0.75 : 0.12 + depth * 0.45) * tw;
        const size = 0.5 + depth * (night ? 2 : 1.6);
        ctx.fillStyle = ctx.strokeStyle = pal[s.c];
        // Warp streaks while scrolling fast.
        if (Math.abs(impulse) > 0.00025) {
          const px = cx + (s.x / pz) * focal * 0.5;
          const py = cy + (s.y / pz) * focal * 0.5;
          ctx.globalAlpha = Math.min(0.8, a * 1.2);
          ctx.lineWidth = size * 0.8;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        ctx.globalAlpha = a;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        if (depth > 0.45) {
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          if (d < 170) near.push({ x, y });
        }
      }
      // Constellation around the cursor.
      if (near.length) {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < near.length; i++) {
          const p = near[i];
          const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          ctx.globalAlpha = (1 - d / 170) * (night ? 0.55 : 0.4);
          ctx.strokeStyle = pal[2];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
          ctx.strokeStyle = colors.star;
          for (let j = i + 1; j < near.length; j++) {
            const q = near[j];
            const dd = Math.hypot(p.x - q.x, p.y - q.y);
            if (dd > 120) continue;
            ctx.globalAlpha = (1 - dd / 120) * (night ? 0.35 : 0.22);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawMeteor = (t: number, dt: number) => {
      if (t > meteor.next && meteor.life <= 0) {
        meteor.x = w * (0.2 + Math.random() * 0.7);
        meteor.y = h * Math.random() * 0.35;
        const ang = Math.PI * (0.72 + Math.random() * 0.1);
        meteor.vx = Math.cos(ang) * 0.9;
        meteor.vy = Math.sin(ang) * 0.9;
        meteor.life = 1;
        meteor.next = t + 6000 + Math.random() * 7000;
      }
      if (meteor.life <= 0) return;
      meteor.x += meteor.vx * dt;
      meteor.y += meteor.vy * dt;
      meteor.life -= dt / 1100;
      const len = 150;
      ctx.lineCap = "round";
      for (let k = 0; k < 4; k++) {
        ctx.globalAlpha = Math.max(0, meteor.life) * (night ? 0.8 : 0.55) * (1 - k / 4);
        ctx.strokeStyle = night ? "#ffffff" : pal[1];
        ctx.lineWidth = 1.6 - k * 0.3;
        ctx.beginPath();
        ctx.moveTo(meteor.x - meteor.vx * (len / 0.9) * (k / 4), meteor.y - meteor.vy * (len / 0.9) * (k / 4));
        ctx.lineTo(meteor.x - meteor.vx * (len / 0.9) * ((k + 1) / 4), meteor.y - meteor.vy * (len / 0.9) * ((k + 1) / 4));
        ctx.stroke();
      }
      ctx.lineCap = "butt";
      ctx.globalAlpha = 1;
    };

    const drawFigure = (t: number, dt: number) => {
      if (!N) return;
      // Start a new morph when the section changes.
      if (shapeRef.current !== current) {
        prevShape = current;
        current = shapeRef.current;
        from.set(cur);
        to = get(current);
        progress = 0;
      }
      progress = Math.min(1, progress + dt / 1800);
      const target = SHAPE_VIEW[current];
      const k = 1 - Math.exp(-dt / 500);
      view.tilt += (target.tilt - view.tilt) * k;
      view.spin += (target.spin - view.spin) * k;
      view.scale += (target.scale - view.scale) * k;
      view.home += ((current === "galaxy" ? 1 : 0) - view.home) * k;

      yaw += dt * 0.00011 * view.spin + impulse * dt * 6;
      const pitch = view.tilt + pointer.sy * 0.22;
      const yw = yaw + pointer.sx * 0.35;
      const cyw = Math.cos(yw), syw = Math.sin(yw), cp = Math.cos(pitch), sp = Math.sin(pitch);

      // Anchor: wide and central for the galaxy in the hero, to the right margin elsewhere.
      const m = Math.min(w, h);
      const ax = small ? w * (0.78 - 0.06 * (1 - view.home)) : w * (0.74 + 0.08 * (1 - view.home));
      const ay = small ? h * (0.16 + 0.12 * (1 - view.home)) : h * (0.3 + 0.22 * (1 - view.home));
      const S = (small ? w * (0.5 - 0.12 * (1 - view.home)) : m * (0.6 - 0.24 * (1 - view.home))) * view.scale;
      // Brightest as the hero galaxy; dimmer when it sits behind reading text.
      const alphaBase = (night ? 0.7 : 0.38) * (small ? 0.7 : 1) * (0.72 + 0.28 * view.home);

      if (night) ctx.globalCompositeOperation = "lighter";
      for (let pass = 0; pass < pal.length; pass++) {
        // Colours cross-fade with the morph.
        ctx.fillStyle = night ? mix(FIGURE[prevShape][pass], FIGURE[current][pass], ease(progress)) : pal[pass];
        for (let i = 0; i < N; i++) {
          if (colorIdx[i] !== pass) continue;
          const i3 = i * 3;
          const local = Math.min(1, Math.max(0, (progress - (i % 89) / 89 * 0.35) / 0.65));
          const e = ease(local);
          const wob = Math.sin(t * 0.0012 + i) * 0.006;
          const x = from[i3] + (to[i3] - from[i3]) * e + wob;
          const y = from[i3 + 1] + (to[i3 + 1] - from[i3 + 1]) * e;
          const z = from[i3 + 2] + (to[i3 + 2] - from[i3 + 2]) * e - wob;
          cur[i3] = x; cur[i3 + 1] = y; cur[i3 + 2] = z;
          // Rotate: yaw about Y, then pitch about X.
          const x1 = x * cyw + z * syw;
          const z1 = -x * syw + z * cyw;
          const y2 = y * cp - z1 * sp;
          const z2 = y * sp + z1 * cp;
          const f = 2.6 / (2.6 + z2);
          const px = ax + x1 * S * f;
          const py = ay + y2 * S * f;
          const size = (night ? 1.5 : 1.25) * f;
          ctx.globalAlpha = alphaBase * Math.min(1, f * f) * (pass ? 1.25 : 1);
          ctx.fillRect(px, py, size, size);
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    const frame = (t: number) => {
      const dt = Math.min(48, t - last);
      last = t;
      // Scroll speed becomes forward (or backward) flight through the stars.
      const y = window.scrollY;
      impulse = impulse * 0.9 + (y - scrollPrev) * 0.0000045;
      impulse = Math.max(-0.0016, Math.min(0.0016, impulse));
      scrollPrev = y;
      pointer.sx += (pointer.tx - pointer.sx) * 0.05;
      pointer.sy += (pointer.ty - pointer.sy) * 0.05;

      ctx.clearRect(0, 0, w, h);
      drawNebula(t);
      drawStars(t, dt);
      drawFigure(t, dt);
      drawMeteor(t, dt);
    };

    const loop = (t: number) => {
      frame(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!reduced && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };

    resize();
    readColors();
    frame(performance.now());
    if (reduced) {
      progress = 1;
      frame(performance.now() + 16);
    }

    const ro = new ResizeObserver(() => (resize(), reduced && frame(performance.now())));
    ro.observe(canvas);
    const mo = new MutationObserver(() => (readColors(), reduced && frame(performance.now())));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : cancelAnimationFrame(raf)));
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [morph]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={clsx("no-print pointer-events-none", fixed ? "fixed inset-0 h-full w-full" : "absolute inset-0 h-full w-full", className)}
    />
  );
}
