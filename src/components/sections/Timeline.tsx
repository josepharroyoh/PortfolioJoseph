import { LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { Section } from "../ui/Section";
import { CV_PATH } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

type Kind = "research" | "work" | "education" | "award" | "community";
type Event = { date: string; type: Kind; title: string; org: string; text: string };

const KINDS: Kind[] = ["research", "work", "education", "award", "community"];

/** Newest first, ordered by the last year in each date; undated ("Hoy") goes on top. */
const endYear = (date: string) => Number(date.match(/\d{4}(?!.*\d{4})/)?.[0] ?? 9999);

function Filters({ value, onChange, counts }: { value: Kind | "all"; onChange: (k: Kind | "all") => void; counts: Record<string, number> }) {
  const { t } = useTranslation();
  const options: (Kind | "all")[] = ["all", ...KINDS];
  return (
    <LayoutGroup id="timeline-filters">
      <div role="radiogroup" aria-label={t("timeline.title")} className="-mx-5 flex gap-1 overflow-x-auto border-b border-line px-5 md:mx-0 md:px-0">
        {options.map((k) => {
          const active = value === k;
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(k)}
              className={clsx("relative inline-flex h-11 shrink-0 items-center gap-1.5 px-3 text-[15px] transition-colors duration-200", active ? "text-ink" : "text-muted hover:text-ink")}
            >
              {k === "all" ? t("timeline.all") : t(`timeline.types.${k}`)}
              <span className="text-xs text-faint tabular-nums">{counts[k]}</span>
              {active && <motion.span layoutId="timeline-line" className="absolute inset-x-3 -bottom-px h-[2px] bg-accent" transition={{ type: "spring", duration: 0.35, bounce: 0.1 }} />}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

export function Timeline() {
  const { t } = useTranslation();
  const events = useCopy<Event[]>("timeline.events");
  const [filter, setFilter] = useState<Kind | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: events.length };
    for (const e of events) c[e.type] = (c[e.type] ?? 0) + 1;
    return c;
  }, [events]);

  const shown = useMemo(
    () =>
      events
        .filter((e) => filter === "all" || e.type === filter)
        .reverse()
        .sort((a, b) => endYear(b.date) - endYear(a.date)),
    [events, filter],
  );

  return (
    <Section id="timeline" title={t("timeline.title")} intro={t("timeline.intro")}>
      <Filters value={filter} onChange={setFilter} counts={counts} />
      <motion.ol key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
        {shown.map((ev) => (
          <li key={`${ev.title}-${ev.date}`} className="group grid gap-1 border-b border-line py-6 md:grid-cols-[10rem_1fr_8rem] md:gap-8">
            <p className="text-sm text-muted tabular-nums md:pt-1">{ev.date}</p>
            <div>
              <h3 className="font-serif text-[1.35rem] leading-snug transition-colors duration-200 group-hover:text-accent">{ev.title}</h3>
              <p className="mt-0.5 text-[15px] text-muted italic">{ev.org}</p>
              <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed">{ev.text}</p>
            </div>
            <p className="hidden text-right text-sm text-faint md:block md:pt-1">{t(`timeline.types.${ev.type}`)}</p>
          </li>
        ))}
      </motion.ol>
      <Link to={CV_PATH} className="link-underline mt-8 inline-flex items-center gap-1 text-accent">
        {t("timeline.cv")}
        <ArrowUpRightIcon size={15} />
      </Link>
    </Section>
  );
}
