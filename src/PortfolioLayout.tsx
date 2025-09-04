import { useState, useEffect } from "react";
import "./App.css";
import { LoadingScreen } from "./components/LoadingScreen/LoadingScreen";
import ParticleBackground from "./components/ParticleBackground/ParticleBackground";
import Header from "./components/Header/Header";
import { HeroSection } from "./components/HeroSection/HeroSection";
import { AboutSection } from "./components/AboutSection/AboutSection";
import ReactLenis from "lenis/react";
import Dock from "./components/lightswind/dock";
import { Home, User, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactModal } from "./components/ContactModal/ContactModal";
import { useTranslation } from "react-i18next";
import React from "react";
import Carousel3D from "./components/Carousel3D";
import type { Carousel3DItem } from "./components/Carousel3D";

type DockItem = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const projectItems: Carousel3DItem[] = [
  {
    id: 1,
    title: 'Igrowkers Intake 4 Proyecto Reffindr',
    brand: 'Data Analyst',
    description: 'Reffindr es una solución PropTech desarrollada en 4 semanas; lideré el equipo de datos creando una API para automatizar la recolección de más de 300 datos inmobiliarios, logrando un MVP de alta calidad.',
    tags: ['Python', 'Flask', 'Azure App Services', 'Power BI', 'Supabase', 'render'],
    imageUrl: '/videos/reffindr.mp4',
    link: 'https://github.com/IgrowkerTraining/i004-reffindr-back-python/tree/docs/readme'
  },
  {
    id: 2,
    title: 'Portafolio Personal',
    brand: 'Desarrollo Web',
    description: 'Desarrollo de mi portafolio personal interactivo utilizando React, TypeScript y Tailwind CSS, con un diseño moderno y animaciones fluidas.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    imageUrl: '',
    link: '#'
  },
  {
    id: 3,
    title: 'Análisis de Datos para E-commerce',
    brand: 'Proyecto Académico',
    description: 'Análisis de un conjunto de datos de un e-commerce para identificar patrones de compra y optimizar estrategias de marketing.',
    tags: ['Python', 'Pandas', 'Matplotlib', 'SQL'],
    imageUrl: '',
    link: '#'
  }
];

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
    const cleanId = rawId.startsWith("#") ? rawId.slice(1) : rawId;

    if (cleanId === "hero" || cleanId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const dockItems: DockItem[] = [
    { icon: <Home size={24} />, label: t("nav.home"), onClick: () => scrollToSection("home") },
    { icon: <User size={24} />, label: t("nav.about"), onClick: () => scrollToSection("about") },
    { icon: <Briefcase size={24} />, label: "Proyectos", onClick: () => scrollToSection("projects") },
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
        <div className="bg-transparent">
          <ParticleBackground />
          <ReactLenis root>
            <Header
              scrollToSection={scrollToSection}
              onContactClick={handleOpenContactModal}
            />
            <main className="w-full max-w-5xl mx-auto px-4">
              <div className="z-10 w-full">
                <div id="home"><HeroSection /></div>
                <div id="about"><AboutSection /></div>
                <div id="projects">
                  <Carousel3D items={projectItems} />
                </div>
              </div>
            </main>
            <AnimatePresence>
              {showDock && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
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