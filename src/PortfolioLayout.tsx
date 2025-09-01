import { useState, useEffect } from "react";
import "./App.css";
import { LoadingScreen } from "./components/LoadingScreen/LoadingScreen";
import ParticleBackground from "./components/ParticleBackground/ParticleBackground";
import Header from "./components/Header/Header";
import { HeroSection } from "./components/HeroSection/HeroSection";
import { AboutSection } from "./components/AboutSection/AboutSection";
import { EducationSection } from "./components/EducationSection/EducationSection";
import { SkillsSection } from "./components/SkillsSection/SkillsSection";
import ReactLenis from "lenis/react";
import Dock from "./components/lightswind/dock";
import { Home, User, GraduationCap, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactModal } from "./components/ContactModal/ContactModal";
import { useTranslation } from "react-i18next";
import React from "react";

type DockItem = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

export function PortfolioLayout() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(() => {
    const justNavigatedInternally = sessionStorage.getItem('justNavigatedInternally') === 'true';
    if (justNavigatedInternally) {
      sessionStorage.removeItem('justNavigatedInternally');
      return false;
    }
    const navigationEntries = performance.getEntriesByType("navigation");
    const isRefresh = navigationEntries.length > 0 && (navigationEntries[0] as PerformanceNavigationTiming).type === 'reload';
    const hasLoadedBefore = sessionStorage.getItem('hasLoadedPortfolio') === 'true';
    if (!hasLoadedBefore || isRefresh) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    return () => {
      sessionStorage.setItem('justNavigatedInternally', 'true');
    };
  }, []);

  const [showDock, setShowDock] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  const handleOpenContactModal = () => setContactModalOpen(true);
  const handleCloseContactModal = () => setContactModalOpen(false);
  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('hasLoadedPortfolio', 'true');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowDock(true);
      } else {
        setShowDock(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (rawId: string) => {
    // Primero, "limpiamos" el id para quitarle el '#' si lo tiene
    const cleanId = rawId.startsWith("#") ? rawId.slice(1) : rawId;

    // Si el id es 'hero' o 'home', nos desplazamos al inicio de la página
    if (cleanId === "hero" || cleanId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Para todos los demás ids, buscamos el elemento y nos desplazamos a él
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const dockItems: DockItem[] = [
    { icon: <Home size={24} />, label: t("nav.home"), onClick: () => scrollToSection("home") },
    { icon: <User size={24} />, label: t("nav.about"), onClick: () => scrollToSection("about") },
    { icon: <GraduationCap size={24} />, label: t("nav.education"), onClick: () => scrollToSection("education") },
    { icon: <Code size={24} />, label: t("nav.skills"), onClick: () => scrollToSection("skills") }
  ];

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LoadingScreen onComplete={handleLoadingComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: isLoading ? 0.8 : 0 }}
      >
        <div className="bg-transparent min-h-screen flex items-center justify-center">
          <ParticleBackground />
          <ReactLenis root>
            <Header
              scrollToSection={scrollToSection}
              onContactClick={handleOpenContactModal}
            />
            <div className="w-full bg-transparent max-w-5xl px-4 my-30 flex items-center justify-center lg:rounded-3xl">
              <div className="z-10">
                <div id="home"><HeroSection /></div>
                <div id="about"><AboutSection /></div>
                <div id="education"><EducationSection /></div>
                <div id="skills"><SkillsSection /></div>
              </div>
            </div>
            <AnimatePresence>
              {showDock && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  // Corregido: left-1/2 y -translate-x-1/2
                  className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999]"
                >
                  <Dock items={dockItems} position="bottom" magnification={70} baseItemSize={50} />
                </motion.div>
              )}
            </AnimatePresence>
          </ReactLenis>
        </div>
      </motion.div>
      <ContactModal isOpen={isContactModalOpen} onClose={handleCloseContactModal} />
    </>
  );
}