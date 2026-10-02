import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bat } from "../brand/Bat";

/** First-visit curtain: the bat flaps once over the name, then the page slides in. */
export function Intro({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setLeaving(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-bg"
      initial={{ clipPath: "inset(0 0 0 0)" }}
      animate={leaving ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0 0)" }}
      transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
      onAnimationComplete={() => leaving && onDone()}
    >
      <motion.div
        className="flex flex-col items-center gap-5"
        initial={{ opacity: 0, transform: "scale(0.94)" }}
        animate={{ opacity: 1, transform: "scale(1)" }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      >
        <span className="grid h-20 w-20 place-items-center rounded-2xl bg-white ring-1 ring-line">
          <Bat size={68} />
        </span>
        <span className="font-display text-2xl font-semibold tracking-[-0.02em]">Joseph Arroyo</span>
      </motion.div>
    </motion.div>
  );
}
