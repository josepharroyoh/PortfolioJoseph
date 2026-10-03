import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageShell } from "../components/layout/PageShell";
import { Intro } from "../components/layout/Intro";
import { Hero } from "../components/sections/Hero";
import { Highlights } from "../components/sections/Highlights";
import { Projects } from "../components/sections/Projects";
import { About } from "../components/sections/About";
import { Research } from "../components/sections/Research";
import { Timeline } from "../components/sections/Timeline";
import { Skills } from "../components/sections/Skills";
import { Contact } from "../components/sections/Contact";
import { Toc } from "../components/layout/Toc";
import { container } from "../components/ui/styles";
import { useActiveSection } from "../hooks/useActiveSection";

const INTRO_KEY = "intro-seen";

function shouldPlayIntro(hash: string, reduced: boolean | null) {
  if (reduced || hash) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== "1";
  } catch {
    return false;
  }
}

export default function HomePage() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const { hash } = useLocation();
  const [intro, setIntro] = useState(() => shouldPlayIntro(hash, reduced));
  const active = useActiveSection();

  useEffect(() => {
    document.title = t("meta.title");
  }, [t]);

  // Deep links (/#research, the old /cv route) land on their section.
  useEffect(() => {
    if (!hash) return;
    const id = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 60);
    return () => window.clearTimeout(id);
  }, [hash]);

  const finishIntro = () => {
    setIntro(false);
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode */
    }
  };

  return (
    <PageShell active={active}>
      {intro && <Intro onDone={finishIntro} />}
      <Hero ready={!intro} />
      <div className={`${container} xl:grid xl:grid-cols-[10rem_minmax(0,1fr)] xl:gap-14`}>
        <aside className="hidden pt-24 xl:block">
          <Toc active={active} />
        </aside>
        <div className="min-w-0">
          <About />
          <Highlights />
          <Research />
          <Projects />
          <Timeline />
          <Skills />
        </div>
      </div>
      <Contact />
    </PageShell>
  );
}
