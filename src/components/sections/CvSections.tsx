import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { Section } from "../ui/Section";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

export type Entry = { date: string; place?: string; title: string; org?: string; text?: string; tags?: string[]; link?: string };

/** One CV row: dates (and place) in the margin, title, institution and detail; a hairline accent draws on hover. */
export function EntryRow({ entry, size = "md", href }: { entry: Entry; size?: "md" | "lg"; href?: string }) {
  return (
    <li className="reveal group relative grid gap-1 border-b border-line py-6 transition-colors duration-300 hover:bg-surface/60 md:grid-cols-[10rem_1fr] md:gap-8">
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-[2px] origin-top scale-y-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-y-100" />
      <div className="text-sm text-muted tabular-nums transition-transform duration-300 ease-out group-hover:translate-x-3 md:pt-1">
        <p>{entry.date}</p>
        {entry.place && <p className="text-faint">{entry.place}</p>}
      </div>
      <div className="transition-transform duration-300 ease-out group-hover:translate-x-3">
        <h3 className={clsx("font-serif leading-snug transition-colors duration-200 group-hover:text-accent", size === "lg" ? "text-[clamp(1.45rem,2.4vw,1.9rem)]" : "text-[1.3rem]")}>
          {entry.title}
        </h3>
        {entry.org && <p className="mt-0.5 text-[15px] text-muted italic">{entry.org}</p>}
        {entry.text && <p className="mt-2 max-w-[68ch] text-[15px] leading-relaxed">{entry.text}</p>}
        {(entry.tags?.length || (entry.link && href)) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {entry.tags?.map((tag) => (
              <span key={tag} className="rounded-full border border-accent/40 bg-accent-soft px-2.5 py-0.5 text-[13px] text-accent">
                {tag}
              </span>
            ))}
            {entry.link && href && (
              <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 text-sm text-accent">
                {entry.link}
                <ArrowUpRightIcon size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export function Education() {
  const { t } = useTranslation();
  const items = useCopy<Entry[]>("education.items");
  return (
    <Section id="education" title={t("education.title")} intro={t("education.intro")}>
      <ol className="border-t border-line-strong">
        {items.map((e) => (
          <EntryRow key={e.title} entry={e} size="lg" />
        ))}
      </ol>
    </Section>
  );
}

export function Awards() {
  const { t } = useTranslation();
  const items = useCopy<Entry[]>("awards.items");
  return (
    <Section id="awards" title={t("awards.title")} intro={t("awards.intro")}>
      <ol className="border-t border-line-strong">
        {items.map((e) => (
          <EntryRow key={e.title} entry={e} />
        ))}
      </ol>
    </Section>
  );
}

export function Experience() {
  const { t } = useTranslation();
  const research = useCopy<Entry[]>("experience.research");
  const work = useCopy<Entry[]>("experience.work");
  return (
    <Section id="experience" title={t("experience.title")} intro={t("experience.intro")}>
      <h3 className="label reveal">{t("experience.researchTitle")}</h3>
      <ol className="mt-3 border-t border-line-strong">
        {research.map((e) => (
          <EntryRow key={e.title} entry={e} href={PROFILE.links.aireica} />
        ))}
      </ol>
      <h3 className="label reveal mt-14">{t("experience.workTitle")}</h3>
      <ol className="mt-3 border-t border-line-strong">
        {work.map((e) => (
          <EntryRow key={e.title} entry={e} />
        ))}
      </ol>
    </Section>
  );
}

type Congress = { date: string; title: string; place: string; topic: string };

export function Talks() {
  const { t } = useTranslation();
  const items = useCopy<Congress[]>("research.congresses");
  return (
    <Section id="talks" title={t("talks.title")} intro={t("talks.intro")}>
      <ol className="border-t border-line-strong">
        {items.map((c, i) => (
          <EntryRow key={`${c.title}-${i}`} entry={{ date: c.date, place: c.place, title: c.topic, org: c.title }} />
        ))}
      </ol>
    </Section>
  );
}

export function Training() {
  const { t } = useTranslation();
  const items = useCopy<Entry[]>("training.items");
  return (
    <Section id="training" title={t("training.title")} intro={t("training.intro")}>
      <ol className="border-t border-line-strong">
        {items.map((e) => (
          <EntryRow key={e.title} entry={e} />
        ))}
      </ol>
    </Section>
  );
}

type Language = { name: string; level: string; value: number };
type Network = { date: string; title: string; text: string };

export function More() {
  const { t } = useTranslation();
  const languages = useCopy<Language[]>("more.languages");
  const networks = useCopy<Network[]>("more.networks");
  const volunteering = useCopy<Entry[]>("more.volunteering");
  return (
    <Section id="more" title={t("more.title")}>
      <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2">
        <div className="reveal bg-bg p-6">
          <h3 className="label">{t("more.languagesTitle")}</h3>
          <ul className="mt-4 space-y-4">
            {languages.map((l) => (
              <li key={l.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-[1.2rem]">{l.name}</span>
                  <span className="text-sm text-muted">{l.level}</span>
                </div>
                {/* Proficiency drawn as a thin bar that fills when it scrolls in. */}
                <div className="mt-2 h-px w-full bg-line">
                  <div className="rule-draw h-px bg-accent" style={{ width: `${l.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal bg-bg p-6">
          <h3 className="label">{t("more.networksTitle")}</h3>
          <ul className="mt-4 space-y-4">
            {networks.map((n) => (
              <li key={n.title}>
                <p className="text-sm text-muted">{n.date}</p>
                <p className="font-serif text-[1.2rem]">{n.title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{n.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="label reveal mt-14">{t("more.volunteeringTitle")}</h3>
      <ol className="mt-3 border-t border-line-strong">
        {volunteering.map((e) => (
          <EntryRow key={e.title} entry={e} />
        ))}
      </ol>
    </Section>
  );
}
