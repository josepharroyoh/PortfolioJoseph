import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowDownIcon, ArrowUpRightIcon, EnvelopeSimpleIcon, LightningIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { CubeBuddy } from "../brand/CubeBuddy";
import { IsobarField } from "../fx/IsobarField";
import { Magnetic, Tilt } from "../fx/Interactions";
import { SignalTrace } from "../fx/SignalTrace";
import type { SignalState } from "../fx/SignalTrace";
import { SocialLinks } from "../ui/SocialLinks";
import { button, container } from "../ui/styles";
import { PROFILE, THESIS_PATH } from "../../data/profile";
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
  trigger: string;
  say: string;
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

/** Figure 1: the live electric-field record, watched over by the cube. */
function FigureOne() {
  const signal = useCopy<Signal>("hero.signal");
  const finePointer = useMediaQuery("(pointer: fine)");
  const fieldRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<HTMLSpanElement>(null);
  const lastState = useRef<SignalState["state"]>("calm");
  const [strikes, setStrikes] = useState(0);
  const [saying, setSaying] = useState(false);

  // "¡Rayo!" shows for a moment after each strike.
  useEffect(() => {
    if (!strikes) return;
    setSaying(true);
    const id = window.setTimeout(() => setSaying(false), 1400);
    return () => window.clearTimeout(id);
  }, [strikes]);

  const onTick = useCallback(
    ({ field, state }: SignalState) => {
      if (fieldRef.current) fieldRef.current.textContent = field.toFixed(1).replace("-", "−");
      if (stateRef.current) {
        stateRef.current.textContent = signal.states[state];
        stateRef.current.dataset.state = state;
      }
      if (state === "strike" && lastState.current !== "strike") setStrikes((n) => n + 1);
      lastState.current = state;
    },
    [signal],
  );

  return (
    <figure className="reveal relative mt-24 md:mt-28">
      {/* The cube sits on the frame, follows your cursor and jumps at every strike. */}
      <div className="absolute -top-[52px] right-5 z-10 flex items-end gap-2 md:right-8">
        <AnimatePresence>
          {saying && (
            <motion.span
              key={strikes}
              initial={{ opacity: 0, transform: "translateY(6px) scale(0.9)" }}
              animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.25, ease: EASE }}
              className="mb-6 rounded-full border border-line bg-surface px-2.5 py-1 font-serif text-sm italic shadow-card"
            >
              {signal.say}
            </motion.span>
          )}
        </AnimatePresence>
        <CubeBuddy size={52} follow startle={strikes} />
      </div>

      <div className="overflow-hidden rounded-sm border border-line-strong bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-4 py-3 md:px-5">
          <p className="text-sm font-medium">{signal.label}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("signal:storm"))}
              className="press inline-flex h-8 items-center gap-1.5 rounded-full border border-line-strong px-3 text-[13px] hover:border-accent hover:text-accent"
            >
              <LightningIcon size={14} weight="fill" />
              {signal.trigger}
            </button>
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
        </div>
        <div className="relative h-[180px] md:h-[240px]">
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
    in: (i: number) => ({ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.7, delay: 0.4 + i * 0.08, ease: EASE } }),
  };

  return (
    <section id="home" aria-labelledby="hero-title" className="relative pt-28 pb-6 md:pt-36">
      {/* Weather-map isobars behind the title block; the cursor is a low they bend around. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1.6, delay: 0.3 }}
        className="isobar-mask absolute inset-x-0 top-0 h-[min(980px,100%)]"
      >
        <IsobarField className="h-full w-full" />
      </motion.div>

      <div className={clsx(container, "relative")}>
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
            <motion.ul custom={1} variants={item} initial="out" animate={state} className="mt-7 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-line-strong bg-bg/70 px-3 py-1 text-[14px] font-medium backdrop-blur-sm transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  {topic}
                </li>
              ))}
            </motion.ul>

            <motion.p custom={2} variants={item} initial="out" animate={state} className="mt-6 max-w-[38ch] font-serif text-[clamp(1.3rem,2vw,1.6rem)] leading-[1.4] text-muted">
              {t("hero.text")}
            </motion.p>

            <motion.div custom={3} variants={item} initial="out" animate={state} className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#research" className={button("primary")}>
                  {t("hero.ctaWork")}
                  <ArrowDownIcon size={16} weight="bold" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" className={button("secondary", "bg-bg/70 backdrop-blur-sm")}>
                  <EnvelopeSimpleIcon size={17} />
                  {t("hero.ctaContact")}
                </a>
              </Magnetic>
              <SocialLinks className="ml-1" />
            </motion.div>
          </div>

          <motion.figure
            className="w-full max-w-[15rem] sm:max-w-[22rem] lg:col-span-4 lg:ml-auto"
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={ready ? { opacity: 1, clipPath: "inset(0% 0 0 0)" } : undefined}
            transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
          >
            <Tilt className="group overflow-hidden rounded-sm">
              {/* Studio-white portrait: multiplied onto a fixed grey and shown in greyscale, colour on hover. */}
              <div className="aspect-[4/5] overflow-hidden bg-[#e4e4e1]">
                <img
                  src={PROFILE.photo}
                  alt={PROFILE.fullName}
                  className="h-full w-full object-cover object-[50%_20%] mix-blend-multiply grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
            </Tilt>
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

        <FigureOne />
      </div>
      <Institutions />
    </section>
  );
}
