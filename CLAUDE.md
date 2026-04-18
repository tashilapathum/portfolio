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

**Stack:** Next.js 13 App Router · TypeScript · Tailwind CSS · Contentlayer (MDX) · Framer Motion · Rome (linter/formatter)

**Package manager:** pnpm

### Content Pipeline

All site content lives as MDX files in `/content/`. Contentlayer transforms them into typed TypeScript objects at build time, available via `contentlayer/generated` (path alias resolves to `.contentlayer/generated`).

- `/content/blog/*.mdx` → `allBlogPosts` (type: `BlogPost`)
- `/content/projects/[slug]/index.mdx` → `allProjects` (type: `Project`)
- `/content/projects/[slug]/{privacy,terms,deletion}.mdx` → `allLegalPages` (type: `LegalPage`)

Computed fields (`slug`, `path`, `formattedDate`) are added by `contentlayer.config.js`. Code blocks use GitHub Dark theme via Rehype Pretty Code.

### Page Structure

```
app/
  page.tsx              # Home — hero, particles, navigation
  layout.tsx            # Root layout — fonts (Cal Sans + Inter), analytics
  blog/
    page.tsx            # Post listing (featured + remaining)
    [slug]/page.tsx     # Individual post, reads from allBlogPosts
  projects/
    page.tsx            # Project gallery
    [slug]/page.tsx     # Project detail, reads from allProjects
    [slug]/[type]/      # Legal subpages (privacy, terms, deletion)
  contact/page.tsx
  components/           # Shared components (nav, card, mdx, particles, share)
```

Server components are the default; mark interactive components with `"use client"` (e.g., `nav.tsx`).

### Styling Conventions

- Color palette: dark theme (black/zinc)
- Custom Tailwind animations: `fade-in`, `title`, `fade-left`, `fade-right`
- MDX content styled via `@tailwindcss/typography` plugin
- Global CSS in `app/global.css` (`.text-edge-outline` text stroke utility)

### Environment Variables

Only needed for view-count tracking via Upstash Redis — see `.env.example` for required keys. The app works without them (analytics/views gracefully degrade).
