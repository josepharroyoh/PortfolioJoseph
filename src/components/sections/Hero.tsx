import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon, ArrowUpRightIcon, FileTextIcon, LightningIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { ElectricField } from "../fx/ElectricField";
import type { FieldState } from "../fx/ElectricField";
import { ProximityText } from "../fx/ProximityText";
import { SocialLinks } from "../ui/SocialLinks";
import { button, container } from "../ui/styles";
import { CV_PATH, THESIS_PATH } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const EASE = [0.23, 1, 0.32, 1] as const;

type Panel = {
  title: string;
  sim: string;
  field: string;
  state: string;
  strikes: string;
  calm: string;
  charging: string;
  alert: string;
  strike: string;
  hint: string;
  hintTouch: string;
  link: string;
};

function RoleRotator({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % roles.length), 2800);
    return () => window.clearInterval(id);
  }, [roles.length]);
  const role = roles[i % roles.length];
  return (
    <span className="relative inline-grid align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={role}
          initial={{ opacity: 0, filter: "blur(6px)", transform: "translateY(40%)" }}
          animate={{ opacity: 1, filter: "blur(0px)", transform: "translateY(0%)" }}
          exit={{ opacity: 0, filter: "blur(6px)", transform: "translateY(-40%)" }}
          transition={{ duration: 0.45, ease: EASE }}
          className="col-start-1 row-start-1 text-accent"
        >
          {role}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Live readouts beside the simulated storm, written straight to the DOM. */
function StationPanel({ panel }: { panel: Panel }) {
  const finePointer = useMediaQuery("(pointer: fine)");
  const traceRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<HTMLSpanElement>(null);
  const strikesRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const onTick = useCallback(
    ({ level, strikes, striking }: FieldState) => {
      if (fieldRef.current) fieldRef.current.textContent = (0.4 + level * 7.6).toFixed(1);
      if (strikesRef.current) strikesRef.current.textContent = String(strikes);
      const state = striking ? "strike" : level >= 0.82 ? "alert" : level >= 0.55 ? "charging" : "calm";
      if (stateRef.current) {
        stateRef.current.textContent = panel[state];
        stateRef.current.dataset.state = state;
      }
      frameRef.current?.toggleAttribute("data-striking", striking);
    },
    [panel],
  );

  return (
    <div
      ref={frameRef}
      className="force-dark group/panel relative overflow-hidden rounded-2xl border border-line bg-bg shadow-[0_30px_80px_-30px_rgba(10,14,40,0.55)] transition-[box-shadow,border-color] duration-200 data-[striking]:border-accent"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent text-accent" aria-hidden="true" />
          {panel.title}
        </p>
        <p className="font-mono text-[11px] text-muted">{panel.sim}</p>
      </div>

      <div className="relative aspect-[5/4] w-full sm:aspect-[4/3] lg:aspect-[4/4.2]">
        <ElectricField vivid cloudX={0.55} ground={0.88} onTick={onTick} traceCanvas={traceRef} className="absolute inset-0" />
        <p className="pointer-events-none absolute top-3 left-4 max-w-[14rem] text-xs text-muted">{finePointer ? panel.hint : panel.hintTouch}</p>
      </div>

      <dl className="grid grid-cols-3 border-t border-line">
        <div className="border-r border-line px-4 py-3">
          <dt className="text-[11px] text-muted">{panel.field}</dt>
          <dd className="mt-1 font-mono text-lg tabular-nums">
            <span ref={fieldRef}>0.4</span>
            <span className="ml-1 text-xs text-muted">kV/m</span>
          </dd>
        </div>
        <div className="border-r border-line px-4 py-3">
          <dt className="text-[11px] text-muted">{panel.state}</dt>
          <dd className="mt-1 text-lg font-medium">
            <span ref={stateRef} data-state="calm" className="transition-colors duration-200 data-[state=alert]:text-accent data-[state=calm]:text-muted data-[state=strike]:text-accent">
              {panel.calm}
            </span>
          </dd>
        </div>
        <div className="px-4 py-3">
          <dt className="text-[11px] text-muted">{panel.strikes}</dt>
          <dd className="mt-1 font-mono text-lg tabular-nums">
            <span ref={strikesRef}>0</span>
          </dd>
        </div>
      </dl>
      <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3">
        <canvas ref={traceRef} aria-hidden="true" className="block h-8 w-40 shrink sm:w-52" />
        <Link to={THESIS_PATH} className="press group inline-flex items-center gap-1.5 rounded-full text-sm text-accent">
          {panel.link}
          <ArrowUpRightIcon size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}

function Ticker() {
  const items = useCopy<string[]>("ticker");
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 px-6 text-[15px] whitespace-nowrap text-muted">
          <LightningIcon size={14} weight="fill" className="text-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee-mask overflow-hidden border-y border-line py-4">
      <div className="marquee-track flex w-max animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useTranslation();
  const roles = useCopy<string[]>("hero.roles");
  const panel = useCopy<Panel>("hero.panel");
  const gridRef = useRef<HTMLDivElement>(null);
  const state = ready ? "in" : "out";

  const item = {
    out: { opacity: 0, transform: "translateY(16px)" },
    in: (i: number) => ({ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.7, delay: 0.08 + i * 0.07, ease: EASE } }),
  };

  // The dot grid follows the pointer; one element, so a CSS variable is cheap here.
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = gridRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };

  return (
    <section id="home" aria-labelledby="hero-title" onPointerMove={onPointerMove} className="relative overflow-hidden">
      <div ref={gridRef} aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0" />
      <div className={clsx(container, "relative grid items-center gap-12 pt-28 pb-16 lg:min-h-[100dvh] lg:grid-cols-12 lg:gap-10 lg:pt-24")}>
        <div className="lg:col-span-7">
          <motion.p custom={0} variants={item} initial="out" animate={state} className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-sm backdrop-blur">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[#1f9d55] text-[#1f9d55]" aria-hidden="true" />
            {t("hero.status")}
          </motion.p>

          <motion.h1
            id="hero-title"
            custom={1}
            variants={item}
            initial="out"
            animate={state}
            className="mt-7 text-[clamp(2.7rem,5.3vw,4.7rem)] leading-[0.95] tracking-[-0.045em]"
          >
            <ProximityText text={t("hero.name1")} className="block" />
            <ProximityText text={t("hero.name2")} className="block text-muted" />
          </motion.h1>

          <motion.p custom={2} variants={item} initial="out" animate={state} className="mt-7 font-display text-[clamp(1.35rem,2.4vw,1.9rem)] leading-snug font-semibold tracking-[-0.02em]">
            {t("hero.rolePrefix")} <RoleRotator roles={roles} />
          </motion.p>

          <motion.p custom={3} variants={item} initial="out" animate={state} className="mt-5 max-w-[36rem] text-lg leading-relaxed text-muted">
            {t("hero.text")}
          </motion.p>

          <motion.div custom={4} variants={item} initial="out" animate={state} className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#projects" className={button("primary")}>
              {t("hero.ctaWork")}
              <ArrowRightIcon size={16} weight="bold" />
            </a>
            <Link to={CV_PATH} className={button("secondary")}>
              <FileTextIcon size={17} />
              {t("hero.ctaCv")}
            </Link>
            <SocialLinks className="ml-1" />
          </motion.div>
        </div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, transform: "translateY(24px) scale(0.98)" }}
          animate={ready ? { opacity: 1, transform: "translateY(0px) scale(1)" } : undefined}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        >
          <StationPanel panel={panel} />
        </motion.div>
      </div>
      <Ticker />
    </section>
  );
}
