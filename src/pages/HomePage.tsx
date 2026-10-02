import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { Suspense, lazy, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "../components/layout/Navbar";
import { Intro } from "../components/layout/Intro";
import { ScrollProgress } from "../components/layout/ScrollProgress";
import { Footer } from "../components/layout/Footer";
import { Assistant } from "../components/layout/Assistant";
import { Hero } from "../components/sections/Hero";
import { About } from "../components/sections/About";
import { Research } from "../components/sections/Research";
import { Projects } from "../components/sections/Projects";
import { Experience } from "../components/sections/Experience";
import { Education } from "../components/sections/Education";
import { Awards } from "../components/sections/Awards";
import { Volunteering } from "../components/sections/Volunteering";
import { Skills } from "../components/sections/Skills";
import { Contact } from "../components/sections/Contact";
import { useActiveSection } from "../hooks/useActiveSection";

// three.js is heavy; load it after the page itself is on screen.
const CosmosScene = lazy(() => import("../components/background/CosmosScene"));

const INTRO_KEY = "intro-seen";

function shouldPlayIntro(hash: string, reduced: boolean | null) {
  if (reduced || hash) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== "1";
  } catch {
    return true;
  }
}

export default function HomePage() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const { hash } = useLocation();
  const [intro, setIntro] = useState(() => shouldPlayIntro(hash, reduced));
  const active = useActiveSection();

  const finishIntro = () => {
    setIntro(false);
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode: just replay next time */
    }
  };

  // Deep links such as /#research (and the old /cv route) land on their section.
  useEffect(() => {
    if (!hash) return;
    const id = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 120);
    return () => window.clearTimeout(id);
  }, [hash]);

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduced, anchors: false }}>
        <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
          {t("nav.skip")}
        </a>
        {intro && <Intro onDone={finishIntro} />}
        <Suspense fallback={null}>
          <CosmosScene />
        </Suspense>
        <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,6,10,0.75)_100%)]" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <ScrollProgress />
        <Navbar active={active} />
        <main>
          <Hero ready={!intro} />
          <About />
          <Research />
          <Projects />
          <Experience />
          <Education />
          <Awards />
          <Volunteering />
          <Skills />
          <Contact />
        </main>
        <Footer />
        <Assistant active={active} />
      </ReactLenis>
    </MotionConfig>
  );
}
