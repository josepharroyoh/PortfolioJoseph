import { useTranslation } from "react-i18next";
import { GraduationCap } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/motion";
import { useCopy } from "../../hooks/useCopy";
import { useSpotlight } from "../../hooks/useSpotlight";

type Degree = { title: string; school: string; date: string; highlights: string[] };
type Course = { title: string; institution: string; date: string };

export function Education() {
  const { t } = useTranslation();
  const degree = useCopy<Degree>("education.degree");
  const courses = useCopy<Course[]>("education.courses");
  const spotlight = useSpotlight<HTMLDivElement>();

  return (
    <section id="education" className="relative z-10 mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-40">
      <SectionHeader eyebrow={t("education.eyebrow")} title={t("education.title")} />

      <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div {...spotlight} className="spotlight glass relative overflow-hidden rounded-[2rem] p-8 md:p-10 lg:sticky lg:top-28">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet/20 blur-3xl" aria-hidden="true" />
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line-strong bg-white/[0.04] text-violet">
              <GraduationCap size={26} strokeWidth={1.5} />
            </span>
            <p className="mt-10 font-mono text-xs tracking-[0.18em] text-cyan uppercase">{degree.date}</p>
            <h3 className="mt-3 font-display text-4xl leading-tight text-paper md:text-5xl">{degree.title}</h3>
            <p className="mt-3 text-muted">{degree.school}</p>
            <ul className="mt-8 space-y-3 border-t border-line pt-6">
              {degree.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-paper/90">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <h3 className="eyebrow">{t("education.coursesTitle")}</h3>
          </Reveal>
          <ul className="mt-6 border-t border-line">
            {courses.map((c, i) => (
              <Reveal as="li" key={c.title} delay={Math.min(i, 5) * 0.05} className="group relative border-b border-line">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-white/[0.05] to-transparent transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                />
                <div className="relative grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[5.5rem_1fr_auto]">
                  <span className="font-mono text-xs text-faint tabular-nums">{c.date}</span>
                  <p className="text-[15px] leading-snug text-paper transition-transform duration-500 group-hover:translate-x-1 md:text-base">{c.title}</p>
                  <p className="col-start-2 text-sm text-muted md:col-start-3 md:text-right">{c.institution}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
