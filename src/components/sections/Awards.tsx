import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { SectionHeading } from "../ui/SectionHeading";
import { container } from "../ui/styles";
import { useCopy } from "../../hooks/useCopy";

type Award = { year: string; title: string; org: string; text: string; amount?: string };

// Five awards, five cells: the research prize leads at 2x2, the rest fill a 3x3 grid.
const CELLS = [
  "md:col-span-2 md:row-span-2 bg-accent text-on-accent",
  "bg-surface border border-line",
  "bg-surface border border-line",
  "md:col-span-2 bg-bg-2",
  "bg-surface border border-line",
];

export function Awards() {
  const { t } = useTranslation();
  const awards = useCopy<Award[]>("awards.items");

  return (
    <section id="awards" aria-labelledby="awards-title" className="border-t border-line py-24 md:py-36">
      <div className={container}>
        <SectionHeading id="awards-title" title={t("awards.title")} intro={t("awards.intro")} />
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {awards.map((a, i) => {
            const lead = i === 0;
            return (
              <li key={a.title} className={clsx("reveal flex flex-col rounded-xl p-6 md:p-7", CELLS[i])}>
                <p className={clsx("font-mono text-sm", lead ? "opacity-80" : "text-faint")}>{a.year}</p>
                {a.amount && (
                  <p className={clsx("mt-6 font-display leading-none font-semibold tracking-[-0.04em]", lead ? "text-[clamp(3rem,7vw,5.5rem)]" : "text-4xl")}>
                    {a.amount}
                  </p>
                )}
                <h3 className={clsx("leading-snug font-semibold tracking-[-0.015em]", lead ? "mt-auto pt-10 text-2xl md:text-3xl" : "mt-4 text-lg")}>
                  {a.title}
                </h3>
                <p className={clsx("mt-1 text-sm", lead ? "opacity-85" : "text-accent")}>{a.org}</p>
                <p className={clsx("mt-3 text-[15px] leading-relaxed", lead ? "opacity-85" : "text-muted")}>{a.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
