# Design system

Portfolio of a physicist who studies atmospheric electricity. The page reads like a
clean scientific publication, and its one signature is a live electric field: a storm
cloud whose field lines flow, charge up and discharge as lightning.

## Theme

Light ("lab paper", cool off-white) and dark ("storm night") are both first-class.
The first visit follows `prefers-color-scheme`; the toggle in the nav saves the choice
in `localStorage` and grows the new theme from the button with a View Transition.
Tokens live in `src/index.css` as CSS variables and are exposed to Tailwind with
`@theme inline`.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#f3f4f1` | `#0d0f12` | page |
| `--bg-2` | `#e8eae5` | `#15181d` | tinted panels |
| `--surface` | `#fafbf9` | `#121519` | raised cards, inputs |
| `--ink` | `#121418` | `#eceef1` | text |
| `--muted` | `#545a64` | `#a3a9b3` | secondary text |
| `--accent` | `#2547d0` | `#8ea4ff` | the only accent: actions, highlights, lightning |
| `--danger` | `#b42318` | `#ff8f80` | form errors |

One accent, used everywhere. No gradients, no glows, no gradient text.

## Type

- Display: Schibsted Grotesk (variable), semibold, tracking -0.02 to -0.04em, max 6rem.
- Body: Geist (self-hosted variable).
- Mono: Geist Mono, only for real data (dates, years, measurements, chart labels).
- No eyebrows or section numbers; headings carry the sections.
- No em or en dashes in copy; ranges use a hyphen.

## Shape

Interactive elements are pills (`rounded-full`); surfaces and media use 12-16px radii.
Cards only where elevation means something (featured thesis, awards); everything else
is grouped with hairlines and space.

## Motion

Easing from Emil Kowalski's rules: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` for
entrances, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` for on-screen movement.

- Buttons scale to 0.97 on press (160ms).
- Section reveals use CSS scroll-driven animations (`.reveal`, `.reveal-clip`), so
  they run off the main thread and content stays visible where unsupported.
- One authored moment: the hero name rises in, the field fades up and the first
  lightning strike arrives about two seconds later.
- Project rows show a spring-follow preview on fine pointers only.
- `prefers-reduced-motion`: the field is drawn once as static field lines, charts
  show their final state, nothing moves.

## Page structure (home)

Each section uses a different layout family and owns one interaction:

| Section | Layout | Interaction |
| --- | --- | --- |
| Hero | split: copy + instrument panel | kinetic name (letter weight follows the cursor), rotating role, live field station with readouts |
| Ticker | full-bleed strip | the only marquee on the page, pauses on hover |
| Highlights | 6-cell bento, research funding leads | count-up numbers, cursor glow |
| Projects | sticky stacking cards (desktop), stacked list (phones) | cards scale back as the next one arrives |
| About | statement + photo + facts | words light up on scroll, photo parallax |
| Research | paper card + project card + talks list | copy APA citation |
| Journey | horizontal pinned track (desktop), vertical list (phones) | filter by type with a sliding pill |
| Tools | tabs | staggered chips |
| Contact | split: copy + form | copy email, link to CV |

Global: island nav with sliding indicator and reading progress, ⌘K / Ctrl+K command
palette (no animation, it is keyboard-driven), cube assistant, printable CV at `/cv`.

## Signature pieces

- `fx/ElectricField.tsx`: canvas field of a storm cloud (point charges plus mirror
  charges for the ground), pointer adds a charge, periodic stepped-leader lightning,
  optional field-mill trace. Pauses off screen and in hidden tabs.
- `fx/FieldTrace.tsx`: illustrative warning chart (threshold, alert, strike, lead
  time). Labels are HTML so they stay legible at any size. Always labelled as a
  simulation.
- `fx/ProximityText.tsx`: variable-weight letters that thicken near the pointer
  (fine pointers only, off for reduced motion).
- `pages/CVPage.tsx`: the CV is generated from the same locale files as the site and
  prints on A4 (`@media print` hides all chrome).
- `brand/Bat.tsx` and `brand/CubeBuddy.tsx`: the pixel bat logo and the blinking cube
  assistant, kept from earlier versions of the site.
