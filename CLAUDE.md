# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build (runs Contentlayer + Next.js)
pnpm start        # Start production server
pnpm fmt          # Lint and format with Rome (apply unsafe fixes)
```

No test suite is configured.

**Never run `pnpm build` and `pnpm dev` against the same `.next`.** Mixing
production and dev artifacts makes the dev server serve an unstyled page with a
404 stylesheet. Stop the dev server *first*, then `rm -rf .next`, then switch.

## Architecture

**Stack:** Next.js 13 App Router · TypeScript · Tailwind CSS · Contentlayer (MDX) · Rome (linter/formatter)

**Package manager:** pnpm

### Content Pipeline

All site content lives as MDX files in `/content/`. Contentlayer transforms them into typed TypeScript objects at build time, available via `contentlayer/generated` (path alias resolves to `.contentlayer/generated`).

- `/content/blog/*.mdx` → `allBlogPosts` (type: `BlogPost`)
- `/content/projects/[slug]/index.mdx` → `allProjects` (type: `Project`)
- `/content/projects/[slug]/{privacy,terms,deletion}.mdx` → `allLegalPages` (type: `LegalPage`)

Computed fields (`slug`, `path`, `formattedDate`, `readingTime`) are added by
`contentlayer.config.js`. Code blocks are dual-theme through Rehype Pretty Code
(`github-light` / `github-dark`), emitted as two sibling `<pre>` blocks;
`app/projects/[slug]/mdx.css` shows the pair that matches the stock and is
imported by the blog route as well.

**Project case-study fields.** All optional, and every block hides when absent, so a
thin project still renders correctly:

- `image` / `imageAlt`: wide shot for the projects index and the detail hero
- `hero`: a different shot for the detail hero only; falls back to `image`
- `imageFit` / `heroFit`: `"contain"` shows the whole image mounted on a quiet
  sheet; anything else crops to the frame. `heroFit` defaults to `imageFit`.
  `heroFit: "banner"` is for low-res Play Store feature graphics
  (`public/projects/*-cover.*`): the hero crops (full 2:1 on phones) and layers
  grain, scanlines and a vignette over it so the upscale doesn't show.
  `heroPosition` (CSS object-position, default `50% 40%`) moves that crop when the
  important part of a cover isn't near the middle
- `portrait`: portrait screenshot for the case-study sidebar
- `featured: 1..4`: promotes a project to a full-scale alternating act on the index
- `tagline`: replaces `description` in hero copy
- `role`, `facts[]`, `specs[]` (`{label, value}`), `notes[]` (`{title, body}`)

Counts and category tabs on `/projects` are always derived from `allProjects`. Never
hardcode them. `<Mdx>` takes `hideImage` / `hideHeading` so a detail page can suppress
a body image or heading it already renders in its hero.

Legal links on a project page are derived from the `allLegalPages` documents that
actually exist for that slug, not from the `agreements` frontmatter flag.

### Page Structure

```
app/
  page.tsx              # Home: hero, toolbox, CTA
  layout.tsx            # Root layout: fonts, pre-paint theme script, analytics
  about/page.tsx        # Bio and career timeline (sourced from CV.pdf)
  blog/
    page.tsx            # Post listing (latest + remaining)
    [slug]/page.tsx     # Individual post, reads from allBlogPosts
  projects/
    page.tsx            # Server: sorts projects, derives category counts
    projects-list.tsx   # Client: tab filtering, alternating acts, load-more
    [slug]/page.tsx     # Case study, reads from allProjects
    [slug]/[type]/[[...lang]]/   # Legal subpages (privacy, terms, deletion)
  contact/page.tsx
  opengraph-image.tsx   # One per route group; all draw through og-sheet.tsx
  components/
    paper.tsx           # Every material primitive (see Components below)
    light-source.tsx    # The single pointer-tracked lamp
    theme-toggle.tsx    # Stock switcher
    site.ts             # Identity, contact details and stats (single source of truth)
    title-block.tsx     # The footer, drawn as a drafting title block
    og-sheet.tsx, toolbox.tsx, cta.tsx, mdx.tsx, site-nav.tsx,
    share.tsx, language-switcher.tsx, page-transition.tsx, ink-in.tsx,
    brand-icons.ts, analytics.tsx
```

Server components are the default. The client boundary is deliberately small:
`site-nav`, `projects-list`, `share`, `language-switcher`, `page-transition`,
`ink-in`, `theme-toggle`, `light-source`, `analytics`, `error`, and the two
`[slug]/header.tsx` files. `framer-motion` is reserved for orchestrated moments
only (filter restagger, route transitions, the nav sheet), never for the material
itself.

---

## The design system: The Draughtsman's Desk

Paper supplies the warmth and the personality. The ink on it supplies the
engineering discipline. That tension is the whole design, and holding both sides
is what keeps a scrapbook from turning twee and an architect's grid from turning
cold.

This is **paper physics**, not neumorphism. Four ideas carry it:

1. **Sheets rest curled.** Paper lying on a desk does not sit flat. Its corners lift.
2. **Pressing flattens.** The curl relaxes, the shadow moves from soft-and-far to
   tight-and-near. It never reaches zero, because flat paper still touches the desk.
3. **One light source, obeyed globally.** Every shadow derives from shared
   `--lx` / `--ly`. On a pointer device the light tracks the cursor, so the whole
   page re-casts together.
4. **A material scale, not one card style.** Different content sits on different stock.

Light mode is manila drafting paper. Dark mode is a cyanotype blueprint: a
different paper stock, not an inversion.

| File | Holds |
|---|---|
| `global.css` | Token layer (both themes) and every material recipe |
| `tailwind.config.js` | Tokens as Tailwind colors, font families, `darkMode` |
| `app/components/paper.tsx` | All material primitives |
| `app/components/light-source.tsx` | The single pointer-tracked lamp |
| `app/layout.tsx` | Font loading and the pre-paint theme script |

### Tokens

Values live in `global.css` as space-separated RGB triplets, so Tailwind's alpha
modifier works: `bg-paper/60` resolves to `rgb(var(--paper) / .6)`.

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
| `--rule` | `28 27 24` | `190 220 250` | Grid and margin ruling, at low alpha |
| `--shadow-rgb` | `72 62 48` | `0 3 10` | Every shadow |
| `--tape` | `244 236 208` | `132 168 204` | Tape body |
| `--sheen` | `255 255 255` | `190 225 255` | Highlights, desk wash |

`--kraft-ink` exists because cardboard is tan in one theme and dark blue in the
other; a single hardcoded text colour is unreadable in one of them.

**One accent, locked sitewide:** a desaturated red-pen vermillion, the red pen an
engineer marks up a drawing with, which is exactly the job an accent does. No neon,
no glows, no second accent.

### Type

Four families, each with a distinct material job. None is decorative.

| Role | Face | Tailwind | Treatment |
|---|---|---|---|
| Display | Archivo | `font-title` | Uppercase, `-0.03em` tracking, `0.9` leading, heavy weights |
| Body | Geist | `font-sans` | Max 65ch |
| Technical | JetBrains Mono | `font-mono` | Labels, specs, figures. `tabular-nums` |
| Hand | Caveat | `font-hand` | Margin annotations only |

Archivo, Caveat and JetBrains Mono load through `next/font/google` as variable
fonts with no `weight` array, so each ships one file. Geist is self-hosted in
`public/fonts/` because Next 13's Google Fonts catalogue predates it.

Two hard caps, both there because the failure mode is the design turning
templated or twee:

- **Eyebrows:** at most `ceil(sections / 3)` per page. No section-number
  breadcrumbs (`01 / INDEX`). Where a section needs labelling, give its sheet a tab.
- **Handwriting:** 4 to 6 instances across the **entire site**. Every one must be a
  real aside worth reading. If you are adding a seventh, delete one instead.

### Materials

**Paper.** Structure is `<div.paper>` containing two `.curl` layers plus a
`<div.sheet>`. The curl layers are invisible; they exist only to cast a shadow,
and they sit behind the opaque sheet so **only the lower part of that shadow
escapes** past the sheet's edge. Each caster is an **ellipse**, and that is the
whole trick: a rectangle's shadow escapes as a flat-bottomed slab and the two read
as trapezoids with a notch between, while an ellipse has no edge to escape and
thins to nothing toward the middle of the card.

**The sheet must fill the paper box**, which is why `.paper` is a flex column and
`.sheet` is `flex: 1`. In a stretch grid the paper is as tall as the tallest cell
while the sheet is only as tall as its content, and every pixel of that difference
is bare `.paper` with both curl shadows sitting on it, unmasked.

Curl levels, set by `data-curl` on `.paper`: `0` pinned flat (body copy, legal
text, anything under a tab), `1` resting (the default), `2` loose (mounted prints,
hero sheets). Press flattens to the level-0 shadow. Paper takes almost no corner
radius (`rounded-[3px]`), because rounded paper reads as plastic.

**Stock:** `.stock-bond` (default sheet), `.stock-card` (index cards, toned
darker), `.stock-graph` (specs, toolbox, timelines), `.stock-pad` (ruled left
margin), `.stock-tracing` (overlays only: mobile nav sheet, language menu, share
sheet).

**Cardboard** is buttons and tabs. A hard, unblurred shadow is the visible side
edge; pressing shortens it (`--thick` 4px to 1px) while the face sinks by the same
amount, so the button genuinely compresses. Corrugation is a
`repeating-linear-gradient` at 6% alpha, and it must stay faint.

**Tape and photo corners** are the three image mounts: `tape` (four torn strips,
the default), `corners` (two across the top), `photo-corners`. Torn edges are a
`clip-path` zigzag down both short ends. The print's paper border is not
decoration: the project covers are saturated store banners, and the mount is what
stops them clashing with the blueprint stock in dark mode.

**The light source.** `--lx` / `--ly` on the document element, range -1 to 1,
defaulting to up-and-left; every shadow offset is the negative of that vector.
`<LightSource/>` attaches **one** `pointermove` listener on `window`, throttled
through `requestAnimationFrame`, writing straight to the DOM. Never React state,
never a listener per card. It is off under `(pointer: coarse)` and under
`prefers-reduced-motion`, and damped to 0.6, because a lamp across the room moves far
less than the cursor does, and full range reads as a gimmick.

**The arrival.** Home only, and the hero only:

| t | Beat | Where |
|---|---|---|
| 0.00-0.50 | The page settles onto the desk | `.sheet-settle`, on every route |
| 0.36-0.80 | The print lands: curl 2 and extra tilt ease to rest | `.print-arrive`, `.print-land` |
| 0.72-1.19 | Four tape strips stick, 70ms apart, clockwise | `.tape-stick` |
| 0.92-1.42 | The leader draws from the note to the print | `.leader` |
| 1.05 | The note inks itself in | `<InkIn delay>` |
| 1.20-2.70 | The lamp sweeps once and every shadow re-casts together | `LightSource` |

Motion is budgeted to the hero. Nothing below the fold animates, or the page reads
as a slideshow rather than as a desk. The lamp's opening sweep is the point of the
whole system: without it, the one thing this design does that nothing else does is
invisible unless a visitor happens to move the pointer. The first real
`pointermove` cancels it mid-flight. `InkIn`'s `delay` is measured from
**navigation**, not from mount, because every other beat is a CSS animation on the
document's clock, and hydration can land after all of them.

### Components

All in `app/components/paper.tsx`. Resting curl, hover and press are **pure CSS**,
so every one works inside a server component with no JavaScript.

| Component | Notes |
|---|---|
| `Paper` | `stock`, `curl` 0-2, `tilt`, `radius` |
| `Button` | `primary` (kraft) or `quiet` (paper); `href`, `external`, `icon` |
| `ICON` | The four shared button glyphs: `folder`, `mail`, `arrow`, `download` |
| `Tab`, `TabStrip` | Kraft folder tab. A `Tab` must be rendered inside a `TabStrip` |
| `Photo` | `mount` of `tape` / `corners` / `photo-corners` / `none`, `fit`, `tilt` |
| `Tape`, `CornerTape`, `PhotoCorners` | Mounting hardware |
| `IndexCard` | A catalogue entry, not a fallback |
| `Annotation` | Caveat margin note. Mind the budget |
| `Title`, `Label`, `SectionHead` | Drafted header, technical label, section head |
| `DimensionString` | Figures off a drawing: baseline, tick per division, arrowheads |
| `Main`, `Rule` | Page shell, ruled divider |

`IndexCard` earns its place: only 4 of 19 projects carry rich case-study
frontmatter and most have no artwork. A typed card is a legitimate entry for
those, where a hatched "missing image" placeholder just looks broken.

### Theming

`data-theme="light" | "dark"` on `<html>`, plus
`darkMode: ["class", '[data-theme="dark"]']` in the Tailwind config. Because the
tokens are CSS variables, almost nothing needs a `dark:` variant.

An inline script in `<head>` resolves the stock **before first paint**, so the page
never flashes the wrong one. `localStorage.theme` holds `"light"`, `"dark"`, or
nothing, where nothing means follow the system. The script therefore always writes
an explicit attribute rather than leaving it off, and a `matchMedia` listener keeps
it live while no explicit choice is stored. The toggle is not a sun/moon switch: it
shows the two stocks themselves and you pick one.

### Accessibility

Every pairing passes WCAG AA:

| Pairing | Light | Dark |
|---|---|---|
| Primary text (`--graphite`) on paper | 15.28:1 | 13.10:1 |
| Body text (`--graphite-soft`) on paper | 7.12:1 | 8.11:1 |
| Labels (`--graphite-faint`) on paper | 5.20:1 | 5.17:1 |
| Vermillion on paper | 4.76:1 | 5.71:1 |
| Text on cardboard | 7.77:1 | 9.41:1 |

Contrast must be checked against the **rendered** background, not the flat token.
Manila plus grain plus ruling can pull text under AA even when the token maths says
otherwise.

`global.css` ends with a blanket `prefers-reduced-motion` flattener. It kills CSS
animation and transitions, so all the material physics collapses correctly. It does
**not** stop JavaScript-driven motion, so any `framer-motion` path needs its own
`useReducedMotion` guard.

Mobile is a priority, not an afterthought. Tape and tilted sheets deliberately
overhang their containers, so **any page using them needs `overflow-x-hidden`** or
the page scrolls sideways on a phone.

Lighthouse (mobile, throttled, production build) sits at 100 accessibility / 100
best-practices / 100 SEO on every route, with performance 91-96 and CLS 0. Keep it
there: give every raw `<img>` in MDX an explicit `width` **and** `height`, keep
heading levels sequential, and prefer a local asset in `public/projects/` over a
remote one.

### The social card

`app/components/og-sheet.tsx` draws it; each route passes a kicker, a title, a note
and a sheet name. Satori is not a browser, so three rules hold there and nowhere
else in this system:

- **No CSS custom properties.** Every colour in that file is a literal hex copied
  from the light stock. Change a token here, change it there.
- **Flexbox only**, and `display: flex` must be explicit on anything with more than
  one child. No grid.
- **Static fonts only**, from `assets/og-fonts/`. The bundled opentype.js reads the
  `fvar` axis table but never `gvar`, so a variable font renders at its default
  instance and every weight comes out Regular. woff2 is not supported either. The
  fonts live in `assets/`, not `public/`: they are read off disk, never served.
  `next.config.mjs` needs the `outputFileTracingIncludes` entry for them, or the
  `[slug]` card routes 500 in production while working fine locally.

---

## Rules and traps

Each of these is a bug that actually happened in this repo.

**Never set curl variables as inline styles.** An inline custom property outranks
the `:active` rule, so the press animates nothing but a 1px nudge. Levels come from
`data-curl` in the stylesheet.

**Never build a material class name by interpolation.** Tailwind tree-shakes
`@layer components` against literal source text, so `` `tape-corner-${c}` ``
compiles to nothing. Spell the variants out.

**Never hardcode a colour in a component.** `rgb(28 27 24)` on cardboard is fine on
tan and unreadable on blueprint. Use a token, always.

**Tape must outrank the sheet.** `.sheet` is `z-index: 1` and `.paper` does not
create a stacking context, so an unlayered tape strip paints *underneath* the photo
it is holding. Tape sits at `z-index: 4`.

**No skew on the curl layers, and no square corners.** Either one gives the
escaping shadow a hard edge, and a hard edge below the sheet reads as two grey
trapezoids parked under the card. Rotation only, `border-radius: 50%` always.
Likewise keep the curl shadow tucked behind the sheet: too much drop relative to
the inset and the shadow body clears the card.

**A short sheet in a stretch grid leaks the shadow.** If `.sheet` ever stops filling
`.paper` (someone drops the flex column, or adds a second in-flow child), the
trapezoids come straight back. It shows up on one card in a row, never all of them,
which is what makes it look like a styling bug on that card.

**Curl layers are siblings, not `::before` at `z-index: -1`.** A negative z-index
child disappears behind an opaque parent background.

**An arrival beat that touches the curl variables must fill `backwards`.**
`forwards` (or `both`) leaves the final keyframe applied for the life of the page,
and an animation's declarations outrank `:active`, so the hero print would stop
flattening under a press from then on. Same failure as an inline curl variable,
reached from the other side. `.print-arrive`, `.print-land`, `.tape-stick` and
`.leader` therefore all fill `backwards`, and every one of their keyframes ends on
a value the stylesheet already holds: `print-land`'s `to` block is a copy of
`.paper[data-curl="2"]`, so changing one means changing the other.

The two exceptions are deliberate. `.ink-in` fills `forwards` because its resting
state is a clip that hides the note entirely, so it has to hold the written state.
`.sheet-settle` fills `both`, which is safe because it animates only `translate`,
`rotate` and `opacity` on the route wrapper and never touches a curl variable.

**The reduced-motion flattener does not touch `animation-delay`.** It zeroes
durations, and every beat of the arrival is delayed. The arrival selectors are
therefore killed outright in that block; each rests at its finished state, which is
why `.leader` rests **drawn** and animates from undrawn. `.ink-in` needs the
opposite fix for the same reason: its resting state is the clip.

**Custom properties do not interpolate until they are registered.** An unregistered
one animates as a discrete step at 50%, so the hero print snapped onto the desk
instead of settling. The five `--curl-*` variables are registered with `@property`
at the top of `global.css`, and their `initial-value` must match the `.paper`
defaults or there is a one-frame jump.

**Check the Tailwind opacity step exists, and check it in DARK.** Tailwind's default
scale jumps 10 to 20, so `/12`, `/15`, `/35` and `/45` generate nothing and the
element silently falls back to `gray-200`. On manila that is invisible, so the bug
hides; on blueprint it is a hard white outline. Twenty classes across nine files
were dead this way. The missing steps are now in `theme.extend.opacity`. This is the
single easiest bug to ship in this system: a dead hairline looks *correct* on one
stock.

**`fr` tracks floor at min-content.** A large uppercase headline has a very wide
min-content, and in `grid-cols-[1fr_1fr]` it will eat the whole row. Use
`minmax(0, 1fr)` anywhere display type shares a row with a print.

**An auto margin stops a grid item stretching.** `mx-auto` on a grid child makes it
size to its content, and a `Photo` has no intrinsic width (the image is `fill`
inside an `aspect-ratio` box), so it collapses to its padding. Pair `mx-auto` with
`w-full`.

**`overflow-x: clip` on body, never `hidden`.** `hidden` computes the other axis to
`auto`, which turns body into a scroll container and silently kills
`position: sticky` for the nav and the case-study sidebar.

**Chips are tone, not outline.** A chip differentiates by its fill, in both stocks,
and its hairline is meant to be barely visible. `--chip` and `--chip-raised` exist
because `paper` and `paper-2` cannot do the job: on manila `paper` is the lighter of
the pair, on blueprint it is the darker, so a chip built from them is the brightest
thing in the row in one theme and the dimmest in the other.

**Blueprint needs a contrast band, not a floor.** A minimum-contrast rule is enough
on manila, where the fix is to darken and the result is just ink. On blueprint the
fix is to lighten, and a bright saturated colour on a near-black ground reads as
emissive however good the ratio is. A floor also lets anything already above it
through untouched: Supabase green sat at 7.6:1 and looked like an LED. `tintOn()`
therefore mutes every mark into the stock and then holds it between a ceiling and a
floor. Light mode still uses the plain floor. Tech-stack logos come from
simple-icons paths vendored into `app/components/brand-icons.ts` (CC0, pinned to
v16.30.0) and inline as SVG; only daily drivers wear brand colour.

**A schedule is a column grid, not a wrapped run.** The toolbox entries were a
flex-wrap run with hairline separators, and a wrapped line puts a stray separator at
its own head. They are a `grid` now, so names line up down the sheet the way a parts
list does.

**A reserved slot must never be empty.** Giving each toolbox entry its own dot slot
and mark slot lined the names up perfectly and still read as misaligned: rows like
"Room" had two holes where their neighbours had two glyphs. One mark slot, always
filled, fixed it: the brand mark where there is one and a filled square where there
is none. And the names **wrap**, never truncate: two columns at 380px are narrower
than "Dependency injection", and an ellipsis there loses the entry.

**These scripts have no letter case.** Sinhala, Japanese, Korean, Devanagari, Thai
and Chinese get `text-transform: none` and normal tracking, and the `lang` attribute
must wrap the heading as well as the body or the `:lang()` rules never reach the
title.

---

## Images and assets

Remote images need a host entry in `next.config.mjs` `images.remotePatterns`; local
project artwork lives in `public/projects/`. SVG sources pass `unoptimized`, because the
image optimizer rejects SVG unless `dangerouslyAllowSVG` is set. Next does not
optimize animated images, so an animated GIF ships at full weight: prefer a static
poster frame for index cards and heroes.

## Environment Variables

Only needed for view-count tracking via Upstash Redis. See `.env.example` for required keys. The app works without them (analytics/views gracefully degrade).
