import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CubeBuddy } from "../brand/CubeBuddy";

const TYPE_MS = 45;

/** The cube's white card: a short quote typed letter by letter, the author underneath. */
export function QuoteCard() {
  const { t, i18n } = useTranslation();
  const text = t("quote.text");
  const [typed, setTyped] = useState("");

  // Retype whenever the language changes; under reduced motion show it whole.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(text);
      return;
    }
    let i = 0;
    setTyped("");
    const id = window.setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [text, i18n.resolvedLanguage]);

  const done = typed.length >= text.length;
  return (
    <figure className="mt-10">
      <div className="flex items-center gap-3 rounded-xl bg-[#fbfbfa] px-3 py-3 text-[#111] shadow-card">
        <CubeBuddy size={34} />
        <blockquote className="min-w-0 flex-1 text-[0.8125rem] leading-snug" aria-label={text}>
          <span aria-hidden="true">
            {typed}
            {!done && <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-[#111]" />}
          </span>
        </blockquote>
      </div>
      <figcaption className="mt-2 pl-1 font-serif text-sm text-muted italic">{t("quote.author")}</figcaption>
    </figure>
  );
}
