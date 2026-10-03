import { useEffect, useRef } from "react";
import clsx from "clsx";

type Props = { text: string; className?: string; radius?: number; min?: number; max?: number };

/**
 * Letters thicken as the pointer approaches them (variable font weight).
 * Decorative: weights ease towards their target each frame, and the effect
 * is off for touch, coarse pointers and reduced motion.
 */
export function ProximityText({ text, className, radius = 220, min = 560, max = 860 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-letter]"));
    const weights = letters.map(() => min);
    const pointer = { x: -9999, y: -9999 };
    // Centres in page coordinates, so scrolling never needs a re-measure.
    let centers: { x: number; y: number }[] = [];
    let raf = 0;
    let settled = true;

    const measure = () => {
      centers = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + window.scrollX + r.width / 2, y: r.top + window.scrollY + r.height / 2 };
      });
    };

    const step = () => {
      settled = true;
      letters.forEach((el, i) => {
        const c = centers[i];
        const d = c ? Math.hypot(pointer.x - c.x, pointer.y - c.y) : Infinity;
        const target = min + (max - min) * Math.max(0, 1 - d / radius) ** 2;
        weights[i] += (target - weights[i]) * 0.18;
        if (Math.abs(target - weights[i]) > 0.5) settled = false;
        el.style.fontVariationSettings = `"wght" ${weights[i].toFixed(0)}`;
      });
      raf = settled ? 0 : requestAnimationFrame(step);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.pageX;
      pointer.y = e.pageY;
      kick();
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
      kick();
    };
    measure();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", measure);
    const fonts = document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
      void fonts;
    };
  }, [text, radius, min, max]);

  const words = text.split(" ");
  return (
    <span ref={ref} className={clsx("inline-block", className)} aria-label={text}>
      {words.map((word, w) => (
        // Words never break inside; each letter still animates on its own.
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, i) => (
            <span key={i} data-letter className="inline-block" style={{ fontVariationSettings: `"wght" ${min}` }}>
              {ch}
            </span>
          ))}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
