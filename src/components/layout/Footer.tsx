import { useTranslation } from "react-i18next";
import { ArrowUp } from "lucide-react";
import { BatTile } from "../brand/Bat";
import { GithubIcon, LinkedinIcon, OrcidIcon } from "../ui/icons";
import { PROFILE } from "../../data/profile";
import { useScrollTo } from "../../hooks/useScrollTo";

export function Footer() {
  const { t } = useTranslation();
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 overflow-hidden border-t border-line px-4 pt-16 pb-28 md:px-6 md:pb-10">
      <div className="mx-auto max-w-7xl">
        <p
          aria-hidden="true"
          className="font-display text-[clamp(3.5rem,15vw,13rem)] leading-[0.85] tracking-[-0.03em] text-transparent select-none [-webkit-text-stroke:1px_rgba(255,255,255,0.18)]"
        >
          Joseph Arroyo
        </p>

        <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <BatTile size={44} />
            <div className="text-sm text-muted">
              <p className="text-paper">© {year} {PROFILE.fullName}</p>
              <p>{t("footer.rights")}</p>
            </div>
          </div>

          <p className="max-w-xs text-sm text-faint">{t("footer.built")}</p>

          <div className="flex items-center gap-3">
            {[
              { href: PROFILE.links.github, label: "GitHub", Icon: GithubIcon },
              { href: PROFILE.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
              { href: PROFILE.links.orcid, label: "ORCID", Icon: OrcidIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="glass grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:text-paper"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => scrollTo("home")}
              aria-label={t("footer.top")}
              title={t("footer.top")}
              className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink transition-transform hover:-translate-y-1"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
