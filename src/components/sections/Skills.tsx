import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { SectionHeading } from "../ui/SectionHeading";
import { container } from "../ui/styles";
import { SKILL_GROUPS } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

export function Skills() {
  const { t } = useTranslation();
  const groups = useCopy<string[]>("skills.groups");
  const [tab, setTab] = useState(0);

  return (
    <section id="skills" aria-labelledby="skills-title" className="border-t border-line py-24 md:py-32">
      <div className={`${container} grid grid-cols-1 gap-10 lg:grid-cols-12`}>
        <div className="min-w-0 lg:col-span-4">
          <SectionHeading id="skills-title" title={t("skills.title")} intro={t("skills.intro")} />
        </div>
        <div className="min-w-0 lg:col-span-8">
          <LayoutGroup id="skills-tabs">
            <div role="tablist" aria-label={t("skills.title")} className="reveal -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:px-0">
              {groups.map((g, i) => (
                <button
                  key={g}
                  type="button"
                  role="tab"
                  id={`skills-tab-${i}`}
                  aria-selected={tab === i}
                  aria-controls="skills-panel"
                  onClick={() => setTab(i)}
                  className={clsx("press relative h-10 shrink-0 rounded-full px-4 text-[15px]", tab === i ? "text-bg" : "text-muted hover:text-ink")}
                >
                  {tab === i && <motion.span layoutId="skills-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", duration: 0.35, bounce: 0.15 }} />}
                  <span className="relative">{g}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <div id="skills-panel" role="tabpanel" aria-labelledby={`skills-tab-${tab}`} className="reveal mt-6 min-h-40 rounded-3xl border border-line bg-surface p-6 md:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={tab}
                className="flex flex-wrap gap-2.5"
                initial="out"
                animate="in"
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                variants={{ in: { transition: { staggerChildren: 0.035 } } }}
              >
                {SKILL_GROUPS[tab].map((skill) => (
                  <motion.li
                    key={skill}
                    variants={{
                      out: { opacity: 0, transform: "translateY(8px) scale(0.97)" },
                      in: { opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } },
                    }}
                    className="rounded-full border border-line bg-bg px-4 py-2 text-[16px] font-medium"
                  >
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
