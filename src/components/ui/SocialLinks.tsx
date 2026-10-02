import { GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { OrcidIcon } from "./OrcidIcon";
import { PROFILE } from "../../data/profile";

const LINKS = [
  { href: PROFILE.links.github, label: "GitHub", Icon: GithubLogoIcon },
  { href: PROFILE.links.linkedin, label: "LinkedIn", Icon: LinkedinLogoIcon },
  { href: PROFILE.links.orcid, label: "ORCID", Icon: OrcidIcon },
];

/** GitHub, LinkedIn and ORCID, as icons or labelled pills. */
export function SocialLinks({ labelled = false, className }: { labelled?: boolean; className?: string }) {
  return (
    <ul className={clsx("flex flex-wrap items-center gap-2", className)}>
      {LINKS.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labelled ? undefined : label}
            className={clsx(
              "press inline-flex items-center gap-2 rounded-full text-muted hover:text-ink",
              labelled ? "h-10 border border-line px-4 text-sm hover:border-line-strong" : "h-10 w-10 justify-center",
            )}
          >
            <Icon size={18} />
            {labelled && label}
          </a>
        </li>
      ))}
    </ul>
  );
}
