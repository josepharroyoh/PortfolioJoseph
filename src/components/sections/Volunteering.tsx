import { useTranslation } from "react-i18next";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/motion";
import { useCopy } from "../../hooks/useCopy";

type Item = { period: string; title: string; role: string; description: string };

export function Volunteering() {
  const { t } = useTranslation();
  const items = useCopy<Item[]>("volunteering.items");
  return (
    <section id="volunteering" className="relative z-10 mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-40">
      <SectionHeader eyebrow={t("volunteering.eyebrow")} title={t("volunteering.title")} />
      <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line md:mt-24 md:grid-cols-2">
        {items.map((v, i) => (
          <Reveal key={v.title} delay={(i % 2) * 0.1} className="group bg-ink/85 p-7 backdrop-blur-xl transition-colors duration-500 hover:bg-ink-2/90 md:p-10">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-xs tracking-[0.18em] text-cyan">{v.period}</span>
              <span className="font-mono text-xs text-faint">0{i + 1}</span>
            </div>
            <h3 className="mt-6 font-display text-3xl leading-tight text-paper transition-transform duration-500 group-hover:translate-x-1">{v.title}</h3>
            <p className="mt-2 text-sm text-violet">{v.role}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted md:text-[15px]">{v.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
