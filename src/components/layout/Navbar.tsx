import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ListIcon, MoonIcon, SunIcon, XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { BatTile } from "../brand/Bat";
import { SocialLinks } from "../ui/SocialLinks";
import { button, container } from "../ui/styles";
import { LANGUAGES } from "../../i18n";
import { useTheme } from "../../hooks/useTheme";
import type { SectionId } from "../../data/profile";

const LINKS = ["projects", "research", "journey", "about"] as const;

/** Sections without their own link light up the closest one. */
const NAV_FOR: Partial<Record<SectionId, (typeof LINKS)[number]>> = {
  projects: "projects",
  about: "about",
  research: "research",
  journey: "journey",
  awards: "journey",
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
      {dark ? <SunIcon size={19} /> : <MoonIcon size={19} />}
    </button>
  );
}

function LanguageSwitch({ className }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? "es";
  return (
    <div role="group" aria-label={t("nav.language")} className={clsx("flex items-center rounded-full border border-line p-0.5", className)}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          lang={code}
          title={label}
          aria-pressed={current === code}
          onClick={() => i18n.changeLanguage(code)}
          className={clsx(
            "press h-8 rounded-full px-2.5 text-[13px] font-medium uppercase",
            current === code ? "bg-ink text-bg" : "text-muted hover:text-ink",
          )}
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
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  // On the home page links are in-page anchors; elsewhere they lead back home.
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const current = active ? NAV_FOR[active] : undefined;

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled || !onHome ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        <div className={`${container} flex h-16 items-center justify-between gap-6`}>
          <Link to="/" className="press flex items-center gap-3 rounded-lg" aria-label={t("nav.home")} onClick={() => onHome && window.scrollTo({ top: 0 })}>
            <BatTile size={34} />
            <span className="font-display text-[17px] font-semibold tracking-[-0.01em] whitespace-nowrap">Joseph Arroyo</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {LINKS.map((id) => (
                <li key={id}>
                  <a
                    href={href(id)}
                    aria-current={current === id ? "true" : undefined}
                    className={clsx(
                      "relative py-2 text-[15px] transition-colors duration-200",
                      current === id ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {t(`nav.${id}`)}
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ease-out",
                        current === id ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <LanguageSwitch />
            </div>
            <ThemeToggle />
            <div className="hidden sm:block">
              <a href={href("contact")} className={button("primary", "h-10 px-4 text-sm")}>
                {t("nav.contact")}
              </a>
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
            className="fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
          >
            <div className={`${container} flex h-16 items-center justify-between`}>
              <span className="flex items-center gap-3">
                <BatTile size={34} />
                <span className="font-display text-[17px] font-semibold">Joseph Arroyo</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("nav.close")}
                className="press grid h-10 w-10 place-items-center rounded-full hover:bg-bg-2"
              >
                <XIcon size={22} />
              </button>
            </div>
            <nav aria-label="Mobile" className={`${container} flex-1 pt-8`}>
              <ul className="space-y-1">
                {[...LINKS, "contact" as const].map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, transform: "translateY(10px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    transition={{ duration: 0.3, delay: 0.04 + i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <a
                      href={href(id)}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        "block py-2 font-display text-[2.6rem] leading-tight font-semibold tracking-[-0.03em]",
                        current === id || (id === "contact" && active === "contact") ? "text-accent" : "text-ink",
                      )}
                    >
                      {t(`nav.${id}`)}
                    </a>
                  </motion.li>
                ))}
              </ul>
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
