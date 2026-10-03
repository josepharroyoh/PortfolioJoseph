import { useTranslation } from "react-i18next";
import { CountUp } from "../ui/CountUp";
import { container } from "../ui/styles";
import { useCopy } from "../../hooks/useCopy";

type Item = { value?: number; display?: string; prefix?: string; suffix?: string; label: string; text: string };

/** Six proofs in a ruled table: the number first, then what it means. */
export function Highlights() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("highlights.items");

  return (
    <section id="highlights" aria-labelledby="highlights-title" className="bg-bg-2 py-16 md:py-20">
      <div className={container}>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="highlights-title" className="reveal text-xl font-semibold tracking-[-0.02em]">
            {t("highlights.title")}
          </h2>
          <p className="reveal text-muted">{t("highlights.intro")}</p>
        </div>
        <ul className="mt-8 grid gap-px overflow-hidden border-y border-line-strong bg-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.label} className="reveal bg-bg-2 py-7 sm:px-6">
              <p className="font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums">
                {item.display ?? <CountUp value={item.value ?? 0} prefix={item.prefix} suffix={item.suffix} />}
              </p>
              <p className="mt-3 font-medium">{item.label}</p>
              <p className="mt-1 max-w-[34ch] text-[15px] leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
