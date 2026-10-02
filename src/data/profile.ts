// Language-independent facts. Translated copy lives in src/locales/*.json.

export const PROFILE = {
  fullName: "Joseph Pascual Arroyo Hernández",
  shortName: "Joseph Arroyo",
  email: "arroyohernandezjoseph@gmail.com",
  timeZone: "America/Lima",
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

/** Section ids in page order; the background shape follows the active one. */
export const SECTIONS = [
  "home",
  "about",
  "research",
  "projects",
  "experience",
  "education",
  "awards",
  "volunteering",
  "skills",
  "contact",
] as const;

export type SectionId = (typeof SECTIONS)[number];

/** Which background shape (see background/shapes.ts) each section shows. */
export const SECTION_SHAPE: Record<SectionId, number> = {
  home: 0, // spiral galaxy
  about: 1, // supershape
  research: 4, // Lorenz attractor — chaos in the atmosphere
  projects: 3, // Möbius ribbon
  experience: 2, // helix
  education: 5, // phyllotaxis sphere
  awards: 1,
  volunteering: 5,
  skills: 6, // neural wave mesh
  contact: 0,
};

/** Media, tags and links for each project, matched by index with locale `projects.items`. */
export const PROJECTS = [
  {
    key: "reffindr",
    video: "/videos/reffindr.mp4",
    poster: "/posters/reffindr.jpg",
    tags: ["Python", "Flask", "Azure App Services", "Power BI", "Supabase", "Render"],
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
    tags: ["Python", "SQL", "Power BI", "Virtual Machine"],
    link: "https://www.aireica.com",
  },
  {
    key: "portfolio",
    tags: ["React", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
    link: "https://github.com/josepharroyoh/PortfolioJoseph",
  },
] as const;

export const SKILL_GROUPS = [
  ["Python", "SQL", "Java", "JavaScript", "HTML", "Flask", "Django"],
  ["AWS", "Google Cloud Platform", "Azure", "BigQuery", "SQL Server", "MySQL", "PostgreSQL", "Supabase"],
  ["Pandas", "Scikit-learn", "Power BI", "Looker Studio", "Excel", "ETL"],
  ["Git", "Bash", "VSCode", "Jupyter Notebook", "Spyder", "LaTeX"],
] as const;
