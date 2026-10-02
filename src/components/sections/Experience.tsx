import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/motion";
import { useCopy } from "../../hooks/useCopy";

type Job = { role: string; org: string; date: string; description: string; metrics: { value: string; label: string }[] };

export function Experience() {
  const { t } = useTranslation();
  const jobs = useCopy<Job[]>("experience.items");
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section id="experience" className="relative z-10 mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-40">
      <SectionHeader eyebrow={t("experience.eyebrow")} title={t("experience.title")} />

      <ol ref={listRef} className="relative mt-16 md:mt-24">
        <span className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-[calc(25%+7px)]" aria-hidden="true" />
        <motion.span
          style={{ scaleY }}
          className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-gradient-to-b from-cyan via-violet to-transparent md:left-[calc(25%+7px)]"
          aria-hidden="true"
        />
        {jobs.map((job, i) => (
          <li key={job.role} className="relative grid gap-4 pb-16 pl-10 last:pb-0 md:grid-cols-4 md:gap-12 md:pl-0">
            <Reveal className="md:pt-1 md:text-right">
              <p className="font-mono text-xs tracking-[0.18em] text-cyan uppercase md:pr-10">{job.date}</p>
            </Reveal>
            <span className="absolute top-1 left-0 grid h-[15px] w-[15px] place-items-center rounded-full border border-cyan/60 bg-ink md:left-[25%]" aria-hidden="true">
              <span className="h-[5px] w-[5px] rounded-full bg-cyan shadow-[0_0_10px_#67e8f9]" />
            </span>
            <Reveal delay={0.1} className="md:col-span-3 md:pl-6">
              <div className="glass rounded-[2rem] p-7 md:p-9">
                <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">0{i + 1}</p>
                <h3 className="mt-3 font-display text-3xl leading-tight text-paper md:text-4xl">{job.role}</h3>
                <p className="mt-2 text-violet">{job.org}</p>
                <p className="mt-5 text-sm leading-relaxed text-muted md:text-[15px]">{job.description}</p>
                {job.metrics.length > 0 && (
                  <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6">
                    {job.metrics.map((m) => (
                      <div key={m.label}>
                        <dt className="sr-only">{m.label}</dt>
                        <dd>
                          <p className="font-display text-4xl text-paper md:text-5xl">{m.value}</p>
                          <p className="mt-1 text-xs leading-snug text-muted md:text-sm">{m.label}</p>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
