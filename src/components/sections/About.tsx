import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { container } from "../ui/styles";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

type Fact = { label: string; value: string };

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** A statement whose words light up as it scrolls through the viewport. */
function Manifesto({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-display text-[clamp(1.8rem,4.2vw,3.4rem)] leading-[1.12] font-semibold tracking-[-0.03em]">
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
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const transform = useTransform(y, (v) => `translateY(${v}) scale(1.12)`);

  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 md:py-32">
      <div className={container}>
        <h2 id="about-title" className="reveal text-sm font-medium text-muted">
          {t("about.title")}
        </h2>
        <div className="mt-6 max-w-5xl">
          <Manifesto text={t("about.manifesto")} />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div ref={photoRef} className="reveal-clip relative aspect-[4/5] max-w-sm overflow-hidden rounded-2xl lg:col-span-4">
            <motion.img src={PROFILE.photo} alt={PROFILE.fullName} loading="lazy" style={{ transform }} className="h-full w-full object-cover object-top" />
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-5">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 20)} className="reveal max-w-[62ch] text-lg leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
            <a href={PROFILE.links.cieasest} target="_blank" rel="noopener noreferrer" className="reveal link-underline mt-5 inline-flex items-center gap-1 text-accent">
              {t("about.cieasest")}
              <ArrowUpRightIcon size={15} />
            </a>

            <dl className="reveal mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 md:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="mt-1 font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="reveal rounded-2xl bg-bg-2 p-6">
                <h3 className="text-sm text-muted">{t("about.seekingTitle")}</h3>
                <ul className="mt-4 space-y-2.5">
                  {seeking.map((s) => (
                    <li key={s} className="flex items-center gap-2.5 font-medium">
                      <CheckCircleIcon size={18} weight="fill" className="shrink-0 text-accent" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="reveal rounded-2xl border border-line p-6">
                <h3 className="text-sm text-muted">{t("about.traitsTitle")}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {traits.map((s) => (
                    <li key={s} className="rounded-full bg-surface px-3.5 py-1.5 text-[15px] shadow-card">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
