// src/pages/CVPage.tsx
import { useState, useEffect } from "react";
import {
  MorphingParticleScene,
  HeaderNav,
  MessageBar,
  ParallaxParticleField,
  TOTAL_SECTIONS,
} from "../components/componentes-cv";
import MainInfoCard from "../components/componentes-cv/MainInfoCard";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import "./styles.css";

// Locales
import es from "../locales/es.json";
import en from "../locales/en.json";
import pt from "../locales/pt.json";

type Lang = "es" | "en" | "pt";
const LOCALES: Record<Lang, any> = { es, en, pt };

export default function CVPage() {
  // ===== i18n =====
  const [lang, setLang] = useState<Lang>(() => {
    const saved = (localStorage.getItem("lang") as Lang) || "es";
    return (["es", "en", "pt"].includes(saved) ? saved : "es") as Lang;
  });
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const CV = (LOCALES[lang] as any).cv;

  // ===== estado de la página =====
  const [settledSection, setSettledSection] = useState(-1);
  const [scrollHue, setScrollHue] = useState(180);
  const [showCard, setShowCard] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  // ✅ NUEVO: sección activa para renderizar la tarjeta (fuente de verdad)
  const [activeSection, setActiveSection] = useState(0);

  // *** NUEVO: mostrar la barra 0.6s después ***
  const [showMsgBar, setShowMsgBar] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowMsgBar(true), 600);
    return () => clearTimeout(t);
  }, []);
  // *** /NUEVO ***

  // Popover idioma
  const [langOpen, setLangOpen] = useState(false);
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setLangOpen(false);
    const onClickAway = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest("#lang-picker")) setLangOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    document.addEventListener("click", onClickAway);
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("click", onClickAway);
    };
  }, []);

  // “ver más/menos”
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showAllAwards, setShowAllAwards] = useState(false);
  const [showAllPublications, setShowAllPublications] = useState(false);
  const [showAllVolunteering, setShowAllVolunteering] = useState(false);

  // ✅ Cambiar sección de UI al instante y luego scrollear
  const scrollToSection = (index: number) => {
    setActiveSection(index); // <- tarjeta visible inmediatamente
    window.scrollTo({ top: index * window.innerHeight, behavior: "smooth" });
  };

  // ===== FIX: siempre arrancar en Resumen al recargar =====
  useEffect(() => {
    // 1) Desactivar restauración automática del scroll
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {/* noop */}

    // 2) Forzar scroll al tope cuanto antes
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    // 3) Poner en transición breve y luego fijar sección 0 + mostrar tarjeta
    setCurrentSection(0);
    setSettledSection(-1);
    const t = setTimeout(() => {
      setCurrentSection(0);
      setSettledSection(0);
      setActiveSection(0); // ✅ asegurar que la tarjeta corresponda a la sección 0
      setShowCard(true);
    }, 900); // ajusta si quieres sincronizar con tu overlay

    return () => clearTimeout(t);
  }, []);
  // ===== /FIX =====

  // Hue dinámico con scroll
  useEffect(() => {
    const handleScroll = () => {
      const progress =
        window.scrollY /
        (document.body.scrollHeight - window.innerHeight || 1);
      const hue = 200 + progress * 120;
      setScrollHue(hue);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Asentar sección (debounce) — usado por partículas
  useEffect(() => {
    const t = setTimeout(() => setSettledSection(currentSection), 150);
    return () => clearTimeout(t);
  }, [currentSection]);

  const isTransitioning = currentSection !== settledSection;

  // ✅ Sincronizar activeSection con scroll natural (cuando el usuario arrastra)
  useEffect(() => {
    const updateActiveFromScroll = () => {
      const h = window.innerHeight || 1;
      const s = Math.max(
        0,
        Math.min(TOTAL_SECTIONS - 1, Math.round(window.scrollY / h))
      );
      setActiveSection(s);
    };
    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveFromScroll);
  }, []);

  // Reset de toggles al cambiar de sección asentada (mantengo tu lógica)
  useEffect(() => {
    if (settledSection !== 2 && showAllCourses) setShowAllCourses(false);
    if (settledSection !== 5 && showAllAwards) setShowAllAwards(false);
    if (settledSection !== 3 && showAllPublications) setShowAllPublications(false);
    if (settledSection !== 6 && showAllVolunteering) setShowAllVolunteering(false);
  }, [
    settledSection,
    showAllCourses,
    showAllAwards,
    showAllPublications,
    showAllVolunteering,
  ]);
  
  // =======================================================
  // ===== CAMBIO 1: HeaderContent solo con logo y nombre ====
  // =======================================================
  const HeaderContent = (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-white flex items-center justify-center overflow-hidden rounded-md">
        <div className="bat" />
      </div>
      <span className="text-white text-sm font-medium tracking-wider">
        JOSEPH ARROYO
      </span>
    </div>
  );

  const abbrDate = (text: string) =>
    text
      .replace("Enero", "Ene")
      .replace("Febrero", "Feb")
      .replace("Marzo", "Mar")
      .replace("Abril", "Abr")
      .replace("Mayo", "May")
      .replace("Junio", "Jun")
      .replace("Julio", "Jul")
      .replace("Agosto", "Ago")
      .replace("Septiembre", "Sep")
      .replace("Octubre", "Oct")
      .replace("Noviembre", "Nov")
      .replace("Diciembre", "Dic");

  // =========================
  // Intro Overlay (pantalla blanca → tiles aleatorios)
  // =========================
  const [introDone, setIntroDone] = useState(false);

  // Configura el tamaño de la cuadrícula
  const T_ROWS = 7;
  const T_COLS = 12;
  const tiles = Array.from({ length: T_ROWS * T_COLS }, (_, i) => i);

  // Asignamos un delay aleatorio a cada tile (todos empiezan opacos/blancos)
  const base = 0.12;
  const spread = 0.9; // cuánto se dispersan
  const delays = tiles.map(() => base + Math.random() * spread);
  const maxDelayIndex = delays.indexOf(Math.max(...delays));

  // Los tiles reciben su delay por "custom"
  const tileVariants: Variants = {
    hidden: { opacity: 1, scale: 1 },
    show: (delay: number) => ({
      opacity: 0,
      scale: 1,
      transition: {
        delay,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  // =======================================================
  // ===== (Esto no cambia) Extraer textos para pasar a props =====
  // =======================================================
  const sectionTitles = CV?.sections || [];
  const barMessages = CV?.messages || [];

  return (
    <div className="bg-black relative">
      {/* ===== Intro Overlay blanco con tiles que se desvanecen en orden aleatorio ===== */}
      <AnimatePresence>
        {!introDone && (
          <motion.div
            className="fixed inset-0 z-[999] pointer-events-none select-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            {/* Capa de tiles blancos */}
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${T_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${T_ROWS}, 1fr)`,
              }}
            >
              {tiles.map((t, i) => (
                <motion.div
                  key={t}
                  custom={delays[i]}
                  variants={tileVariants}
                  initial="hidden"
                  animate="show"
                  className="bg-white" // <- cada tile es blanco
                  onAnimationComplete={() => {
                    if (i === maxDelayIndex) setIntroDone(true);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fondo partículas */}
      <ParallaxParticleField
        count={80}
        depth={80}
        spread={1.2}
        baseSpeed={0.1}
        accel={0.009}
        sway={6.0}
        swayFreq={0.5}
        size={0.26}
        color="#ffffff"
        excludeRadius={24}
        repelStrength={0.05}
      />

      {/* Escena principal */}
      <MorphingParticleScene
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        setSettledSection={setSettledSection}
      />

      {/* ======================================================= */}
      {/* ===== CAMBIO 2: Separar la flecha y el header ======== */}
      {/* ======================================================= */}
      
      {/* Icono de Volver (Esquina Superior Izquierda) */}
      <div className="fixed top-2 left-0 z-[140] pointer-events-auto">
        <a
          href="/"
          aria-label="Volver a la página principal"
          title="Volver a la página principal"
          className="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7" // Tamaño del icono
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2} // Grosor de la línea
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 000-10H6"
            />
          </svg>
        </a>
      </div>

      {/* Header Fijo (Logo y Nombre), movido un poco más abajo */}
      <div className="fixed top-10 left-10 z-[140] pointer-events-none">
        {HeaderContent}
      </div>


      {/* Menú derecho */}
      <HeaderNav
        settledSection={settledSection}
        onClickItem={scrollToSection}
        titles={sectionTitles}
      />

      {/* Tarjeta animada */}
      <div className="fixed top-15 left-2 z-[150] pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeSection}-${lang}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{
              opacity: isTransitioning ? 0 : 0.95,
              y: isTransitioning ? 8 : 0,
              scale: isTransitioning ? 0.98 : 1,
            }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="pointer-events-none"
          >
            <MainInfoCard isVisible={showCard} scrollHue={scrollHue}>
              {/* === 0: RESUMEN === */}
              {activeSection === 0 ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-neutral-200 text-base font-normal tracking-wider mb-4">
                      {CV.summary.title}
                    </h3>
                    <p className="text-neutral-400 text-sm font-light leading-relaxed tracking-wide">
                      {CV.summary.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-neutral-200 text-base font-normal tracking-wider mb-2">
                      {CV.skills.title}
                    </h3>

                    {/* (pendiente: mover a JSON cuando me lo pases) */}
                    <div className="space-y-3">
                      {[
                        {
                          category: "Desarrollo y Programación",
                          skills: [
                            { name: "Python", style: "text-sky-400" },
                            { name: "Java", style: "text-red-400" },
                            { name: "JavaScript", style: "text-yellow-400" },
                            { name: "HTML", style: "text-orange-400" },
                            { name: "Flask", style: "text-emerald-400" },
                            { name: "Django", style: "text-purple-400" },
                          ],
                        },
                        {
                          category: "Datos y Cloud",
                          skills: [
                            { name: "Scikit-learn", style: "text-orange-400" },
                            { name: "Google Cloud Platform", style: "text-blue-400" },
                            { name: "Power BI", style: "text-fuchsia-400" },
                            { name: "SQL Server", style: "text-red-400" },
                            { name: "MySQL", style: "text-cyan-400" },
                            { name: "PostgreSQL", style: "text-indigo-400" },
                          ],
                        },
                        {
                          category: "Entorno y Herramientas",
                          skills: [
                            { name: "VSCode", style: "text-sky-400" },
                            { name: "Jupyter Notebook", style: "text-orange-400" },
                            { name: "Spyder", style: "text-rose-400" },
                            { name: "Latex", style: "text-teal-400" },
                          ],
                        },
                      ].map((category) => (
                        <div key={category.category}>
                          <h4 className="text-neutral-300 text-sm font-normal tracking-wider mb-3">
                            {category.category}
                          </h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {category.skills.map((skill) => (
                              <span
                                key={skill.name}
                                className={`text-sm font-light tracking-wide ${skill.style}`}
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : activeSection === 1 ? (
                (() => {
                  const exp = CV.experience;
                  const jobs = [exp.job1, exp.job2].filter(Boolean);
                  return (
                    <div>
                      <h3 className="text-neutral-200 text-base font-normal tracking-wider mb-2">
                        {exp.title}
                      </h3>
                      <ul className="space-y-3">
                        {jobs.map((job: any, idx: number) => {
                          const date = abbrDate(job.date);
                          return (
                            <li key={idx}>
                              <div className="flex">
                                <span className="text-neutral-500 mr-2 select-none">-</span>
                                <div className="flex-1">
                                  <h4 className="text-neutral-200 text-base font-normal tracking-wider mb-1">
                                    {job.title}
                                  </h4>
                                  <p className="text-neutral-400 text-[13px] font-light leading-relaxed tracking-wide whitespace-nowrap overflow-hidden text-ellipsis" title={`${job.company} | ${date}`}>
                                    {`${job.company} | ${date}`}
                                  </p>
                                  {job.desc1 && (
                                    <p className="text-neutral-400 text-sm font-light leading-relaxed tracking-wide mt-2">
                                      {job.desc1}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })()
              ) : activeSection === 2 ? (
                (() => {
                  const ed = CV.education;

                  const allCourses = Object.entries(ed)
                    .filter(([k, v]) => /^course\d+$/.test(k) && v && typeof v === "object")
                    .sort(
                      ([a], [b]) =>
                        Number(String(a).replace("course", "")) -
                        Number(String(b).replace("course", ""))
                    )
                    .map(([, v]) => v as { title?: string; institution?: string; date?: string })
                    .filter((c) => c?.title && c?.institution);

                  const VISIBLE = 5;
                  const showCourses = showAllCourses ? allCourses : allCourses.slice(0, VISIBLE);
                  const hasHidden = allCourses.length > VISIBLE;

                  return (
                    <div>
                      <h3 className="text-neutral-200 text-base font-normal tracking-wider mb-4">
                        {ed.title}
                      </h3>

                      <h4 className="text-neutral-200 text-base font-normal tracking-wider mb-1 whitespace-nowrap overflow-hidden text-ellipsis" title={`${ed.degree} | ${ed.degreeDate}`}>
                        {ed.degree}
                        <span className="text-neutral-400 text-[13px] font-light ml-2">| {ed.degreeDate}</span>
                      </h4>

                      <p className="text-neutral-400 text-[13px] font-light leading-relaxed tracking-wide" title={ed.university}>
                        {ed.university}
                      </p>

                      <div className="border-t border-white/10 my-3" />
                      <p className="text-neutral-300 text-sm font-normal tracking-wider mb-1">
                        {ed.coursesTitle}
                      </p>

                      <ul className="space-y-4">
                        {showCourses.map((c, idx) => (
                          <li key={idx}>
                            <div className="flex">
                              <span className="text-neutral-500 mr-2 select-none">-</span>
                              <div className="flex-1">
                                <h4 className="text-neutral-200 text-base font-normal tracking-wider mb-0.5">
                                  {c.title}
                                </h4>
                                <p className="text-neutral-400 text-xs font-light leading-relaxed tracking-wide whitespace-nowrap overflow-hidden text-ellipsis" title={`${c.institution} | ${c.date ?? ""}`}>
                                  {`${c.institution} | ${c.date ?? ""}`}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {hasHidden && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setShowAllCourses((s) => !s)}
                            className="pointer-events-auto text-neutral-300 text-xs underline underline-offset-4 hover:text-white transition"
                          >
                            {showAllCourses ? "Ver menos" : "Ver más"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : activeSection === 3 ? (
                (() => {
                  const pub = CV.publications;
                  const allItems = Object.entries(pub)
                    .filter(([k, v]) => /^item\d+$/.test(k) && v && typeof v === "object")
                    .sort(
                      ([a], [b]) =>
                        Number(String(a).replace("item", "")) -
                        Number(String(b).replace("item", ""))
                    )
                    .map(([, v]) => v as {
                      title?: string;
                      journal?: string;
                      date?: string;
                      authors?: string;
                      status?: string;
                      description?: string;
                    });

                  const VISIBLE = 2;
                  const items = showAllPublications ? allItems : allItems.slice(0, VISIBLE);
                  const hasHidden = allItems.length > VISIBLE;

                  return (
                    <div>
                      <h3 className="text-neutral-200 text-base font-normal tracking-wider mb-2">
                        {pub.title}
                      </h3>

                      <ul className="space-y-3">
                        {items.map((p, idx) => (
                          <li key={idx}>
                            <div className="flex">
                              <span className="text-neutral-500 mr-2 select-none">-</span>
                              <div className="flex-1">
                                <h4 className="text-neutral-200 text-base font-normal tracking-wider mb-0.5">
                                  {p.title}
                                </h4>
                                {(p.journal || p.date || p.status) && (
                                  <p className="text-neutral-400 text-[13px] font-light tracking-wide">
                                    {p.journal ?? p.status ?? p.date ?? ""}
                                  </p>
                                )}
                                {p.authors && (
                                  <p className="text-neutral-500 text-xs font-light tracking-wide mt-1">
                                    {p.authors}
                                  </p>
                                )}
                                {p.description && (
                                  <p className="text-neutral-400 text-sm font-light leading-relaxed tracking-wider mt-2">
                                    {p.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {hasHidden && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setShowAllPublications((s) => !s)}
                            className="pointer-events-auto text-neutral-300 text-xs underline underline-offset-4 hover:text-white transition"
                          >
                            {showAllPublications ? "Ver menos" : "Ver más"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : activeSection === 4 ? (
                (() => {
                  const cg = CV.congresses;
                  const items = Object.entries(cg)
                    .filter(([k, v]) => /^item\d+$/.test(k) && v && typeof v === "object")
                    .sort(
                      ([a], [b]) =>
                        Number(String(a).replace("item", "")) -
                        Number(String(b).replace("item", ""))
                    )
                    .map(([, v]) => v as { title?: string; location?: string; date?: string; topic?: string });

                  return (
                    <div>
                      <h3 className="text-neutral-200 text-base font-normal tracking-wider mb-4">
                        {cg.title}
                      </h3>

                      <ul className="space-y-5">
                        {items.map((c, idx) => (
                          <li key={idx}>
                            <div className="flex">
                              <span className="text-neutral-500 mr-2 select-none">-</span>
                              <div className="flex-1">
                                <h4 className="text-neutral-200 text-base font-normal tracking-wider mb-0.5">
                                  {c.title}
                                </h4>
                                {(c.location || c.date) && (
                                  <p className="text-neutral-400 text-[13px] font-light tracking-wide whitespace-nowrap overflow-hidden text-ellipsis" title={`${c.location ?? ""}${c.location && c.date ? " | " : ""}${c.date ?? ""}`}>
                                    {(c.location ?? "") + (c.location && c.date ? " | " : "") + (c.date ?? "")}
                                  </p>
                                )}
                                {c.topic && (
                                  <p className="text-neutral-400 text-sm font-light leading-relaxed tracking-wider mt-2">
                                    {c.topic}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()
              ) : activeSection === 5 ? (
                (() => {
                  const aw = CV.awards;
                  const all = Object.entries(aw)
                    .filter(([k, v]) => /^item\d+$/.test(k) && v && typeof v === "object")
                    .sort(
                      ([a], [b]) =>
                        Number(String(a).replace("item", "")) -
                        Number(String(b).replace("item", ""))
                    )
                    .map(([, v]) => v as { title?: string; description?: string });

                  const VISIBLE = 4;
                  const shown = showAllAwards ? all : all.slice(0, VISIBLE);
                  const hasHidden = all.length > VISIBLE;

                  return (
                    <div>
                      <h3 className="text-neutral-200 text-base font-normal tracking-wider mb-2">
                        {aw.title}
                      </h3>

                      <ul className="space-y-2">
                        {shown.map((a, idx) => (
                          <li key={idx}>
                            <div className="flex">
                              <span className="text-neutral-500 mr-2 select-none">-</span>
                              <div className="flex-1">
                                <h4 className="text-neutral-200 text-base font-normal tracking-wider mb-0.5">
                                  {a.title}
                                </h4>
                                {a.description && (
                                  <p className="text-neutral-400 text-sm font-light leading-relaxed tracking-wider">
                                    {a.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {hasHidden && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setShowAllAwards((s) => !s)}
                            className="pointer-events-auto text-neutral-300 text-xs underline underline-offset-4 hover:text-white transition"
                          >
                            {showAllAwards ? "Ver menos" : "Ver más"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : activeSection === 6 ? (
                (() => {
                  const vol = CV.volunteering;
                  const all = Object.entries(vol)
                    .filter(([k, v]) => /^item\d+$/.test(k) && v && typeof v === "object")
                    .sort(
                      ([a], [b]) =>
                        Number(String(a).replace("item", "")) -
                        Number(String(b).replace("item", ""))
                    )
                    .map(([, v]) => v as { title?: string; role?: string; description?: string });

                  const VISIBLE = 3;
                  const shown = showAllVolunteering ? all : all.slice(0, VISIBLE);
                  const hasHidden = all.length > VISIBLE;

                  return (
                    <div>
                      <h3 className="text-neutral-200 text-base font-normal tracking-wider mb-4">
                        {vol.title}
                      </h3>

                      <ul className="space-y-2">
                        {shown.map((v, idx) => (
                          <li key={idx}>
                            <div className="flex">
                              <span className="text-neutral-500 mr-2 select-none">-</span>
                              <div className="flex-1">
                                <h4 className="text-neutral-200 text-base font-normal tracking-wider mb-0.5">
                                  {v.title}
                                </h4>
                                {v.role && (
                                  <p className="text-neutral-400 text-[13px] font-light tracking-wide">
                                    {v.role}
                                  </p>
                                )}
                                {v.description && (
                                  <p className="text-neutral-400 text-sm font-light leading-relaxed tracking-wider mt-1">
                                    {v.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {hasHidden && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setShowAllVolunteering((s) => !s)}
                            className="pointer-events-auto text-neutral-300 text-xs underline underline-offset-4 hover:text-white transition"
                          >
                            {showAllVolunteering ? "Ver menos" : "Ver más"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-neutral-600 text-sm italic"></div>
              )}
            </MainInfoCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mensaje inferior (aparece 0.7s después) */}
      {showMsgBar && <MessageBar messages={barMessages} />}

      {/* Footer con selector de idioma + cuadro del murciélago */}
<footer className="fixed bottom-5 right-6 z-[160] flex items-end gap-4 text-white text-xs">
  {/* === Selector de idioma (igual que antes) === */}
  <div id="lang-picker" className="relative">
    <button
      type="button"
      onClick={() => setLangOpen((o) => !o)}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/15 active:bg-white/20 transition rounded-full pl-2.5 pr-2 py-2"
      aria-haspopup="menu"
      aria-expanded={langOpen}
      aria-label="Cambiar idioma"
      title="Cambiar idioma"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-90" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm7.93 9h-3.09a15.9 15.9 0 0 0-.85-5.02A8.02 8.02 0 0 1 19.93 11ZM8.01 11H4.07A8.02 8.02 0 0 1 8.95 5.98 15.9 15.9 0 0 0 8.01 11Zm0 2a15.9 15.9 0 0 0 .85 5.02A8.02 8.02 0 0 1 4.07 13h3.94Zm9.83 0a15.9 15.9 0 0 1-.85 5.02A8.02 8.02 0 0 0 19.93 13h-3.09ZM9.67 5.34A13.9 13.9 0 0 1 12 5c.79 0 1.55.12 2.33.34.5 1.14.86 2.44 1.08 3.66H8.59c.22-1.22.58-2.52 1.08-3.66ZM8.59 15h6.82c-.22 1.22-.58 2.52-1.08 3.66A13.9 13.9 0 0 1 12 19c-.79 0-1.55-.12-2.33-.34A17.8 17.8 0 0 1 8.59 15ZM15.41 11H8.59c.1-.72.25-1.45.45-2.16h5.92c.2.71.35 1.44.45 2.16Z"/>
      </svg>
      <span className="tracking-wide">Language</span>
      <svg viewBox="0 0 20 20" className="w-4 h-4 opacity-80" fill="currentColor" aria-hidden="true">
        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.2l3.71-2.97a.75.75 0 1 1 .94 1.16l-4.2 3.36a.75.75 0 0 1-.94 0l-4.2-3.36a.75.75 0 0 1 .02-1.06Z"/>
      </svg>
    </button>

    {langOpen && (
      <div
        role="menu"
        className="absolute bottom-full right-0 mb-2 bg-neutral-900/90 backdrop-blur-sm border border-white/10 shadow-lg rounded-2xl p-1 min-w-[120px]"
      >
        {([
          { code: "es", label: "Español (ES)" },
          { code: "en", label: "English (EN)" },
          { code: "pt", label: "Português (PT)" },
        ] as { code: Lang; label: string }[]).map(({ code, label }) => (
          <button
            key={code}
            role="menuitem"
            onClick={() => { setLang(code); setLangOpen(false); }}
            className={[
              "w-full text-left px-3 py-2 rounded-xl transition",
              lang === code ? "bg-white text-black" : "hover:bg-white/10"
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
    )}
  </div>
</footer>


      {/* Pantallas para scroll */}
      <div className="relative z-10 pointer-events-none">
        {Array.from({ length: TOTAL_SECTIONS }).map((_, i) => (
          <div key={i} className="h-screen" />
        ))}
      </div>
    </div>
  );
}
