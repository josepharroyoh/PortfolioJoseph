import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type Charge = { x: number; y: number; q: number };
type Particle = { x: number; y: number; age: number; life: number };
type Segment = { x1: number; y1: number; x2: number; y2: number; w: number };

type Props = {
  /** Horizontal position of the storm cloud, as a fraction of the width. */
  cloudX?: number;
  /** Small canvas below the field that plots the simulated sensor reading. */
  traceCanvas?: RefObject<HTMLCanvasElement | null>;
  className?: string;
};

const SOFTEN = 900; // px² added to r² so the field stays finite near a charge

function readColors() {
  const css = getComputedStyle(document.documentElement);
  return {
    ink: css.getPropertyValue("--ink").trim() || "#121418",
    accent: css.getPropertyValue("--accent").trim() || "#2547d0",
    dark: document.documentElement.dataset.theme === "dark",
  };
}

/** Stepped-leader path from the cloud base to the ground, with side branches. */
function buildBolt(x: number, y: number, groundY: number, width: number): Segment[] {
  const segments: Segment[] = [];
  const grow = (sx: number, sy: number, angle: number, w: number, depth: number, toGround: boolean) => {
    let cx = sx;
    let cy = sy;
    let a = angle;
    const limit = toGround ? 400 : 6 + Math.random() * 10;
    for (let i = 0; i < limit; i++) {
      a += (Math.random() - 0.5) * 0.9;
      // The main channel keeps being pulled back towards straight down.
      if (toGround) a += (Math.PI / 2 - a) * 0.25;
      const len = 7 + Math.random() * 12;
      const nx = cx + Math.cos(a) * len;
      const ny = cy + Math.sin(a) * len;
      segments.push({ x1: cx, y1: cy, x2: nx, y2: Math.min(ny, groundY), w });
      cx = nx;
      cy = ny;
      if (toGround && cy >= groundY) break;
      if (cx < 0 || cx > width) break;
      if (depth < 2 && Math.random() < (toGround ? 0.09 : 0.04)) {
        grow(cx, cy, a + (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.6), w * 0.5, depth + 1, false);
      }
    }
  };
  grow(x, y, Math.PI / 2, 2.2, 0, true);
  return segments;
}

/**
 * A storm cloud's electric field drawn as flowing field lines. The cloud
 * slowly charges, discharges as a lightning bolt, and starts again; the
 * pointer adds a positive charge that bends the field around it.
 */
export function ElectricField({ cloudX = 0.66, traceCanvas, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;
    const traceEl = traceCanvas?.current ?? null;
    const tctx = traceEl?.getContext("2d") ?? null;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = readColors();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let groundY = 0;
    let particles: Particle[] = [];
    let target = 0;

    const cloud = { neg: { x: 0, y: 0 }, pos: { x: 0, y: 0 }, pocket: { x: 0, y: 0 } };
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, on: false, until: 0 };
    let level = 0.45;
    let rate = 1 / 2.4; // the first strike comes quickly
    let bolt: { segs: Segment[]; t: number } | null = null;
    let lastTime = performance.now();

    const trace: number[] = [];
    const THRESHOLD = 0.72;

    const charges = (): Charge[] => {
      const k = 2600 * (0.35 + level);
      const list: Charge[] = [
        { x: cloud.pos.x, y: cloud.pos.y, q: 0.75 * k },
        { x: cloud.neg.x, y: cloud.neg.y, q: -1 * k },
        { x: cloud.pocket.x, y: cloud.pocket.y, q: 0.18 * k },
      ];
      if (pointer.on) list.push({ x: pointer.x, y: pointer.y, q: 900 });
      // Mirror charges below the ground make the field meet it at right angles.
      const mirrored = list.map((c) => ({ x: c.x, y: 2 * groundY - c.y, q: -c.q }));
      return list.concat(mirrored);
    };

    const field = (x: number, y: number, list: Charge[]) => {
      let ex = 0;
      let ey = 0;
      for (const c of list) {
        const dx = x - c.x;
        const dy = y - c.y;
        const r2 = dx * dx + dy * dy + SOFTEN;
        ex += (c.q * dx) / r2;
        ey += (c.q * dy) / r2;
      }
      return { ex, ey };
    };

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * groundY,
      age: 0,
      life: 60 + Math.random() * 140,
    });

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, 1 * dpr, 0, 0);
      groundY = h * 0.84;
      const cx = w * cloudX;
      cloud.pos = { x: cx + w * 0.03, y: h * 0.14 };
      cloud.neg = { x: cx, y: h * 0.34 };
      cloud.pocket = { x: cx - w * 0.04, y: h * 0.43 };
      target = Math.min(900, Math.round((w * h) / 1500));
      particles = Array.from({ length: target }, spawn);
      if (traceEl && tctx) {
        const tr = traceEl.getBoundingClientRect();
        traceEl.width = Math.round(tr.width * dpr);
        traceEl.height = Math.round(tr.height * dpr);
        tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.clearRect(0, 0, w, h);
      if (reduced) drawStatic();
    };

    const drawGround = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 0.5);
      ctx.lineTo(w, groundY + 0.5);
      ctx.stroke();
      // Field-mill sensor on the ground.
      const sx = w * Math.max(0.12, cloudX - 0.22);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = colors.accent;
      ctx.fillRect(sx - 3, groundY - 7, 6, 7);
      ctx.globalAlpha = 1;
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const list = charges();
      ctx.strokeStyle = colors.ink;
      ctx.globalAlpha = 0.28;
      ctx.lineWidth = 1;
      for (let i = 0; i < 70; i++) {
        let x = (i / 70) * w;
        let y = groundY - 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        for (let s = 0; s < 220; s++) {
          const { ex, ey } = field(x, y, list);
          const m = Math.hypot(ex, ey) || 1;
          x += (ex / m) * 4;
          y += (ey / m) * 4;
          if (y < 0 || y > groundY || x < 0 || x > w) break;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      drawGround();
    };

    const drawTrace = () => {
      if (!traceEl || !tctx) return;
      const tw = traceEl.width / dpr;
      const th = traceEl.height / dpr;
      tctx.clearRect(0, 0, tw, th);
      const yFor = (v: number) => th - 4 - v * (th - 8);
      tctx.setLineDash([3, 4]);
      tctx.strokeStyle = colors.ink;
      tctx.globalAlpha = 0.35;
      tctx.lineWidth = 1;
      tctx.beginPath();
      tctx.moveTo(0, yFor(THRESHOLD));
      tctx.lineTo(tw, yFor(THRESHOLD));
      tctx.stroke();
      tctx.setLineDash([]);
      tctx.globalAlpha = 1;
      const step = tw / 160;
      for (let i = 1; i < trace.length; i++) {
        const above = trace[i] >= THRESHOLD;
        tctx.strokeStyle = above ? colors.accent : colors.ink;
        tctx.globalAlpha = above ? 1 : 0.7;
        tctx.lineWidth = above ? 1.6 : 1.2;
        tctx.beginPath();
        tctx.moveTo((i - 1) * step, yFor(trace[i - 1]));
        tctx.lineTo(i * step, yFor(trace[i]));
        tctx.stroke();
      }
      tctx.globalAlpha = 1;
    };

    let raf = 0;
    let running = true;
    let visible = true;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!running || !visible || document.hidden) {
        lastTime = now;
        return;
      }
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Charge build-up and discharge cycle.
      if (!bolt) {
        level = Math.min(1, level + rate * dt * 0.6);
        if (level >= 1) {
          bolt = { segs: buildBolt(cloud.neg.x, cloud.neg.y + 10, groundY, w), t: 0 };
          level = 0.3;
          rate = 1 / (5 + Math.random() * 4);
        }
      }

      if (pointer.until && now > pointer.until) {
        pointer.on = false;
        pointer.until = 0;
      }
      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;

      // Fade the previous frame to leave short trails.
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 0.09;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      const list = charges();
      const speed = 1.4 + level * 1.8;
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1;
      ctx.globalAlpha = colors.dark ? 0.55 : 0.45;
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const { ex, ey } = field(p.x, p.y, list);
        const m = Math.hypot(ex, ey);
        if (m < 1e-6) {
          particles[i] = spawn();
          continue;
        }
        const nx = p.x + (ex / m) * speed;
        const ny = p.y + (ey / m) * speed;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        p.x = nx;
        p.y = ny;
        p.age++;
        const nearNeg = Math.hypot(p.x - cloud.neg.x, p.y - cloud.neg.y) < 10;
        if (p.age > p.life || nearNeg || p.y > groundY || p.y < 0 || p.x < 0 || p.x > w) particles[i] = spawn();
      }
      ctx.stroke();

      // Pointer charge.
      if (pointer.on) {
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 7, 0, Math.PI * 2);
        ctx.moveTo(pointer.x - 3, pointer.y);
        ctx.lineTo(pointer.x + 3, pointer.y);
        ctx.moveTo(pointer.x, pointer.y - 3);
        ctx.lineTo(pointer.x, pointer.y + 3);
        ctx.stroke();
      }

      // Lightning: two quick return strokes, then gone.
      if (bolt) {
        bolt.t += dt;
        const t = bolt.t;
        const flicker = t < 0.06 ? 1 : t < 0.11 ? 0.25 : t < 0.18 ? 0.9 : Math.max(0, 1 - (t - 0.18) / 0.12);
        if (flashRef.current) flashRef.current.style.opacity = String(0.14 * flicker);
        if (flicker > 0) {
          for (const pass of [0, 1]) {
            ctx.strokeStyle = pass === 0 ? colors.accent : colors.ink;
            ctx.globalAlpha = (pass === 0 ? 0.35 : 1) * flicker;
            ctx.beginPath();
            for (const s of bolt.segs) {
              ctx.lineWidth = pass === 0 ? s.w * 3.5 : s.w;
              ctx.moveTo(s.x1, s.y1);
              ctx.lineTo(s.x2, s.y2);
            }
            ctx.stroke();
          }
        }
        if (t > 0.32) {
          bolt = null;
          if (flashRef.current) flashRef.current.style.opacity = "0";
        }
      }
      ctx.globalAlpha = 1;
      drawGround();

      // Simulated field-mill reading.
      const noise = (Math.sin(now / 310) + Math.sin(now / 97) * 0.5) * 0.02;
      trace.push(Math.max(0, Math.min(1, 0.1 + level * 0.82 + noise + (pointer.on ? 0.04 : 0))));
      if (trace.length > 160) trace.shift();
      drawTrace();
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (y > groundY) {
        pointer.on = false;
        return;
      }
      if (!pointer.on) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.tx = x;
      pointer.ty = y;
      pointer.on = true;
      pointer.until = e.pointerType === "mouse" ? 0 : performance.now() + 2500;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") pointer.on = false;
    };

    const onTheme = new MutationObserver(() => {
      colors = readColors();
      ctx.clearRect(0, 0, w, h);
      if (reduced) drawStatic();
    });
    onTheme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(wrap);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    viewObserver.observe(wrap);

    resize();
    if (!reduced) {
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerdown", onMove);
      wrap.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(frame);
    } else {
      for (let i = 0; i < 160; i++) trace.push(0.1 + (i / 160) * 0.6);
      drawTrace();
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      onTheme.disconnect();
      sizeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [cloudX, traceCanvas]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full touch-pan-y" />
      <div ref={flashRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-accent opacity-0" />
    </div>
  );
}
