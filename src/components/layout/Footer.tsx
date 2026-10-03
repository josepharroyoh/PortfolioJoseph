import { useTranslation } from "react-i18next";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { BatTile } from "../brand/Bat";
import { SocialLinks } from "../ui/SocialLinks";
import { container } from "../ui/styles";
import { PROFILE } from "../../data/profile";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="no-print force-dark relative z-[1] border-t border-line bg-bg pt-14 pb-32">
      <div className={`${container} flex flex-col gap-10 md:flex-row md:items-end md:justify-between`}>
        <div className="flex items-center gap-4">
          <BatTile size={44} />
          <div className="text-sm">
            <p className="font-medium">
              © {new Date().getFullYear()} {PROFILE.fullName}
            </p>
            <p className="text-muted">
              {t("footer.rights")} {t("footer.built")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SocialLinks />
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={t("footer.top")}
            title={t("footer.top")}
            className="press grid h-10 w-10 place-items-center rounded-full border border-line hover:border-line-strong"
          >
            <ArrowUpIcon size={17} />
          </button>
        </div>
      </div>
    </footer>
  );
}
