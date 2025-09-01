import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import {
  FaPython,
  FaDatabase,
  FaCloud,
  FaChartBar,
  FaFileExcel,
  FaGitAlt,
  FaTerminal,
  FaRobot,
  FaSyncAlt,
} from "react-icons/fa";
import { SiScikitlearn } from "react-icons/si";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const SkillsSection = () => {
  const { t } = useTranslation();

  // 1. AÑADIMOS UN 'id' ESTABLE QUE NO CAMBIA CON EL IDIOMA
  const skillsData = [
    { id: "python", name: t("skills.items.python"), icon: <FaPython size="1.8rem" /> },
    { id: "sql", name: t("skills.items.sql"), icon: <FaDatabase size="1.8rem" /> },
    { id: "aws", name: t("skills.items.aws"), icon: <FaCloud size="1.8rem" /> },
    { id: "powerbi", name: t("skills.items.powerbi"), icon: <FaChartBar size="1.8rem" /> },
    { id: "ml", name: t("skills.items.ml"), icon: <SiScikitlearn size="1.8rem" /> },
    { id: "excel", name: t("skills.items.excel"), icon: <FaFileExcel size="1.8rem" /> },
    { id: "etl", name: t("skills.items.etl"), icon: <FaSyncAlt size="1.8rem" /> },
    { id: "agents", name: t("skills.items.agents"), icon: <FaRobot size="1.8rem" /> },
    { id: "git", name: t("skills.items.git"), icon: <FaGitAlt size="1.8rem" /> },
    { id: "bash", name: t("skills.items.bash"), icon: <FaTerminal size="1.8rem" /> },
  ];

  return (
    <section id="skills" className="space-y-10 py-10 px-6">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h3
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {t("skills.title")}
        </motion.h3>

        <motion.div
          className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skillsData.map((skill) => (
            <motion.div
              key={skill.id} // 2. USAMOS EL 'id' ESTABLE COMO KEY
              className="group flex flex-col items-center p-4 rounded-md transition-all duration-300 cursor-pointer
                         bg-[#112240]/70 backdrop-blur-md border border-white/5
                         hover:bg-[#64FFDA] hover:border-[#64FFDA] hover:text-black"
              variants={itemVariants}
            >
              <div className="text-[#64FFDA] mb-2 transition-colors duration-300 group-hover:text-black">
                {skill.icon}
              </div>
              <span className="text-sm text-[#CCD6F6] transition-colors duration-300 group-hover:text-black font-mono">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};