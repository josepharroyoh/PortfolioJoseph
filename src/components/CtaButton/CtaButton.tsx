import './CtaButton.css';
// --- INICIO DE ADICIONES ---
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// --- FIN DE ADICIONES ---

type CtaButtonProps = {
  as?: 'a' | 'button';
  children: React.ReactNode;
  href?: string;
  [key: string]: any;
};

const CtaButton = ({ as, children, ...props }: CtaButtonProps) => {
  const Component = as || 'a';

  // --- LÓGICA AÑADIDA PARA SOLUCIONAR EL PROBLEMA EN MÓVIL ---
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsLoading(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (props.href) {
      e.preventDefault();
      setIsLoading(true);
      setTimeout(() => {
        navigate(props.href as string);
      }, 600); // Duración de tu animación CSS
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };
  // --- FIN DE LA LÓGICA AÑADIDA ---

  return (
    <Component
      {...props}
      onClick={handleClick} // Se añade el manejador de clic
      className={`
        /* --- Clase para nuestra animación custom --- */
        cta-button-animated

        /* --- Estilos de texto (SENSIBLE AL TEMA) --- */
        font-semibold no-underline
        text-black dark:text-[#64FFDA]

        /* --- Bordes y fondo (SENSIBLE AL TEMA) --- */
        bg-transparent rounded-[7px]
        border border-black! dark:border-[#64FFDA]!

        /* --- Layout y tamaño (Tailwind) --- */
        inline-block py-[14px] px-[30px]

        /* --- Posicionamiento y transiciones --- */
        relative overflow-hidden z-10 transition-transform duration-300
        
        /* --- Efectos de Hover --- */
        hover:-translate-y-[3px] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,173,181,0.7)]
        
        /* --- Estilos para estado deshabilitado (para el formulario) --- */
        disabled:opacity-50 disabled:cursor-not-allowed
        
        /* --- CAMBIO AQUÍ: Se añade la clase de carga condicional --- */
        ${isLoading ? 'loading' : ''}
      `}
    >
      {children}
    </Component>
  );
};

export default CtaButton;