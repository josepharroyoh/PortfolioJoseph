import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const GAZE = [
  { x: 0, y: 0 }, { x: 3, y: 0 }, { x: -3, y: 0 }, { x: 0, y: -2 },
  { x: 3, y: -1 }, { x: -3, y: -1 }, { x: 0, y: 2 },
];

type Props = {
  size?: number;
  /** Eyes follow the mouse (fine pointers); otherwise they look around on their own. */
  follow?: boolean;
  /** Bump this number to make the cube jump with wide eyes (a lightning strike, a sent form). */
  startle?: number;
  /** Element to stare at while it has focus, e.g. the contact form. */
  watch?: RefObject<HTMLElement | null>;
  className?: string;
};

/** The little black cube that blinks, looks around and follows your cursor. */
export function CubeBuddy({ size = 32, follow = false, startle = 0, watch, className }: Props) {
  const bodyRef = useRef<HTMLSpanElement>(null);
  const leftEye = useRef<HTMLSpanElement>(null);
  const rightEye = useRef<HTMLSpanElement>(null);
  const state = useRef({ gx: 0, gy: 0, scaleY: 1, wide: 1 });

  const apply = () => {
    const { gx, gy, scaleY, wide } = state.current;
    const transform = `translate(${gx}px, ${gy}px) scale(${wide}, ${scaleY * wide})`;
    if (leftEye.current) leftEye.current.style.transform = transform;
    if (rightEye.current) rightEye.current.style.transform = transform;
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const unit = size / 32;
    const s = state.current;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const tracking = follow && fine;

    let blinkTimer = 0;
    let openTimer = 0;
    const blink = () => {
      blinkTimer = window.setTimeout(() => {
        s.scaleY = 0.12;
        apply();
        openTimer = window.setTimeout(() => {
          s.scaleY = 1;
          apply();
          blink();
        }, 110);
      }, 1800 + Math.random() * 2600);
    };

    // Look towards a point on screen, eyes clamped to the face.
    const lookAt = (x: number, y: number) => {
      const r = bodyRef.current?.getBoundingClientRect();
      if (!r) return;
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 220);
      s.gx = (dx / d) * reach * 3.4 * unit;
      s.gy = (dy / d) * reach * 2.6 * unit;
      apply();
    };

    let lookTimer = 0;
    const wander = () => {
      const g = GAZE[Math.floor(Math.random() * GAZE.length)];
      s.gx = g.x * unit;
      s.gy = g.y * unit;
      apply();
      lookTimer = window.setTimeout(wander, 1000 + Math.random() * 2000);
    };

    const onMove = (e: PointerEvent) => {
      const target = watch?.current;
      if (target && target.contains(document.activeElement)) return;
      lookAt(e.clientX, e.clientY);
    };
    const onFocus = () => {
      const el = document.activeElement as HTMLElement | null;
      const target = watch?.current;
      if (!el || !target?.contains(el)) return;
      const r = el.getBoundingClientRect();
      lookAt(r.left + Math.min(r.width, 40), r.top + r.height / 2);
    };

    blink();
    if (tracking) window.addEventListener("pointermove", onMove, { passive: true });
    else wander();
    if (watch) {
      document.addEventListener("focusin", onFocus);
      document.addEventListener("input", onFocus);
    }
    return () => {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(openTimer);
      window.clearTimeout(lookTimer);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("input", onFocus);
    };
  }, [follow, size, watch]);

  // Startle: a quick hop and wide eyes.
  useEffect(() => {
    if (!startle || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const body = bodyRef.current;
    state.current.wide = 1.45;
    apply();
    body?.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(-28%)", offset: 0.35 }, { transform: "translateY(0)" }],
      { duration: 520, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
    );
    const id = window.setTimeout(() => {
      state.current.wide = 1;
      apply();
    }, 700);
    return () => window.clearTimeout(id);
  }, [startle]);

  const unit = size / 32;
  const eye = "absolute rounded-[1px] bg-white transition-transform duration-150 ease-out";
  return (
    <span
      ref={bodyRef}
      aria-hidden="true"
      className={`relative block shrink-0 rounded-[3px] bg-[#0b0c0e] ring-1 ring-white/20 ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <span ref={leftEye} className={eye} style={{ width: 4 * unit, height: 4 * unit, left: 7 * unit, top: 8 * unit }} />
      <span ref={rightEye} className={eye} style={{ width: 4 * unit, height: 4 * unit, left: 17 * unit, top: 8 * unit }} />
    </span>
  );
}
