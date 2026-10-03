# Notas para Claude

## Publicación

- Cuando Joseph pida **remodelar o rediseñar toda la página**, al terminar (build y lint sin errores, revisión con Playwright en escritorio y móvil) sube los cambios a la rama de trabajo **y también a `main`**. Netlify publica `main` en https://portfolio-josepharroyo.netlify.app/.
- Para cambios más pequeños, sube solo a la rama de trabajo y pregunta antes de tocar `main`.
- Nunca reescribas el historial de `main`: si no avanza directo (fast-forward), haz merge primero.

## Diseño

- Sigue `DESIGN.md` y las skills de `.claude/skills/` (emil-design-eng, impeccable, taste-skill).
- Conserva el murciélago pixel-art (`src/components/brand/Bat.tsx`) y el cubo con ojos (`src/components/brand/CubeBuddy.tsx`): a Joseph le gustan.
- Todo texto visible va en los tres idiomas (`src/locales/es.json`, `en.json`, `pt.json`), sin guiones largos.
