import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Section } from "../ui/Section";
import { button } from "../ui/styles";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";


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

  return (
    <Section
      id="publications"
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

    </Section>
  );
}
