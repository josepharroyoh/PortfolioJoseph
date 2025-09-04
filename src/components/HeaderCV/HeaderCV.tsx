import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Check, ChevronDown, ArrowLeft, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  navItems: { name: string; id: string }[];
  scrollToSection: (id: string) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  // Se agrega esta prop para poder abrir el menú lateral desde aquí.
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const languages = [
  { code: "es", name: "Español", flag: "/images/es-flag.png" },
  { code: "en", name: "English", flag: "/images/gb-flag.png" },
  { code: "pt", name: "Português", flag: "/images/br-flag.png" },
];

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, navItems, scrollToSection, setIsOpen, isOpen, setIsSidebarOpen }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-20 transition-all duration-300">
      <nav className="bg-white dark:bg-gray-900 shadow-lg p-1">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Lado izquierdo: Botón de regreso y Contenido de perfil (móvil/PC) */}
          <div className="flex items-center space-x-4">
            {/* Botón de regreso */}
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-800 dark:text-white" />
            </button>
            {/* Contenido del perfil visible en el encabezado móvil, oculto en PC */}
            <div className="flex items-center space-x-2 md:hidden">
              <img src="images/foto.jpg" alt="Joseph" className="w-18 h-18 rounded-full border-2 border-gray-300" />
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-gray-800 dark:text-white">Joseph Pascual</h1>
                <h1 className="text-sm font-bold text-gray-800 dark:text-white">Arroyo Hernandez</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">• Campo eléctrico atmosférico</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">• Data Analytics</p>
              </div>
            </div>
            {/* Contenido principal del encabezado (solo PC), oculto en móvil */}
            <div className="hidden md:flex items-center space-x-12">
              <img src="images/foto.jpg" alt="Joseph" className="w-24 h-24 rounded-full border-0.1 border-gray-300" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Joseph Pascual</h1>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Arroyo Hernandez</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">• Campo eléctrico atmosférico</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">• Data Analytics</p>
              </div>
            </div>
          </div>
          {/* Lado derecho: Menú de navegación (solo PC) y botón de menú hamburguesa (móvil) */}
          <div className="flex items-center space-x-30">
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <a key={item.id} onClick={() => scrollToSection(item.id)} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors cursor-pointer text-sm font-medium">
                  {item.name}
                </a>
              ))}
            </div>
             {/* Botón de menú para móviles, visible solo en responsive */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:hidden"
            >
              <Menu size={34} className="text-gray-800 dark:text-white" />
            </button>
          </div>
        </div>
      </nav>
      {/* Recuadro de utilidades en la esquina superior derecha (SOLO PC) */}
      <div className="absolute top-0 right-0 p-3 hidden md:block">
        <div className="flex items-center space-x-2">
          {/* Botón de modo oscuro/claro */}
          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Cambiar tema"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (<motion.div key="moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}><Moon size={20} className="text-gray-800 dark:text-white" /></motion.div>) : (<motion.div key="sun" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}><Sun size={20} className="text-gray-800 dark:text-white" /></motion.div>)}
            </AnimatePresence>
          </motion.button>
          {/* Selector de idioma */}
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-1 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Seleccionar idioma"
            >
              <img src={currentLang.flag} alt={currentLang.name} className="mr-2 h-4 w-4" />
              {currentLang.code.toUpperCase()}
              <ChevronDown className="-mr-1 ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            </button>
            {isOpen && (<div className="absolute right-0 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 mt-2">
              <div className="py-1">
                {languages.map((lang) => (<button key={lang.code} onClick={() => changeLanguage(lang.code)} className="text-gray-700 dark:text-gray-200 flex items-center justify-between px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                  <span><img src={lang.flag} alt={lang.name} className="mr-2 h-4 w-4 inline-block" />{lang.name}</span>
                  {i18n.language === lang.code && <Check className="h-4 w-4 text-blue-500" />}
                </button>))}
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </header>
  );
};