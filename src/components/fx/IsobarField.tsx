import { useEffect, useRef } from "react";

type System = { x: number; y: number; ax: number; ay: number; fx: number; fy: number; phase: number; amp: number; sigma: number };

/**
 * A weather-map background: isobars drawn with marching squares over a few
 * drifting pressure systems. The cursor is a low that the lines bend around.
 * Alta / baja centres are marked "A" and "B", as on a Spanish weather chart.
 */
export function IsobarField({
  className,
  levels = 13,
  accentLevel = true,
  letters = true,
}: {
  className?: string;
  levels?: number;
  accentLevel?: boolean;
  /** Mark pressure centres with "A" / "B" (kept to the right side, clear of the title). */
  letters?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const systems: System[] = [
      { x: 0.78, y: 0.32, ax: 0.08, ay: 0.06, fx: 0.00011, fy: 0.00014, phase: 0, amp: 1, sigma: 0.24 },
      { x: 0.3, y: 0.7, ax: 0.1, ay: 0.05, fx: 0.00009, fy: 0.00012, phase: 2, amp: -0.9, sigma: 0.22 },
      { x: 0.55, y: 0.1, ax: 0.12, ay: 0.05, fx: 0.00007, fy: 0.0001, phase: 4, amp: 0.6, sigma: 0.18 },
      { x: 0.1, y: 0.25, ax: 0.06, ay: 0.08, fx: 0.00013, fy: 0.00008, phase: 1, amp: -0.5, sigma: 0.16 },
    ];
    const cursor = { x: -9, y: -9, tx: -9, ty: -9, s: 0, ts: 0 };
    let w = 0;
    let h = 0;
    let cell = coarse ? 22 : 16;
    let cols = 0;
    let rows = 0;
    let grid = new Float32Array(0);
    let raf = 0;
    let last = 0;
    let visible = true;
    const colors = { ink: "#000", accent: "#9b1c2e", text: "#888" };

    const readColors = () => {
      const cs = getComputedStyle(canvas);
      colors.ink = cs.getPropertyValue("--ink").trim() || colors.ink;
      colors.accent = cs.getPropertyValue("--accent").trim() || colors.accent;
      colors.text = cs.getPropertyValue("--faint").trim() || colors.text;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cell = w < 640 ? 20 : coarse ? 22 : 16;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      grid = new Float32Array(cols * rows);
    };

    const centres = (t: number) =>
      systems.map((s) => ({
        x: (s.x + Math.sin(t * s.fx + s.phase) * s.ax) * w,
        y: (s.y + Math.cos(t * s.fy + s.phase) * s.ay) * h,
        amp: s.amp,
        sig: s.sigma * Math.max(w, h),
      }));

    const field = (t: number) => {
      const cs = centres(t);
      const cSig = Math.max(w, h) * 0.09;
      for (let j = 0; j < rows; j++) {
        const y = j * cell;
        for (let i = 0; i < cols; i++) {
          const x = i * cell;
          let v = Math.sin(x / (w * 0.6) + t * 0.00005) * 0.18 + Math.cos(y / (h * 0.8) - t * 0.00004) * 0.12;
          for (const c of cs) {
            const dx = x - c.x;
            const dy = y - c.y;
            v += c.amp * Math.exp(-(dx * dx + dy * dy) / (2 * c.sig * c.sig));
          }
          if (cursor.s > 0.01) {
            const dx = x - cursor.x;
            const dy = y - cursor.y;
            v -= 1.1 * cursor.s * Math.exp(-(dx * dx + dy * dy) / (2 * cSig * cSig));
          }
          grid[j * cols + i] = v;
        }
      }
      return cs;
    };

    // Marching squares: one path per level, linear interpolation along cell edges.
    const contour = (level: number) => {
      ctx.beginPath();
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const a = grid[j * cols + i];
          const b = grid[j * cols + i + 1];
          const c = grid[(j + 1) * cols + i + 1];
          const d = grid[(j + 1) * cols + i];
          let idx = 0;
          if (a > level) idx |= 8;
          if (b > level) idx |= 4;
          if (c > level) idx |= 2;
          if (d > level) idx |= 1;
          if (idx === 0 || idx === 15) continue;
          const x = i * cell;
          const y = j * cell;
          const top = () => [x + ((level - a) / (b - a)) * cell, y];
          const right = () => [x + cell, y + ((level - b) / (c - b)) * cell];
          const bottom = () => [x + ((level - d) / (c - d)) * cell, y + cell];
          const left = () => [x, y + ((level - a) / (d - a)) * cell];
          const seg = (p: number[], q: number[]) => {
            ctx.moveTo(p[0], p[1]);
            ctx.lineTo(q[0], q[1]);
          };
          switch (idx) {
            case 1: case 14: seg(left(), bottom()); break;
            case 2: case 13: seg(bottom(), right()); break;
            case 3: case 12: seg(left(), right()); break;
            case 4: case 11: seg(top(), right()); break;
            case 6: case 9: seg(top(), bottom()); break;
            case 7: case 8: seg(left(), top()); break;
            case 5: seg(left(), top()); seg(bottom(), right()); break;
            case 10: seg(top(), right()); seg(left(), bottom()); break;
          }
        }
      }
      ctx.stroke();
    };

    const draw = (t: number) => {
      cursor.x += (cursor.tx - cursor.x) * 0.12;
      cursor.y += (cursor.ty - cursor.y) * 0.12;
      cursor.s += (cursor.ts - cursor.s) * 0.06;
      const cs = field(t);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      ctx.strokeStyle = colors.ink;
      for (let k = 0; k < levels; k++) {
        const level = -1.1 + (k / (levels - 1)) * 2.2;
        const strong = accentLevel && k === Math.floor(levels * 0.72);
        const fade = w < 640 ? 0.7 : 1; // lighter behind the text column on phones
        ctx.globalAlpha = (strong ? 0.6 : k % 4 === 0 ? 0.28 : 0.15) * fade;
        ctx.strokeStyle = strong ? colors.accent : colors.ink;
        contour(level);
      }
      // Pressure-centre letters.
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = colors.text;
      ctx.font = "italic 20px 'Newsreader Variable', Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const showLetters = letters && w >= 768;
      for (const c of showLetters ? cs : []) {
        if (c.x < w * 0.62 || c.x > w - 20 || c.y < 90 || c.y > h - 20) continue;
        ctx.fillText(c.amp > 0 ? "A" : "B", c.x, c.y);
      }
      if (showLetters && cursor.s > 0.3) {
        ctx.globalAlpha = Math.min(0.7, cursor.s * 0.7);
        ctx.fillStyle = colors.accent;
        ctx.fillText("B", cursor.x, cursor.y);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30 fps is plenty for drifting weather
      last = now;
      draw(now);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (visible && !reduced && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (cursor.tx < -8) {
        cursor.x = e.clientX - r.left;
        cursor.y = e.clientY - r.top;
      }
      cursor.tx = e.clientX - r.left;
      cursor.ty = e.clientY - r.top;
      cursor.ts = inside ? 1 : 0;
    };
    const onLeave = () => (cursor.ts = 0);

    resize();
    readColors();
    draw(performance.now());

    const ro = new ResizeObserver(() => (resize(), draw(performance.now())));
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => ((visible = e.isIntersecting), start()));
    io.observe(canvas);
    const mo = new MutationObserver(() => (readColors(), draw(performance.now())));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [levels, accentLevel, letters]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
