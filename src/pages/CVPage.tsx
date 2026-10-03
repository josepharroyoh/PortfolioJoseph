import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, PrinterIcon } from "@phosphor-icons/react";
import { PageShell } from "../components/layout/PageShell";
import { Authors } from "../components/sections/Research";
import type { Publication } from "../components/sections/Research";
import { button } from "../components/ui/styles";
import { PROFILE, SKILL_GROUPS } from "../data/profile";
import { useCopy } from "../hooks/useCopy";

type Event = { date: string; type: string; title: string; org: string; text: string; course?: boolean };
type Entry = { date: string; title: string; org: string; text?: string };
type Academic = { title: string; authors: string; text: string };
type Congress = { date: string; title: string; place: string; topic: string };
type Project = { title: string; year: string; role: string; text: string };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="avoid-break mt-9">
      <h2 className="border-b border-line pb-2 text-[13px] font-semibold tracking-[0.08em] text-accent uppercase print:text-[#2547d0]">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Row({ date, title, org, text }: Entry) {
  return (
    <div className="avoid-break grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
      <p className="font-mono text-[13px] text-muted">{date}</p>
      <div>
        <p className="font-semibold leading-snug">{title}</p>
        <p className="text-[15px] text-muted">{org}</p>
        {text && <p className="mt-1 text-[15px] leading-relaxed">{text}</p>}
      </div>
    </div>
  );
}

export default function CVPage() {
  const { t } = useTranslation();
  const events = useCopy<Event[]>("timeline.events");
  const degrees = useCopy<Entry[]>("cv.degrees");
  const thesis = useCopy<Entry>("cv.thesis");
  const pubs = useCopy<Publication[]>("research.publications");
  const academic = useCopy<Academic>("research.academic");
  const congresses = useCopy<Congress[]>("research.congresses");
  const projects = useCopy<Project[]>("projects.items");
  const groups = useCopy<string[]>("skills.groups");

  useEffect(() => {
    document.title = `CV | ${PROFILE.fullName}`;
  }, []);

  // Newest first, as a CV reads: ordered by the last year in each date.
  const endYear = (date: string) => Number(date.match(/\d{4}(?!.*\d{4})/)?.[0] ?? 9999);
  const byType = (type: string, filter: (e: Event) => boolean = () => true) =>
    events
      .filter((e) => e.type === type && filter(e))
      .reverse()
      .sort((a, b) => endYear(b.date) - endYear(a.date));

  return (
    <PageShell active="cv">
      <div className="mx-auto max-w-[860px] px-4 pt-24 pb-16 print:p-0">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="press inline-flex items-center gap-2 rounded-full text-sm text-muted hover:text-ink">
            <ArrowLeftIcon size={16} />
            {t("cv.back")}
          </Link>
          <button type="button" onClick={() => window.print()} className={button("primary", "h-10 px-4 text-sm")}>
            <PrinterIcon size={17} />
            {t("cv.print")}
          </button>
        </div>

        <article className="print-plain rounded-2xl border border-line bg-surface p-7 shadow-card md:p-12">
          <header className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-[clamp(2rem,4.5vw,2.8rem)] leading-[1.05] font-semibold tracking-[-0.03em]">{PROFILE.fullName}</h1>
              <p className="mt-2 text-lg text-muted">{t("cv.title")}</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
                <li>
                  <a href={`mailto:${PROFILE.email}`} className="link-underline">{PROFILE.email}</a>
                </li>
                <li>São Paulo, Brasil</li>
                <li>
                  <a href={PROFILE.links.linkedin} className="link-underline">linkedin.com/in/josepharroyohernandez</a>
                </li>
                <li>
                  <a href={PROFILE.links.github} className="link-underline">github.com/josepharroyoh</a>
                </li>
                <li>
                  <a href={PROFILE.links.orcid} className="link-underline">ORCID 0000-0002-1355-5182</a>
                </li>
              </ul>
            </div>
            <img src={PROFILE.photo} alt="" className="h-28 w-24 shrink-0 rounded-xl object-cover object-top" />
          </header>

          <Section title={t("cv.summaryTitle")}>
            <p className="leading-relaxed">{t("cv.summary")}</p>
          </Section>

          <Section title={t("cv.educationTitle")}>
            {degrees.map((d) => (
              <Row key={d.title} {...d} />
            ))}
          </Section>

          <Section title={t("cv.researchTitle")}>
            <Row date={thesis.date} title={thesis.title} org={thesis.org} />
            {pubs.map((pub) => (
              <div key={pub.title} className="avoid-break grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
                <p className="font-mono text-[13px] text-muted">
                  {pub.year} · {pub.status}
                </p>
                <p className="text-[15px] leading-relaxed">
                  <Authors text={pub.authors} /> ({pub.year}). <span className="font-semibold">{pub.title}</span> {pub.journal && <em>{pub.journal}.</em>}{" "}
                  {pub.doi && <span className="text-muted">doi.org/{pub.doi}</span>}
                </p>
              </div>
            ))}
            <div className="avoid-break grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
              <p className="font-mono text-[13px] text-muted">2023</p>
              <div>
                <p className="font-semibold leading-snug">{academic.title}</p>
                <p className="text-[15px] text-muted">
                  <Authors text={academic.authors} />
                </p>
                <p className="mt-1 text-[15px] leading-relaxed">{academic.text}</p>
              </div>
            </div>
          </Section>

          <Section title={t("cv.talksTitle")}>
            {congresses.map((c, i) => (
              <Row key={i} date={c.date} title={c.title} org={c.place} text={c.topic} />
            ))}
          </Section>

          <Section title={t("cv.experienceTitle")}>
            {byType("work").map((e) => (
              <Row key={e.title} {...e} />
            ))}
          </Section>


          <Section title={t("cv.awardsTitle")}>
            {byType("award").map((e) => (
              <Row key={e.title} {...e} />
            ))}
          </Section>

          <Section title={t("cv.coursesTitle")}>
            {byType("education", (e) => Boolean(e.course)).map((e) => (
              <Row key={e.title} date={e.date} title={e.title} org={e.org} />
            ))}
          </Section>

          <Section title={t("cv.projectsTitle")}>
            {projects
              .filter((p) => p.year)
              .map((p) => (
                <Row key={p.title} date={p.year} title={`${p.title}, ${p.role}`} org="" text={p.text} />
              ))}
          </Section>

          <Section title={t("cv.communityTitle")}>
            {byType("community").map((e) => (
              <Row key={e.title} {...e} />
            ))}
          </Section>

          <Section title={t("cv.languagesTitle")}>
            <p className="text-[15px]">{t("cv.languages")}</p>
          </Section>

          <Section title={t("cv.skillsTitle")}>
            {SKILL_GROUPS.map((skills, i) => (
              <div key={groups[i]} className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-5">
                <p className="text-[13px] text-muted">{groups[i]}</p>
                <p className="text-[15px]">{skills.join(", ")}</p>
              </div>
            ))}
          </Section>
        </article>
      </div>
    </PageShell>
  );
}
