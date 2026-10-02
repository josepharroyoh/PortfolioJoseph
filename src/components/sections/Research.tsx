import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { SectionHeading } from "../ui/SectionHeading";
import { container } from "../ui/styles";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

type Publication = { label: string; authors: string; year: string; title: string; journal: string };
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

  return (
    <section id="research" aria-labelledby="research-title" className="border-t border-line py-24 md:py-36">
      <div className={container}>
        <SectionHeading id="research-title" title={t("research.title")} intro={t("research.intro")} />

        {/* Set like a reference list: year in the margin, citation in the measure. */}
        <div className="mt-14 space-y-14">
          <article className="reveal grid gap-4 md:grid-cols-12 md:gap-8">
            <p className="font-mono text-4xl leading-none font-medium tracking-tight text-accent md:col-span-2 md:text-5xl">{pub.year}</p>
            <div className="md:col-span-9">
              <p className="text-sm text-muted">{pub.label}</p>
              <h3 className="mt-3 text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.02em]">{pub.title}</h3>
              <p className="mt-4 leading-relaxed text-muted">
                <Authors text={pub.authors} />
              </p>
              <p className="mt-2 italic">{pub.journal}</p>
            </div>
          </article>

          <article className="reveal grid gap-4 md:grid-cols-12 md:gap-8">
            <p className="font-mono text-4xl leading-none font-medium tracking-tight text-faint md:col-span-2 md:text-5xl">2023</p>
            <div className="md:col-span-9">
              <p className="text-sm text-muted">{academic.label}</p>
              <h3 className="mt-3 text-[clamp(1.35rem,2.2vw,1.8rem)] leading-[1.2] font-semibold tracking-[-0.02em]">{academic.title}</h3>
              <p className="mt-3 text-muted">
                <Authors text={academic.authors} />
              </p>
              <p className="mt-4 max-w-[65ch] leading-relaxed text-muted">{academic.text}</p>
              <a href={PROFILE.links.aireica} target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-flex items-center gap-1 text-accent">
                {academic.link}
                <ArrowUpRightIcon size={15} />
              </a>
            </div>
          </article>
        </div>

        <h3 className="reveal mt-20 text-xl font-semibold tracking-[-0.01em]">{t("research.congressesTitle")}</h3>
        <ol className="mt-6 border-t border-line">
          {congresses.map((c, i) => (
            <li key={`${c.title}-${i}`} className="reveal grid gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-8">
              <span className="font-mono text-sm text-faint md:col-span-2">{c.date}</span>
              <div className="md:col-span-7">
                <p className="font-medium">{c.title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{c.topic}</p>
              </div>
              <span className="text-sm text-muted md:col-span-3 md:text-right">{c.place}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
