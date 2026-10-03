# Design system (v5, académico elegante)

Portfolio of a physicist who works on atmospheric electricity, EFM networks and
lightning nowcasting, set like an interactive scientific article (in the spirit of
Distill.pub): serif type, a byline, numbered figures with captions, margin notes and a
table of contents. Figure 1 is a live strip-chart of the surface electric field.

## Theme

Light (clean journal white, never cream) and dark (graphite) are both first-class.
Contact and footer are always dark (`.force-dark`).

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#fbfbfa` | `#141416` | page |
| `--bg-2` | `#f1f1ee` | `#1c1c1f` | plates, tinted areas |
| `--surface` | `#ffffff` | `#19191c` | figures, inputs |
| `--ink` | `#1b1b1d` | `#eae9e6` | text |
| `--muted` | `#5d5d64` | `#a4a3a9` | secondary text |
| `--accent` | `#9b1c2e` | `#f08a93` | the only accent: oxblood |

## Type

- Newsreader (variable, optical size, with italics) for headings, the name, leads and
  long-form text (`.serif-body`, `.dropcap`). Weight 380-450; emphasis is italic.
- Geist for UI, metadata and labels (`.label`: tracked caps, used sparingly).
- Geist Mono only for measurements.
- No em or en dashes in copy.

## Interaction layer (v5.1)

- Background: `fx/Universe.tsx`, rebuilt from the original site's three effects, fixed
  behind every page. A deep starfield that warps with scroll speed (streaks forward or
  backward), a constellation that links the stars around the cursor, shooting stars,
  a faint nebula at night, and ~3,000 particles that morph per section
  (`fx/universe-shapes.ts`): spiral galaxy (hero), Earth and atmosphere (Perfil),
  Lorenz attractor (Investigación), stepped leader (Proyectos), dipole magnetic field
  (Trayectoria), atmospheric waves (Herramientas). The cursor pushes particles aside.
  Light theme reads as an ink star atlas; dark theme as the night sky. The TOC names
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

| Section | Layout | Interaction |
| --- | --- | --- |
| Title block | name (italic surname in accent), topics, dek, B/W portrait, byline grid | lines rise from masks; portrait unveils, colour on hover |
| Figura 1 | full-width plot with caption | live EFM signal, storms on its own, cursor or tap brings the cloud |
| Perfil | text column + margin notes | lead lights up word by word, drop cap |
| En cifras | ruled 3x2 table, serif numerals | count-up |
| Investigación | reference-list layout + margin (ORCID, copy citation) | copy APA citation |
| Proyectos | alternating figures (Fig. 2+) with captions | videos play in view, media clip-reveal |
| Trayectoria | CV table | underline tabs with counts |
| Herramientas | ruled 2x2 table | none |
| Contacto | dark slab with its own night sky, bat, big cube, form | copy email, cube watches the form |

Global: sticky table of contents on wide screens with reading progress, text nav,
⌘K palette, cube assistant, pixel bat, printable CV, thesis page.
