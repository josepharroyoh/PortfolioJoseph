import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Section } from "../ui/Section";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

type Fact = { label: string; value: string };

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** The opening statement: its words come into ink as you read down. */
function Lead({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-serif text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.28] tracking-[-0.01em]">
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

export function About() {
  const { t } = useTranslation();
  const paragraphs = useCopy<string[]>("about.paragraphs");
  const facts = useCopy<Fact[]>("about.facts");
  const seeking = useCopy<string[]>("about.seeking");
  const traits = useCopy<string[]>("about.traits");

  return (
    <Section
      id="about"
      title={t("about.title")}
      aside={
        <div className="space-y-8">
          <dl className="reveal space-y-4">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="label">{f.label}</dt>
                <dd className="mt-0.5">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="reveal">
            <h3 className="label">{t("about.seekingTitle")}</h3>
            <ul className="mt-2 space-y-1">
              {seeking.map((s) => (
                <li key={s} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ›
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h3 className="label">{t("about.traitsTitle")}</h3>
            <p className="mt-2">{traits.join(", ")}</p>
          </div>
        </div>
      }
    >
      <Lead text={t("about.manifesto")} />
      <div className="mt-10 max-w-[64ch] space-y-5">
        {paragraphs.map((p, i) => (
          <p key={p.slice(0, 20)} className={`reveal serif-body ${i === 0 ? "dropcap" : ""}`}>
            {p}
          </p>
        ))}
      </div>
      <a href={PROFILE.links.cieasest} target="_blank" rel="noopener noreferrer" className="reveal link-underline mt-6 inline-flex items-center gap-1 text-accent">
        {t("about.cieasest")}
        <ArrowUpRightIcon size={15} />
      </a>
    </Section>
  );
}
