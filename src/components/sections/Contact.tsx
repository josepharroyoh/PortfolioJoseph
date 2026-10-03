import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CheckIcon, CopyIcon, FileTextIcon } from "@phosphor-icons/react";
import { SocialLinks } from "../ui/SocialLinks";
import { button, container } from "../ui/styles";
import { CV_PATH, PROFILE } from "../../data/profile";

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
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line py-24 md:py-36">
      <div className={`${container} grid gap-14 lg:grid-cols-12`}>
        <div className="lg:col-span-6">
          <h2 id="contact-title" className="reveal text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.04em]">
            {t("contact.title")}
          </h2>
          <p className="reveal mt-6 max-w-[42ch] text-lg leading-relaxed text-muted">{t("contact.text")}</p>

          <div className="reveal mt-10 flex flex-wrap items-center gap-3">
            <a href={`mailto:${PROFILE.email}`} className="link-underline text-lg break-all md:text-xl">
              {PROFILE.email}
            </a>
            <button type="button" onClick={copy} className={button("secondary", "h-9 px-4 text-sm")} aria-live="polite">
              {copied ? <CheckIcon size={15} weight="bold" /> : <CopyIcon size={15} />}
              {copied ? t("contact.copied") : t("contact.copy")}
            </button>
          </div>
          <div className="reveal mt-6 flex flex-wrap items-center gap-2">
            <Link to={CV_PATH} className={button("primary", "h-10 px-4 text-sm")}>
              <FileTextIcon size={16} />
              {t("nav.cv")}
            </Link>
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
            <button type="submit" disabled={state.submitting} className={button("primary", "disabled:opacity-60")}>
              {state.submitting ? t("contact.form.sending") : t("contact.form.send")}
            </button>
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
