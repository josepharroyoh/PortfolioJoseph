import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Check } from "lucide-react";

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
          className="inline-flex justify-center w-full rounded-full border border-gray-500 shadow-sm px-3 py-1 bg-black/70 dark:bg-gray-800 text-sm font-medium text-white hover:bg-black/80 dark:hover:bg-gray-700 focus:outline-none"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentLang.flag} {currentLang.code.toUpperCase()}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      {/* Panel del dropdown */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                role="menuitem"
                tabIndex={-1}
              >
                {lang.flag} {lang.name}
                {i18n.language === lang.code && <Check className="inline-block ml-2 h-4 w-4 text-pink-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;