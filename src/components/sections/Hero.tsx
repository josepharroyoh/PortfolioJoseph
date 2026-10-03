import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowDownIcon, ArrowUpRightIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { Magnetic } from "../fx/Interactions";
import { SocialLinks } from "../ui/SocialLinks";
import { button, container } from "../ui/styles";
import { PROFILE, THESIS_PATH } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";

const EASE = [0.23, 1, 0.32, 1] as const;

type Byline = { label: string; value: string; link?: boolean };

/** One line of the name, rising out of its own mask. */
function Line({ children, delay, ready, className }: { children: string; delay: number; ready: boolean; className?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={clsx("block", className)}
        initial={{ transform: "translateY(110%)" }}
        animate={ready ? { transform: "translateY(0%)" } : undefined}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Institutions and programmes, drifting past in serif italics. The page's only marquee. */
function Institutions() {
  const { t } = useTranslation();
  const items = useCopy<string[]>("hero.institutions");
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-8 pr-8 font-serif text-[clamp(1.3rem,2.2vw,1.8rem)] whitespace-nowrap text-muted italic">
          {item}
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mt-20">
      <p className={clsx(container, "label")}>{t("hero.institutionsLabel")}</p>
      <div className="marquee-mask mt-4 overflow-hidden border-y border-line py-5">
        <div className="marquee-track flex w-max animate-marquee motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useTranslation();
  const topics = useCopy<string[]>("hero.topics");
  const byline = useCopy<Byline[]>("hero.byline");
  const state = ready ? "in" : "out";

  const item = {
    out: { opacity: 0, transform: "translateY(12px)" },
    in: (i: number) => ({
      opacity: 1,
      transform: "translateY(0px)",
      transition: { duration: 0.7, delay: 0.4 + i * 0.08, ease: EASE },
    }),
  };

  return (
    <section id="home" aria-labelledby="hero-title" className="relative pb-6">
      <div className={clsx(container, "relative")}>
        {/* The first screen: everything from the status line to the byline fits one viewport. */}
        <div className="flex min-h-[100svh] flex-col pt-24 pb-6 md:pt-28">
          {/* Centred title block over the galaxy: status, name, role, research lines, actions. */}
          <div className="my-auto flex flex-col items-center py-4 text-center">
            <motion.p custom={0} variants={item} initial="out" animate={state} className="label">
              <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-px animate-pulse-dot rounded-full bg-ok align-middle text-ok" aria-hidden="true" />
              {t("hero.status")}
            </motion.p>

            <h1 id="hero-title" className="mt-6 text-[clamp(3.2rem,min(9vw,12vh),8.8rem)] leading-[0.9] font-[360] tracking-[-0.04em]">
              <Line ready={ready} delay={0.05}>
                {t("hero.name1")}
              </Line>
              <Line ready={ready} delay={0.15} className="text-accent italic">
                {t("hero.name2")}
              </Line>
            </h1>

            <motion.p custom={1} variants={item} initial="out" animate={state} className="mt-6 max-w-[62ch] font-serif text-[clamp(1.2rem,1.7vw,1.5rem)] leading-snug text-muted">
              {t("hero.role")}
            </motion.p>

            {/* Research lines as one quiet line of text, separated by small diamonds. */}
            <motion.ul custom={2} variants={item} initial="out" animate={state} className="mt-5 flex max-w-[64rem] flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[15px] text-ink/90 sm:gap-x-4">
              {topics.map((topic, i) => (
                <li key={topic} className="flex items-center gap-4">
                  {i > 0 && <span aria-hidden="true" className="hidden h-1.5 w-1.5 rotate-45 bg-accent sm:block" />}
                  <span className="transition-colors duration-200 hover:text-accent">{topic}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div custom={3} variants={item} initial="out" animate={state} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <a href="#academic" className={button("primary", "h-12 px-6")}>
                  {t("hero.ctaWork")}
                  <ArrowDownIcon size={16} weight="bold" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href={`mailto:${PROFILE.email}`} className={button("secondary", "h-12 px-6 bg-bg/70 backdrop-blur-sm")}>
                  <EnvelopeSimpleIcon size={17} />
                  {t("hero.ctaContact")}
                </a>
              </Magnetic>
              <SocialLinks labelled className="justify-center" />
            </motion.div>
          </div>

          {/* Byline, the way a paper lists its author details. */}
          <motion.dl
            custom={5}
            variants={item}
            initial="out"
            animate={state}
            className="grid grid-cols-1 gap-px overflow-hidden border-y border-line-strong bg-line sm:grid-cols-2 lg:grid-cols-4"
          >
            {byline.map((b) => (
              <div key={b.label} className="group bg-bg py-4 transition-colors duration-300 hover:bg-surface sm:px-5">
                <dt className="label transition-colors duration-200 group-hover:text-accent">{b.label}</dt>
                <dd className="mt-1.5 leading-snug">
                  {b.link ? (
                    <Link to={THESIS_PATH} className="inline-flex items-start gap-1 hover:text-accent">
                      <span className="link-underline">{b.value}</span>
                      <ArrowUpRightIcon size={14} className="mt-1 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  ) : (
                    b.value
                  )}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

      </div>
      <Institutions />
    </section>
  );
}
