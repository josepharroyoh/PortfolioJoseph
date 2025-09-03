import { motion } from "framer-motion";
import React from "react";

interface SectionCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
  direction?: "left" | "right";
  titleGradient?: string;
  className?: string; // 1. SE AÑADE ESTA LÍNEA PARA ACEPTAR LA CLASE
}

export const SectionCard: React.FC<SectionCardProps> = ({
  id,
  title,
  children,
  delay = 0,
  direction = "right",
  titleGradient = "from-blue-600 to-purple-600",
  className, // 2. SE AÑADE className A LA LISTA DE PROPS
}) => {
  return (
    <motion.section
      id={id}
      // 3. SE COMBINA LA CLASE EXISTENTE CON LA NUEVA USANDO `${}`
      className={`bg-transparent backdrop-blur-none p-6 rounded-xl shadow-2xl mb-8 border border-gray-300/30 dark:border-gray-600/40 ${className || ''}`}
      initial={{ opacity: 0, x: direction === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <h2 className={`text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center`}>
        <div className={`w-1 h-8 bg-gradient-to-b ${titleGradient} rounded-full mr-3`}></div>
        {title}
      </h2>
      {children}
    </motion.section>
  );
};