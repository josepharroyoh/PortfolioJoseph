import { useForm, ValidationError } from "@formspree/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, Copy } from "lucide-react";
import { Reveal, SplitWords } from "../ui/motion";
import { GithubIcon, LinkedinIcon, OrcidIcon } from "../ui/icons";
import { PROFILE } from "../../data/profile";

const field =
  "peer w-full rounded-2xl border border-line-strong bg-white/[0.03] px-5 pt-7 pb-3 text-paper outline-none transition-colors placeholder:text-transparent focus:border-cyan/70 focus:bg-white/[0.05]";
const label =
  "pointer-events-none absolute top-2.5 left-5 font-mono text-[10px] tracking-[0.18em] text-faint uppercase transition-colors peer-focus:text-cyan";

export function Contact() {
  const { t } = useTranslation();
  const [state, handleSubmit] = useForm(PROFILE.formspreeId);
  const formRef = useRef<HTMLFormElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state.succeeded) formRef.current?.reset();
  }, [state.succeeded]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section id="contact" className="relative z-10 mx-auto max-w-7xl px-4 py-28 md:px-6 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-cyan to-violet" />
              {t("contact.eyebrow")}
            </p>
          </Reveal>
          <h2 className="mt-6 font-display text-[clamp(3.4rem,9vw,7.5rem)] leading-[0.9] tracking-[-0.03em]">
            <SplitWords text={t("contact.title")} wordClassName="italic" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted md:text-lg">{t("contact.text")}</p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 space-y-6">
            <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-2 pl-5">
              <a href={`mailto:${PROFILE.email}`} className="min-w-0 truncate text-[15px] text-paper hover:text-cyan md:text-base">
                {PROFILE.email}
              </a>
              <button
                type="button"
                onClick={copy}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-sm text-ink transition-transform active:scale-95"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? t("contact.copied") : t("contact.copy")}
              </button>
            </div>
            <div className="flex gap-3">
              {[
                { href: PROFILE.links.github, label: "GitHub", Icon: GithubIcon },
                { href: PROFILE.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                { href: PROFILE.links.orcid, label: "ORCID", Icon: OrcidIcon },
              ].map(({ href, label: name, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-muted transition-colors hover:text-paper"
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6">
          <form ref={formRef} onSubmit={handleSubmit} className="glass space-y-4 rounded-[2rem] p-5 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <input id="name" name="name" required autoComplete="name" placeholder={t("contact.form.name")} className={field} />
                <label htmlFor="name" className={label}>{t("contact.form.name")}</label>
              </div>
              <div className="relative">
                <input id="email" type="email" name="email" required autoComplete="email" placeholder={t("contact.form.email")} className={field} />
                <label htmlFor="email" className={label}>{t("contact.form.email")}</label>
                <ValidationError field="email" errors={state.errors} className="mt-2 text-sm text-rose-400" />
              </div>
            </div>
            <div className="relative">
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder={t("contact.form.placeholder")}
                className={`${field} resize-none placeholder:text-faint`}
              />
              <label htmlFor="message" className={label}>{t("contact.form.message")}</label>
              <ValidationError field="message" errors={state.errors} className="mt-2 text-sm text-rose-400" />
            </div>

            <div className="flex flex-col-reverse items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-5 text-sm" aria-live="polite">
                <AnimatePresence mode="wait">
                  {state.succeeded ? (
                    <motion.p key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-cyan">
                      {t("contact.form.success")}
                    </motion.p>
                  ) : state.errors && !state.submitting ? (
                    <motion.p key="err" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400">
                      {t("contact.form.error")}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                disabled={state.submitting}
                className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-paper px-7 py-4 text-sm font-medium text-ink transition-opacity disabled:opacity-60 sm:w-auto"
              >
                <span aria-hidden="true" className="absolute inset-0 translate-y-full rounded-full bg-gradient-to-r from-cyan to-violet transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                <span className="relative">{state.submitting ? t("contact.form.sending") : t("contact.form.send")}</span>
                <ArrowRight size={16} className="relative transition-transform duration-500 group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
