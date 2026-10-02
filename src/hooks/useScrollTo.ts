import { useLenis } from "lenis/react";
import { useCallback } from "react";

/** Smoothly scrolls to a section id (or the top for "home"). */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (id: string) => {
      const target = id === "home" ? 0 : document.getElementById(id);
      if (target === null) return;
      if (lenis) {
        lenis.scrollTo(target, { offset: id === "home" ? 0 : -24, duration: 1.4 });
      } else if (target === 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis],
  );
}
