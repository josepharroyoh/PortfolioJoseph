import './CtaButton.css';

// --- CAMBIO 1: Se actualizan las propiedades (Props) ---
type CtaButtonProps = {
  as?: 'a' | 'button'; 
  children: React.ReactNode;
  [key: string]: any; 
};

const CtaButton = ({ as, children, ...props }: CtaButtonProps) => {
  const Component = as || 'a'; 

  return (
    <Component
      // Pasamos todas las propiedades adicionales (href, type, disabled, etc.) al componente
      {...props} 
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
      `}
    >
      {children}
    </Component>
  );
};

export default CtaButton;