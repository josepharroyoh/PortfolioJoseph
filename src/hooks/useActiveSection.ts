import { useEffect, useState } from "react";
import { SECTIONS, SECTION_SHAPE, type SectionId } from "../data/profile";
import { sceneStore } from "../components/background/sceneStore";

/** Tracks the section crossing the middle of the viewport and steers the background. */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id as SectionId;
          setActive(id);
          sceneStore.shape = SECTION_SHAPE[id];
          sceneStore.hero = id === "home" ? 1 : 0;
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}
