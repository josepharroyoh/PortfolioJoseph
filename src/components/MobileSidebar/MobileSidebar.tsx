import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, Moon, Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MobileSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
  navItems: { name: string; id: string }[];
  scrollToSection: (id: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const languages = [
  { code: "es", name: "Español", flag: "/images/es-flag.png" },
  { code: "en", name: "English", flag: "/images/gb-flag.png" },
  { code: "pt", name: "Português", flag: "/images/br-flag.png" },
];

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  theme,
  setTheme,
  navItems,
  scrollToSection,
  isOpen,
  setIsOpen,
}) => {
  const { i18n } = useTranslation();
  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-900 shadow-2xl z-50 p-6 flex flex-col"
        >
          {/* Encabezado de la barra lateral */}
          <div className="flex items-center justify-between mb-8">
            
            {/* --- INICIO DEL CAMBIO --- */}
            
            {/* 1. Título ahora a la izquierda */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Menú</h2>
            
            {/* 2. Botón de cerrar ahora a la derecha */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={24} className="text-gray-800 dark:text-white" />
            </button>
            
            {/* --- FIN DEL CAMBIO --- */}

          </div>

          {/* Botones de utilidades (tema y idioma) */}
          <div className="flex items-center justify-between mb-8">
            {/* Botón de tema */}
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

          {/* Lista de enlaces de navegación */}
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors cursor-pointer text-lg font-medium p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};