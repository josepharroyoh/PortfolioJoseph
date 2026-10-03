import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon, CheckIcon, CopyIcon, MicrophoneStageIcon } from "@phosphor-icons/react";
import { SectionHeading } from "../ui/SectionHeading";
import { button, container } from "../ui/styles";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

type Publication = { label: string; authors: string; year: string; title: string; journal: string; copy: string; copied: string };
type Academic = { label: string; title: string; authors: string; text: string; link: string };
type Congress = { date: string; title: string; place: string; topic: string };

const ME = /(Arroyo, J\.)/;

/** Author list with Joseph's name set in the ink colour and weight. */
export function Authors({ text }: { text: string }) {
  return (
    <>
      {text.split(ME).map((part, i) =>
        ME.test(part) ? (
          <strong key={i} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function Research() {
  const { t } = useTranslation();
  const pub = useCopy<Publication>("research.publication");
  const academic = useCopy<Academic>("research.academic");
  const congresses = useCopy<Congress[]>("research.congresses");
  const [copied, setCopied] = useState(false);

  const citation = `${pub.authors} (${pub.year}). ${pub.title} ${pub.journal}.`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the citation is still selectable on the page */
    }
  };

  return (
    <section id="research" aria-labelledby="research-title" className="border-t border-line py-24 md:py-32">
      <div className={container}>
        <SectionHeading id="research-title" title={t("research.title")} intro={t("research.intro")} />

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {/* The paper, set like a journal title page. */}
          <article className="reveal relative overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-card md:p-10 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">{pub.label}</p>
              <p className="font-mono text-sm text-muted">{pub.year}</p>
            </div>
            <p className="mt-8 text-sm italic text-muted">{pub.journal}</p>
            <h3 className="mt-3 text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.15] font-semibold tracking-[-0.025em]">{pub.title}</h3>
            <p className="mt-5 leading-relaxed text-muted">
              <Authors text={pub.authors} />
            </p>
            <button type="button" onClick={copy} className={button("secondary", "mt-8 h-10 px-4 text-sm")} aria-live="polite">
              {copied ? <CheckIcon size={15} weight="bold" /> : <CopyIcon size={15} />}
              {copied ? pub.copied : pub.copy}
            </button>
          </article>

          <article className="reveal flex flex-col rounded-3xl bg-bg-2 p-7 md:p-10 lg:col-span-5">
            <p className="text-sm text-muted">{academic.label}</p>
            <h3 className="mt-4 text-xl leading-snug font-semibold tracking-[-0.015em]">{academic.title}</h3>
            <p className="mt-3 text-sm text-muted">
              <Authors text={academic.authors} />
            </p>
            <p className="mt-4 leading-relaxed text-muted">{academic.text}</p>
            <a href={PROFILE.links.aireica} target="_blank" rel="noopener noreferrer" className="link-underline mt-6 inline-flex items-center gap-1 text-accent lg:mt-auto lg:pt-6">
              {academic.link}
              <ArrowUpRightIcon size={15} />
            </a>
          </article>
        </div>

        <h3 className="reveal mt-16 flex items-center gap-2 text-xl font-semibold tracking-[-0.01em]">
          <MicrophoneStageIcon size={20} className="text-accent" />
          {t("research.congressesTitle")}
        </h3>
        <ol className="mt-5 border-t border-line">
          {congresses.map((c, i) => (
            <li key={`${c.title}-${i}`} className="reveal grid gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-8">
              <span className="font-mono text-sm text-muted md:col-span-2">{c.date}</span>
              <div className="md:col-span-7">
                <p className="font-medium leading-snug">{c.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{c.topic}</p>
              </div>
              <span className="text-sm text-muted md:col-span-3 md:text-right">{c.place}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
