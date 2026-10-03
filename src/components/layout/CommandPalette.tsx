import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowElbowDownLeftIcon,
  CopyIcon,
  FileTextIcon,
  HashIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { LANGUAGES } from "../../i18n";
import { CV_PATH, PROFILE, SECTIONS, THESIS_PATH } from "../../data/profile";
import { palette, usePaletteOpen } from "../../hooks/usePalette";

type Command = { id: string; group: "sections" | "actions"; label: string; icon: ReactNode; run: () => void };

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * ⌘K / Ctrl+K command menu. Opened from the keyboard many times a session,
 * so per Emil's rule it has no open or close animation.
 */
export function CommandPalette() {
  const { t, i18n } = useTranslation();
  const open = usePaletteOpen();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        palette.toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setIndex(0);
      setNotice("");
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
      restoreRef.current?.focus?.();
    }
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => () => {
      palette.close();
      if (pathname === "/") document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      else navigate(`/#${id}`);
    };
    const sections: Command[] = SECTIONS.filter((s) => s !== "home").map((id) => ({
      id,
      group: "sections",
      label: t(`nav.${id}`),
      icon: <HashIcon size={18} />,
      run: go(id),
    }));
    const actions: Command[] = [
      { id: "cv", group: "actions", label: t("palette.openCv"), icon: <FileTextIcon size={18} />, run: () => (palette.close(), navigate(CV_PATH)) },
      { id: "thesis", group: "actions", label: t("palette.openThesis"), icon: <LightningIcon size={18} />, run: () => (palette.close(), navigate(THESIS_PATH)) },
      {
        id: "email",
        group: "actions",
        label: `${t("palette.copyEmail")}: ${PROFILE.email}`,
        icon: <CopyIcon size={18} />,
        run: () => {
          navigator.clipboard?.writeText(PROFILE.email).then(() => setNotice(t("palette.emailCopied")), () => {});
        },
      },
      ...LANGUAGES.filter((l) => l.code !== i18n.resolvedLanguage).map((l) => ({
        id: `lang-${l.code}`,
        group: "actions" as const,
        label: `${t("palette.language")} ${l.label}`,
        icon: <TranslateIcon size={18} />,
        run: () => (palette.close(), i18n.changeLanguage(l.code)),
      })),
    ];
    return [...sections, ...actions];
  }, [t, i18n, navigate, pathname]);

  const filtered = commands.filter((c) => fold(c.label).includes(fold(query)));
  const active = Math.min(index, Math.max(0, filtered.length - 1));

  if (!open) return null;

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") palette.close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((active + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((active - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") filtered[active]?.run();
  };

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center bg-black/40 px-4 pt-[14vh]" onMouseDown={() => palette.close()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.search")}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <MagnifyingGlassIcon size={18} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder={t("palette.placeholder")}
            aria-controls="palette-list"
            aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
            className="h-14 w-full bg-transparent text-[16px] outline-none placeholder:text-muted"
          />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">{t("palette.empty")}</li>}
          {filtered.map((c, i) => {
            const heading = c.group !== lastGroup ? t(`palette.${c.group}`) : null;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {heading && <p className="px-3 pt-3 pb-1.5 text-xs text-muted">{heading}</p>}
                <button
                  id={`cmd-${c.id}`}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setIndex(i)}
                  onClick={c.run}
                  className={clsx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px]", i === active ? "bg-bg-2 text-ink" : "text-muted")}
                >
                  <span className={i === active ? "text-accent" : ""}>{c.icon}</span>
                  <span className="flex-1 truncate">{c.label}</span>
                  {i === active && <ArrowElbowDownLeftIcon size={15} className="text-muted" />}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-line px-4 py-2.5 text-xs text-muted" aria-live="polite">
          {notice || t("palette.hint")}
        </p>
      </div>
    </div>
  );
}
