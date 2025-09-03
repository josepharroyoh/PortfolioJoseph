import React from "react";
import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  theme: "light" | "dark";
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const gradientVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      backgroundSize: ["200% 200%", "200% 200%", "200% 200%"],
    },
  };

  const bubbleVariants = {
    animate: (i: number) => ({
      y: [0, -100, 0],
      x: [0, 50, -50, 0],
      scale: [1, 1.5, 1],
      opacity: [0.2, 0.4, 0.2],
      transition: {
        duration: 20 + i * 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 2,
      },
    }),
  };

  const colors = isDark 
    ? 'rgba(29, 78, 216, 0.4), rgba(124, 58, 237, 0.4)'
    : 'rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4)';

  const bubbles = Array.from({ length: 15 }).map((_, i) => {
    const size = `${Math.random() * 20 + 10}vh`;
    const top = `${Math.random() * 100}vh`;
    const left = `${Math.random() * 100}vw`;

    return (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          top,
          left,
          background: `radial-gradient(circle, ${colors}, transparent)`,
          filter: `blur(80px)`,
        }}
        custom={i}
        variants={bubbleVariants}
        animate="animate"
      />
    );
  });

  return (
    <div className={`absolute inset-0 overflow-hidden -z-10 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <motion.div
        className="absolute inset-0 opacity-80"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0f172a, #1e3a8a, #4f46e5)'
            : 'linear-gradient(135deg, #e2e8f0, #93c5fd, #c7d2fe)',
          backgroundSize: '200% 200%',
        }}
        variants={gradientVariants}
        animate="animate"
      />
      {bubbles}
    </div>
  );
};