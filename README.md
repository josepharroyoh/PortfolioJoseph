# Joseph Arroyo Hernández — Portafolio académico

Desplegado [aquí](https://portfolio-josepharroyo.netlify.app/)

Portafolio de investigación y analítica de datos: un universo de partículas en WebGL que cambia de forma en cada capítulo de la página (galaxia, atractor de Lorenz, hélice, cinta de Möbius…), tipografía editorial, animaciones con scroll y soporte en español, inglés y portugués.

## Stack

- **React 19 + TypeScript + Vite 7**
- **Tailwind CSS 4** (tokens de diseño en `src/index.css`)
- **Three.js** para el fondo de partículas (se carga aparte, después de la página)
- **Framer Motion** para las animaciones y **Lenis** para el scroll suave
- **i18next** para los tres idiomas y **Formspree** para el formulario de contacto

## Cómo editar el contenido

| Qué cambiar | Dónde |
| --- | --- |
| Textos, experiencia, publicaciones, premios, cursos… | `src/locales/es.json`, `en.json`, `pt.json` (mismas claves en los tres) |
| Correo, redes, enlaces, foto, ID de Formspree | `src/data/profile.ts` → `PROFILE` |
| Proyectos (video, etiquetas, enlace) | `src/data/profile.ts` → `PROJECTS` (el texto va en `projects.items` de los JSON, en el mismo orden) |
| Habilidades | `src/data/profile.ts` → `SKILL_GROUPS` |
| Forma de partículas de cada sección | `src/data/profile.ts` → `SECTION_SHAPE` |

## Estructura

```
src/
  pages/HomePage.tsx          página única con todas las secciones
  components/
    sections/                 Hero, About, Research, Projects, Experience, Education, Awards, Volunteering, Skills, Contact
    layout/                   Navbar, Intro, Assistant (el cubo con ojos), Footer, ScrollProgress, LanguageSwitcher
    background/               CosmosScene (Three.js) y las figuras matemáticas
    brand/                    Bat (murciélago pixel-art) y CubeBuddy
    ui/                       animaciones reutilizables, botones, marquee, iconos
  data/profile.ts             datos que no dependen del idioma
  locales/                    textos en es / en / pt
```

## Scripts

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:8080
npm run build    # compila a dist/
npm run lint
```

`public/_redirects` hace que Netlify sirva la app en cualquier ruta (la antigua `/cv` redirige a la sección de trayectoria).
