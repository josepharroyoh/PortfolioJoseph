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
      <dl className="border-t border-line">
        {SKILL_GROUPS.map((skills, i) => (
          <div key={groups[i]} className="reveal grid gap-3 border-b border-line py-6 md:grid-cols-[12rem_1fr] md:gap-6">
            <dt className="font-medium">{groups[i]}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li key={skill} className="rounded-full bg-bg-2 px-3.5 py-1.5 text-[15px] transition-colors duration-200 hover:bg-accent-soft hover:text-accent">
                    {skill}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
