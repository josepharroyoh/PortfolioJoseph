import { LayoutGroup, motion, useScroll } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Section } from "../ui/Section";
import { useCopy } from "../../hooks/useCopy";

type Kind = "research" | "work" | "education" | "award" | "community";
type Event = { date: string; type: Kind; title: string; org: string; text: string };

const KINDS: Kind[] = ["research", "work", "education", "award", "community"];

/** The last four-digit year in a date ("Dic 2022 - May 2023" → 2023); undated means today. */
const yearOf = (date: string) => date.match(/\d{4}(?!.*\d{4})/)?.[0] ?? null;

function Filters({ value, onChange, counts }: { value: Kind | "all"; onChange: (k: Kind | "all") => void; counts: Record<string, number> }) {
  const { t } = useTranslation();
  const options: (Kind | "all")[] = ["all", ...KINDS];
  return (
    <LayoutGroup id="timeline-filters">
      <div
        role="radiogroup"
        aria-label={t("timeline.title")}
        className="-mx-5 mt-8 flex gap-1.5 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0 lg:flex-col lg:items-start"
      >
        {options.map((k) => {
          const active = value === k;
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(k)}
              className={clsx(
                "press relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm",
                active ? "text-bg" : "text-muted hover:text-ink",
              )}
            >
              {active && <motion.span layoutId="timeline-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", duration: 0.35, bounce: 0.12 }} />}
              <span className="relative">{k === "all" ? t("timeline.all") : t(`timeline.types.${k}`)}</span>
              <span className={clsx("relative font-mono text-xs tabular-nums", active ? "text-bg/70" : "text-faint")}>{counts[k]}</span>
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
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: events.length };
    for (const e of events) c[e.type] = (c[e.type] ?? 0) + 1;
    return c;
  }, [events]);

  // Newest first, grouped by year, the way a committee reads a CV.
  const groups = useMemo(() => {
    const shown = events.map((e, i) => ({ e, i })).filter(({ e }) => filter === "all" || e.type === filter);
    const map = new Map<string, Event[]>();
    for (const { e } of shown.reverse()) {
      const key = yearOf(e.date) ?? t("timeline.now");
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return [...map.entries()].sort(([a], [b]) => (Number(b) || 9999) - (Number(a) || 9999));
  }, [events, filter, t]);

  return (
    <Section id="timeline" title={t("timeline.title")} intro={t("timeline.intro")} aside={<Filters value={filter} onChange={setFilter} counts={counts} />}>
      <div ref={listRef} className="relative">
        {/* The rail fills as you read down the years. */}
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line md:left-[calc(6rem+5px)]" />
        <motion.div aria-hidden="true" style={{ scaleY: scrollYProgress }} className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-accent md:left-[calc(6rem+5px)]" />

        <motion.div key={filter} initial={{ opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
          {groups.map(([year, list]) => (
            <div key={year} className="relative grid pb-6 md:grid-cols-[6rem_1fr]">
              <p className="pl-7 font-display text-2xl leading-none font-semibold tracking-[-0.03em] tabular-nums md:sticky md:top-28 md:self-start md:pt-1 md:pl-0">{year}</p>
              <ol className="mt-3 md:mt-0">
                {list.map((ev) => (
                  <li key={`${ev.title}-${ev.date}`} className="relative pb-7 pl-7">
                    <span aria-hidden="true" className="absolute top-[0.45rem] left-0 h-[11px] w-[11px] rounded-full border-2 border-bg bg-ink" />
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                      <span className="font-mono">{ev.date}</span>
                      <span className="rounded-full border border-line px-2 py-0.5 text-xs">{t(`timeline.types.${ev.type}`)}</span>
                    </p>
                    <h3 className="mt-2 text-lg leading-snug font-semibold tracking-[-0.01em]">{ev.title}</h3>
                    <p className="text-[15px] text-muted">{ev.org}</p>
                    <p className="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed">{ev.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
