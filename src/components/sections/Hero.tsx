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

const EASE = [0.23, 1, 0.32, 1] as const;

/** One line of the name, rising out of its own mask. */
function Line({ children, delay, ready, className }: { children: string; delay: number; ready: boolean; className?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={clsx("block", className)}
        initial={{ transform: "translateY(105%)" }}
        animate={ready ? { transform: "translateY(0%)" } : undefined}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

type Signal = { label: string; note: string; threshold: string; states: Record<SignalState["state"], string> };

function SignalReadout() {
  const signal = useCopy<Signal>("hero.signal");
  const fieldRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<HTMLSpanElement>(null);
  const onTick = useCallback(({ field, state }: SignalState) => {
    if (fieldRef.current) fieldRef.current.textContent = field.toFixed(1).replace("-", "−");
    if (stateRef.current) {
      stateRef.current.textContent = signal.states[state];
      stateRef.current.dataset.state = state;
    }
  }, [signal]);

  return (
    <div className="flex h-full flex-col border-t border-line">
      <div className={clsx(container, "flex flex-wrap items-end justify-between gap-x-6 gap-y-1 pt-4")}>
        <p className="text-sm font-medium">
          {signal.label} <span className="ml-1 hidden font-normal text-faint md:inline">{signal.note}</span>
        </p>
        <p className="flex items-baseline gap-3 font-mono text-sm tabular-nums">
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
        <p className="w-full text-xs text-faint md:hidden">{signal.note}</p>
      </div>
      {/* Fills whatever height the first screen has left, never less than a readable strip. */}
      <div className="relative max-h-[280px] min-h-[110px] flex-1 md:min-h-[128px]">
        <SignalTrace onTick={onTick} threshold={signal.threshold} className="absolute inset-0 block h-full w-full touch-manipulation" />
      </div>
    </div>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useTranslation();
  const topics = useCopy<string[]>("hero.topics");
  const state = ready ? "in" : "out";

  const item = {
    out: { opacity: 0, transform: "translateY(12px)" },
    in: (i: number) => ({ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.6, delay: 0.35 + i * 0.07, ease: EASE } }),
  };

  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100dvh] flex-col">
      <div className={clsx(container, "grid items-end gap-10 pt-28 pb-10 lg:grid-cols-12 lg:gap-12 lg:pt-24 lg:pb-10")}>
        <div className="lg:col-span-8">
          <motion.p custom={0} variants={item} initial="out" animate={state} className="inline-flex items-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-ok text-ok" aria-hidden="true" />
            {t("hero.status")}
          </motion.p>

          <h1 id="hero-title" className="mt-6 text-[clamp(3rem,7.2vw,6.8rem)] leading-[0.92] font-semibold tracking-[-0.05em] whitespace-nowrap">
            <Line ready={ready} delay={0.05}>
              {t("hero.name1")}
            </Line>
            <Line ready={ready} delay={0.14} className="text-muted">
              {t("hero.name2")}
            </Line>
          </h1>

          {/* What I work on, right under the name. */}
          <motion.ul custom={1} variants={item} initial="out" animate={state} className="mt-7 flex flex-wrap gap-x-2 gap-y-1 font-display text-[clamp(1.05rem,1.7vw,1.4rem)] font-medium tracking-[-0.015em]">
            {topics.map((topic, i) => (
              <li key={topic} className="flex items-center gap-2">
                {topic}
                {i < topics.length - 1 && (
                  <span aria-hidden="true" className="text-accent">
                    /
                  </span>
                )}
              </li>
            ))}
          </motion.ul>

          <motion.p custom={2} variants={item} initial="out" animate={state} className="mt-5 max-w-[34rem] text-lg leading-relaxed text-muted">
            {t("hero.text")}
          </motion.p>

          <motion.div custom={3} variants={item} initial="out" animate={state} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className={button("primary")}>
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

        <motion.aside
          className="grid grid-cols-[7.5rem_1fr] gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1"
          initial={{ opacity: 0, transform: "translateY(20px)" }}
          animate={ready ? { opacity: 1, transform: "translateY(0px)" } : undefined}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        >
          {/* The portrait has a studio-white backdrop; multiplying it onto a fixed light grey seats it in both themes. */}
          <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#e3e3df] lg:aspect-[4/3.3]">
            <img src={PROFILE.photo} alt={t("hero.photoAlt")} className="h-full w-full object-cover object-[50%_20%] mix-blend-multiply" />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#161618]/80 px-3 py-1 text-xs font-medium text-[#ececee] backdrop-blur">Ica, Perú</figcaption>
          </figure>
          <Link
            to={THESIS_PATH}
            className="press group flex flex-col justify-between gap-3 rounded-2xl border border-line bg-surface p-5 hover:border-line-strong"
          >
            <span className="flex items-center gap-2 text-sm text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {t("hero.now.label")}
            </span>
            <span className="leading-snug font-medium">{t("hero.now.text")}</span>
            <span className="inline-flex items-center gap-1 text-sm text-accent">
              {t("hero.now.link")}
              <ArrowUpRightIcon size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </motion.aside>
      </div>

      <motion.div className="flex flex-1 flex-col" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ duration: 0.8, delay: 0.6 }}>
        <SignalReadout />
      </motion.div>
    </section>
  );
}
