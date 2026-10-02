import { useTranslation } from "react-i18next";
import { container } from "../ui/styles";
import { SKILL_GROUPS } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

type Item = { period: string; title: string; role: string; text: string };

/** Volunteering and tools share one quieter band near the end of the page. */
export function Community() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("community.items");
  const groups = useCopy<string[]>("skills.groups");

  return (
    <>
      <section id="community" aria-labelledby="community-title" className="border-t border-line py-24 md:py-32">
        <div className={`${container} grid gap-10 lg:grid-cols-12`}>
          <h2 id="community-title" className="reveal text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em] lg:col-span-4">
            {t("community.title")}
          </h2>
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
            {items.map((v) => (
              <li key={v.title} className="reveal">
                <p className="font-mono text-sm text-faint">{v.period}</p>
                <h3 className="mt-2 text-xl leading-snug font-semibold tracking-[-0.015em]">{v.title}</h3>
                <p className="mt-1 text-sm text-accent">{v.role}</p>
                <p className="mt-2 leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="skills" aria-labelledby="skills-title" className="border-t border-line py-24 md:py-32">
        <div className={`${container} grid gap-10 lg:grid-cols-12`}>
          <h2 id="skills-title" className="reveal text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em] lg:col-span-4">
            {t("skills.title")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
            {SKILL_GROUPS.map((skills, i) => (
              <div key={groups[i]} className="reveal">
                <h3 className="text-sm text-faint">{groups[i]}</h3>
                <p className="mt-3 text-lg leading-relaxed">{skills.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
