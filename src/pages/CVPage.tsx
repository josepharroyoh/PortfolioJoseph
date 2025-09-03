// src/pages/CVPage.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SparkleParticles } from "../components/SparkleParticles/SparkleParticles";
import { SectionCard } from "../components/SectionCard/SectionCard";
import { Header } from "../components/HeaderCV/HeaderCV";
import { MobileSidebar } from "../components/MobileSidebar/MobileSidebar";
import { useTranslation } from "react-i18next";

export function CVPage() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : "dark";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const scrollToSection = (rawId: string) => {
    const cleanId = rawId.startsWith("#") ? rawId.slice(1) : rawId;
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsSidebarOpen(false);
  };

  const navItems = [
    { name: t("cv.nav.summary"), id: "resumen" },
    { name: t("cv.nav.experience"), id: "experiencia" },
    { name: t("cv.nav.education"), id: "educacion" },
    { name: t("cv.nav.publications"), id: "publicaciones-proyectos" },
    { name: t("cv.nav.congresses"), id: "congresos" },
    { name: t("cv.nav.awards"), id: "premios" },
    { name: t("cv.nav.volunteering"), id: "voluntariado" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-transparent min-h-screen relative overflow-hidden">
        <SparkleParticles
          className="absolute inset-0 w-full h-full"
          particleCount={8}
          maxParticleSize={1.5}
          baseDensity={600}
          particleColor={theme === "dark" ? "#ffffff" : "#000000"}
          backgroundColor="transparent"
          zIndexLevel={0}
        />

        <Header
          theme={theme}
          setTheme={setTheme}
          navItems={navItems}
          scrollToSection={scrollToSection}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <MobileSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          theme={theme}
          setTheme={setTheme}
          navItems={navItems}
          scrollToSection={scrollToSection}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <div className="relative z-10 p-4 max-w-7xl mx-auto mt-24 md:mt-38">
          <SectionCard id="resumen" title={t("cv.summary.title")} className="cv-section">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {t("cv.summary.description")}
            </p>
          </SectionCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <SectionCard id="experiencia" title={t("cv.experience.title")} delay={0.3} direction="right" titleGradient="from-purple-500 to-pink-500" className="cv-section">
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-4 hover:border-pink-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.experience.job1.title")}</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">{t("cv.experience.job1.company")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.experience.job1.date")}</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                      <li>{t("cv.experience.job1.desc1")}</li>
                      <strong>{t("cv.experience.job1.achievementsTitle")}</strong>
                      <li>{t("cv.experience.job1.achievementsDesc1")}</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 hover:border-cyan-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.experience.job2.title")}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{t("cv.experience.job2.company")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.experience.job2.date")}</p>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                      {t("cv.experience.job2.desc1")}
                    </ul>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="publicaciones-proyectos" title={t("cv.publications.title")} delay={0.1} direction="left" titleGradient="from-indigo-500 to-blue-500" className="cv-section">
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{t("cv.publications.item1.title")}</h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">{t("cv.publications.item1.journal")}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t("cv.publications.item1.authors")}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{t("cv.publications.item2.title")}</h3>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t("cv.publications.item2.date")}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t("cv.publications.item2.authors")}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">{t("cv.publications.item2.description")}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{t("cv.publications.item3.title")}</h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{t("cv.publications.item3.status")}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t("cv.publications.item3.authors")}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">{t("cv.publications.item3.description")}</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="congresos" title={t("cv.congresses.title")} delay={0.2} direction="left" titleGradient="from-red-500 to-pink-500" className="cv-section">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{t("cv.congresses.item1.title")}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{t("cv.congresses.item1.location")}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1"><a 
                        href="https://www.aireica.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 dark:text-blue-400 hover:underline transition-colors duration-300 hover:text-purple-500 dark:hover:text-purple-400"
                    >
                        AIREICA: 
                    </a>{t("cv.congresses.item1.topic")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{t("cv.congresses.item2.title")}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{t("cv.congresses.item2.date")}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{t("cv.congresses.item2.topic")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{t("cv.congresses.item3.title")}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{t("cv.congresses.item3.date")}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{t("cv.congresses.item3.topic")}</p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="voluntariado" title={t("cv.volunteering.title")} delay={0.4} direction="left" titleGradient="from-orange-500 to-red-500" className="cv-section">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t("cv.volunteering.item1.title")}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{t("cv.volunteering.item1.role")}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{t("cv.volunteering.item1.description")}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-l-4 border-green-500">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t("cv.volunteering.item2.title")}</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">{t("cv.volunteering.item2.role")}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{t("cv.volunteering.item2.description")}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-l-4 border-purple-500">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t("cv.volunteering.item3.title")}</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">{t("cv.volunteering.item3.role")}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{t("cv.volunteering.item3.description")}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t("cv.volunteering.item4.title")}</h3>
                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">{t("cv.volunteering.item4.role")}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{t("cv.volunteering.item4.description")}</p>
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="space-y-8">
              <SectionCard id="contacto" title={t("cv.contact.title")} delay={0.1} direction="right" titleGradient="from-emerald-500 to-green-500" className="cv-section">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{t("cv.contact.email")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400"><a 
                        href="mailto:arroyohemandezjoseph@gmail.com" 
                        className="hover:underline transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
                    >
                        arroyohemandezjoseph@gmail.com
                    </a></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">LinkedIn</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400"><a 
                        href="https://www.linkedin.com/in/josepharroyohernandez/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline transition-colors duration-300 hover:text-purple-500 dark:hover:text-purple-400"
                    >
                        linkedin.com/in/josepharroyohernandez/
                    </a></p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="educacion" title={t("cv.education.title")} delay={0.2} direction="right" titleGradient="from-blue-500 to-purple-500" className="cv-section">
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4 hover:border-purple-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.education.degree")}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{t("cv.education.university")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.education.degreeDate")}</p>
                  </div>
                  <div className="relative w-full my-6 flex justify-center items-center">
                    <div className="flex-grow border-t-2 border-gray-300 dark:border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 font-medium">{t("cv.education.coursesTitle")}</span>
                    <div className="flex-grow border-t-2 border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 hover:border-emerald-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.education.course1.title")}</h3>
                    <p className="text-green-600 dark:text-green-400 font-medium">{t("cv.education.course1.institution")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.education.course1.date")}</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 hover:border-pink-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.education.course2.title")}</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">{t("cv.education.course2.institution")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.education.course2.date")}</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 hover:border-pink-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.education.course3.title")}</h3>
                    <p className="text-red-600 dark:text-red-400 font-medium">{t("cv.education.course3.institution")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.education.course3.date")}</p>
                  </div>
                   <div className="border-l-4 border-blue-500 pl-4 hover:border-cyan-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.education.course4.title")}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{t("cv.education.course4.institution")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.education.course4.date")}</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 hover:border-emerald-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.education.course5.title")}</h3>
                    <p className="text-green-600 dark:text-green-400 font-medium">{t("cv.education.course5.institution")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.education.course5.date")}</p>
                  </div>
                  <div className="border-l-4 border-pink-500 pl-4 hover:border-pink-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.education.course6.title")}</h3>
                    <p className="text-pink-500 dark:text-pink-500 font-medium">{t("cv.education.course6.institution")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.education.course6.date")}</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 hover:border-purple-500 transition-colors duration-300">
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.education.course7.title")}</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">{t("cv.education.course7.institution")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.education.course7.date")}</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 hover:border-red-500 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t("cv.education.course8.title")}</h3>
                    <p className="text-red-600 dark:text-red-400 font-medium">{t("cv.education.course8.institution")}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t("cv.education.course8.date")}</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="premios" title={t("cv.awards.title")} delay={0.4} direction="right" titleGradient="from-yellow-500 to-orange-500" className="cv-section">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{t("cv.awards.item1.title")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t("cv.awards.item1.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{t("cv.awards.item2.title")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t("cv.awards.item2.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{t("cv.awards.item3.title")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t("cv.awards.item3.description")}</p>
                    </div>
                  </div>
                   <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{t("cv.awards.item4.title")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t("cv.awards.item4.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{t("cv.awards.item5.title")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t("cv.awards.item5.description")}</p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="habilidades" title={t("cv.skills.title")} delay={0.5} direction="right" titleGradient="from-cyan-500 to-teal-500" className="cv-section">
                <div className="space-y-4">
                    <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t("cv.skills.programming")}</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">Python</span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">Flask</span>
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">Django</span>
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm">Java</span>
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm">HTML</span>
                    </div>
                    </div>
                    <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t("cv.skills.dataScience")}</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm">Google Cloud Platform</span>
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm">Python</span>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm">Looker Studio</span>
                        <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full text-sm">Power BI</span>
                    </div>
                    </div>
                    <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t("cv.skills.dbAdmin")}</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">SQL Server</span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">MySQL</span>
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">PostgreSQL</span>
                    </div>
                    </div>
                    <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t("cv.skills.ides")}</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm">Spyder</span>
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm">VSCode</span>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm">Jupyter Notebook</span>
                    </div>
                    </div>
                    <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t("cv.skills.writing")}</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full text-sm">Latex</span>
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm">Word</span>
                    </div>
                    </div>
                </div>
                </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}