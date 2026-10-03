# Design system (v4, «Señal»)

Portfolio of a physicist who works on atmospheric electricity, EFM networks and
lightning nowcasting. The page reads like a clean, confident CV: the name and the
topics lead, the work follows. Its one signature is a live strip-chart of the surface
electric field running along the bottom of the first screen.

## Theme

Light (cool paper white) and dark (graphite) are both first-class. The first visit
follows `prefers-color-scheme`; the toggle saves the choice in `localStorage` and grows
the new theme from the button with a View Transition. Contact and footer are always
dark (`.force-dark`) so the page ends on a closing slab.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#f4f4f2` | `#111113` | page |
| `--bg-2` | `#e9e9e6` | `#1b1b1e` | tinted bands, chips |
| `--surface` | `#fbfbfa` | `#161619` | cards, inputs |
| `--ink` | `#161618` | `#ececee` | text |
| `--muted` | `#5b5b63` | `#a0a0a8` | secondary text |
| `--accent` | `#c2410c` | `#ff7a45` | the only accent: signal orange |
| `--ok` | `#15803d` | `#4ade80` | the "open to opportunities" dot only |

One accent. No gradients, no glows. Elevation is hairlines; shadows only on floating
things (project preview, cube bubble).

## Type

- Display: Bricolage Grotesque (variable, optical size), semibold, tight tracking.
- Body: Geist. Mono: Geist Mono, only for dates and measurements.
- No eyebrows, no section numbers, no em or en dashes in copy.

## Motion

`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`; UI transitions 200-300ms; buttons scale
to 0.97 on press; reveals are CSS scroll-driven. Reduced motion draws the signal once.

## Page structure (home)

| Section | Layout | Interaction |
| --- | --- | --- |
| Hero | name + topics + photo + "Ahora" card, signal strip below | name lines rise from a mask; the signal storms on its own and charges as the cursor nears |
| Logros | full-bleed tinted band, ruled 3x2 table | count-up numbers |
| Perfil | index layout (sticky heading + facts) | statement lights up word by word |
| Proyectos | full-width list | spring-follow preview on hover, rows expand in place (video, thesis chart) |
| Investigación | index layout | copy APA citation |
| Trayectoria | index layout, grouped by year | filters with counts, rail fills on scroll |
| Herramientas | index layout, all groups visible | none |
| Contacto | dark slab, big email + form | copy email |

Global: text nav with sliding underline and reading progress, ⌘K palette, cube
assistant, pixel bat, printable CV at `/cv`, thesis page at `/proyectos/prediccion-de-rayos`.
