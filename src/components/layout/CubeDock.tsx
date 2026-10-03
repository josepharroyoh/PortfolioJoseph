import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CubeBuddy } from "../brand/CubeBuddy";

/**
 * On screens without the side index, the cube waits in the corner once you scroll: a small "back to top" button in the corner
 * whose eyes follow your cursor. It steps aside at the footer so the page ends clean.
 */
export function CubeDock({ hidden }: { hidden?: boolean }) {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);
  // Shown once you scroll, and stepping aside when the footer comes into view.
  useMotionValueEvent(scrollY, "change", (y) => {
    const footer = document.getElementById("site-footer");
    const atFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    setShown(y > 640 && !atFooter);
  });

  return (
    <AnimatePresence>
      {shown && !hidden && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={t("footer.top")}
          initial={{ opacity: 0, transform: "translateY(16px) scale(0.9)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={{ opacity: 0, transform: "translateY(16px) scale(0.9)", transition: { duration: 0.15 } }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="group no-print fixed right-4 bottom-4 z-[65] flex items-center gap-3 md:right-6 md:bottom-6 xl:hidden"
        >
          <span className="pointer-events-none translate-x-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] whitespace-nowrap opacity-0 shadow-card transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
            {t("footer.top")}
          </span>
          <span className="press block rounded-[4px] shadow-card group-active:scale-95">
            <CubeBuddy size={46} />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
