import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowCounterClockwiseIcon, ArrowLeftIcon, LightningIcon } from "@phosphor-icons/react";
import { PageShell } from "../components/layout/PageShell";
import { ElectricField } from "../components/fx/ElectricField";
import { FieldTrace } from "../components/fx/FieldTrace";
import { button, container } from "../components/ui/styles";
import { useCopy } from "../hooks/useCopy";

type Item = { name: string; text: string };
type Demo = { field: string; threshold: string; alert: string; strike: string; lead: string };

export default function ThesisPage() {
  const { t } = useTranslation();
  const data = useCopy<Item[]>("thesis.data");
  const method = useCopy<Item[]>("thesis.method");
  const demo = useCopy<Demo>("thesis.demo");
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    document.title = `${t("projects.featured.title")} | Joseph Arroyo`;
  }, [t]);

  return (
    <PageShell active="thesis">
      <article>
        <header className={`${container} pt-28 md:pt-36`}>
          <Link to="/#projects" className="press inline-flex items-center gap-2 rounded-full text-sm text-muted hover:text-ink">
            <ArrowLeftIcon size={16} />
            {t("thesis.back")}
          </Link>
          <br />
          <p className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
            <LightningIcon size={15} weight="fill" />
            {t("thesis.status")}
          </p>
          <h1 className="mt-5 max-w-5xl text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] font-semibold tracking-[-0.04em]">{t("thesis.title")}</h1>
          <p className="mt-7 max-w-[60ch] text-xl leading-relaxed text-muted">{t("thesis.lead")}</p>
        </header>

        <div className="relative mt-14 h-[52vh] min-h-80 border-y border-line">
          <ElectricField cloudX={0.5} className="absolute inset-0" />
          <p className={`${container} pointer-events-none absolute inset-x-0 bottom-4 text-xs text-muted`}>{t("hero.caption")}</p>
        </div>

        <div className={`${container} py-20 md:py-28`}>
          <section aria-labelledby="question" className="reveal rounded-2xl bg-bg-2 p-7 md:p-12">
            <h2 id="question" className="text-sm font-normal text-muted">
              {t("thesis.questionLabel")}
            </h2>
            <p className="mt-4 max-w-4xl font-display text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.15] font-semibold tracking-[-0.025em]">
              {t("thesis.question")}
            </p>
          </section>

          <section aria-labelledby="demo" className="mt-24">
            <div className="reveal flex flex-wrap items-end justify-between gap-4">
              <h2 id="demo" className="text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em]">
                {t("thesis.demoTitle")}
              </h2>
              <button type="button" onClick={() => setReplay((n) => n + 1)} className={button("secondary", "h-10 px-4 text-sm")}>
                <ArrowCounterClockwiseIcon size={15} />
                {t("thesis.demoReplay")}
              </button>
            </div>
            <div className="reveal mt-8 rounded-2xl border border-line bg-surface p-5 md:p-10">
              <FieldTrace labels={demo} replayKey={replay} />
            </div>
            <p className="reveal mt-4 max-w-[70ch] text-sm leading-relaxed text-muted">{t("thesis.demoCaption")}</p>
          </section>

          <section aria-labelledby="data" className="mt-24 grid gap-8 lg:grid-cols-12">
            <h2 id="data" className="reveal text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em] lg:col-span-4">
              {t("thesis.dataTitle")}
            </h2>
            <dl className="border-t border-line lg:col-span-8">
              {data.map((d) => (
                <div key={d.name} className="reveal grid gap-2 border-b border-line py-6 md:grid-cols-8 md:gap-6">
                  <dt className="font-medium md:col-span-3">{d.name}</dt>
                  <dd className="leading-relaxed text-muted md:col-span-5">{d.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="method" className="mt-24 grid gap-8 lg:grid-cols-12">
            <h2 id="method" className="reveal text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em] lg:col-span-4">
              {t("thesis.methodTitle")}
            </h2>
            <ol className="grid gap-8 md:grid-cols-3 lg:col-span-8">
              {method.map((m, i) => (
                <li key={m.name} className="reveal border-t-2 border-ink pt-5">
                  <span className="font-mono text-sm text-accent">{i + 1}</span>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.015em]">{m.name}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{m.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="why" className="mt-24 grid gap-8 lg:grid-cols-12">
            <h2 id="why" className="reveal text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight font-semibold tracking-[-0.03em] lg:col-span-4">
              {t("thesis.whyTitle")}
            </h2>
            <div className="lg:col-span-8">
              <p className="reveal max-w-[62ch] text-xl leading-relaxed">{t("thesis.why")}</p>
              <p className="reveal mt-6 text-muted">{t("thesis.note")}</p>
            </div>
          </section>

          <div className="reveal mt-24 flex flex-col items-start gap-6 border-t border-line pt-12 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-display text-2xl leading-snug font-semibold tracking-[-0.02em]">{t("thesis.cta")}</p>
            <Link to="/#contact" className={button("primary")}>
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
