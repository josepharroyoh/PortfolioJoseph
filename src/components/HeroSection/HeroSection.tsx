import { useTranslation } from "react-i18next";
import { Badge } from "../lightswind/badge";
import { motion } from "framer-motion";
// @ts-ignore
import { TypingText } from "../lightswind/TypingText";
// @ts-ignore
import { ShinyText } from "../lightswind/shiny-text";
import CtaButton from '../CtaButton/CtaButton';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const HeroSection = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.div
      id="hero"
      className="min-h-screen text-foreground flex flex-col md:flex-row md:items-center justify-center pt-14 pb-20 max-w-6xl mx-auto w-full"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delayChildren: 0.3,
          staggerChildren: 0.2,
        },
      }}
    >
      {/* Left Section (Texto) */}
      <motion.div
        className="w-full md:w-2/3 space-y-4 p-6 text-center md:text-left"
        initial={false}
      >
        <motion.h1
          className="text-4xl font-bold md:whitespace-nowrap"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          }}
        >
          <TypingText
            as="span"
            duration={2}
            delay={0.1}
            fontSize="text-5xl"
            fontWeight="font-bold"
            color="text-foreground"
            letterSpacing="tracking-tight"
            // --- ESTE ES EL ÚNICO CAMBIO ---
            align={isMobile ? 'center' : 'left'} // Centrado en móvil, a la izquierda en escritorio
            loop={true}
            showCursor={!isMobile}
          >
            Joseph Arroyo Hernandez
          </TypingText>

          <motion.span
            className="text-sm text-pink-500 font-semibold block"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.8, ease: "easeOut" },
            }}
          >
            {/* ... */}
          </motion.span>
        </motion.h1>

        <motion.h2
          className="text-xl text-muted-foreground mt-1"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          }}
        >
          <ShinyText
            speed={5}
            delay={1}
            direction="left-to-right"
            repeat="infinite"
            baseColor="hsl(var(--foreground))"
            shineColor="hsl(var(--foreground)/10)"
            shineWidth={13}
            pauseOnHover={true}
          >
            {t("hero.role")}
          </ShinyText>
        </motion.h2>

        <motion.div
          className="flex flex-wrap justify-center md:justify-start gap-2"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          }}
        >
          <Badge className="text-xs bg-pink-500">{t("hero.badge1")}</Badge>
          <Badge className="text-xs bg-pink-500">{t("hero.badge2")}</Badge>
          <Badge className="text-xs bg-pink-500">{t("hero.badge3")}</Badge>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center md:justify-start"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
          }}
        >
          <CtaButton href="cv">
            {t("hero.ctaButton")}
          </CtaButton>
        </motion.div>

      </motion.div>

      {/* Right Section (Imagen) */}
      <motion.div
        className="w-full md:w-1/3 flex justify-center p-6"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
      >
        <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg">
          <img
            src="/images/foto.jpg"
            alt="Joseph Arroyo"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};