import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Section } from "../ui/Section";
import { button } from "../ui/styles";
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
    <Section id="research" title={t("research.title")} intro={t("research.intro")}>
      {/* The paper, set like a journal title page. */}
      <article className="reveal rounded-2xl border border-line bg-surface p-6 md:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="font-medium text-accent">{pub.label}</p>
          <p className="font-mono text-muted">{pub.year}</p>
        </div>
        <p className="mt-6 text-sm text-muted italic">{pub.journal}</p>
        <h3 className="mt-2 text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.15] font-semibold tracking-[-0.025em]">{pub.title}</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          <Authors text={pub.authors} />
        </p>
        <button type="button" onClick={copy} className={button("secondary", "mt-7 h-10 px-4 text-sm")} aria-live="polite">
          {copied ? <CheckIcon size={15} weight="bold" /> : <CopyIcon size={15} />}
          {copied ? pub.copied : pub.copy}
        </button>
      </article>

      <article className="reveal mt-4 rounded-2xl bg-bg-2 p-6 md:p-9">
        <p className="text-sm text-muted">{academic.label}</p>
        <h3 className="mt-3 text-xl leading-snug font-semibold tracking-[-0.015em]">{academic.title}</h3>
        <p className="mt-2 text-sm text-muted">
          <Authors text={academic.authors} />
        </p>
        <p className="mt-4 max-w-[62ch] leading-relaxed text-muted">{academic.text}</p>
        <a href={PROFILE.links.aireica} target="_blank" rel="noopener noreferrer" className="link-underline mt-5 inline-flex items-center gap-1 text-accent">
          {academic.link}
          <ArrowUpRightIcon size={15} />
        </a>
      </article>

      <h3 className="reveal mt-14 text-xl font-semibold tracking-[-0.01em]">{t("research.congressesTitle")}</h3>
      <ol className="mt-4 border-t border-line">
        {congresses.map((c, i) => (
          <li key={`${c.title}-${i}`} className="reveal grid gap-1 border-b border-line py-5 md:grid-cols-[7rem_1fr] md:gap-6">
            <span className="font-mono text-sm text-muted">{c.date}</span>
            <div>
              <p className="font-medium leading-snug">{c.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">{c.topic}</p>
              <p className="mt-1 text-sm text-faint">{c.place}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
