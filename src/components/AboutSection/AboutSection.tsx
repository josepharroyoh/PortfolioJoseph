import { Separator } from "../lightswind/separator";
import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next"; 

export const AboutSection = () => {
  const { t } = useTranslation(); 

  return (
    <motion.div
      id="about"
      className="text-foreground max-w-7xl mx-auto w-full px-6 py-12 space-y-4 bg-transparent"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <h2 className="text-3xl font-bold">{t("about.title")}</h2>
      <p className="text-muted-foreground text-sm max-w-3xl">
        <Trans i18nKey="about.description">
          Bachiller de Ciencias Físicas, mi formación me expuso al desafío de manejar bases de datos a gran escala en el 
          <a 
            href="https://www.cieasest.unica.edu.pe/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="no-underline hover:text-green-600"
          >
            CIEASEST
          </a>
          , lo que me dio una sólida base en análisis y automatización. Para superar las limitaciones de la infraestructura local, ahora me especializo en AWS para diseñar y desplegar pipelines de datos robustos en la nube. Mi objetivo es claro: que esta infraestructura alimente a futuros modelos y agentes de IA para construir sistemas que actúen en tiempo real en soluciones innovadoras.
        </Trans>
      </p>
      <Separator />
    </motion.div>
  );
};