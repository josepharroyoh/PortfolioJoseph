import { useTranslation } from "react-i18next";
import { SocialLinks } from "../ui/SocialLinks";
import { container } from "../ui/styles";
import { PROFILE } from "../../data/profile";

/** A quiet closing line: name and year on the left, profiles on the right. */
export function Footer() {
  const { t } = useTranslation();
  return (
    <footer id="site-footer" className="no-print relative z-[1] border-t border-line bg-bg">
      <div className={`${container} flex flex-col items-center gap-4 py-10 text-center md:flex-row md:justify-between md:text-left`}>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} <span className="font-serif text-[15px] text-ink italic">{PROFILE.fullName}</span>
          <span className="mx-2 text-faint" aria-hidden="true">
            ·
          </span>
          {t("footer.rights")}
        </p>
        <SocialLinks />
      </div>
    </footer>
  );
}
