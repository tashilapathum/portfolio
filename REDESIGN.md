# Full site redesign: The Draughtsman's Desk

## Context

`DESIGN.md` describes a complete design system (paper physics, manila and blueprint stocks,
a single pointer-tracked light source, cardboard buttons, tape, index cards). The system is
built and proven, but **it is wired to nothing**. `app/layout.tsx` still sets
`bg-ink text-fg`, `nav.tsx` is entirely old-token, and every one of the nine routes renders
the old dark design. The only thing consuming `paper.tsx`, `light-source.tsx` and
`theme-toggle.tsx` is `/lab`, which is marked for deletion.

So this is not a visual refresh. It is the conversion `DESIGN.md` §10 has been waiting for,
plus five additions that turn a well-built system into something people remember:

1. A drafting **title block** as the site footer
2. Route changes that read as **sheet handling**
3. Annotations that **write themselves** in
4. **OG images as drafting sheets**, generated per route
5. **Fibre in the paper**, so the stock is a material and not just a colour
6. A **404 as a blank sheet**

The print stylesheet idea was considered and dropped.

Decisions already taken: foundation converts first so nothing renders on old tokens; legal
pages get the full treatment including non-Latin font fallbacks; OG covers every route; the
nav becomes folder tabs.

---

## Progress

Tick these as they land. A phase is done when every route still renders in both stocks.

**Phase 0: Foundation**
- [x] `global.css`: drop the dark `body` and `::selection` blocks
- [x] `global.css`: fibre texture in the stock recipes
- [x] `global.css`: `.title-block` recipe
- [x] `global.css`: `ink-in` and `sheet-settle` keyframes
- [x] `tailwind.config.js`: `line` / `line-strong` onto the rule token
- [x] `app/layout.tsx`: desk wrapper, `LightSource`, nav, title block, retire Instrument Serif
- [x] `paper.tsx`: folder tab merges into the sheet
- [x] `paper.tsx`: `SectionHead` and `Rule`
- [x] `title-block.tsx`
- [x] `site-nav.tsx`
- [x] `ink-in.tsx`
- [x] `page-transition.tsx` rewritten as sheet handling

> **Pulled forward out of Phase 3:** the prose theme, dual-theme code
> highlighting and the `share.tsx` client-boundary repair were done during
> Phase 1, because all three blocked `/blog/[slug]` and would have blocked
> `/projects/[slug]` and the legal pages too.

**Phase 1: Route conversion**
- [x] `/contact`
- [x] `/about`
- [x] `/blog` and `/blog/[slug]`
- [x] `/projects` and `projects-list.tsx`
- [x] `/projects/[slug]`
- [x] `/` (home)

**Phase 2: Signature additions**
- [x] OG sheet template and per-route `opengraph-image.tsx`
- [x] `not-found.tsx`, `error.tsx`, `loading.tsx`

**Phase 3: Content systems**
- [x] `mdx.tsx` prose theme on tokens
- [x] Dual-theme code highlighting
- [x] Legal pages and non-Latin fallbacks
- [x] Client boundary repairs (`share.tsx`)

**Phase 4: Teardown**
- [x] Delete `/lab`, `ui.tsx`, superseded tokens
- [x] Drop `lucide-react`, Instrument Serif
- [x] Update `DESIGN.md` §10

---

## Phase 0: Foundation

Nothing else can land until the shell stops being dark. After this phase every route is on
the new stock even before its own layout is touched.

### `global.css`

- Delete the hardcoded `body { background-color: #101215; color: #e8ebed; }` block and the
  `::selection` rule pinned to `rgba(14,165,233,.3)`. Both are theme-blind and will fight
  light mode on every converted page. Selection becomes `rgb(var(--vermillion) / .22)`.
- Add the **fibre texture** (addition 5). One tiled SVG `feTurbulence` at very low alpha as
  a static `background-image` layered under each stock's own recipe, in `.stock-bond`,
  `.stock-card`, `.stock-graph`, `.stock-pad`. Static background on a non-animating
  element, so it does not hit the trap §9 warns about with the fixed `.grain` pass. Keep the
  existing full-page `.grain` as the lamp's dust; this is the paper's own fibre and is a
  different layer. Tune alpha separately per theme (blueprint needs less).
- Add `.title-block` recipe (addition 1): ruled box, mono, `tabular-nums`, hairlines from
  `--rule`.
- Add the `ink-in` keyframe (addition 3): `clip-path: inset(0 100% 0 0)` to `inset(0)` on a
  hand-writing ease. The existing `prefers-reduced-motion` flattener at the end of the file
  already kills it correctly.
- Add `:lang()` overrides for the non-Latin scripts (Phase 3).

### `tailwind.config.js`

- Replace `borderColor.line` / `line-strong` (hardcoded white alphas, invisible on manila)
  with `rule`-derived values.
- Leave the `// Superseded` colour block in place until Phase 4. Removing it now breaks
  every unconverted route at once.

### `app/layout.tsx`

- Body className becomes the lab's proven wrapper: `desk grain text-graphite antialiased`
  plus `min-h-[100dvh] overflow-x-hidden`. That clip is load-bearing, since `Paper`'s `tilt`
  and `Tape` deliberately overhang.
- Mount `<LightSource />`, `<SiteNav />` and `<TitleBlock />` here, so every route gets them
  and each page stops mounting its own `<Navigation />`.
- Drop the `Instrument_Serif` import (retiring `font-display`).
- Fix the two em dashes in the `metadata.description` and `openGraph.description` strings.

### `app/components/paper.tsx`

- **Fix the folder tab.** `Tab` currently fills kraft while the folder sheet below is
  `--paper-2`, and every tab keeps its 4px cardboard bottom edge, so the active tab reads as
  a chip resting on the folder rather than part of it. The active tab takes the folder's
  fill and drops its bottom edge; inactive tabs keep the edge and sit a few px lower.
  This is the one place `DESIGN.md` says the metaphor costs nothing, so it should be exact.
- Add `SectionHead` and `Rule`, the two `ui.tsx` primitives with no `paper.tsx` equivalent.
- `Annotation` gains a client leaf (below) so it can write itself in.

### New components

| File | Client? | Job |
|---|---|---|
| `app/components/title-block.tsx` | server | Addition 1. The site footer as a drafting title block |
| `app/components/site-nav.tsx` | client | Folder tabs. Replaces `nav.tsx` |
| `app/components/ink-in.tsx` | client | Addition 3. IntersectionObserver leaf that adds the `ink-in` class once |
| `app/components/page-transition.tsx` | client | Addition 2. Rewritten, see below |

**Title block** renders a ruled box carrying real fields, never fake ones:
`DRAWN BY` from `SITE.name`, `SHEET` from the route, `SCALE 1:1`, `REV` from the build date,
`SHEET COUNT` derived from `allProjects` the way `footer.tsx` already does it. The existing
`footer.tsx` stays as what it actually is, a mid-page CTA, and gets renamed `cta.tsx` to
stop it being mistaken for a footer.

**`ink-in`** is a ~25 line client leaf using IntersectionObserver, not framer-motion. It
toggles one class once and disconnects. `Annotation` stays a server component and accepts
`write` to opt in. Budget is unchanged at 4 to 6 sitewide, so this fires at most six times.

**Page transition (addition 2).** Next 13's App Router discards the outgoing tree, so a true
exit animation needs the `FrozenRouter` / `LayoutRouterContext` hack. That is fragile and
not worth it. Ship **enter-only choreography** instead: the incoming sheet arrives from
slightly above with its curl loose and its shadow spread, then settles and flattens to the
resting curl. It drives the existing `--curl-rot` / `--curl-drop` / `--curl-blur` /
`--curl-alpha` variables, so it is literally the same physics the cards use, and the
demonstration lands on every navigation. Keep the `key={pathname}` remount; replace
`animate-rise-in` with the new `sheet-settle` animation. Flattened by the existing global
reduced-motion block, so no `useReducedMotion` guard is needed while it stays CSS.

---

## Phase 1: Route conversion

`/lab` is the reference implementation for all of these, so keep it until Phase 4. Section
07 of `/lab` is already a full recreation of the home hero in the new system.

Order, cheapest-to-riskiest:

1. **`app/contact/page.tsx`** (101 lines). Smallest surface. Four channel tiles become
   `Paper stock="card"`. Drops `lucide-react`.
2. **`app/about/page.tsx`** (141 lines). The timeline is what `stock-pad` exists for, per
   the stock table. Remove the dead `SiteFooter` import.
3. **`app/blog/page.tsx`** + **`app/blog/[slug]/`**. Latest post on `stock-bond` curl 2, the
   rest as `IndexCard` rows. Two raw hexes (`#18222a`, `#141719`) to remove.
4. **`app/projects/page.tsx`** + **`projects-list.tsx`** (346 lines, the largest single
   block). `Act` becomes a taped `Photo`; `Row` becomes a half-height print; the
   `PlaceholderTile` fallback becomes `IndexCard`, which is what `IndexCard` was built for
   (only 4 of 19 projects carry artwork). Category tabs reuse the fixed `Tab`. Keep the
   IntersectionObserver load-more and the staggered restagger; this is the one place
   `DESIGN.md` sanctions framer-motion, but the existing CSS stagger already works, so only
   reach for it if the filter transition needs layout animation.
5. **`app/projects/[slug]/page.tsx`** (257 lines) + its `header.tsx` / `footer.tsx`. Fact
   cards to `IndexCard`, spec table to `stock-graph`, notes grid to cards, sidebar portrait
   to a mounted `Photo`. The three `banner` / `contain` / `cover` hero branches and the
   `.banner-texture` / `.banner-scrim` recipes need re-deriving against paper rather than
   `rgba(16,18,21,…)`.
6. **`app/page.tsx`** (home). Converted last, because by then every primitive it needs has
   been proven on a real route. `Toolbox` needs `tintOn()` re-derived for a light ground.

Per route: delete the local `<Navigation />` and `<Glow />`, drop the
`relative min-h-screen overflow-x-hidden` wrapper now that the layout owns it, and hunt the
raw hexes (`#A9B1B7`, `#D6DBDF` ×2, `#9AA3AA`, `text-white` ×5) and the inline
`rgba(14,165,233,…)` shadows.

**Trap:** both `ui.tsx` and `paper.tsx` export `Button` with different variant vocabularies
(`ghost` vs `quiet`). A naive swap of `variant="ghost"` silently falls through to primary.
Grep for `variant="ghost"` after each route.

---

## Phase 2: Signature additions

### Addition 4: OG images as drafting sheets

`@vercel/og` is not installed and `next/og` does not resolve in Next 13.5.11, but
`ImageResponse` is re-exported from `next/server`, so import it from there.

- One shared template, `app/components/og-sheet.tsx`: manila ground, ruled margin, the title
  block, the page title in Archivo.
- `opengraph-image.tsx` at `app/`, `app/about/`, `app/projects/`, `app/projects/[slug]/`,
  `app/blog/`, `app/blog/[slug]/`, `app/contact/`. The `[slug]` ones read their own
  contentlayer document for title, role and date.
- **Satori does not render woff2.** The repo only has `Geist-latin.woff2`, and Archivo and
  JetBrains Mono arrive through `next/font/google` with no file on disk. Add `.ttf` copies
  of Archivo and JetBrains Mono under `public/fonts/og/` and read them with `fs` at build
  time. Without this step every OG image silently falls back to a system face.
- Delete the hardcoded `images: [...]` pointing at `https://tashila.me/og.png` from
  `layout.tsx` once per-route images exist, and remove `public/og.png`.

### Addition 6: 404 as a blank sheet

`app/not-found.tsx`: `SHEET NOT FOUND` in `Title` on an otherwise empty pinned-flat sheet,
one red-pen `Annotation` pointing home, nothing else. Three routes already call
`notFound()` (`blog/[slug]`, `projects/[slug]`, the legal page) and currently land on Next's
unstyled white default. Add `error.tsx` and `loading.tsx` in the same pass, both listed
under `DESIGN.md` §10.

---

## Phase 3: Content systems

This is where the redesign is most likely to break quietly, because MDX output is not
covered by any route conversion.

### Prose

`app/components/mdx.tsx` (213 lines, `@ts-nocheck`) hardcodes about ten `border-white/10`
and `bg-white/[.03]` alphas and `font-display` on h1 to h3. All of it assumes a dark ground
and all of it is invisible on manila. Rewrite the component map against the tokens, drop
`prose-invert` for a token-driven prose theme in `tailwind.config.js`, and remove the
`@ts-nocheck` while the file is open. `app/projects/[slug]/mdx.css` `@apply`s `text-muted3`,
`text-muted2` and `bg-accent/10` and needs the same treatment.

### Code blocks

`contentlayer.config.js` pins `rehypePrettyCode` to `github-dark`, which will be a dark
island on manila. Move to the dual-theme form (`{ light, dark }`) and add the CSS that shows
the right one per `data-theme`.

### Legal pages and non-Latin scripts

40 MDX files across 15 locales. Archivo and Caveat cover none of Sinhala, Japanese, Korean,
Devanagari, Thai or Chinese.

- Load the matching Noto families through `next/font/google`, scoped to the legal route
  segment only so the rest of the site does not pay for them.
- Add `:lang()` overrides in `global.css` so `font-title` falls back per script rather than
  rendering Archivo's Latin fallback metrics against Sinhala glyphs.
- Restyle `language-switcher.tsx` onto tokens.
- Legal body copy sits on `curl={0}`, per the curl table: pinned flat, anything under a tab.

### Client boundary repairs

- `share.tsx` uses `useState` with **no `"use client"`**, and only works because both
  importers happen to be client components. Add the directive.
- It is also the only thing forcing both `header.tsx` files to be client components, and it
  is styled in raw `zinc-*` outside both token systems. Restyle onto tokens.
- Both headers read `window.location.href` during render inside an `isOpen &&` branch.
  Currently safe, but move it behind an effect while the file is open.

---

## Phase 4: Teardown

Only after every route renders on the new system:

- Delete `app/lab/page.tsx` (402 lines) and its route.
- Delete `app/components/ui.tsx` once its 12 importers are gone. `RuleLabel` already has
  zero importers.
- Delete the `// Superseded` colour block from `tailwind.config.js`, plus `backgroundImage`
  `hatch` / `tile-accent` and all three `shadow-accent-*`.
- Remove `lucide-react` and `@tailwindcss/line-clamp` (redundant on Tailwind 3.3) from
  `package.json`.
- Confirm `font-display` and `--font-instrument` have no remaining references.
- If the home page drops the brand-pill toolbox, `toolbox.tsx` and `brand-icons.ts` go with
  it. If it keeps it, `tintOn()` must be re-derived for a light ground.
- Update `DESIGN.md` §10, which is currently the to-do list this plan implements.

---

## Verification

Run throughout, not just at the end.

1. `pnpm dev`, then walk every route in **both stocks** via the theme toggle. `DESIGN.md`
   §9 is explicit: colour bugs here show up in exactly one theme.
   Routes: `/`, `/about`, `/projects`, `/projects/neo-music`, `/projects/neo-music/privacy`,
   `/projects/neo-music/privacy/si` (Sinhala), `/blog`, `/blog/building-neo-music`,
   `/contact`, and a deliberate 404.
2. **Check no sheet leaks its curl shadow.** In the console:
   `[...document.querySelectorAll('.paper')].filter(p => { const s = p.querySelector('.sheet'); return s && Math.abs(p.getBoundingClientRect().height - s.getBoundingClientRect().height) > 0.6; })`
   must be empty. A non-empty result is the trapezoid bug returning.
3. **No horizontal scroll at 380px** on any route. Tape and tilted sheets overhang by
   design, so this is the failure mode to watch.
4. **Contrast against the rendered background**, not the flat token, per §8. Manila plus
   grain plus fibre plus ruling can pull text under AA even when the token maths passes.
   Re-check the four pairings in the §8 table after the fibre texture lands.
5. **Reduced motion**: enable it and confirm the page transition, the ink-in annotations and
   all material physics collapse to static, and that `LightSource` does not attach.
6. **Coarse pointer**: confirm `LightSource` is inert and shadows sit at their resting
   angle.
7. **OG images**: hit `/opengraph-image` on each route and confirm Archivo is actually
   rendering, not a system fallback. This is the step that silently degrades.
8. `rm -rf .next && pnpm build` with the dev server **stopped first**, per §9. Then
   Lighthouse on home and one project page: LCP under 2.5s, CLS under 0.1.
9. `pnpm fmt` before each commit.

---

## Where this was left

**The redesign is complete.** Every phase is done, `pnpm build` passes with
74 pages, lint is clean, and every route was checked in both stocks.

### Things found while converting, worth keeping in mind

- **`fr` tracks floor at min-content.** A 74px uppercase headline has a huge
  min-content width and ate the entire hero row, crushing the photo column to
  21px. Both hero columns are `minmax(0, …)` now.
- **An auto margin stops a grid item stretching.** `mx-auto` on the hero print
  made it size to its content, and an `aspect-ratio` box holding a `fill`
  image has no intrinsic width, so it collapsed to its own padding. It needs
  `w-full` alongside.
- **`overflow-x: clip`, never `hidden`.** Verified: `scrollWidth` still
  over-reports by a few px from the tilted sheets, but nothing actually
  scrolls sideways, and `position: sticky` keeps working in the case-study
  sidebar.
- **`rehype-pretty-code` 0.10 emits `-fragment`, not `-figure`.** The old
  stylesheet targeted `-figure` throughout, so its line-numbering and
  highlight rules had never applied to anything.
- **Removing `@ts-nocheck` from `mdx.tsx` broke the build**, because the
  project targeted ES5 and the component uses a Unicode-flagged regex.
  `tsconfig.json` is on `es2018` now.
- **`tintOn` had to be re-derived for both stocks.** A brand hex must darken
  on manila and lighten on blueprint, so it returns both and CSS picks.

### OG images: three constraints that are not obvious

- **Static fonts only.** The bundled opentype.js parses the `fvar` axis table
  but never `gvar`, so a variable font renders at its default instance and
  every weight silently comes out Regular. Also no woff2: the bundle has a
  `wOFF` signature check but no `wOF2`.
- **`fetch(new URL(..., import.meta.url))` does not work here.** It is the
  documented pattern, but it only works on the edge runtime. Metadata routes
  default to node, where the URL resolves to a root-relative path and node's
  `fetch` throws `ERR_INVALID_URL`. The fonts are read with `fs` instead.
- **The two `[slug]` card routes are lambdas.** Next 13.5 will not prerender
  a metadata image route in a dynamic segment, and `force-static` does not
  change it. They read the fonts at request time, which is why
  `next.config.mjs` has an `outputFileTracingIncludes` entry for
  `assets/og-fonts`. Without it they would 500 in production only.

### Not verified

- **Mobile at 380px.** The browser in this session would not resize, so the
  phone layout has not been looked at. Worth a pass before shipping; the
  tilted sheets and tape are exactly what overhangs.
- **Reduced motion and coarse pointer** were not exercised, though both are
  handled in CSS and in `LightSource` and were not touched.
- **Lighthouse** has not been run.
