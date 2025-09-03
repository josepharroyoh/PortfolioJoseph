// src/components/CtaButton/CtaButton-form.tsx
import './CtaButton-form.css';
import React from 'react';

type CtaButtonProps = {
  as?: 'a' | 'button';
  children: React.ReactNode;
  isSubmitting?: boolean;
  [key: string]: any;
};

const CtaButtonform = ({ as, children, isSubmitting, ...props }: CtaButtonProps) => {
  const Component = as || 'button';

  return (
    <Component
      {...props}
      className={`
        /* Tu clase de animación custom */
        cta-button-animated
        /* Tus otros estilos de Tailwind... */
        font-semibold no-underline dark:text-[#64FFDA]
        bg-transparent rounded-[7px] border border-black dark:border-[#64FFDA]!
        inline-block py-[10px] px-[20px]
        relative overflow-hidden z-10 transition-transform duration-300
        hover:-translate-y-[3px] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,173,181,0.7)]
        disabled:opacity-50 disabled:cursor-not-allowed
        /* La clase se añade solo si el formulario se está enviando */
        ${isSubmitting ? 'submitting' : ''}
      `}
    >
      {children}
    </Component>
  );
};

export default CtaButtonform;