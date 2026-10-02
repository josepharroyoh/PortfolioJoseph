import { useTranslation } from "react-i18next";
import { SectionHeading } from "../ui/SectionHeading";
import { container } from "../ui/styles";
import { useCopy } from "../../hooks/useCopy";

type Job = { date: string; role: string; org: string; text: string; metrics: { value: string; label: string }[] };
type Degree = { date: string; title: string; school: string; highlights: string[] };
type CourseGroup = { year: string; items: { title: string; institution: string }[] };

export function Journey() {
  const { t } = useTranslation();
  const jobs = useCopy<Job[]>("journey.jobs");
  const degree = useCopy<Degree>("journey.degree");
  const groups = useCopy<CourseGroup[]>("journey.courseGroups");

  return (
    <section id="journey" aria-labelledby="journey-title" className="border-t border-line py-24 md:py-36">
      <div className={container}>
        <SectionHeading id="journey-title" title={t("journey.title")} />

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <h3 className="reveal text-sm text-faint">{t("journey.experienceTitle")}</h3>
            <ol className="mt-6 space-y-12">
              {jobs.map((job) => (
                <li key={job.role} className="reveal relative border-l border-line-strong pl-6">
                  <span className="absolute top-2 -left-[4.5px] h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  <p className="font-mono text-sm text-faint">{job.date}</p>
                  <h4 className="mt-2 font-display text-2xl leading-tight font-semibold tracking-[-0.02em]">{job.role}</h4>
                  <p className="mt-1 text-accent">{job.org}</p>
                  <p className="mt-4 max-w-[58ch] leading-relaxed text-muted">{job.text}</p>
                  {job.metrics.length > 0 && (
                    <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                      {job.metrics.map((m) => (
                        <div key={m.label}>
                          <dt className="sr-only">{m.label}</dt>
                          <dd>
                            <span className="font-display text-4xl font-semibold tracking-[-0.03em]">{m.value}</span>
                            <span className="mt-1 block text-sm text-muted">{m.label}</span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-6">
            <h3 className="reveal text-sm text-faint">{t("journey.educationTitle")}</h3>
            <div className="reveal mt-6 rounded-xl bg-bg-2 p-6 md:p-8">
              <p className="font-mono text-sm text-muted">{degree.date}</p>
              <h4 className="mt-2 font-display text-3xl leading-tight font-semibold tracking-[-0.025em]">{degree.title}</h4>
              <p className="mt-1 text-muted">{degree.school}</p>
              <ul className="mt-5 space-y-1.5">
                {degree.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>

            <h4 className="reveal mt-12 text-sm text-faint">{t("journey.coursesTitle")}</h4>
            <div className="mt-4 space-y-8">
              {groups.map((g) => (
                <div key={g.year} className="reveal grid grid-cols-[5.5rem_1fr] gap-4 border-t border-line pt-5">
                  <p className="font-mono text-sm text-faint">{g.year}</p>
                  <ul className="space-y-4">
                    {g.items.map((c) => (
                      <li key={c.title}>
                        <p className="leading-snug">{c.title}</p>
                        <p className="mt-0.5 text-sm text-muted">{c.institution}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
