import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants, MotionProps } from "framer-motion";
import { Menu, X, Sun, Moon, BookCheckIcon, ChevronDown, Check } from "lucide-react";
import { BorderBeam } from "../lightswind/border-beam";
import { useTranslation } from "react-i18next";

// 2. DEFINIMOS EL COMPONENTE PERSONALIZADO PARA EL IDIOMA AQUÍ MISMO
const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-full border border-gray-500 shadow-sm px-3 py-1 bg-black/70 dark:bg-gray-800 text-sm font-medium text-white hover:bg-black/80 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-pink-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="mr-2">{currentLang.flag}</span>
          {currentLang.code.toUpperCase()}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="text-gray-700 dark:text-gray-200 flex items-center justify-between px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span>{lang.flag} {lang.name}</span>
                {i18n.language === lang.code && <Check className="h-4 w-4 text-pink-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// componente Header original empieza aquí
type HeaderProps = {
  scrollToSection: (id: string) => void;
  onContactClick: () => void;
};

export default function Header({ scrollToSection, onContactClick }: HeaderProps) {
  const { t } = useTranslation();

  const navItems = [
    { name: t("nav.home"), href: "#hero" },
    { name: t("nav.about"), href: "#about" },
    { name: t("nav.education"), href: "#education" },
    { name: t("nav.skills"), href: "#skills" },
    { name: t("nav.contact"), href: "#contact-modal" },
  ];

  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const menuVariants: Variants = { /* ... */ };
  const listVariants: Variants = { /* ... */ };
  const itemVariants: Variants = { /* ... */ };

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.header
          initial={{ y: -100, top: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4"
        >
          <div
            className="border border-gray-100 dark:border-gray-900 backdrop-blur-xl
            w-full xl:max-w-6xl rounded-full
            flex items-center justify-between px-6 py-3
            transition-all duration-300"
          >
            <BorderBeam />
            <a onClick={() => scrollToSection("#hero")} className="cursor-pointer font-bold text-lg text-gray-800 dark:text-white"><BookCheckIcon /></a>
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex space-x-6">
                {navItems.map((item) => (
                  <motion.li key={item.name} className="relative group text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                    <a onClick={() => { if (item.href === "#contact-modal") { onContactClick(); } else { scrollToSection(item.href); } }} className="cursor-pointer hover:text-[#06b6d4] dark:hover:text-[#06b6d4] inline-block transition-transform duration-300 ease-in-out hover:scale-110">{item.name}</a>
                    <motion.span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#06b6d4] rounded-full" initial={{ width: 0, x: "-50%" }} whileHover={{ width: "100%" }} transition={{ duration: 0.3 }} />
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full text-sm font-semibold hover:bg-pink-400 dark:hover:bg-pink-800 transition-colors hidden md:block" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (<motion.div key="moon" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}><Moon size={20} className="text-gray-800 dark:text-white" /></motion.div>) : (<motion.div key="sun" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}><Sun size={20} className="text-gray-800 dark:text-white" /></motion.div>)}
              </AnimatePresence>
            </motion.button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-800 dark:text-white"><Menu size={24} /></button>
          </div>
          
          {/* 3. REEMPLAZA EL ANTIGUO SELECT CON EL NUEVO COMPONENTE */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:block">
            <LanguageSwitcher />
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                {...({ initial: "closed", animate: "open", exit: "closed", variants: menuVariants } as MotionProps)}
                className="fixed inset-0 z-40 bg-background dark:bg-background-dark md:hidden flex flex-col items-center justify-center"
              >
                <motion.button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-gray-800 dark:text-white" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ delay: 0.2 }}>
                  <X size={32} />
                </motion.button>
                <motion.ul {...({ variants: listVariants } as MotionProps)} className="flex flex-col items-center justify-center h-full space-y-8">
                  {navItems.map((item) => (
                    <motion.li key={item.name} {...({ variants: itemVariants } as MotionProps)}>
                      <a onClick={() => { if (item.href === "#contact-modal") { onContactClick(); } else { scrollToSection(item.href); } setIsMobileMenuOpen(false); }} className="text-4xl font-bold text-gray-800 dark:text-white cursor-pointer">{item.name}</a>
                    </motion.li>
                  ))}
                </motion.ul>
                
                {/* 4. REEMPLAZA TAMBIÉN EL SELECT DEL MENÚ MÓVIL */}
                <div className="absolute bottom-10 ">
                  <LanguageSwitcher />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}