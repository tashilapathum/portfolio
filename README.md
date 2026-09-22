<a href="https://tashila.me"><h1>tashila.me</h1></a>

My personal website: portfolio, case studies and writing.

Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) and [Contentlayer](https://www.contentlayer.dev/), deployed to [Vercel](https://vercel.com/).

<img width="1279" height="900" alt="image" src="https://github.com/user-attachments/assets/8203e403-6c4d-44b1-928d-69295a5e26c8" />

## The design

The site is built around a single idea called *The Draughtsman's Desk*: sheets of
paper laid out on a drafting table. Paper supplies the warmth, and the ink on it
supplies the engineering discipline.

It is paper physics rather than flat cards. Sheets rest with their corners
curled, pressing one flattens it against the desk, and every shadow on the page
derives from one shared light source that follows your cursor, so the whole page
re-casts together. Different content sits on different stock: bond, index card,
graph paper, engineering pad, tracing paper. Buttons and tabs are cardboard, with
a hard side edge that compresses when you press them.

Light mode is manila drafting paper. Dark mode is a cyanotype blueprint, which is
a different paper stock rather than an inverted palette. There is one accent
throughout, a desaturated vermillion: the red pen an engineer marks up a drawing
with.

Everything material is pure CSS, so it works without JavaScript, and the whole
system collapses gracefully under `prefers-reduced-motion`.

## Tech Stack

| Tech | Stack |
|---|---|
| Framework | Next.js 13 (App Router), TypeScript |
| Styling | Tailwind CSS, CSS custom properties for the token layer |
| Content | Contentlayer, MDX |
| Type | Archivo, Geist, JetBrains Mono, Caveat |

## Running it locally

Requires Node and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

```bash
pnpm build      # Production build (Contentlayer, then Next.js)
pnpm start      # Serve the production build
pnpm fmt        # Lint and format with Rome
```

View-count tracking needs the two Upstash keys in `.env.example`. Without them
the site runs fine and the counters degrade quietly.

One caveat: `pnpm dev` and `pnpm build` share the `.next` directory and their
artifacts do not mix. Stop the dev server, `rm -rf .next`, then switch.

## Content

All content is MDX under `/content/`, compiled to typed objects by Contentlayer:

```
content/
  blog/<slug>.mdx                 # Posts
  projects/<slug>/index.mdx       # Project case studies
  projects/<slug>/privacy.mdx     # Optional legal pages, per project
  projects/<slug>/terms.mdx
  projects/<slug>/deletion.mdx
```

Project frontmatter is almost entirely optional and every block hides when it is
absent, so a one-line entry and a full case study both render correctly. The
legal pages are per project because the Android apps need them, and several are
translated.

## Credits

The site began as [Chronark](https://github.com/chronark/chronark.com), an
excellent Next.js template I found through Vercel. Little of it survives the
redesign beyond the content pipeline, but it is why the project exists.

Tech-stack logos are from [Simple Icons](https://simpleicons.org/) (CC0).
