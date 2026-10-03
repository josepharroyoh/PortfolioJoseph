// Language-independent facts. Translated copy lives in src/locales/*.json.

export const PROFILE = {
  fullName: "Joseph Pascual Arroyo Hernández",
  shortName: "Joseph Arroyo",
  email: "arroyohernandezjoseph@gmail.com",
  photo: "/images/foto.jpg",
  formspreeId: "xovlbkyr",
  links: {
    github: "https://github.com/josepharroyoh",
    linkedin: "https://www.linkedin.com/in/josepharroyohernandez/",
    orcid: "https://orcid.org/0000-0002-1355-5182",
    cieasest: "https://www.cieasest.unica.edu.pe/",
    aireica: "https://www.aireica.com",
  },
} as const;

export const THESIS_PATH = "/proyectos/prediccion-de-rayos";
export const CV_PATH = "/cv";

/** Home page sections in order; the nav and the assistant follow the active one. */
export const SECTIONS = ["home", "academic", "awards", "experience", "projects", "skills", "training", "volunteering", "contact"] as const;
export type SectionId = (typeof SECTIONS)[number];

type Project = {
  key: string;
  tags: string[];
  link?: string;
  /** Route inside this site (the thesis page). */
  page?: string;
  video?: string;
  poster?: string;
};

/** Media, tags and links per project, matched by `key` with locale `projects.items`. */
export const PROJECTS: Project[] = [
  {
    key: "thesis",
    tags: ["Campo eléctrico", "GOES-16/19", "GLM", "Deep learning", "Series temporales"],
    page: THESIS_PATH,
  },
  {
    key: "reffindr",
    video: "/videos/reffindr.mp4",
    poster: "/posters/reffindr.jpg",
    tags: ["Python", "Flask", "Azure", "Power BI", "Supabase"],
    link: "https://github.com/IgrowkerTraining/i004-reffindr-back-python/tree/docs/readme",
  },
  {
    key: "prello",
    video: "/videos/prello.mp4",
    poster: "/posters/prello.jpg",
    tags: ["Python", "ETL", "BigQuery", "Power BI"],
    link: "https://drive.google.com/file/d/1K07cqroSZ_A3oh06IIFEHFe5NUXQSgvd/view?usp=sharing",
  },
  {
    key: "aireica",
    tags: ["Python", "SQL", "Linux", "Power BI", "Sensores PM y campo eléctrico"],
    link: "https://www.aireica.com",
  },
  {
    key: "cori",
    tags: ["NASA Space Apps", "Clima espacial", "Web interactiva"],
    link: "https://youtu.be/LrkSt2qn5bg",
  },
  {
    key: "portfolio",
    poster: "/posters/portfolio.jpg",
    tags: ["React", "TypeScript", "Canvas", "Framer Motion"],
    link: "https://github.com/josepharroyoh/PortfolioJoseph",
  },
];

export const SKILL_GROUPS = [
  ["scikit-learn", "Modelos de series temporales", "Deep learning (RNN, CNN, transformer)", "Evaluación y calibración"],
  ["Python (NumPy, pandas, Matplotlib)", "SQL", "Flask", "Java", "HTML"],
  ["PostgreSQL", "MySQL", "SQL Server", "BigQuery", "Supabase"],
  ["Power BI", "Looker Studio", "Pipelines ETL"],
  ["GOES-16/19 (ABI, GLM)", "STARNET VLF", "Red AFINSA de campo eléctrico", "Radiosondas", "Sensores PM y meteorológicos"],
  ["Jupyter", "VS Code", "Git y GitHub", "LaTeX", "AWS", "Google Cloud Platform", "Azure App Services", "Linux", "Máquinas virtuales"],
];
