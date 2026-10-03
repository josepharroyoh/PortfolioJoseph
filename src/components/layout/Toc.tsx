import { motion, useScroll } from "framer-motion";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import type { SectionId } from "../../data/profile";
import { CubeBuddy } from "../brand/CubeBuddy";

const ITEMS = ["academic", "awards", "experience", "projects", "skills", "training", "volunteering"] as const;
const OWNER: Partial<Record<SectionId, (typeof ITEMS)[number]>> = {};

/** Table of contents pinned in the left margin on wide screens, like a long-form paper. */
export function Toc({ active }: { active: SectionId }) {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const current = OWNER[active] ?? active;

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
                className={clsx("block text-[0.9375rem] transition-colors duration-200", current === id ? "font-serif text-[1.05rem] text-ink italic" : "text-muted hover:text-ink")}
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* The cube, looking around on its own, signs off a short quote like an email signature. */}
      <figure className="mt-10 flex items-start gap-3 border-t border-line pt-6">
        <CubeBuddy size={40} className="mt-1" />
        <div>
          <blockquote className="font-serif text-[0.98rem] leading-snug text-ink/90 italic">“{t("quote.text")}”</blockquote>
          <figcaption className="mt-2 text-xs tracking-wide text-muted">{t("quote.author")}</figcaption>
        </div>
      </figure>
    </nav>
  );
}
