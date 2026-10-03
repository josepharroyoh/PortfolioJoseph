import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { container } from "../ui/styles";
import { useCopy } from "../../hooks/useCopy";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type Kind = "research" | "work" | "education" | "award" | "community";
type Event = { date: string; type: Kind; title: string; org: string; text: string };

/** Categorical colours, used only as small markers so the accent stays the accent. */
const KIND_COLOR: Record<Kind, string> = {
  research: "var(--accent)",
  work: "#1f9d55",
  education: "#7c5cd6",
  award: "#c8891f",
  community: "#d14d72",
};
const KINDS: Kind[] = ["research", "work", "education", "award", "community"];

function Filters({ value, onChange }: { value: Kind | "all"; onChange: (k: Kind | "all") => void }) {
  const { t } = useTranslation();
  const options: (Kind | "all")[] = ["all", ...KINDS];
  return (
    <LayoutGroup id="timeline-filters">
      <div role="radiogroup" aria-label={t("timeline.title")} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
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
                "press relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm",
                active ? "border-transparent text-bg" : "border-line text-muted hover:text-ink",
              )}
            >
              {active && (
                <motion.span layoutId="timeline-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", duration: 0.35, bounce: 0.15 }} />
              )}
              {k !== "all" && <span className="relative h-2 w-2 rounded-full" style={{ background: KIND_COLOR[k] }} aria-hidden="true" />}
              <span className="relative">{k === "all" ? t("timeline.all") : t(`timeline.types.${k}`)}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function EventCard({ ev, last, horizontal }: { ev: Event; last: boolean; horizontal: boolean }) {
  const { t } = useTranslation();
  return (
    <motion.li
      layout
      initial={{ opacity: 0, transform: "translateY(12px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className={clsx("relative", horizontal ? "w-[19rem] shrink-0 pt-10" : "pb-8 pl-8")}
    >
      {/* Marker on the axis. */}
      <span
        aria-hidden="true"
        className={clsx("absolute h-3 w-3 rounded-full ring-4 ring-bg", horizontal ? "top-[1.1rem] left-6" : "top-1.5 left-0")}
        style={{ background: KIND_COLOR[ev.type] }}
      />
      <div className={clsx("h-full rounded-2xl border p-5", last ? "border-accent bg-accent-soft" : "border-line bg-surface")}>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-sm text-muted">{ev.date}</p>
          <p className="text-xs font-medium" style={{ color: KIND_COLOR[ev.type] }}>
            {t(`timeline.types.${ev.type}`)}
          </p>
        </div>
        <h3 className="mt-3 text-lg leading-snug font-semibold tracking-[-0.015em]">{ev.title}</h3>
        <p className="mt-1 text-sm text-accent">{ev.org}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{ev.text}</p>
      </div>
    </motion.li>
  );
}

export function Timeline() {
  const { t } = useTranslation();
  const events = useCopy<Event[]>("timeline.events");
  const [filter, setFilter] = useState<Kind | "all">("all");
  const horizontal = useMediaQuery("(min-width: 1024px)");
  const shown = events.filter((e) => filter === "all" || e.type === filter);
  const now = events[events.length - 1];

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);

  // How far the track has to travel sideways; the section is that much taller.
  useLayoutEffect(() => {
    if (!horizontal) return;
    const measure = () => {
      const track = trackRef.current;
      const view = viewportRef.current;
      // The viewport has 2rem of padding on each side.
      if (track && view) setDistance(Math.max(0, track.scrollWidth - (view.clientWidth - 64)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [horizontal, shown.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const transform = useTransform(x, (v) => `translateX(${v}px)`);
  const barScale = useTransform(scrollYProgress, (v) => `scaleX(${v})`);

  const header = (
    <div className={container}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 id="timeline-title" className="text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
            {t("timeline.title")}
          </h2>
          <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-muted">{t("timeline.intro")}</p>
        </div>
      </div>
      <div className="mt-8">
        <Filters value={filter} onChange={setFilter} />
      </div>
    </div>
  );

  if (!horizontal) {
    return (
      <section id="timeline" aria-labelledby="timeline-title" className="border-t border-line py-24">
        {header}
        <div className={container}>
          <ol className="relative mt-10 border-l border-line pl-0 [&>li]:-ml-[6px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((ev) => (
                <EventCard key={`${ev.date}-${ev.title}`} ev={ev} last={ev === now} horizontal={false} />
              ))}
            </AnimatePresence>
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      id="timeline"
      ref={sectionRef}
      aria-labelledby="timeline-title"
      className="relative border-t border-line"
      style={{ height: `calc(100dvh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center gap-10 overflow-hidden pt-16">
        {header}
        <div ref={viewportRef} className="relative mx-auto w-full max-w-[1200px] px-8">
          {/* Axis with scroll progress. */}
          <div className="absolute top-[1.45rem] right-8 left-8 h-px bg-line" aria-hidden="true">
            <motion.div style={{ transform: barScale }} className="h-full origin-left bg-accent" />
          </div>
          <motion.ol ref={trackRef} style={{ transform }} className="flex w-max gap-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((ev) => (
                <EventCard key={`${ev.date}-${ev.title}`} ev={ev} last={ev === now} horizontal />
              ))}
            </AnimatePresence>
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
