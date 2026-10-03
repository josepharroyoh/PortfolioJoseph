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
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** A statement whose words light up as it scrolls through the viewport. */
function Manifesto({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-display text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.15] font-medium tracking-[-0.03em]">
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
        <dl className="reveal mt-8 hidden space-y-4 border-t border-line pt-6 lg:block">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      }
    >
      <Manifesto text={t("about.manifesto")} />

      <div className="mt-12 grid gap-x-10 gap-y-5 md:grid-cols-2">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 20)} className="reveal leading-relaxed text-muted">
            {p}
          </p>
        ))}
        <a href={PROFILE.links.cieasest} target="_blank" rel="noopener noreferrer" className="reveal link-underline inline-flex items-center gap-1 self-start text-accent">
          {t("about.cieasest")}
          <ArrowUpRightIcon size={15} />
        </a>
      </div>

      <dl className="reveal mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 lg:hidden">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-sm text-muted">{f.label}</dt>
            <dd className="font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        <div className="reveal bg-surface p-6">
          <h3 className="text-sm text-muted">{t("about.seekingTitle")}</h3>
          <ul className="mt-4 space-y-2">
            {seeking.map((s) => (
              <li key={s} className="flex items-center gap-3 font-medium">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="reveal bg-surface p-6">
          <h3 className="text-sm text-muted">{t("about.traitsTitle")}</h3>
          <ul className="mt-4 space-y-2">
            {traits.map((s) => (
              <li key={s} className="font-medium">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
