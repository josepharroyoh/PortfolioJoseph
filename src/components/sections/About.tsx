import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, BrainCircuit, CloudCog, Orbit } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal, ScrollLitText } from "../ui/motion";
import { PROFILE } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";
import { useSpotlight } from "../../hooks/useSpotlight";

type Fact = { label: string; value: string };
type Focus = { title: string; text: string };

const FOCUS_ICONS = [Orbit, CloudCog, BrainCircuit];

export function About() {
  const { t } = useTranslation();
  const facts = useCopy<Fact[]>("about.facts");
  const focus = useCopy<Focus[]>("about.focus");
  const traits = useCopy<string[]>("about.traits");
  const spotlight = useSpotlight<HTMLDivElement>();

  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const frameRotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <section id="about" className="relative z-10 mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-40">
      <SectionHeader eyebrow={t("about.eyebrow")} title={t("about.title")} />

      <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div ref={photoRef} className="relative mx-auto max-w-[22rem]">
            <motion.div
              style={{ rotate: frameRotate }}
              className="absolute -inset-4 rounded-t-full rounded-b-[2.6rem] bg-gradient-to-br from-cyan/40 via-transparent to-violet/40 opacity-70 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] border border-line-strong bg-ink-2">
              <motion.img
                src={PROFILE.photo}
                alt={PROFILE.fullName}
                style={{ y: imgY, scale: 1.12 }}
                className="h-full w-full object-cover object-top brightness-[0.92] contrast-[1.05]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6">
                <p className="font-display text-3xl leading-none">{PROFILE.shortName}</p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">{t("about.photoCaption")}</p>
              </div>
            </div>
            <motion.span
              className="glass absolute top-10 -right-3 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-paper uppercase md:-right-8"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              B.Sc. Physics
            </motion.span>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <ScrollLitText text={t("about.lead")} className="text-[clamp(1.45rem,2.6vw,2.15rem)] leading-[1.35] tracking-[-0.01em] text-paper" />

          <Reveal delay={0.1}>
            <p className="mt-8 text-base leading-relaxed text-muted md:text-lg">{t("about.body")}</p>
            <a
              href={PROFILE.links.cieasest}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 text-sm text-cyan"
            >
              <span className="border-b border-cyan/40 pb-0.5 transition-colors group-hover:border-cyan">{t("about.cieasestLabel")}</span>
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-12 divide-y divide-line border-y border-line">
              {facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="font-mono text-[11px] tracking-[0.2em] text-faint uppercase">{f.label}</dt>
                  <dd className="text-right text-paper">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-2">
            {traits.map((trait) => (
              <span key={trait} className="rounded-full border border-line-strong px-4 py-2 text-sm text-paper/90">
                {trait}
              </span>
            ))}
          </Reveal>
        </div>
      </div>

      <div className="mt-24">
        <Reveal>
          <p className="eyebrow">{t("about.focusTitle")}</p>
        </Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {focus.map((f, i) => {
            const Icon = FOCUS_ICONS[i % FOCUS_ICONS.length];
            return (
              <Reveal key={f.title} delay={i * 0.1}>
                <div {...spotlight} className="spotlight glass group h-full rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line-strong bg-white/[0.04] text-cyan">
                      <Icon size={22} strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-xs text-faint">0{i + 1}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl leading-tight text-paper md:text-[1.7rem]">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
