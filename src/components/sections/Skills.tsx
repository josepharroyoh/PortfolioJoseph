import { useTranslation } from "react-i18next";
import { SectionHeader } from "../ui/SectionHeader";
import { Marquee } from "../ui/Marquee";
import { Reveal } from "../ui/motion";
import { SKILL_GROUPS } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

export function Skills() {
  const { t } = useTranslation();
  const groups = useCopy<string[]>("skills.groups");
  const all = SKILL_GROUPS.flat();
  const half = Math.ceil(all.length / 2);

  return (
    <section id="skills" className="relative z-10 py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader eyebrow={t("skills.eyebrow")} title={t("skills.title")} />
      </div>

      <div className="mt-16 space-y-4 md:mt-20">
        {[all.slice(0, half), all.slice(half)].map((row, r) => (
          <Marquee key={r} reverse={r === 1} duration={r === 1 ? 46 : 38}>
            {row.map((skill, i) => (
              <span key={skill} className="flex items-center gap-4">
                <span
                  className={
                    i % 2 === 0
                      ? "font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none whitespace-nowrap text-paper"
                      : "font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none whitespace-nowrap text-transparent italic [-webkit-text-stroke:1px_rgba(236,237,241,0.45)]"
                  }
                >
                  {skill}
                </span>
                <span className="text-xl text-cyan/70" aria-hidden="true">✦</span>
              </span>
            ))}
          </Marquee>
        ))}
      </div>

      <div className="mx-auto mt-20 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {SKILL_GROUPS.map((items, g) => (
          <Reveal key={g} delay={g * 0.08} className="glass rounded-3xl p-6">
            <h3 className="font-mono text-[11px] tracking-[0.18em] text-cyan uppercase">{groups[g]}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {items.map((skill) => (
                <li key={skill} className="rounded-full bg-white/[0.05] px-3 py-1.5 text-sm text-paper/90 ring-1 ring-line">
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
