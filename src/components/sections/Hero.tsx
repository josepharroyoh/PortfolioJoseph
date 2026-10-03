import { motion } from "framer-motion";
import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowDownIcon, ArrowUpRightIcon, FileTextIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { SignalTrace } from "../fx/SignalTrace";
import type { SignalState } from "../fx/SignalTrace";
import { SocialLinks } from "../ui/SocialLinks";
import { button, container } from "../ui/styles";
import { CV_PATH, PROFILE, THESIS_PATH } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const EASE = [0.23, 1, 0.32, 1] as const;

type Signal = {
  figure: string;
  label: string;
  caption: string;
  hint: string;
  hintTouch: string;
  threshold: string;
  states: Record<SignalState["state"], string>;
};
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

/** Figure 1: the live electric-field record, captioned like a paper figure. */
function FigureOne() {
  const signal = useCopy<Signal>("hero.signal");
  const finePointer = useMediaQuery("(pointer: fine)");
  const fieldRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<HTMLSpanElement>(null);
  const onTick = useCallback(
    ({ field, state }: SignalState) => {
      if (fieldRef.current) fieldRef.current.textContent = field.toFixed(1).replace("-", "−");
      if (stateRef.current) {
        stateRef.current.textContent = signal.states[state];
        stateRef.current.dataset.state = state;
      }
    },
    [signal],
  );

  return (
    <figure className="reveal mt-16 md:mt-20">
      <div className="overflow-hidden rounded-sm border border-line-strong bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-4 py-3 md:px-5">
          <p className="text-sm font-medium">{signal.label}</p>
          <p className="flex items-center gap-3 font-mono text-sm tabular-nums">
            <span>
              <span ref={fieldRef}>0.0</span> <span className="text-muted">kV/m</span>
            </span>
            <span
              ref={stateRef}
              data-state="calm"
              className="rounded-full border border-line px-2 py-0.5 font-sans text-xs text-muted transition-colors duration-200 data-[state=alert]:border-accent data-[state=alert]:text-accent data-[state=strike]:border-accent data-[state=strike]:bg-accent data-[state=strike]:text-on-accent"
            >
              {signal.states.calm}
            </span>
          </p>
        </div>
        <div className="relative h-[170px] md:h-[230px]">
          <SignalTrace onTick={onTick} threshold={signal.threshold} className="absolute inset-0 block h-full w-full touch-manipulation" />
        </div>
      </div>
      <figcaption className="mt-3 grid gap-1 text-[15px] leading-relaxed text-muted md:grid-cols-[minmax(0,1fr)_auto] md:gap-8">
        <p className="max-w-[80ch] font-serif text-[1.02rem]">
          <span className="font-sans text-sm font-semibold text-ink">{signal.figure}.</span> {signal.caption}
        </p>
        <p className="text-sm text-faint italic">{finePointer ? signal.hint : signal.hintTouch}</p>
      </figcaption>
    </figure>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useTranslation();
  const topics = useCopy<string[]>("hero.topics");
  const byline = useCopy<Byline[]>("hero.byline");
  const state = ready ? "in" : "out";

  const item = {
    out: { opacity: 0, transform: "translateY(12px)" },
    in: (i: number) => ({ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.7, delay: 0.4 + i * 0.08, ease: EASE } }),
  };

  return (
    <section id="home" aria-labelledby="hero-title" className="relative pt-28 pb-6 md:pt-36">
      <div className={container}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <motion.p custom={0} variants={item} initial="out" animate={state} className="label flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ok text-ok" aria-hidden="true" />
              {t("hero.status")}
            </motion.p>

            <h1 id="hero-title" className="mt-6 text-[clamp(3.3rem,8.4vw,7.6rem)] leading-[0.92] font-[380] tracking-[-0.035em]">
              <Line ready={ready} delay={0.05}>
                {t("hero.name1")}
              </Line>
              <Line ready={ready} delay={0.15} className="text-accent italic">
                {t("hero.name2")}
              </Line>
            </h1>

            {/* What I work on, right under the name. */}
            <motion.ul custom={1} variants={item} initial="out" animate={state} className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-medium">
              {topics.map((topic) => (
                <li key={topic} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                  {topic}
                </li>
              ))}
            </motion.ul>

            <motion.p custom={2} variants={item} initial="out" animate={state} className="mt-6 max-w-[38ch] font-serif text-[clamp(1.3rem,2vw,1.6rem)] leading-[1.4] text-muted">
              {t("hero.text")}
            </motion.p>

            <motion.div custom={3} variants={item} initial="out" animate={state} className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#research" className={button("primary")}>
                {t("hero.ctaWork")}
                <ArrowDownIcon size={16} weight="bold" />
              </a>
              <Link to={CV_PATH} className={button("secondary")}>
                <FileTextIcon size={17} />
                {t("hero.ctaCv")}
              </Link>
              <SocialLinks className="ml-1" />
            </motion.div>
          </div>

          <motion.figure
            className="group w-full max-w-[15rem] sm:max-w-[22rem] lg:col-span-4 lg:ml-auto"
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={ready ? { opacity: 1, clipPath: "inset(0% 0 0 0)" } : undefined}
            transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
          >
            {/* Studio-white portrait: multiplied onto a fixed grey and shown in greyscale, colour on hover. */}
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-[#e4e4e1]">
              <img
                src={PROFILE.photo}
                alt={PROFILE.fullName}
                className="h-full w-full object-cover object-[50%_20%] mix-blend-multiply grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              />
            </div>
            <figcaption className="mt-2 flex justify-between text-sm text-muted">
              <span className="italic">{PROFILE.fullName}</span>
              <span>{t("hero.photoCaption")}</span>
            </figcaption>
          </motion.figure>
        </div>

        {/* Byline, the way a paper lists its author details. */}
        <motion.dl
          custom={4}
          variants={item}
          initial="out"
          animate={state}
          className="mt-14 grid grid-cols-1 gap-px overflow-hidden border-y border-line-strong bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {byline.map((b) => (
            <div key={b.label} className="bg-bg py-4 sm:pr-6 sm:even:pl-6 lg:pl-6 lg:first:pl-0">
              <dt className="label">{b.label}</dt>
              <dd className="mt-1.5 leading-snug">
                {b.link ? (
                  <Link to={THESIS_PATH} className="group inline-flex items-start gap-1 hover:text-accent">
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

        <FigureOne />
      </div>
    </section>
  );
}
