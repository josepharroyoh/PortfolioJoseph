import { useEffect, useRef } from "react";

export type SignalState = { field: number; state: "calm" | "charging" | "alert" | "strike" };

const SAMPLES = 420;
const THRESHOLD = -0.62;

/**
 * A strip-chart of the surface electric field, the kind an EFM records.
 * The pointer acts as a storm cloud: the closer it is, the more the field
 * swings negative, until a discharge snaps it back. Illustrative, not data.
 */
export function SignalTrace({ onTick, threshold, className }: { onTick?: (s: SignalState) => void; threshold: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef(onTick);
  const labelRef = useRef(threshold);
  useEffect(() => {
    tickRef.current = onTick;
    labelRef.current = threshold;
  });

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const buf = new Float32Array(SAMPLES);
    const strikes: number[] = []; // sample counters at which a discharge happened
    let count = 260;
    let charge = 0.2;
    let drift = 0;
    let proximity = 0;
    let touchUntil = 0;
    let strikeFlash = 0;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const colors = { accent: "#c2410c", line: "rgba(0,0,0,.1)", faint: "#888", ink: "#111" };

    const readColors = () => {
      const cs = getComputedStyle(canvas);
      colors.accent = cs.getPropertyValue("--accent").trim() || colors.accent;
      colors.line = cs.getPropertyValue("--line-strong").trim() || colors.line;
      colors.faint = cs.getPropertyValue("--faint").trim() || colors.faint;
      colors.ink = cs.getPropertyValue("--ink").trim() || colors.ink;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const step = () => {
      count++;
      const touching = performance.now() < touchUntil ? 1 : 0;
      // Storms come and go on their own every ~20 s; the pointer (or a tap) brings one in now.
      const storm = 0.8 * Math.pow(Math.max(0, Math.sin(count / 380)), 2);
      const target = 0.15 + Math.max(storm, 0.85 * Math.max(proximity, touching));
      charge += (target - charge) * 0.014;
      drift = drift * 0.92 + (Math.random() - 0.5) * 0.05;
      let v = 0.12 - charge * 0.95 + drift + Math.sin(count / 23) * 0.02 * (0.4 + charge);
      // Discharges become likely once the field is deep past the threshold.
      if (v < THRESHOLD - 0.05 && Math.random() < 0.012 + (THRESHOLD - v) * 0.05) {
        charge *= 0.25;
        v = 0.35 + Math.random() * 0.2;
        strikes.push(count);
        strikeFlash = 1;
      }
      buf[count % SAMPLES] = v;
      while (strikes.length && count - strikes[0] > SAMPLES) strikes.shift();
      return v;
    };

    const yOf = (v: number) => h * 0.42 - v * h * 0.48;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const dx = w / (SAMPLES - 1);

      // Zero line and alert threshold.
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.line;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(0, Math.round(yOf(0)) + 0.5);
      ctx.lineTo(w, Math.round(yOf(0)) + 0.5);
      ctx.stroke();
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(0, Math.round(yOf(THRESHOLD)) + 0.5);
      ctx.lineTo(w, Math.round(yOf(THRESHOLD)) + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = colors.faint;
      ctx.font = "11px Geist, system-ui, sans-serif";
      // Labels sit on the right, clear of the cube in the bottom-left corner.
      ctx.textAlign = "right";
      ctx.fillText("0 kV/m", w - 20, yOf(0) - 6);
      ctx.fillText(labelRef.current, w - 20, yOf(THRESHOLD) - 6);
      ctx.textAlign = "left";

      // Discharge markers travel left with the record.
      ctx.strokeStyle = colors.accent;
      for (const s of strikes) {
        const x = w - (count - s) * dx;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, 4);
        ctx.lineTo(x, h - 4);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // The record itself, oldest sample on the left.
      ctx.lineWidth = 1.75;
      ctx.lineJoin = "round";
      ctx.strokeStyle = colors.ink;
      ctx.beginPath();
      for (let i = 0; i < SAMPLES; i++) {
        const v = buf[(count + 1 + i) % SAMPLES];
        const x = i * dx;
        const y = yOf(v);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Live head.
      const last = buf[count % SAMPLES];
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(w - 3, yOf(last), 3.5 + strikeFlash * 4, 0, Math.PI * 2);
      ctx.fill();
      strikeFlash *= 0.9;
    };

    const report = (v: number) => {
      const fresh = strikes.length > 0 && count - strikes[strikes.length - 1] < 40;
      const state = fresh ? "strike" : v < THRESHOLD ? "alert" : v < -0.3 ? "charging" : "calm";
      tickRef.current?.({ field: v * 8, state });
    };

    const loop = () => {
      let v = 0;
      for (let i = 0; i < 2; i++) v = step();
      draw();
      if (count % 8 === 0) report(v);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (visible && !reduced && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      const dy = e.clientY < r.top ? r.top - e.clientY : e.clientY > r.bottom ? e.clientY - r.bottom : 0;
      proximity = Math.max(0, 1 - dy / 260);
    };
    const onTouch = () => (touchUntil = performance.now() + 3500);

    resize();
    readColors();
    for (let i = 0; i < SAMPLES; i++) step();
    draw();
    report(buf[count % SAMPLES]);

    const ro = new ResizeObserver(() => (resize(), draw()));
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => ((visible = e.isIntersecting), start()));
    io.observe(canvas);
    const mo = new MutationObserver(() => (readColors(), draw()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    canvas.addEventListener("pointerdown", onTouch);
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onTouch);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
