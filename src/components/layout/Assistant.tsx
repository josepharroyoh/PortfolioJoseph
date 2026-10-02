import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { EnvelopeSimpleIcon, GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import { CubeBuddy } from "../brand/CubeBuddy";
import { OrcidIcon } from "../ui/OrcidIcon";
import { PROFILE, type SectionId } from "../../data/profile";
import { useCopy } from "../../hooks/useCopy";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const TYPE_MS = 32;
const HOLD_MS = 3200;

/**
 * The blinking cube from the old CV, now a guide that comments on whatever
 * section is on screen. On phones it folds down to the cube between messages.
 */
export function Assistant({ active }: { active: SectionId | "thesis" }) {
  const { t, i18n } = useTranslation();
  const all = useCopy<Record<SectionId | "thesis", string[]>>("assistant.messages");
  // i18next may hand back a fresh array each render; key the list by its text.
  const messagesKey = (all[active] ?? all.home).join("\u0000");
  const messages = useMemo(() => messagesKey.split("\u0000"), [messagesKey]);
  const wide = useMediaQuery("(min-width: 768px)");

  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [idle, setIdle] = useState(false);
  const [open, setOpen] = useState(false);

  // Start over whenever the section or language changes.
  useEffect(() => {
    setIndex(0);
  }, [active, i18n.resolvedLanguage]);

  useEffect(() => {
    const message = messages[index % messages.length];
    let i = 0;
    let holdTimer = 0;
    setTyped("");
    setIdle(false);
    const typer = window.setInterval(() => {
      i += 1;
      setTyped(message.slice(0, i));
      if (i < message.length) return;
      window.clearInterval(typer);
      holdTimer = window.setTimeout(() => {
        if (index + 1 < messages.length) setIndex(index + 1);
        else setIdle(true);
      }, HOLD_MS);
    }, TYPE_MS);
    return () => {
      window.clearInterval(typer);
      window.clearTimeout(holdTimer);
    };
  }, [index, messages]);

  const folded = !wide && idle && !open;

  const links = [
    { href: PROFILE.links.github, label: "GitHub", icon: <GithubLogoIcon size={20} /> },
    { href: PROFILE.links.linkedin, label: "LinkedIn", icon: <LinkedinLogoIcon size={20} /> },
    { href: PROFILE.links.orcid, label: "ORCID", icon: <OrcidIcon size={20} /> },
    { href: `mailto:${PROFILE.email}`, label: t("assistant.email"), icon: <EnvelopeSimpleIcon size={20} /> },
  ];

  return (
    <motion.aside
      aria-label={t("assistant.label")}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-4 left-4 z-[65] md:bottom-6 md:left-6"
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-surface text-ink shadow-card">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <ul className="grid grid-cols-4 gap-1 border-b border-line px-3 pt-4 pb-3">
                {links.map(({ href, label, icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="press flex flex-col items-center gap-1.5 rounded-xl px-2 py-2 text-[11px] text-muted hover:bg-bg-2 hover:text-ink"
                    >
                      {icon}
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-14 items-center gap-3 pr-2 pl-3">
          <CubeBuddy size={32} />
          <p
            aria-live="polite"
            className={clsx(
              "overflow-hidden text-[13px] leading-tight whitespace-nowrap text-ink transition-[max-width,opacity] duration-300 ease-out",
              folded ? "max-w-0 opacity-0" : "max-w-[min(15rem,calc(100vw-9rem))] opacity-100 md:max-w-[17rem]",
            )}
          >
            <span className="block truncate">
              {typed}
              {!idle && <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-ink" />}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={t("assistant.more")}
            className="press grid h-10 w-10 shrink-0 place-items-center rounded-xl hover:bg-bg-2"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-ink" />
              <span
                className={clsx(
                  "absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 rounded-full bg-ink transition-transform duration-200 ease-out",
                  open ? "scale-y-0" : "scale-y-100",
                )}
              />
            </span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
