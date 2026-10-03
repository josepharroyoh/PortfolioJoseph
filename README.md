# Joseph Arroyo Hernández | Portafolio

Desplegado [aquí](https://portfolio-josepharroyo.netlify.app/)

Portafolio de investigación y proyectos pensado para comités de posgrado, pasantías y reclutadores:

- Estación de campo eléctrico en vivo en la portada (simulación en canvas con lecturas y rayos).
- Logros con contadores, proyectos en tarjetas apiladas, trayectoria horizontal con filtros.
- Paleta de comandos con ⌘K / Ctrl+K, modo claro y oscuro, tres idiomas (es / en / pt).
- Página de la tesis en [`/proyectos/prediccion-de-rayos`](https://portfolio-josepharroyo.netlify.app/proyectos/prediccion-de-rayos).
- CV imprimible en [`/cv`](https://portfolio-josepharroyo.netlify.app/cv) (botón «Imprimir o guardar PDF»), generado con los mismos textos de la web.

## Stack

- **React 19 + TypeScript + Vite 7**
- **Tailwind CSS 4** con tokens de color en variables CSS (ver `DESIGN.md`)
- **Canvas 2D** para el campo eléctrico (sin librerías 3D)
- **Framer Motion** para las animaciones, **i18next** para los idiomas, **Formspree** para el formulario

## Cómo editar el contenido

| Qué cambiar | Dónde |
| --- | --- |
| Todos los textos (proyectos, tesis, logros, trayectoria, CV…) | `src/locales/es.json`, `en.json`, `pt.json` (mismas claves en los tres) |
| Trayectoria (y lo que aparece en el CV) | `timeline.events` en cada JSON: `type` es `research`, `work`, `education`, `award` o `community`; `course: true` lo lleva a «Cursos» del CV |
| Correo, redes, foto, ID de Formspree | `src/data/profile.ts` → `PROFILE` |
| Video, etiquetas y enlace de cada proyecto | `src/data/profile.ts` → `PROJECTS` (el texto va en `projects.items`, unido por `key`) |
| Habilidades | `src/data/profile.ts` → `SKILL_GROUPS` |
| Colores, tipografías y animaciones | `src/index.css` y `DESIGN.md` |

## Estructura

```
src/
  pages/HomePage.tsx        portada con todas las secciones
  pages/ThesisPage.tsx      /proyectos/prediccion-de-rayos
  pages/CVPage.tsx          /cv (imprimible)
  components/
    fx/                     ElectricField (canvas), FieldTrace (gráfica de la tesis), ProximityText (nombre cinético)
    sections/               Hero, Highlights, Projects, About, Research, Timeline, Skills, Contact
    layout/                 Navbar, CommandPalette (⌘K), Footer, Intro, Assistant (el cubo con ojos), PageShell
    brand/                  Bat (murciélago pixel-art) y CubeBuddy
    ui/                     estilos de botones, encabezados, redes
  data/profile.ts           datos que no dependen del idioma
  locales/                  textos en es / en / pt
.claude/skills/             skills de diseño usadas (Emil Kowalski, Impeccable, Taste)
```

## Scripts

```bash
npm install
npm run dev      # http://localhost:8080
npm run build
npm run lint
```

`public/_redirects` hace que Netlify sirva la app en cualquier ruta (la antigua `/cv` lleva a Trayectoria).
