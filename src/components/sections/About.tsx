import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { container } from "../ui/styles";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

type Fact = { label: string; value: string };

export function About() {
  const { t } = useTranslation();
  const paragraphs = useCopy<string[]>("about.paragraphs");
  const facts = useCopy<Fact[]>("about.facts");
  const traits = useCopy<string[]>("about.traits");
  const [lead, ...rest] = paragraphs;

  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 md:py-36">
      <div className={`${container} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
        <figure className="lg:col-span-4">
          <img
            src={PROFILE.photo}
            alt={PROFILE.fullName}
            loading="lazy"
            className="reveal-clip aspect-[4/5] w-full max-w-sm rounded-xl object-cover object-top"
          />
        </figure>

        <div className="lg:col-span-7 lg:col-start-6">
          <h2 id="about-title" className="reveal text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
            {t("about.title")}
          </h2>
          <p className="reveal mt-8 text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.4] tracking-[-0.01em]">{lead}</p>
          {rest.map((p) => (
            <p key={p.slice(0, 24)} className="reveal mt-5 max-w-[62ch] text-lg leading-relaxed text-muted">
              {p}
            </p>
          ))}
          <a
            href={PROFILE.links.cieasest}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal link-underline mt-6 inline-flex items-center gap-1 text-accent"
          >
            {t("about.cieasest")}
            <ArrowUpRightIcon size={15} />
          </a>

          <dl className="reveal mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-sm text-faint">{f.label}</dt>
                <dd className="mt-1 text-[17px]">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="reveal mt-8 text-muted">{traits.join("  /  ")}</p>
        </div>
      </div>
    </section>
  );
}
