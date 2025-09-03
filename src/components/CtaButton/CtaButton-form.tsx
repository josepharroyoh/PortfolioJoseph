import './CtaButton-form.css';
import React from 'react'; // Añadido para claridad

type CtaButtonProps = {
  as?: 'a' | 'button';
  children: React.ReactNode;
  isSubmitting?: boolean; // 1. AÑADIMOS UNA NUEVA PROP PARA EL ESTADO DE ENVÍO
  [key: string]: any;
};

const CtaButton = ({ as, children, isSubmitting, ...props }: CtaButtonProps) => { // 2. OBTENEMOS LA NUEVA PROP
  const Component = as || 'a';

  return (
    <Component
      {...props}
      className={`
        /* --- Clase para nuestra animación custom --- */
        cta-button-animated

        /* --- Estilos de texto (SENSIBLE AL TEMA) --- */
        font-semibold no-underline
        dark:text-[#64FFDA]

        /* --- Bordes y fondo (SENSIBLE AL TEMA) --- */
        bg-transparent rounded-[7px]
        border border-black dark:border-[#64FFDA]!

        /* --- Layout y tamaño (Tailwind) --- */
        inline-block py-[10px] px-[20px]

        /* --- Posicionamiento y transiciones --- */
        relative overflow-hidden z-10 transition-transform duration-300
        
        /* --- Efectos de Hover --- */
        hover:-translate-y-[3px] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,173,181,0.7)]
        
        /* --- Estilos para estado deshabilitado (para el formulario) --- */
        disabled:opacity-50 disabled:cursor-not-allowed

        /* --- 3. AÑADIMOS LA CLASE .submitting CUANDO isSubmitting ES TRUE --- */
        ${isSubmitting ? 'submitting' : ''}
      `}
    >
      {children}
    </Component>
  );
};

export default CtaButton;