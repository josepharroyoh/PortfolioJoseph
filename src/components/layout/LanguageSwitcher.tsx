import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { LANGUAGES } from "../../i18n";

/** Segmented ES / EN / PT control with a sliding highlight. */
export function LanguageSwitcher({ className, id = "lang" }: { className?: string; id?: string }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? "es";
  return (
    <div role="group" aria-label={t("nav.language")} className={clsx("glass flex items-center rounded-full p-1", className)}>
      {LANGUAGES.map(({ code, label }) => {
        const active = current === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => i18n.changeLanguage(code)}
            aria-pressed={active}
            title={label}
            className={clsx(
              "relative rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors duration-300",
              active ? "text-ink" : "text-muted hover:text-paper",
            )}
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-paper"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{code}</span>
          </button>
        );
      })}
    </div>
  );
}
