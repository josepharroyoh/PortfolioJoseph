import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useForm, ValidationError } from '@formspree/react';
import './ContactModal.css';
import { useEffect, useRef } from 'react';
import CtaButtonform from '../CtaButton/CtaButton-form';

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [state, handleSubmit, reset] = useForm("xovlbkyr");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.succeeded) {
      formRef.current?.reset(); 
      const timer = setTimeout(() => {
        onClose();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded, onClose]);

  useEffect(() => {
    if (!isOpen && state.succeeded) {
      reset();
    }
  }, [isOpen, state.succeeded, reset]);

  // Este useEffect se encarga de cerrar el modal al presionar la tecla 'Escape'
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]); 

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-[599px] h-[502px] m-4 p-8 bg-[rgba(30,30,30,0.9)] border border-[#64FFDA]! rounded-lg shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#64FFDA] hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold text-center text-[#64FFDA] mb-3">Contacto</h2>
            
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                <input id="name" type="text" name="name" required className="w-full bg-black/50 border border-gray-600! rounded-md p-2 text-white focus:border-[#64FFDA]! focus:ring-1 focus:ring-[#64FFDA]/50 outline-none transition-all" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
                <input id="email" type="email" name="email" required className="w-full bg-black/50 border border-gray-600! rounded-md p-2 text-white focus:border-[#64FFDA]! focus:ring-1 focus:ring-[#64FFDA]/50 outline-none transition-all" />
                <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Mensaje</label>
                <textarea id="message" name="message" required rows={3} className="w-full bg-black/50 border border-gray-600! rounded-md p-2 text-white resize-none focus:border-[#64FFDA]! focus:ring-2 focus:ring-[#64FFDA]/50 outline-none transition-all" />
                <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm mt-1" />
              </div>

              <div className="mt-2 flex justify-center">
                <CtaButtonform
                  as="button"
                  type="submit"
                  disabled={state.submitting || state.succeeded}
                  // Pasamos el estado de envío de Formspree directamente al botón
                  isSubmitting={state.submitting}
                >
                  Enviar Mensaje
                </CtaButtonform>
              </div>

              <div className="mt-2 text-center text-sm min-h-[1.25rem]">
                {state.submitting && !state.succeeded && (
                  <p className="text-gray-400">Enviando...</p>
                )}
                {state.succeeded && (
                  <p className="text-gray-400">¡Gracias! Tu mensaje ha sido enviado.</p>
                )}
                {!state.submitting && !state.succeeded && state.errors && (
                   <p className="text-red-500">Hubo un error. Por favor, intenta de nuevo.</p>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}