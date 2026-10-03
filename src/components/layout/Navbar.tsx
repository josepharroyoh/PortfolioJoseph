import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileTextIcon, ListIcon, MagnifyingGlassIcon, MoonIcon, SunIcon, XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { BatTile } from "../brand/Bat";
import { SocialLinks } from "../ui/SocialLinks";
import { button, container } from "../ui/styles";
import { LANGUAGES } from "../../i18n";
import { useTheme } from "../../hooks/useTheme";
import { palette } from "../../hooks/usePalette";
import { CV_PATH, type SectionId } from "../../data/profile";

const LINKS = ["highlights", "projects", "about", "research", "timeline", "contact"] as const;
type LinkId = (typeof LINKS)[number];

const NAV_FOR: Partial<Record<SectionId, LinkId>> = {
  highlights: "highlights",
  projects: "projects",
  about: "about",
  research: "research",
  timeline: "timeline",
  skills: "timeline",
  contact: "contact",
};

function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const ref = useRef<HTMLButtonElement>(null);
  const dark = theme === "dark";
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => toggle(ref.current)}
      aria-label={dark ? t("nav.toLight") : t("nav.toDark")}
      title={dark ? t("nav.toLight") : t("nav.toDark")}
      className="press grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-bg-2"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, transform: "rotate(-90deg) scale(0.8)" }}
          animate={{ opacity: 1, transform: "rotate(0deg) scale(1)" }}
          exit={{ opacity: 0, transform: "rotate(90deg) scale(0.8)" }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="grid place-items-center"
        >
          {dark ? <SunIcon size={19} /> : <MoonIcon size={19} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function LanguageSwitch() {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? "es";
  return (
    <div role="group" aria-label={t("nav.language")} className="flex items-center rounded-full border border-line p-0.5">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          lang={code}
          title={label}
          aria-pressed={current === code}
          onClick={() => i18n.changeLanguage(code)}
          className={clsx("press h-8 rounded-full px-2.5 text-[13px] font-medium uppercase", current === code ? "bg-ink text-bg" : "text-muted hover:text-ink")}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function Navbar({ active }: { active?: SectionId }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, (v) => `scaleX(${v})`);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const current = active ? NAV_FOR[active] : undefined;

  return (
    <>
      <header className={clsx("no-print fixed inset-x-0 top-0 z-50 transition-colors duration-300", scrolled || !onHome ? "bg-bg/80 backdrop-blur-md" : "bg-transparent")}>
        <div className={`${container} flex h-16 items-center justify-between gap-4`}>
          <Link to="/" className="press flex items-center gap-3 rounded-lg" aria-label={t("nav.home")}>
            <BatTile size={34} />
            <span className="hidden font-display text-[17px] font-semibold tracking-[-0.01em] whitespace-nowrap sm:inline">Joseph Arroyo</span>
          </Link>

          {/* The island: section links, a sliding indicator and reading progress. */}
          <nav aria-label="Main" className="relative hidden overflow-hidden rounded-full border border-line bg-surface/80 shadow-card backdrop-blur lg:block">
            <LayoutGroup id="nav">
              <ul className="flex items-center p-1">
                {LINKS.map((id) => (
                  <li key={id}>
                    <a
                      href={href(id)}
                      aria-current={current === id ? "true" : undefined}
                      className={clsx("relative block rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-200", current === id ? "text-bg" : "text-muted hover:text-ink")}
                    >
                      {current === id && (
                        <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} />
                      )}
                      <span className="relative">{t(`nav.${id}`)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </LayoutGroup>
            {onHome && <motion.span aria-hidden="true" style={{ transform: progress }} className="absolute inset-x-3 bottom-0 h-px origin-left bg-accent" />}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => palette.open()}
              aria-label={t("nav.search")}
              className="press hidden h-10 items-center gap-2 rounded-full border border-line px-3 text-sm text-muted hover:text-ink xl:inline-flex"
            >
              <MagnifyingGlassIcon size={16} />
              <kbd className="font-mono text-[11px] whitespace-nowrap">{isMac ? "⌘K" : "Ctrl K"}</kbd>
            </button>
            <div className="hidden lg:block">
              <LanguageSwitch />
            </div>
            <ThemeToggle />
            <div className="hidden sm:block">
              <Link to={CV_PATH} className={button("primary", "h-10 px-4 text-sm")}>
                <FileTextIcon size={16} />
                {t("nav.cv")}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={t("nav.menu")}
              className="press grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-bg-2 lg:hidden"
            >
              <ListIcon size={22} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
            className="no-print fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
          >
            <div className={`${container} flex h-16 items-center justify-between`}>
              <BatTile size={34} />
              <button type="button" onClick={() => setOpen(false)} aria-label={t("nav.close")} className="press grid h-10 w-10 place-items-center rounded-full hover:bg-bg-2">
                <XIcon size={22} />
              </button>
            </div>
            <nav aria-label="Mobile" className={`${container} flex-1 overflow-y-auto pt-6`}>
              <ul className="space-y-1">
                {LINKS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, transform: "translateY(10px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    transition={{ duration: 0.3, delay: 0.03 + i * 0.035, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <a
                      href={href(id)}
                      onClick={() => setOpen(false)}
                      className={clsx("block py-1.5 font-display text-[2.4rem] leading-tight font-semibold tracking-[-0.03em]", current === id ? "text-accent" : "text-ink")}
                    >
                      {t(`nav.${id}`)}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <Link to={CV_PATH} onClick={() => setOpen(false)} className={button("primary", "mt-8")}>
                <FileTextIcon size={17} />
                {t("nav.cv")}
              </Link>
            </nav>
            <div className={`${container} flex flex-wrap items-center justify-between gap-4 border-t border-line py-6`}>
              <LanguageSwitch />
              <SocialLinks />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
