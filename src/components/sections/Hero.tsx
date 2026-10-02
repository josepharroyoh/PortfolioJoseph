import { motion } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { ElectricField } from "../fx/ElectricField";
import { button, container } from "../ui/styles";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const EASE = [0.23, 1, 0.32, 1] as const;

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useTranslation();
  const wide = useMediaQuery("(min-width: 1024px)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const traceRef = useRef<HTMLCanvasElement>(null);
  const state = ready ? "in" : "out";

  const rise = {
    out: { transform: "translateY(105%)" },
    in: (i: number) => ({ transform: "translateY(0%)", transition: { duration: 0.9, delay: 0.05 + i * 0.08, ease: EASE } }),
  };
  const fade = {
    out: { opacity: 0, transform: "translateY(12px)" },
    in: (i: number) => ({ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.7, delay: 0.3 + i * 0.07, ease: EASE } }),
  };

  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100dvh] flex-col overflow-hidden lg:block">
      <div className={`${container} relative z-10 pt-28 lg:flex lg:min-h-[100dvh] lg:items-center lg:pt-16`}>
        <div className="lg:pointer-events-none">
          <h1 id="hero-title" className="text-[clamp(2.9rem,6.4vw,5.4rem)] leading-[0.95] font-semibold tracking-[-0.04em] lg:whitespace-nowrap">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" custom={0} variants={rise} initial="out" animate={state}>
                {t("hero.name1")}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block text-muted" custom={1} variants={rise} initial="out" animate={state}>
                {t("hero.name2")}
              </motion.span>
            </span>
          </h1>

          <motion.p custom={0} variants={fade} initial="out" animate={state} className="mt-7 max-w-[34rem] text-lg leading-relaxed text-muted md:text-xl">
            {t("hero.text")}
          </motion.p>

          <motion.div custom={1} variants={fade} initial="out" animate={state} className="pointer-events-auto mt-9 flex flex-wrap gap-3">
            <a href="#projects" className={button("primary")}>
              {t("hero.ctaWork")}
              <ArrowRightIcon size={16} weight="bold" />
            </a>
            <a href="#contact" className={button("secondary")}>
              {t("hero.ctaContact")}
            </a>
          </motion.div>
        </div>
      </div>

      {/* The storm: full-bleed behind the copy on desktop, its own band on phones. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mt-8 h-[46dvh] min-h-72 w-full flex-1 lg:absolute lg:inset-0 lg:mt-0 lg:h-full"
      >
        <ElectricField
          cloudX={wide ? 0.76 : 0.55}
          traceCanvas={traceRef}
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_18%)] lg:[mask-image:linear-gradient(to_right,transparent_28%,#000_64%)]"
        />
        <div className={`${container} pointer-events-none absolute inset-x-0 top-3 flex justify-end lg:top-auto lg:bottom-6`}>
          <div className="flex items-end gap-5">
            <p className="max-w-[15rem] text-right text-xs leading-snug text-muted">{finePointer ? t("hero.caption") : t("hero.captionTouch")}</p>
            <div className="hidden w-44 shrink-0 sm:block">
              <canvas ref={traceRef} aria-hidden="true" className="block h-10 w-full" />
              <p className="mt-1 font-mono text-[10px] text-faint">{t("hero.sensor")}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
