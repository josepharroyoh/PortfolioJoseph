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
    <Section
      id="research"
      title={t("research.title")}
      intro={t("research.intro")}
      aside={
        <div className="reveal space-y-3">
          <p className="label">ORCID</p>
          <a href={PROFILE.links.orcid} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 font-mono text-sm">
            0000-0002-1355-5182
            <ArrowUpRightIcon size={13} />
          </a>
          <p className="pt-4 text-muted">{t("research.citeLabel")}</p>
          <button type="button" onClick={copy} className={button("secondary", "h-9 px-4 text-sm")} aria-live="polite">
            {copied ? <CheckIcon size={15} weight="bold" /> : <CopyIcon size={15} />}
            {copied ? pub.copied : pub.copy}
          </button>
        </div>
      }
    >
      {/* The paper, set as it would appear in a reference list, only larger. */}
      <article className="reveal group -mx-5 rounded-sm px-5 py-6 transition-[background-color,box-shadow] duration-300 hover:bg-surface hover:shadow-card md:-mx-7 md:px-7">
        <p className="flex flex-wrap items-baseline gap-x-3 text-sm">
          <span className="font-medium text-accent">{pub.label}</span>
          <span className="text-faint">{pub.year}</span>
        </p>
        <h3 className="mt-3 font-serif text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.18] tracking-[-0.015em]">{pub.title}</h3>
        <p className="mt-3 font-serif text-lg text-muted italic">{pub.journal}</p>
        <p className="mt-3 max-w-[70ch] leading-relaxed text-muted">
          <Authors text={pub.authors} />
        </p>
      </article>

      <article className="reveal mt-12 border-l-2 border-accent pl-5 md:pl-7">
        <p className="text-sm text-muted">{academic.label}</p>
        <h3 className="mt-2 font-serif text-[1.45rem] leading-snug">{academic.title}</h3>
        <p className="mt-2 text-sm text-muted">
          <Authors text={academic.authors} />
        </p>
        <p className="serif-body mt-4 max-w-[62ch] text-muted">{academic.text}</p>
        <a href={PROFILE.links.aireica} target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-flex items-center gap-1 text-accent">
          {academic.link}
          <ArrowUpRightIcon size={15} />
        </a>
      </article>

      <h3 className="label reveal mt-14">{t("research.congressesTitle")}</h3>
      <ol className="mt-3 border-t border-line">
        {congresses.map((c, i) => (
          <li key={`${c.title}-${i}`} className="reveal grid gap-1 border-b border-line py-5 md:grid-cols-[6.5rem_1fr] md:gap-6">
            <span className="text-sm text-muted tabular-nums">{c.date}</span>
            <div>
              <p className="font-serif text-[1.2rem] leading-snug">{c.topic}</p>
              <p className="mt-1 text-[15px] text-muted">
                <span className="italic">{c.title}</span>, {c.place}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
