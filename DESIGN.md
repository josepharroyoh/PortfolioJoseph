# Design system (v5, académico elegante)

Portfolio of a physicist who works on atmospheric electricity, EFM networks and
lightning nowcasting, set like an interactive scientific article (in the spirit of
Distill.pub): serif type, a byline, numbered figures with captions, margin notes and a
table of contents. Figure 1 is a live strip-chart of the surface electric field.

## Theme

Dark only (graphite under a night sky); there is no theme toggle.
Contact and footer are always dark (`.force-dark`).

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | | `#000000` | page (pure black) |
| `--bg-2` | `#f1f1ee` | `#1c1c1f` | plates, tinted areas |
| `--surface` | `#ffffff` | `#19191c` | figures, inputs |
| `--ink` | `#1b1b1d` | `#eae9e6` | text |
| `--muted` | `#5d5d64` | `#a4a3a9` | secondary text |
| `--accent` | | `#9fe3c6` | the only accent: mint |

## Type

- Newsreader (variable, optical size, with italics) for headings, the name, leads and
  long-form text; the surname is italic in the accent colour. Geist for UI and labels.
- Geist for UI, metadata and labels (`.label`: tracked caps, used sparingly).
- Geist Mono only for measurements.
- No em or en dashes in copy.

## Interaction layer (v5.1)

- Background: `fx/Universe.tsx`, rebuilt from the original site's three effects, fixed
  behind every page. A deep starfield that warps with scroll speed (streaks forward or
  backward), a constellation that links the stars around the cursor, shooting stars,
  a faint nebula at night, and ~3,000 particles that morph per section
  (`fx/universe-shapes.ts`): ringed planet (hero, silver and mint), Earth and atmosphere (Perfil),
  Lorenz attractor (Investigación), stepped leader (Proyectos), dipole magnetic field
  (Trayectoria), atmospheric waves (Herramientas). The cursor pushes particles aside.
  Each figure has its own vivid palette (blue, cyan, violet, aurora green, gold). The TOC names
  the current figure ("Fondo"). Contact has its own night sky with the bat crossing.
- Cursor: `CursorAura` ring trails the pointer, swells over links, reads "Ver" over
  project media. `Magnetic` CTAs, `Tilt` 3D cards with a soft sheen.
- Headings rise word by word (`Words`); highlight cells, timeline rows and the paper
  card respond on hover with a drawn accent line.
- The cube lives in three places: perched on Figure 1 (follows the cursor, jumps and
  says "¡Rayo!" at every strike), as the back-to-top dock in the corner, and large in
  contact, where it watches the form while you type. No floating chat bubble.
- No "Ver CV" buttons; the CV stays reachable from Trayectoria, ⌘K and `/cv`.

## Page structure (home)

Centred title block (one viewport), then: Educación e investigación (tabs: Educación,
Publicaciones, Conferencias), Becas y premios (tilt cards), Experiencia (tabs:
Investigación, Profesional), Proyectos (alternating figures), Habilidades técnicas,
Formación en IA y ciencia de datos, Voluntariado (languages and AFINSA as margin
notes). No contact section: email is in the hero CTA and the footer. Tabs are a segmented control with a sliding pill (`ui/Tabs.tsx`,
arrow-key navigation); CV rows share `EntryRow` (`sections/CvSections.tsx`).
