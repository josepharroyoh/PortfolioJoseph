import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import type { SectionId } from "../../data/profile";
import { sectionShape } from "../fx/universe-shapes";
import type { ShapeKey } from "../fx/universe-shapes";
import { useCopy } from "../../hooks/useCopy";

const ITEMS = ["academic", "awards", "experience", "projects", "skills", "training", "volunteering"] as const;
const OWNER: Partial<Record<SectionId, (typeof ITEMS)[number]>> = {};

/** Table of contents pinned in the left margin on wide screens, like a long-form paper. */
export function Toc({ active }: { active: SectionId }) {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const current = OWNER[active] ?? active;
  const shapes = useCopy<Record<ShapeKey, string>>("universe.shapes");
  const shape = sectionShape(active);

  return (
    <nav aria-label={t("nav.toc")} className="sticky top-28 hidden xl:block">
      <p className="label">{t("nav.toc")}</p>
      <div className="relative mt-4 pl-4">
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-line" />
        <motion.div aria-hidden="true" style={{ scaleY: scrollYProgress }} className="absolute top-0 bottom-0 left-0 w-px origin-top bg-accent" />
        <ol className="space-y-2.5">
          {ITEMS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={current === id ? "true" : undefined}
                className={clsx("block text-[15px] transition-colors duration-200", current === id ? "font-serif text-[1.05rem] text-ink italic" : "text-muted hover:text-ink")}
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ol>
      </div>
      {/* Names the figure the background particles are drawing right now. */}
      <div className="mt-10 border-t border-line pt-4">
        <p className="label">{t("universe.label")}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={shape}
            initial={{ opacity: 0, transform: "translateY(6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-6px)" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="mt-1.5 font-serif text-[15px] leading-snug text-muted italic"
          >
            {shapes[shape]}
          </motion.p>
        </AnimatePresence>
      </div>
    </nav>
  );
}
