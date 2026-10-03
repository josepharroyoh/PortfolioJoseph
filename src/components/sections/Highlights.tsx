import type { PointerEvent } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { CountUp } from "../ui/CountUp";
import { SectionHeading } from "../ui/SectionHeading";
import { container } from "../ui/styles";
import { useCopy } from "../../hooks/useCopy";

type Item = { value?: number; display?: string; prefix?: string; suffix?: string; label: string; text: string };

// Six results, six cells: the research funding leads at 2x2, the class-rank strip closes the grid.
const CELLS = [
  "sm:col-span-2 lg:row-span-2 bg-accent text-on-accent",
  "bg-surface",
  "bg-surface",
  "bg-surface",
  "bg-bg-2",
  "sm:col-span-2 lg:col-span-4 bg-surface",
];

const glow = (e: PointerEvent<HTMLLIElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

export function Highlights() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("highlights.items");
  return (
    <section id="highlights" aria-labelledby="highlights-title" className="py-24 md:py-32">
      <div className={container}>
        <SectionHeading id="highlights-title" title={t("highlights.title")} intro={t("highlights.intro")} />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const lead = i === 0;
            const wide = i === items.length - 1;
            return (
              <li
                key={it.label}
                onPointerMove={glow}
                className={clsx(
                  "reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line p-6 md:p-7",
                  CELLS[i],
                  wide && "lg:flex-row lg:items-end lg:gap-10",
                )}
              >
                {/* Cursor glow, fine pointers only. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
                  style={{ background: "radial-gradient(260px circle at var(--x) var(--y), color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)" }}
                />
                <p
                  className={clsx(
                    "relative font-display leading-none font-semibold tracking-[-0.04em]",
                    lead ? "text-[clamp(3rem,6vw,5.2rem)] whitespace-nowrap" : "text-[clamp(2.4rem,4vw,3.4rem)] whitespace-nowrap",
                  )}
                >
                  {it.display ?? <CountUp value={it.value ?? 0} prefix={it.prefix} suffix={it.suffix} />}
                </p>
                <div className={clsx("relative", lead ? "mt-auto pt-16" : wide ? "mt-4 lg:mt-0" : "mt-4")}>
                  <p className={clsx("font-medium", lead ? "text-xl" : "text-[17px]")}>{it.label}</p>
                  <p className={clsx("mt-1 leading-relaxed", lead ? "max-w-sm opacity-85" : "text-[15px] text-muted")}>{it.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
