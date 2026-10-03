import { LayoutGroup, motion } from "framer-motion";
import { useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import clsx from "clsx";

export type Tab = { id: string; label: string; count?: number };

/**
 * Segmented tabs: a pill slides between options, counts sit beside each label,
 * and arrow keys move between tabs (WAI-ARIA tablist).
 */
export function Tabs({ tabs, value, onChange, idPrefix, label }: { tabs: Tab[]; value: string; onChange: (id: string) => void; idPrefix: string; label: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === value);
    const next = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : -1;
    if (next < 0) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <LayoutGroup id={idPrefix}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKey}
        className="flex w-full gap-1 rounded-full border border-line bg-surface/70 p-1 backdrop-blur md:inline-flex md:w-auto"
      >
        {tabs.map((t, i) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${t.id}`}
              aria-selected={active}
              aria-controls={`${idPrefix}-panel`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(t.id)}
              className={clsx(
                "press relative inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-[13px] font-medium transition-colors duration-200 sm:px-5 sm:text-[15px] md:flex-none",
                active ? "text-on-accent" : "text-muted hover:text-ink",
              )}
            >
              {active && <motion.span layoutId={`${idPrefix}-pill`} className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", duration: 0.45, bounce: 0.15 }} />}
              <span className="relative">{t.label}</span>
              {t.count !== undefined && (
                <span className={clsx("relative hidden rounded-full px-1.5 text-xs tabular-nums sm:inline", active ? "bg-on-accent/20" : "bg-bg-2 text-faint")}>{t.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
