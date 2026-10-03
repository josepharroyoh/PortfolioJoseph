import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

/** Counts from zero to `value` once, the first time it scrolls into view. */
export function CountUp({ value, prefix = "", suffix = "", className }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const format = useMemo(() => new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en-US"), [lang]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const write = (v: number) => (el.textContent = `${prefix}${format.format(Math.round(v))}${suffix}`);
    if (reduced) {
      write(value);
      return;
    }
    const controls = animate(0, value, { duration: 1.6, ease: [0.23, 1, 0.32, 1], onUpdate: write });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, reduced, format]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format.format(value)}
      {suffix}
    </span>
  );
}
