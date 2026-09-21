# The Draughtsman's Desk

The design system for tashila.me.

Paper supplies the warmth and the personality. The ink on it supplies the engineering
discipline. That tension is the whole design, and holding both sides is what keeps a
scrapbook from turning twee and an architect's grid from turning cold.

**Status:** foundation and primitives built, proven on `/lab`. Page conversion not started.

---

## 1. Why this, and not neumorphism

Standard neumorphism is monochrome plastic extruded from a flat background, lit by two
opposing shadows. It is also everywhere. This system is **paper physics** instead, which
reads as a different material and gives four things to hold onto:

1. **Sheets rest curled.** Paper lying on a desk does not sit flat. Its corners lift.
2. **Pressing flattens.** The curl relaxes, the shadow moves from soft-and-far to
   tight-and-near. It never reaches zero. Flat paper still touches the desk.
3. **One light source, obeyed globally.** Every shadow derives from shared `--lx` / `--ly`.
   On a pointer device the light tracks the cursor, so the whole page re-casts together.
4. **A material scale, not one card style.** Different content sits on different stock.

Light mode is manila drafting paper. Dark mode is a cyanotype blueprint: a different paper
stock, not an inversion. Blueprints are literally what a drafting sheet becomes when
reproduced, so the metaphor holds rather than breaking.

---

## 2. Files

| File | Holds |
|---|---|
| `global.css` | Token layer (both themes) and every material recipe |
| `tailwind.config.js` | Tokens exposed as Tailwind colors, font families, `darkMode` |
| `app/components/paper.tsx` | All material primitives |
| `app/components/light-source.tsx` | The single pointer-tracked lamp |
| `app/components/theme-toggle.tsx` | Stock switcher |
| `app/layout.tsx` | Font loading and the pre-paint theme script |
| `app/lab/page.tsx` | Throwaway specimen page. **Delete before merge.** |

---

## 3. Tokens

Values live in `global.css` as space-separated RGB triplets, so Tailwind's alpha modifier
works: `bg-paper/60` resolves to `rgb(var(--paper) / .6)`.

| Token | Light (manila) | Dark (blueprint) | Job |
|---|---|---|---|
| `--desk` | `223 214 197` | `4 10 20` | The surface behind the paper |
| `--desk-2` | `210 200 181` | `7 16 30` | Recesses, image wells |
| `--paper` | `245 241 232` | `13 30 56` | Default sheet |
| `--paper-2` | `236 230 217` | `17 38 68` | Index cards, quiet buttons |
| `--kraft` | `198 170 130` | `33 58 93` | Cardboard face |
| `--kraft-edge` | `148 120 84` | `13 28 50` | Cardboard side edge |
| `--kraft-ink` | `28 27 24` | `220 234 250` | Text **on** cardboard |
| `--graphite` | `28 27 24` | `214 230 246` | Primary text |
| `--graphite-soft` | `84 80 72` | `156 184 212` | Body and secondary text |
| `--graphite-faint` | `106 100 90` | `116 146 180` | Labels and metadata |
| `--vermillion` | `190 62 42` | `232 118 96` | The one accent |
| `--rule` | `28 27 24` | `190 220 250` | Grid and margin ruling, used at low alpha |
| `--shadow-rgb` | `72 62 48` | `0 3 10` | Every shadow |
| `--tape` | `244 236 208` | `132 168 204` | Tape body |
| `--sheen` | `255 255 255` | `190 225 255` | Highlights, desk wash |

`--kraft-ink` exists because cardboard is tan in one theme and dark blue in the other.
A single hardcoded text colour is unreadable in one of them. See §9.

### The accent

**One** accent, locked sitewide: a desaturated red-pen vermillion. It is the red pen an
engineer marks up a drawing with, which is exactly the job an accent does. It reads on both
stocks and it is none of the AI defaults. No neon, no glows, no second accent.

---

## 4. Type

Four families, each with a distinct material job. None is decorative.

| Role | Face | Tailwind | Treatment |
|---|---|---|---|
| Display | Archivo | `font-title` | Uppercase, `-0.03em` tracking, `0.9` leading, heavy weights |
| Body | Geist | `font-sans` | Max 65ch |
| Technical | JetBrains Mono | `font-mono` | Labels, specs, figures. `tabular-nums` |
| Hand | Caveat | `font-hand` | Margin annotations only |

Both new faces are variable fonts loaded without a `weight` array, so each ships one file.

`font-display` (Instrument Serif) is the **old** face and is being retired. Do not use it in
new work.

### Budgets

Two hard caps, both there because the failure mode is the design turning templated or twee:

- **Eyebrows:** at most `ceil(sections / 3)` per page. No section-number breadcrumbs
  (`01 / INDEX`). Where a section needs labelling, give its sheet a tab instead.
- **Handwriting:** 4 to 6 instances across the **entire site**. Every one must be a real
  aside worth reading. If you are adding a seventh, delete one instead.

---

## 5. Materials

### Paper

Structure is `<div.paper>` containing two `.curl` layers plus a `<div.sheet>`.

The curl layers are invisible. They exist only to cast a shadow, and they sit behind the
opaque sheet so that **only the lower part of that shadow escapes** past the sheet's edge.
Because each layer is rotated, its blurred shadow spreads at the lifted corner and pinches
at the contact edge. That asymmetry is what reads as paper rather than as a generic drop
shadow.

**Each caster is an ellipse, and that is the whole trick.** A rectangle casts a shadow with
a straight bottom and square ends, so what escapes below the sheet is a flat-bottomed slab,
and the two of them read as trapezoids with a notch between. An ellipse has no edge to
escape: the shadow is deepest under the corner the rotation dips and thins to nothing toward
the middle of the card, which is what a lifted corner actually does to the light.

**The sheet must fill the paper box**, which is why `.paper` is a flex column and `.sheet`
is `flex: 1`. In a stretch grid the paper is as tall as the tallest cell while the sheet is
only as tall as its content, and every pixel of that difference is bare `.paper` with both
curl shadows sitting on it, unmasked. That is what puts grey shapes under a short card in a
row of tall ones, and an index card with one line of copy is exactly that short card.

Curl levels, set by `data-curl` on `.paper`:

| Level | Use |
|---|---|
| `0` | Pinned flat. Body copy, legal text, anything under a tab |
| `1` | Resting. The default |
| `2` | Loose. Something you could pick up: mounted prints, hero sheets |

Press flattens to the level-0 shadow. Because the curl layer transitions `box-shadow`,
`transform` and `bottom`, and all three are computed from the custom properties, the shadow
**eases down** rather than the sheet merely nudging.

Paper takes almost no corner radius (`rounded-[3px]`). Rounded paper reads as plastic.

### Stock

| Class | Where |
|---|---|
| `.stock-bond` | Default sheet |
| `.stock-card` | Index cards, toned slightly darker |
| `.stock-graph` | Technical sections: specs, toolbox, timelines |
| `.stock-pad` | Ruled left margin, like an engineering pad |
| `.stock-tracing` | Overlays only: mobile nav sheet, language menu, share sheet |

### Cardboard

Buttons and tabs. A hard, unblurred shadow is the visible **side edge**. Pressing shortens
it (`--thick` 4px to 1px) while the face sinks by the same amount, so the button genuinely
compresses instead of just translating. Hover raises it slightly (5px).

Corrugation is a `repeating-linear-gradient` at 6% alpha. Keep it faint. At tab size a
stronger value reads as hard stripes rather than texture.

### Tape and photo corners

Three mounts for imagery:

- **`tape`** (default): four torn strips, one across each corner
- **`corners`**: two strips across the top
- **`photo-corners`**: black photo corners

Torn edges are a `clip-path` zigzag down both short ends, so strips read as ripped off a
roll rather than guillotined.

Tape sits at `z-index: 4`, **above** what it holds down. See §9.

The print's paper border is not decoration. The project covers are saturated store banners,
and the mount is what stops them clashing with the blueprint stock in dark mode.

### The light source

`--lx` / `--ly` on the document element, range -1 to 1, defaulting to up-and-left. Every
shadow offset is the negative of that vector.

`<LightSource/>` attaches **one** `pointermove` listener on `document`, throttled through
`requestAnimationFrame`, writing straight to the DOM. Never React state, never a listener
per card. It is off under `(pointer: coarse)` and under `prefers-reduced-motion`, and the
movement is damped to 0.6: a lamp across the room moves far less than the cursor does, and
full range reads as a gimmick.

---

## 6. Components

All in `app/components/paper.tsx`. Resting curl, hover and press are **pure CSS**, so every
one of these works inside a server component with no JavaScript.

| Component | Notes |
|---|---|
| `Paper` | `stock`, `curl` 0-2, `tilt`, `radius` |
| `Button` | `primary` (kraft) or `quiet` (paper). Keeps the old `href`/`external` API |
| `Tab` | Kraft folder tab |
| `Photo` | `mount` of `tape` / `corners` / `photo-corners` / `none`, `fit`, `tilt` |
| `Tape`, `CornerTape`, `PhotoCorners` | Mounting hardware |
| `IndexCard` | A catalogue entry, not a fallback. See below |
| `Annotation` | Caveat margin note. Mind the budget |
| `Title`, `Label` | Drafted header, technical label |

`IndexCard` earns its place: only 4 of 19 projects carry rich case-study frontmatter and
most have no artwork. A typed card is a legitimate entry for those, where a hatched
"missing image" placeholder just looks broken.

### Client boundary

`framer-motion` is reserved for orchestrated moments only: filter restagger, route
transitions, the nav sheet. Not for the material itself. Client components stay limited to
`nav`, `projects-list`, `share`, `language-switcher`, `page-transition`, the two
`header.tsx` files, `ThemeToggle` and `LightSource`.

---

## 7. Theming

`data-theme="light" | "dark"` on `<html>`, plus `darkMode: ["class", '[data-theme="dark"]']`
in the Tailwind config. Because the tokens are CSS variables, almost nothing needs a `dark:`
variant; the recipes pick up new values automatically.

An inline script in `<head>` resolves the stock **before first paint**, so the page never
flashes the wrong one. `localStorage.theme` holds `"light"`, `"dark"`, or nothing, where
nothing means follow the system. The script therefore always writes an explicit attribute
rather than leaving it off, and a `matchMedia` listener keeps it live while no explicit
choice is stored.

The toggle is not a sun/moon switch. It shows the two stocks themselves and you pick one.

---

## 8. Accessibility

Every pairing passes WCAG AA:

| Pairing | Light | Dark |
|---|---|---|
| Primary text on paper | 15.28:1 | 13.10:1 |
| Body text on paper | 5.20:1 | 5.17:1 |
| Vermillion on paper | 4.76:1 | 5.71:1 |
| Text on cardboard | 7.77:1 | 9.41:1 |

Contrast must be checked against the **rendered** background, not the flat token. Manila
plus grain plus ruling can pull text under AA even when the token maths says otherwise.

`global.css` ends with a blanket `prefers-reduced-motion` flattener. It kills CSS animation
and transitions, so all the material physics collapses correctly. It does **not** stop
JavaScript-driven motion, so any `framer-motion` path needs its own `useReducedMotion`
guard.

### Responsive

Mobile is a priority, not an afterthought. Tape and tilted sheets deliberately overhang
their containers, so **any page using them needs `overflow-x-hidden`** or the page scrolls
sideways on a phone. Tape and print padding step down at `sm`.

---

## 9. Rules and traps

Each of these is a bug that actually happened while building the system.

**Never set curl variables as inline styles.** An inline custom property outranks the
`:active` rule, so the press animates nothing but a 1px nudge. Levels come from `data-curl`
in the stylesheet.

**Never build a material class name by interpolation.** Tailwind tree-shakes
`@layer components` against literal source text, so `` `tape-corner-${c}` `` compiles to
nothing. Spell the four variants out.

**Never hardcode a colour in a component.** `rgb(28 27 24)` on cardboard is fine on tan and
unreadable on blueprint. It broke silently in exactly one theme. Use a token, always.

**Tape must outrank the sheet.** `.sheet` is `z-index: 1` and `.paper` does not create a
stacking context, so an unlayered tape strip paints *underneath* the photo it is holding.

**No skew on the curl layers, and no square corners.** Either one gives the escaping
shadow a hard edge, and a hard edge below the sheet reads as two grey trapezoids parked
under the card. Rotation only, `border-radius: 50%` always.

**A short sheet in a stretch grid leaks the shadow.** If `.sheet` ever stops filling
`.paper` (someone drops the flex column, or adds a second in-flow child), the curl layers
stop being masked and the trapezoids come straight back. It shows up on one card in a row,
never all of them, which is what makes it look like a styling bug on that card.

**Keep the curl shadow tucked behind the sheet.** Too much drop relative to the inset and
the shadow body clears the card, which destroys the illusion for the same reason.

**Curl layers are siblings, not `::before` at `z-index: -1`.** A negative z-index child
disappears behind an opaque parent background.

**Check the Tailwind opacity step exists.** `border-graphite/12` silently generates nothing.

**Never run `pnpm build` and `pnpm dev` against the same `.next`.** Mixing production and
dev artifacts makes the dev server serve an unstyled page with a 404 stylesheet. Run
`rm -rf .next` between them, and stop the dev server *before* deleting the directory.

---

## 10. Not built yet

- Lighthouse pass, and a look at the phone layout at 380px

Everything else is done: every route is converted, the prose theme runs off
the tokens, code highlighting is dual-theme, the legal pages have per-script
font fallbacks, every route ships its own drafting-sheet OG card, and
`ui.tsx`, `/lab`, `lucide-react`, Instrument Serif and the old `accent` /
`ink` / `surface` tokens are gone.

### The social card

`app/components/og-sheet.tsx` draws it; each route passes a kicker, a title,
a note and a sheet name. Satori is not a browser, so three rules hold there
and nowhere else in this system:

- **No CSS custom properties.** Every colour in that file is a literal hex
  copied from the light stock. Change a token here, change it there.
- **Flexbox only**, and `display: flex` must be explicit on anything with
  more than one child. No grid.
- **Static fonts only**, from `assets/og-fonts/`. The bundled opentype.js
  reads the `fvar` axis table but never `gvar`, so a variable font renders at
  its default instance and every weight comes out Regular. woff2 is not
  supported either. The fonts live in `assets/`, not `public/`: they are read
  off disk, never served.

---

## 11. Rules learned during conversion

**`fr` tracks floor at min-content.** A large uppercase headline has a very
wide min-content, and in `grid-cols-[1fr_1fr]` it will eat the whole row.
Use `minmax(0, 1fr)` anywhere display type shares a row with a print.

**An auto margin stops a grid item stretching.** `mx-auto` on a grid child
makes it size to its content, and a `Photo` has no intrinsic width (the image
is `fill` inside an `aspect-ratio` box), so it collapses to its padding. Pair
`mx-auto` with `w-full`.

**`overflow-x: clip` on body, never `hidden`.** `hidden` computes the other
axis to `auto`, which turns body into a scroll container and silently kills
`position: sticky` for the nav and the case-study sidebar. `clip` creates no
scroll container.

**A tab is only a tab if it is attached to a folder.** `Tab` must be rendered
inside `TabStrip`. On its own the active tab has nothing to flow into and
reads as a chip resting on the page.

**Check the opacity step exists, and check it in DARK.** Tailwind's default
scale jumps 10 to 20, so `/12`, `/15`, `/35` and `/45` generate nothing and
the element silently falls back to Tailwind's default border colour,
`gray-200`. On manila that is invisible, so the bug hides; on blueprint it is
a hard white outline. Twenty classes across nine files were dead this way,
which is why the dark chips read as drawn boxes while the light ones read as
tone. The missing steps are now in `theme.extend.opacity`. This is the single
easiest bug to ship in this system: a dead hairline looks *correct* on one
stock.

**Chips are tone, not outline.** A chip differentiates by its fill, in both
stocks, and its hairline is meant to be barely visible. `--chip` and
`--chip-raised` exist because `paper` and `paper-2` cannot do the job: on
manila `paper` is the lighter of the pair, on blueprint it is the darker, so
a chip built from them is the brightest thing in the row in one theme and the
dimmest in the other. The dedicated pair keeps "raised" meaning raised.

**Blueprint needs a contrast band, not a floor.** A minimum-contrast rule
is enough on manila, where the fix is to darken and the result is just ink.
On blueprint the fix is to lighten, and a bright saturated colour on a
near-black ground reads as emissive however good the ratio is. A floor also
lets anything already above it through completely untouched: Supabase green
sat at 7.6:1 and looked like an LED. `tintOn` therefore mutes every mark
into the stock and then holds it between a ceiling and a floor, which drops
chroma and ties the mark to the paper instead of leaving it floating above
it. Light mode still uses the plain floor.

**These scripts have no letter case.** Sinhala, Japanese, Korean, Devanagari,
Thai and Chinese get `text-transform: none` and normal tracking, and the
`lang` attribute must wrap the heading as well as the body or the `:lang()`
rules never reach the title.
