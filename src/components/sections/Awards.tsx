import { useTranslation } from "react-i18next";
import { Award as AwardIcon } from "lucide-react";
import clsx from "clsx";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/motion";
import { useCopy } from "../../hooks/useCopy";
import { useSpotlight } from "../../hooks/useSpotlight";

type Award = { year: string; title: string; org: string; description: string; amount?: string };

export function Awards() {
  const { t } = useTranslation();
  const awards = useCopy<Award[]>("awards.items");
  const spotlight = useSpotlight<HTMLDivElement>();

  return (
    <section id="awards" className="relative z-10 mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-40">
      <SectionHeader eyebrow={t("awards.eyebrow")} title={t("awards.title")} />

      <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-2 lg:grid-cols-6">
        {awards.map((a, i) => (
          <Reveal key={a.title} delay={(i % 3) * 0.08} className={clsx(i < 2 ? "lg:col-span-3" : "lg:col-span-2")}>
            <div {...spotlight} className="spotlight glass group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-7 md:p-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -bottom-10 font-display text-[9rem] leading-none text-transparent transition-transform duration-700 ease-out-expo [-webkit-text-stroke:1px_rgba(245,194,107,0.18)] group-hover:-translate-y-3"
              >
                {a.year}
              </span>
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/30">
                  <AwardIcon size={20} strokeWidth={1.6} />
                </span>
                <span className="font-mono text-xs tracking-[0.18em] text-muted">{a.year}</span>
              </div>
              <h3 className="mt-8 font-display text-2xl leading-snug text-paper md:text-[1.75rem]">{a.title}</h3>
              <p className="mt-2 text-sm text-gold/90">{a.org}</p>
              <p className="relative mt-4 flex-1 text-sm leading-relaxed text-muted">{a.description}</p>
              {a.amount && (
                <p className="relative mt-6 w-fit rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs text-gold">{a.amount}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
