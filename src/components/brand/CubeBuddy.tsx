import { useEffect, useRef } from "react";

const GAZE = [
  { x: 0, y: 0 }, { x: 3, y: 0 }, { x: -3, y: 0 }, { x: 0, y: -2 },
  { x: 3, y: -1 }, { x: -3, y: -1 }, { x: 0, y: 2 },
];

/** The little black cube that blinks and looks around. */
export function CubeBuddy({ size = 32 }: { size?: number }) {
  const leftEye = useRef<HTMLSpanElement>(null);
  const rightEye = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gaze = { x: 0, y: 0 };
    let scaleY = 1;
    const apply = () => {
      const transform = `translate(${gaze.x}px, ${gaze.y}px) scaleY(${scaleY})`;
      if (leftEye.current) leftEye.current.style.transform = transform;
      if (rightEye.current) rightEye.current.style.transform = transform;
    };

    let blinkTimer = 0;
    let openTimer = 0;
    const blink = () => {
      blinkTimer = window.setTimeout(() => {
        scaleY = 0.15;
        apply();
        openTimer = window.setTimeout(() => {
          scaleY = 1;
          apply();
          blink();
        }, 120);
      }, 1800 + Math.random() * 2200);
    };

    let lookTimer = 0;
    const look = () => {
      Object.assign(gaze, GAZE[Math.floor(Math.random() * GAZE.length)]);
      apply();
      lookTimer = window.setTimeout(look, 1000 + Math.random() * 2000);
    };

    blink();
    look();
    return () => {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(openTimer);
      window.clearTimeout(lookTimer);
    };
  }, []);

  const unit = size / 32;
  const eye = "absolute rounded-[1px] bg-white transition-transform duration-100 ease-out";
  return (
    <span
      aria-hidden="true"
      className="relative block shrink-0 rounded-[3px] bg-[#0b0c0e] ring-1 ring-white/10"
      style={{ width: size, height: size }}
    >
      <span ref={leftEye} className={eye} style={{ width: 4 * unit, height: 4 * unit, left: 7 * unit, top: 8 * unit }} />
      <span ref={rightEye} className={eye} style={{ width: 4 * unit, height: 4 * unit, left: 17 * unit, top: 8 * unit }} />
    </span>
  );
}
