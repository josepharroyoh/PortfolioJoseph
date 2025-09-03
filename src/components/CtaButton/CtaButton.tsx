import './CtaButton.css';
// --- INICIO DE CAMBIOS ---
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// --- FIN DE CAMBIOS ---

type CtaButtonProps = {
  as?: 'a' | 'button'; 
  children: React.ReactNode;
  href?: string; // Hacemos href opcional
  [key: string]: any; 
};

const CtaButton = ({ as, children, href, ...props }: CtaButtonProps) => {
  // --- LÓGICA AÑADIDA PARA CONTROLAR LA NAVEGACIÓN EN MÓVIL ---
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  // 1. Manejador de clic que activa la animación y navega con retraso
  const handleNavigateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevenimos cualquier comportamiento por defecto si es necesario
    e.preventDefault();
    
    setIsNavigating(true); // Activa el estado de carga (y la clase .loading en el CSS)

    // Esperamos 600ms para que la animación se complete antes de navegar
    setTimeout(() => {
      if (href) {
        navigate(href);
      }
    }, 600); // Esta duración debe coincidir con la de tu transición en CSS
  };

  // 2. useEffect para arreglar el problema del botón "atrás" en el navegador (bfcache)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Si la página se restaura desde la caché, reiniciamos el estado del botón
        setIsNavigating(false);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
  // --- FIN DE LA LÓGICA AÑADIDA ---


  // Si el botón es un enlace simple (no el de navegación principal), usamos una etiqueta 'a'
  if (as === 'a') {
    return (
      <a
        href={href}
        {...props}
        className={`
          cta-button-animated
          font-semibold no-underline text-black dark:text-[#64FFDA]
          bg-transparent rounded-[7px] border border-black dark:border-[#64FFDA]
          inline-block py-[14px] px-[30px]
          relative overflow-hidden z-10 transition-transform duration-300
          hover:-translate-y-[3px] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,173,81,0.7)]
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {children}
      </a>
    );
  }

  // Este es el botón principal que ahora tiene la lógica de navegación controlada
  return (
    <button
      {...props}
      onClick={handleNavigateClick}
      disabled={isNavigating}
      className={`
        cta-button-animated
        font-semibold no-underline text-black dark:text-[#64FFDA]
        bg-transparent rounded-[7px] border border-black dark:border-[#64FFDA]
        inline-block py-[14px] px-[30px]
        relative overflow-hidden z-10 transition-transform duration-300
        hover:-translate-y-[3px] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,173,81,0.7)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isNavigating ? 'loading' : ''} // Añadimos la clase .loading cuando está navegando
      `}
    >
      {children}
    </button>
  );
};

export default CtaButton;