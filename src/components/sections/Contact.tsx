import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Bat } from "../brand/Bat";
import { CubeBuddy } from "../brand/CubeBuddy";
import { Universe } from "../fx/Universe";
import { Magnetic } from "../fx/Interactions";
import { SocialLinks } from "../ui/SocialLinks";
import { button, container } from "../ui/styles";
import { PROFILE } from "../../data/profile";

const field =
  "w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:ring-4 focus:ring-accent-soft";

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
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="force-dark relative isolate overflow-hidden bg-bg py-24 md:py-32">
      {/* Night sky: stars, nebula, shooting stars and the bat crossing now and then. */}
      <Universe morph={false} fixed={false} className="-z-10" />
      <div aria-hidden="true" className="bat-flight pointer-events-none absolute top-[14%] left-0 -z-10">
        <Bat size={44} className="invert" />
      </div>

      <div className={`${container} grid gap-14 lg:grid-cols-12`}>
        <div className="lg:col-span-6">
          <div className="flex items-end gap-4">
            <CubeBuddy size={72} follow watch={formRef} startle={state.succeeded ? 1 : 0} />
            <div className="pb-1">
              <h2 id="contact-title" className="label reveal">
                {t("contact.title")}
              </h2>
              <p className="mt-1 text-sm text-faint italic">{t("contact.cube")}</p>
            </div>
          </div>
          <p className="reveal mt-8 font-serif text-[clamp(2.3rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.03em] italic">{t("contact.lead")}</p>
          <p className="reveal mt-6 max-w-[42ch] text-lg leading-relaxed text-muted">{t("contact.text")}</p>

          <div className="reveal mt-10 flex flex-wrap items-center gap-3">
            <a href={`mailto:${PROFILE.email}`} className="link-underline font-serif text-[clamp(1.3rem,2.6vw,2rem)] tracking-[-0.01em] break-all">
              {PROFILE.email}
            </a>
            <button type="button" onClick={copy} className={button("secondary", "h-9 px-4 text-sm")} aria-live="polite">
              {copied ? <CheckIcon size={15} weight="bold" /> : <CopyIcon size={15} />}
              {copied ? t("contact.copied") : t("contact.copy")}
            </button>
          </div>
          <div className="reveal mt-6">
            <SocialLinks labelled />
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="reveal space-y-5 lg:col-span-6" noValidate={false}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">{t("contact.form.name")}</label>
              <input id="name" name="name" required autoComplete="name" className={field} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">{t("contact.form.email")}</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={field} />
              <ValidationError field="email" errors={state.errors} className="text-sm text-danger" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">{t("contact.form.message")}</label>
            <textarea id="message" name="message" required rows={6} aria-describedby="message-hint" className={`${field} resize-y`} />
            <p id="message-hint" className="text-sm text-muted">{t("contact.form.hint")}</p>
            <ValidationError field="message" errors={state.errors} className="text-sm text-danger" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <button type="submit" disabled={state.submitting} className={button("primary", "disabled:opacity-60")}>
                {state.submitting ? t("contact.form.sending") : t("contact.form.send")}
              </button>
            </Magnetic>
            <p className="text-sm" aria-live="polite">
              {state.succeeded && <span className="text-accent">{t("contact.form.success")}</span>}
              {!state.succeeded && !state.submitting && state.errors && <span className="text-danger">{t("contact.form.error")}</span>}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
