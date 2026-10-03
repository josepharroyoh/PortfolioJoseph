import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { BatTile } from "../brand/Bat";
import { SocialLinks } from "../ui/SocialLinks";
import { container } from "../ui/styles";
import { LANGUAGES } from "../../i18n";
import type { SectionId } from "../../data/profile";

const LINKS = ["academic", "awards", "experience", "projects", "skills"] as const;
type LinkId = (typeof LINKS)[number];

const NAV_FOR: Partial<Record<SectionId, LinkId>> = {
  academic: "academic",
  awards: "awards",
  experience: "experience",
  projects: "projects",
  skills: "skills",
  training: "skills",
  volunteering: "skills",
};

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
          className={clsx("press h-8 rounded-full px-2.5 text-[0.8125rem] font-medium uppercase", current === code ? "bg-accent text-on-accent" : "text-muted hover:text-ink")}
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
      <header className={clsx("no-print fixed inset-x-0 top-0 z-50 transition-colors duration-300", scrolled || !onHome ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent")}>
        <div className={`${container} flex h-16 items-center justify-between gap-4`}>
          <Link to="/" className="press flex items-center gap-3 rounded-lg" aria-label={t("nav.home")}>
            <BatTile size={36} />
          </Link>

          {/* Plain text links; a hairline under the current one slides between them. */}
          <nav aria-label="Main" className="hidden lg:block">
            <LayoutGroup id="nav">
              <ul className="flex items-center gap-1">
                {LINKS.map((id) => (
                  <li key={id}>
                    <a
                      href={href(id)}
                      aria-current={current === id ? "true" : undefined}
                      className={clsx("relative block px-3 py-2 text-[0.9375rem] whitespace-nowrap transition-colors duration-200", current === id ? "text-ink" : "text-muted hover:text-ink")}
                    >
                      {t(`nav.${id}`)}
                      {current === id && (
                        <motion.span layoutId="nav-line" className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-accent" transition={{ type: "spring", duration: 0.4, bounce: 0.1 }} />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </LayoutGroup>
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="hidden sm:block">
              <LanguageSwitch />
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
        {onHome && <motion.span aria-hidden="true" style={{ transform: progress }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent" />}
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
