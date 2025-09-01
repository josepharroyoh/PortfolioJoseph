import { Card, CardHeader, CardTitle, CardContent } from "../lightswind/card";
import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";

export const EducationSection = () => {
  const { t } = useTranslation();

  return (
    <motion.section
      id="education"
      className="space-y-10 py-10 px-6"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div>
        <motion.h3
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {t("education.title")}
        </motion.h3>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-1 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Card> 
            <CardHeader>
              <CardTitle>{t("education.degree")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Universidad Nacional San Luis Gonzaga | 2018 – 2023
              </p>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                <Trans i18nKey="education.summary">
                  Adquirió bases sólidas en <strong>programación</strong>,
                  <strong> análisis</strong>, and
                  <strong> investigación</strong>.
                </Trans>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <Trans i18nKey="education.achievement1">
                    Ganador del Premio de Investigación Científica UNICA 2023, Tesista en el proyecto 
                      <a 
                        href="https://www.aireica.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="no-underline hover:text-green-600"
                      >
                      <strong>Alerta temprana de tormentas de polvo</strong>
                      </a>
                    , financiado con USD 16,000
                  </Trans>
                </li>
                <li>{t("education.achievement2")}</li>
                <li>{t("education.achievement3")}</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};
