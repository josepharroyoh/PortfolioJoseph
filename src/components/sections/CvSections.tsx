import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { Section } from "../ui/Section";
import { Tabs } from "../ui/Tabs";
import { Tilt } from "../fx/Interactions";
import { Reference } from "./Research";
import type { Publication } from "./Research";
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

type Congress = { date: string; title: string; place: string; topic: string };

/** Panel that fades and rises in each time its tab changes. */
function Panel({ id, tab, children }: { id: string; tab: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={tab}
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${tab}`}
        initial={{ opacity: 0, transform: "translateY(10px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        exit={{ opacity: 0, transform: "translateY(-6px)", transition: { duration: 0.15 } }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className="mt-8"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Education, publications and conferences together, switched with tabs. */
export function Academic() {
  const { t } = useTranslation();
  const education = useCopy<Entry[]>("education.items");
  const pubs = useCopy<Publication[]>("research.publications");
  const talks = useCopy<Congress[]>("research.congresses");
  const [tab, setTab] = useState("education");
  const tabs = [
    { id: "education", label: t("academic.tabs.education"), count: education.length },
    { id: "publications", label: t("academic.tabs.publications"), count: pubs.length },
    { id: "talks", label: t("academic.tabs.talks"), count: talks.length },
  ];

  return (
    <Section id="academic" title={t("academic.title")} intro={t("academic.intro")}>
      <Tabs tabs={tabs} value={tab} onChange={setTab} idPrefix="academic" label={t("academic.title")} />
      <Panel id="academic" tab={tab}>
        {tab === "education" && (
          <ol className="border-t border-line-strong">
            {education.map((e) => (
              <EntryRow key={e.title} entry={e} size="lg" />
            ))}
          </ol>
        )}
        {tab === "publications" && (
          <ol className="divide-y divide-line border-t border-line-strong">
            {pubs.map((pub, i) => (
              <Reference key={pub.title} pub={pub} featured={i === 0} />
            ))}
          </ol>
        )}
        {tab === "talks" && (
          <ol className="border-t border-line-strong">
            {talks.map((c, i) => (
              <EntryRow key={`${c.title}-${i}`} entry={{ date: c.date, place: c.place, title: c.topic, org: c.title }} />
            ))}
          </ol>
        )}
      </Panel>
      <a href={PROFILE.links.orcid} target="_blank" rel="noopener noreferrer" className="link-underline mt-8 inline-flex items-center gap-1 text-sm text-accent">
        ORCID 0000-0002-1355-5182
        <ArrowUpRightIcon size={13} />
      </a>
    </Section>
  );
}

/** Awards as cards: year badge, title, institution; the card lifts and its edge lights on hover. */
export function Awards() {
  const { t } = useTranslation();
  const items = useCopy<Entry[]>("awards.items");
  return (
    <Section id="awards" title={t("awards.title")} intro={t("awards.intro")}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((e, i) => (
          <li key={e.title} className={clsx("reveal", i < 2 && "sm:col-span-1")}>
            <Tilt max={3} className="h-full rounded-xl">
              <article className="group relative h-full overflow-hidden rounded-xl border border-line bg-surface/80 p-6 backdrop-blur transition-[border-color,box-shadow] duration-300 hover:border-accent/60 hover:shadow-card">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="inline-flex rounded-full border border-accent/40 bg-accent-soft px-2.5 py-0.5 text-[13px] text-accent tabular-nums">{e.date}</span>
                <h3 className="mt-4 font-serif text-[1.35rem] leading-snug">{e.title}</h3>
                {e.org && <p className="mt-1 text-[15px] text-muted italic">{e.org}</p>}
                {e.text && <p className="mt-3 text-[15px] leading-relaxed">{e.text}</p>}
              </article>
            </Tilt>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Experience() {
  const { t } = useTranslation();
  const research = useCopy<Entry[]>("experience.research");
  const work = useCopy<Entry[]>("experience.work");
  const [tab, setTab] = useState("research");
  const tabs = [
    { id: "research", label: t("experience.tabs.research"), count: research.length },
    { id: "work", label: t("experience.tabs.work"), count: work.length },
  ];
  return (
    <Section id="experience" title={t("experience.title")} intro={t("experience.intro")}>
      <Tabs tabs={tabs} value={tab} onChange={setTab} idPrefix="experience" label={t("experience.title")} />
      <Panel id="experience" tab={tab}>
        <ol className="border-t border-line-strong">
          {(tab === "research" ? research : work).map((e) => (
            <EntryRow key={e.title} entry={e} size="lg" href={tab === "research" ? PROFILE.links.aireica : undefined} />
          ))}
        </ol>
      </Panel>
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

/** Volunteering, with languages and networks as margin notes. */
export function Volunteering() {
  const { t } = useTranslation();
  const languages = useCopy<Language[]>("more.languages");
  const networks = useCopy<Network[]>("more.networks");
  const volunteering = useCopy<Entry[]>("more.volunteering");
  return (
    <Section
      id="volunteering"
      title={t("more.volunteeringTitle")}
      intro={t("more.intro")}
      aside={
        <div className="space-y-8">
          <div className="reveal">
            <h3 className="label">{t("more.languagesTitle")}</h3>
            <ul className="mt-3 space-y-3">
              {languages.map((l) => (
                <li key={l.name}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-[1.1rem]">{l.name}</span>
                    <span className="text-right text-xs text-muted">{l.level}</span>
                  </div>
                  <div className="mt-1.5 h-px w-full bg-line">
                    <div className="rule-draw h-px bg-accent" style={{ width: `${l.value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h3 className="label">{t("more.networksTitle")}</h3>
            {networks.map((n) => (
              <div key={n.title} className="mt-3">
                <p className="text-xs text-muted">{n.date}</p>
                <p className="font-serif text-[1.1rem]">{n.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ol className="border-t border-line-strong">
        {volunteering.map((e) => (
          <EntryRow key={e.title} entry={e} />
        ))}
      </ol>
    </Section>
  );
}
