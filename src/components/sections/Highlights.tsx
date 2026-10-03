import { useTranslation } from "react-i18next";
import { CountUp } from "../ui/CountUp";
import { useCopy } from "../../hooks/useCopy";

type Item = { value?: number; display?: string; prefix?: string; suffix?: string; label: string; text: string };

/** Six proofs, set as a ruled table with large serif figures. */
export function Highlights() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("highlights.items");

  return (
    <section id="highlights" aria-labelledby="highlights-title" className="pb-8">
      <h2 id="highlights-title" className="label reveal">
        {t("highlights.title")}
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-px overflow-hidden border-y border-line-strong bg-line sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.label} className="reveal group relative bg-bg py-6 transition-colors duration-300 hover:bg-surface sm:px-5">
            {/* A hairline draws across the top of the cell on hover. */}
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
            <p className="font-serif text-[clamp(2.3rem,3.4vw,3.1rem)] leading-none font-[400] tracking-[-0.03em] whitespace-nowrap tabular-nums transition-[color,transform] duration-300 ease-out group-hover:translate-x-1 group-hover:text-accent group-hover:italic">
              {item.display ?? <CountUp value={item.value ?? 0} prefix={item.prefix} suffix={item.suffix} />}
            </p>
            <p className="mt-3 font-medium">{item.label}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-muted">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
