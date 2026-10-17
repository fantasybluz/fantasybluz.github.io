# Bluz Lan Portfolio

Production website: <https://bluz.dev/> (Cloudflare Pages project `marklan`; <https://marklan.pages.dev> forwards to it).
The old address <https://fantasybluz.github.io/> forwards every path to the new site.

A static portfolio/resume site built with React 19 + TypeScript 5 + Vite 7.

- Bilingual: zh at `/`, en at `/en/`, plus a changelog page in each (`/changelog/`, `/en/changelog/`)
- Every page is prerendered to static HTML at build time, so crawlers and link previews get full content without JavaScript
- Per-locale SEO: canonical, `hreflang`, Open Graph and Twitter tags, JSON-LD, sitemap, 1200 × 630 link-preview cards
- Apple-style design ([DESIGN.md](DESIGN.md)), responsive down to phone width
- Version in the footer (`VERSION`), linking to the changelog ([CHANGELOG.md](CHANGELOG.md), [CHANGELOG.en.md](CHANGELOG.en.md))

## Development

Node.js 20+, npm 10+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint       # ESLint
npm run lint:css   # Stylelint
npm run build      # docs check + type check + build + prerender into dist/
npm run preview    # serve dist/
npm run og         # re-render the link-preview cards (needs local Chrome)
npm run deploy     # build + deploy to Cloudflare Pages (needs wrangler login)
```

Deploy, custom domain, the GitHub Pages redirect, and Search Console: [docs/setup.md](docs/setup.md).

## Docs

| | |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Build and prerender pipeline, locales, SEO, changelog, cards, hosting |
| [docs/setup.md](docs/setup.md) | Setup and deploy |
| [docs/decisions/](docs/decisions/) | Why it is built this way (ADRs) |
| [RELEASING.md](RELEASING.md) | Changelog format and release steps |
| [DESIGN.md](DESIGN.md) | Design spec |

Where to change what, and how the docs are kept up to date: [docs/README.md](docs/README.md).

## Structure

```text
src/            App.tsx (content + layout), locale.ts (paths, SEO strings), changelog.ts, Changelog.tsx,
                main.tsx (browser), entry-server.tsx (prerender), App.css, index.css
scripts/        prerender.mjs, render-og.mjs + og/card.html, build-redirect.mjs, check-docs.mjs
public/         photo, logo, og-*.png, screenshots/<slug>/, robots.txt, sitemap.xml, _headers, Google verification
index.html      HTML shell and SEO tags (rewritten per page at build time)
docs/           documentation
```

## License

MIT
