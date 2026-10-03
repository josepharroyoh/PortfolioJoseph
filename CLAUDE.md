# Notas para Claude

## Publicación

- No subas nada a `main` sin que Joseph lo apruebe. Primero muéstrale capturas (Playwright, escritorio y móvil, claro y oscuro) y espera su visto bueno; mientras tanto sube solo a la rama de trabajo.
- Netlify publica `main` en https://portfolio-josepharroyo.netlify.app/.
- Nunca reescribas el historial de `main`: si no avanza directo (fast-forward), haz merge primero.

## Diseño

- Sigue `DESIGN.md` y las skills de `.claude/skills/` (emil-design-eng, impeccable, taste-skill).
- Conserva el murciélago pixel-art (`src/components/brand/Bat.tsx`) y el cubo con ojos (`src/components/brand/CubeBuddy.tsx`): a Joseph le gustan.
- Todo texto visible va en los tres idiomas (`src/locales/es.json`, `pt.json`, `en.json`, mismas claves), sin guiones largos.
