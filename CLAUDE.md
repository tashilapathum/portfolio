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

## Architecture

**Stack:** Next.js 13 App Router · TypeScript · Tailwind CSS · Contentlayer (MDX) · Rome (linter/formatter)

**Package manager:** pnpm

### Content Pipeline

All site content lives as MDX files in `/content/`. Contentlayer transforms them into typed TypeScript objects at build time, available via `contentlayer/generated` (path alias resolves to `.contentlayer/generated`).

- `/content/blog/*.mdx` → `allBlogPosts` (type: `BlogPost`)
- `/content/projects/[slug]/index.mdx` → `allProjects` (type: `Project`)
- `/content/projects/[slug]/{privacy,terms,deletion}.mdx` → `allLegalPages` (type: `LegalPage`)

Computed fields (`slug`, `path`, `formattedDate`, `readingTime`) are added by `contentlayer.config.js`. Code blocks use GitHub Dark theme via Rehype Pretty Code.

**Project case-study fields** — all optional, and every block hides when absent, so a
thin project still renders correctly:

- `image` / `imageAlt` — wide shot for the projects index and the detail hero
- `hero` — a different shot for the detail hero only; falls back to `image`
- `imageFit` / `heroFit` — `"contain"` shows the whole image on a quiet surface with a
  glow behind it (phone screenshots, logos); anything else crops to the frame. `heroFit`
  defaults to `imageFit`
- `portrait` — portrait screenshot for the case-study sidebar
- `featured: 1..4` — promotes a project to a full-scale alternating act on the index
- `tagline` — replaces `description` in hero copy
- `role`, `facts[]`, `specs[]` (`{label, value}`), `notes[]` (`{title, body}`)

Counts and category tabs on `/projects` are always derived from `allProjects` — never
hardcode them. `<Mdx>` takes `hideImage` / `hideHeading` so a detail page can suppress
a body image or heading it already renders in its hero.

### Page Structure

```
app/
  page.tsx              # Home — hero, toolbox, footer
  layout.tsx            # Root layout — fonts (Instrument Serif + Geist + JetBrains Mono), analytics
  about/page.tsx        # Bio and career timeline (sourced from CV.pdf)
  blog/
    page.tsx            # Post listing (latest + remaining)
    [slug]/page.tsx     # Individual post, reads from allBlogPosts
  projects/
    page.tsx            # Server: sorts projects, derives category counts
    projects-list.tsx   # Client: tab filtering, alternating acts, load-more
    [slug]/page.tsx     # Case study, reads from allProjects
    [slug]/[type]/      # Legal subpages (privacy, terms, deletion)
  contact/page.tsx
  components/
    ui.tsx              # Button / TextLink / Eyebrow / SectionHead / Glow / PlaceholderTile
    site.ts             # Identity, contact details and stats — single source of truth
    nav.tsx, footer.tsx, toolbox.tsx, mdx.tsx, share.tsx, language-switcher.tsx
```

Legal links on a project page are derived from the `allLegalPages` documents that
actually exist for that slug — not from the `agreements` frontmatter flag.

Server components are the default; mark interactive components with `"use client"` (e.g., `nav.tsx`).

### Styling Conventions

- Dark only. Tokens in `tailwind.config.js`: `ink` (page), `surface`/`surface2`
  (elevated), `accent` `#0EA5E9`, text ramp `fg-strong` → `fg` → `muted` → `muted2` → `muted3`
- Type roles: `font-display` (Instrument Serif) for headings, `font-sans` (Geist) for
  body, `font-mono` (JetBrains Mono) for uppercase labels and eyebrows
- Tabs, buttons and text links are three distinct things — use the primitives in
  `app/components/ui.tsx` rather than restyling ad hoc
- Custom Tailwind animations: `fade-in`, `glow-pulse`, `float`, `rise-in`
- Nothing snaps: every hover pairs `duration-*` with a `transition-*` utility (a bare
  `duration-200` is inert), the mobile sheet animates `grid-template-rows` from `0fr`,
  the projects list staggers `rise-in` on filter, and `app/components/page-transition.tsx`
  re-keys on `usePathname()` so route changes ease in. `global.css` flattens all of it
  under `prefers-reduced-motion: reduce`
- Tech-stack logos come from simple-icons paths vendored into
  `app/components/brand-icons.ts` (CC0, pinned to v16.30.0) and inline as SVG. A tool
  with no brand mark renders as a plain name pill with no logo square; `tintOn()`
  lifts a brand hex that would be unreadable on a dark tile. Only daily drivers wear
  brand colour
- MDX content styled via `@tailwindcss/typography` (`prose-invert`)
- Global CSS is `global.css` at the repo root (not `app/`); it defines the `.glow` wash
- Geist is self-hosted in `public/fonts/` because Next 13's Google Fonts catalogue
  predates it; the other two load via `next/font/google`
- Remote images need a host entry in `next.config.mjs` `images.remotePatterns`; local
  project artwork lives in `public/projects/`. SVG sources pass `unoptimized` — the image
  optimizer rejects SVG unless `dangerouslyAllowSVG` is set

### Environment Variables

Only needed for view-count tracking via Upstash Redis — see `.env.example` for required keys. The app works without them (analytics/views gracefully degrade).
