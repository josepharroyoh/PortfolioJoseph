import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CubeDock } from "./CubeDock";
import { CursorAura } from "../fx/Interactions";
import { Universe } from "../fx/Universe";
import { CommandPalette } from "./CommandPalette";
import type { SectionId } from "../../data/profile";

/** Chrome shared by every page: skip link, nav, footer and the universe background, the cube dock and the cursor aura. */
export function PageShell({ active, children }: { active: SectionId | "thesis" | "cv"; children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        {t("nav.skip")}
      </a>
      {/* The universe sits behind everything; main and footer stack above it. */}
      <Universe active={active} />
      <Navbar active={active === "thesis" || active === "cv" ? undefined : active} />
      <main id="main" className="relative z-[1]">
        {children}
      </main>
      <Footer />
      <CubeDock hidden={active === "contact"} />
      <CursorAura />
      <CommandPalette />
    </MotionConfig>
  );
}
