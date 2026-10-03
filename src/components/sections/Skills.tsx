import { useTranslation } from "react-i18next";
import { Section } from "../ui/Section";
import { SKILL_GROUPS } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

/** Every tool visible at once: scanning beats clicking through tabs. */
export function Skills() {
  const { t } = useTranslation();
  const groups = useCopy<string[]>("skills.groups");

  return (
    <Section id="skills" title={t("skills.title")} intro={t("skills.intro")}>
      <dl className="grid gap-px overflow-hidden border-y border-line-strong bg-line sm:grid-cols-2">
        {SKILL_GROUPS.map((skills, i) => (
          <div key={groups[i]} className="reveal bg-bg py-6 sm:px-5 sm:odd:pl-0">
            <dt className="label">{groups[i]}</dt>
            <dd className="mt-3 font-serif text-[1.2rem] leading-relaxed">
              {skills.map((skill, j) => (
                <span key={skill}>
                  <span className="whitespace-nowrap transition-colors duration-200 hover:text-accent">{skill}</span>
                  {j < skills.length - 1 && (
                    <span aria-hidden="true" className="px-1.5 text-faint">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
