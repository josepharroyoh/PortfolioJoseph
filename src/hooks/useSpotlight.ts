import type { PointerEvent } from "react";

/** Tracks the cursor in CSS variables so `.spotlight` can draw its glow. */
export function useSpotlight<T extends HTMLElement>() {
  return {
    onPointerMove: (e: PointerEvent<T>) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
  };
}
