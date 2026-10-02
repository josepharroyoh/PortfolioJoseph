import { animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bat } from "../brand/Bat";

const EASE = [0.76, 0, 0.24, 1] as const;

/** Short preloader: the bat flies in while a counter runs, then the curtain lifts. */
export function Intro({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setLeaving(true),
    });
    return () => controls.stop();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-6 md:px-10 md:py-8"
      initial={{ y: 0 }}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      onAnimationComplete={() => leaving && onDone()}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
        <span>Portfolio</span>
        <span>Ica · Perú</span>
      </div>

      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid h-20 w-20 place-items-center rounded-2xl bg-white"
        >
          <Bat size={72} />
        </motion.div>
        <div className="overflow-hidden">
          <motion.p
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl tracking-tight md:text-6xl"
          >
            Joseph <em className="text-gradient">Arroyo</em>
          </motion.p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-px w-full overflow-hidden bg-line">
          <div className="h-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${count}%` }} />
        </div>
        <div className="flex items-end justify-between">
          <span className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">{t("intro.loading")}</span>
          <span className="font-display text-6xl leading-none tabular-nums md:text-8xl">{String(count).padStart(3, "0")}</span>
        </div>
      </div>
    </motion.div>
  );
}
