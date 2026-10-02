// src/components/componentes-cv/MessageBar.tsx

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface MessageBarProps {
  messages: string[];
}

export default function MessageBar({ messages }: MessageBarProps) {
  // --- Estados y Refs para animaciones ---
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const typeIntervalRef = useRef<number | null>(null);
  const nextMessageTimeoutRef = useRef<number | null>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const eyeLRef = useRef<HTMLDivElement>(null);
  const eyeRRef = useRef<HTMLDivElement>(null);
  const blinkRef = useRef<number | null>(null);
  const moveRef = useRef<number | null>(null);
  const translationRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef({ y: 1 });

  // --- Lógica para el menú expandible ---
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleToggleMenu = () => setIsOpen((v) => !v);

  // --- Cerrar con tecla ESC ---
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // --- Utils de animación ojos ---
  const applyTransform = () => {
    const l = eyeLRef.current,
      r = eyeRRef.current;
    if (!l || !r) return;
    const trans = `translate(${translationRef.current.x}px, ${translationRef.current.y}px)`;
    const scale = `scaleY(${scaleRef.current.y})`;
    l.style.transform = `${trans} ${scale}`;
    r.style.transform = `${trans} ${scale}`;
  };

  // --- Typing loop ---
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const cleanup = () => {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      if (nextMessageTimeoutRef.current) clearTimeout(nextMessageTimeoutRef.current);
    };
    cleanup();
    const fullMessage = messages[messageIndex % messages.length];
    let charIndex = 0;
    typeIntervalRef.current = window.setInterval(() => {
      if (charIndex < fullMessage.length) {
        setDisplayedText(fullMessage.substring(0, charIndex + 1));
        charIndex++;
      } else {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        nextMessageTimeoutRef.current = window.setTimeout(
          () => setMessageIndex((prev) => (prev + 1) % messages.length),
          3000
        );
      }
    }, 40);
    return cleanup;
  }, [messageIndex, messages]);

  // --- Parpadeo ---
  useEffect(() => {
    const blink = () => {
      scaleRef.current.y = 0.15;
      applyTransform();
      setTimeout(() => {
        scaleRef.current.y = 1;
        applyTransform();
      }, 120);
    };
    const loop = () => {
      blinkRef.current = window.setTimeout(() => {
        blink();
        loop();
      }, 1800 + Math.random() * 2200);
    };
    loop();
    return () => {
      if (blinkRef.current) clearTimeout(blinkRef.current);
    };
  }, []);

  // --- Movimiento ojos ---
  useEffect(() => {
    const positions = [
      { x: 0, y: 0 }, { x: 3, y: 0 }, { x: -3, y: 0 }, { x: 0, y: -2 },
      { x: 3, y: -1 }, { x: -3, y: -1 }, { x: 0, y: 2 },
    ];
    const moveEyes = () => {
      const target = positions[Math.floor(Math.random() * positions.length)];
      translationRef.current = target;
      applyTransform();
      const nextMoveIn = 1000 + Math.random() * 2000;
      moveRef.current = window.setTimeout(moveEyes, nextMoveIn);
    };
    moveEyes();
    return () => {
      if (moveRef.current) clearTimeout(moveRef.current);
    };
  }, []);
  
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto">
      <div
        className={clsx(
          "relative z-[9999] w-[500px] max-w-[92vw] bg-white rounded-md border border-[#E9E9E9] overflow-hidden transition-all duration-500 ease-in-out flex flex-col-reverse drop-shadow-xl",
          isOpen ? "h-40" : "h-12"
        )}
      >
        {/* Barra inferior (mensaje + botón) */}
        <div className="w-full h-12 flex items-center justify-between pt-4 pr-5 pb-4 pl-3 shrink-0">
          <div className="flex items-center gap-6">
            <div
              ref={cubeRef}
              className="relative w-8 h-8 bg-black rounded-[3px] shrink-0"
              style={{ left: 7 }}
            >
              <div
                ref={eyeLRef}
                className="eye absolute w-[4px] h-[4px] bg-white rounded-[1px]"
                style={{ left: 7, top: 8 }}
              />
              <div
                ref={eyeRRef}
                className="eye absolute w-[4px] h-[4px] bg-white rounded-[1px]"
                style={{ left: 17, top: 8 }}
              />
            </div>
            <p className="text-black text-sm leading-none">{displayedText}</p>
          </div>
          <button
            onClick={handleToggleMenu}
            aria-label="more"
            className="btn-plus w-8 h-8 flex items-center justify-center shrink-0"
          >
            <div className="relative w-4 h-4">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1.5px] bg-black rounded-full"></div>
              <div
                className={clsx(
                  "absolute left-1/2 top-0 -translate-x-1/2 w-[1.5px] h-full bg-black rounded-full transition-transform duration-300 ease-in-out",
                  isOpen ? "scale-y-0" : "scale-y-100"
                )}
              ></div>
            </div>
          </button>
        </div>

        {/* Zona expandible (iconos) */}
        <div
          className={clsx(
            "w-full flex-1 px-8 pt-4 pb-6 transition-opacity duration-300 ease-in-out flex flex-col justify-center",
            isOpen ? "opacity-100" : "opacity-0 invisible"
          )}
        >
          <div className="border-t border-gray-200"></div>
          <div className="flex items-center justify-around mt-6 pointer-events-auto">
            {/* GitHub */}
            <a
              href="https://github.com/josepharroyoh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="transition-transform duration-200 hover:scale-110 drop-shadow-sm"
              >
                <circle cx="12" cy="12" r="12" fill="#181717" />
                <path
                  fill="#FFFFFF"
                  d="M12 .296C5.373.296 0 5.669 0 12.296c0 5.279 3.438 9.747 8.207 11.327.6.111.793-.263.793-.58v-2.232c-3.338.724-4.033-1.418-4.033-1.418-.546-1.386-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.239 1.839 1.239 1.07 1.833 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.312.469-2.381 1.236-3.221-.124-.304-.535-1.525.117-3.176 0 0 1.008-.323 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.651.242 2.872.118 3.176.77.84 1.235 1.909 1.235 3.221 0 4.609-2.807 5.623-5.479 5.92.43.372.823 1.103.823 2.223v3.292c0 .319.192.694.801.577C20.562 22.042 24 17.574 24 12.296 24 5.669 18.627.296 12 .296z"
                />
              </svg>
              <span className="text-xs mt-1">GitHub</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/josepharroyohernandez"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="transition-transform duration-200 hover:scale-110 drop-shadow-sm"
              >
                <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
                <path
                  fill="#FFFFFF"
                  d="M7 9h2.7v8.5H7V9zm1.35-4A1.55 1.55 0 1 1 6.8 6.55 1.55 1.55 0 0 1 8.35 5zM10.9 9h2.58v1.16h.04c.36-.68 1.23-1.4 2.53-1.4 2.7 0 3.2 1.77 3.2 4.07V17.5H16.6v-3.66c0-.87-.02-1.99-1.22-1.99-1.22 0-1.41.95-1.41 1.93V17.5H10.9V9z"
                />
              </svg>
              <span className="text-xs mt-1">LinkedIn</span>
            </a>

            {/* ORCID */}
            <a
              href="https://orcid.org/0000-0002-1355-5182"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="rounded-full transition-transform duration-200 hover:scale-110 drop-shadow-sm"
              >
                <circle cx="12" cy="12" r="12" fill="#A6CE39" />
                <path
                  fill="#FFFFFF"
                  d="M8.9 7.2h1.3v9.6H8.9V7.2zm2.4 0h3.2c2.3 0 4.1 1.7 4.1 4.8 0 3.2-1.8 4.8-4.1 4.8h-3.2V7.2zm1.3 8.4h1.8c1.7 0 2.8-1.1 2.8-3.6 0-2.4-1.1-3.6-2.8-3.6h-1.8v7.2zM7.6 9.3c0 .4-.3.8-.8.8s-.8-.4-.8-.8.3-.8.8-.8.8.4.8.8z"
                />
              </svg>
              <span className="text-xs mt-1">ORCID</span>
            </a>

            {/* Correo */}
            <a
              href="mailto:arroyohernandezjoseph@gmail.com"
              className="flex flex-col items-center text-black hover:text-gray-700 transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="transition-transform duration-200 hover:scale-110"
              >
                <path d="M0 3v18h24v-18H0zm21.518 2l-9.518 7.713L2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z" />
              </svg>
              <span className="text-xs mt-1">Contacto</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}