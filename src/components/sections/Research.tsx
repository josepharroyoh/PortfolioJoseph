import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Section } from "../ui/Section";
import { button } from "../ui/styles";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

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

export type Publication = { status: string; authors: string; year: string; title: string; journal: string; doi?: string };

/** One reference, set like an entry in a reference list, with its status, DOI and a copy button. */
function Reference({ pub, featured }: { pub: Publication; featured: boolean }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const citation = `${pub.authors} (${pub.year}). ${pub.title}${pub.journal ? ` ${pub.journal}.` : ""}${pub.doi ? ` https://doi.org/${pub.doi}` : ""}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the citation is still selectable on the page */
    }
  };
  const published = Boolean(pub.doi);

  return (
    <li className="reveal group -mx-5 rounded-sm px-5 py-6 transition-[background-color,box-shadow] duration-300 hover:bg-surface hover:shadow-card md:-mx-7 md:px-7">
      <p className="flex flex-wrap items-baseline gap-x-3 text-sm">
        <span className={published ? "font-medium text-accent" : "font-medium text-muted"}>{pub.status}</span>
        <span className="text-faint tabular-nums">{pub.year}</span>
      </p>
      <h3 className={featured ? "mt-3 font-serif text-[clamp(1.55rem,2.6vw,2.15rem)] leading-[1.18] tracking-[-0.015em]" : "mt-2 font-serif text-[1.35rem] leading-snug"}>
        {pub.title}
      </h3>
      {pub.journal && <p className="mt-2 font-serif text-lg text-muted italic">{pub.journal}</p>}
      <p className="mt-2 max-w-[70ch] text-[15px] leading-relaxed text-muted">
        <Authors text={pub.authors} />
      </p>
      {published && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className={button("secondary", "h-9 px-4 text-sm")}>
            {t("research.doi")}
            <ArrowUpRightIcon size={14} />
          </a>
          <button type="button" onClick={copy} className={button("secondary", "h-9 px-4 text-sm")} aria-live="polite">
            {copied ? <CheckIcon size={15} weight="bold" /> : <CopyIcon size={15} />}
            {copied ? t("research.copied") : t("research.copy")}
          </button>
        </div>
      )}
    </li>
  );
}

export function Research() {
  const { t } = useTranslation();
  const pubs = useCopy<Publication[]>("research.publications");
  const academic = useCopy<Academic>("research.academic");
  const congresses = useCopy<Congress[]>("research.congresses");

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
        </div>
      }
    >
      <ol className="divide-y divide-line">
        {pubs.map((pub, i) => (
          <Reference key={pub.title} pub={pub} featured={i === 0} />
        ))}
      </ol>

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
