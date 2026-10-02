import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { BatTile } from "../brand/Bat";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GithubIcon, LinkedinIcon, OrcidIcon } from "../ui/icons";
import { PROFILE, type SectionId } from "../../data/profile";
import { useScrollTo } from "../../hooks/useScrollTo";

const LINKS = ["about", "research", "projects", "experience", "awards", "contact"] as const;
type LinkId = (typeof LINKS)[number];

/** Sections without their own nav entry highlight the closest one. */
const NAV_FOR: Partial<Record<SectionId, LinkId>> = {
  about: "about",
  research: "research",
  projects: "projects",
  experience: "experience",
  education: "experience",
  awards: "awards",
  volunteering: "awards",
  contact: "contact",
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar({ active }: { active: SectionId }) {
  const { t } = useTranslation();
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 240 && !open);
  });

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const go = (id: string) => {
    setOpen(false);
    // Let the menu start closing before the page moves.
    window.setTimeout(() => scrollTo(id), open ? 250 : 0);
  };

  const current = NAV_FOR[active];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6"
      >
        <div
          className={clsx(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full py-2 pr-2 pl-2 transition-all duration-500 md:pl-3",
            scrolled ? "glass shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]" : "border border-transparent",
          )}
        >
          <button type="button" onClick={() => go("home")} className="flex items-center gap-3 rounded-full pr-2" aria-label="Joseph Arroyo">
            <BatTile size={36} />
            <span className="font-mono text-[12px] tracking-[0.2em] text-paper uppercase">Joseph Arroyo</span>
          </button>

          <nav className="hidden lg:block" aria-label="Main">
            <ul className="flex items-center gap-1">
              {LINKS.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => go(id)}
                    aria-current={current === id ? "true" : undefined}
                    className={clsx(
                      "relative rounded-full px-4 py-2 text-[13px] transition-colors duration-300",
                      current === id ? "text-paper" : "text-muted hover:text-paper",
                    )}
                  >
                    {current === id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-line-strong bg-white/[0.06]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{t(`nav.${id}`)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:flex" id="nav-lang" />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="glass flex h-11 items-center gap-2 rounded-full px-4 text-[13px] text-paper lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="flex w-4 flex-col gap-[5px]" aria-hidden="true">
                <span className="h-px w-full bg-paper" />
                <span className="h-px w-2/3 bg-paper" />
              </span>
              {t("nav.menu")}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
            className="fixed inset-0 z-[80] flex flex-col bg-ink/95 px-6 pt-5 pb-8 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <BatTile size={36} />
                <span className="font-mono text-[12px] tracking-[0.2em] uppercase">Joseph Arroyo</span>
              </span>
              <button type="button" onClick={() => setOpen(false)} className="glass h-11 rounded-full px-4 text-[13px]">
                {t("nav.close")}
              </button>
            </div>

            <nav className="mt-10 flex-1" aria-label="Mobile">
              <ul className="space-y-1">
                {LINKS.map((id, i) => (
                  <li key={id} className="overflow-hidden">
                    <motion.button
                      type="button"
                      onClick={() => go(id)}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: EASE }}
                      className="group flex w-full items-baseline gap-4 py-1 text-left"
                    >
                      <span className="font-mono text-xs text-faint">0{i + 1}</span>
                      <span
                        className={clsx(
                          "font-display text-[clamp(2.6rem,11vw,4rem)] leading-tight transition-colors",
                          current === id ? "text-gradient" : "text-paper group-active:text-cyan",
                        )}
                      >
                        {t(`nav.${id}`)}
                      </span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <LanguageSwitcher className="w-fit" id="menu-lang" />
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                <a href={`mailto:${PROFILE.email}`} className="flex min-w-0 items-center gap-1 text-sm break-all text-muted">
                  {PROFILE.email}
                  <ArrowUpRight size={14} className="shrink-0" />
                </a>
                <div className="flex gap-4 text-muted">
                  <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon className="h-5 w-5" /></a>
                  <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinIcon className="h-5 w-5" /></a>
                  <a href={PROFILE.links.orcid} target="_blank" rel="noopener noreferrer" aria-label="ORCID"><OrcidIcon className="h-5 w-5" /></a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
