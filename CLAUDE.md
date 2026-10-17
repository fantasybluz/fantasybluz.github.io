# Bluz Lan portfolio (fantasybluz.github.io)

Personal portfolio at https://bluz.dev: Vite + React 19 + TypeScript, zh at `/`, en at `/en/`, every page prerendered
to static HTML at build time, hosted on Cloudflare Pages (project `marklan`). The old GitHub Pages address only redirects.
Read [docs/README.md](docs/README.md) first; how it fits together is in [docs/architecture.md](docs/architecture.md).

## Commands

- `npm run dev`: http://localhost:5173 (client-rendered, no prerender)
- `npm run lint`, `npm run lint:css` (Stylelint with `--fix`)
- `npm run build`: docs link check + `tsc -b` + client build + SSR build + `scripts/prerender.mjs`
  (fails on broken doc links, `VERSION`/changelog mismatch, a page missing from the sitemap, a missing `<head>` tag)
- `npm run preview`: check `/`, `/en/`, `/changelog/`, `/en/changelog/`
- `npm run og`: re-render `public/og-zh.png`, `public/og-en.png` with local Chrome (commit the PNGs)
- `npm run deploy`: build + `wrangler pages deploy dist --project-name marklan --branch main` (see [docs/setup.md](docs/setup.md))
- Before committing: `npm run lint`, `npm run lint:css`, `npm run build` all pass

## When you change something, update in the same commit

| Change | Also update |
|---|---|
| Anything a visitor can see | `CHANGELOG.md` `## 未發佈` **and** `CHANGELOG.en.md` `## Unreleased` |
| Content in `contentByLocale` (`src/App.tsx`) | Both `zh` and `en` |
| A new page | `pagePaths` in `src/locale.ts`, `public/sitemap.xml` with `hreflang` alternates, `docs/architecture.md` |
| Title/description | `seoByLocale` / `changelogSeoByLocale` in `src/locale.ts` (both locales) |
| SEO tags in `index.html` | `scripts/prerender.mjs` if the tag is rewritten per page |
| Photo or card design | Run `npm run og` and commit the PNGs |
| Build, deploy, domain, headers, secrets | `docs/setup.md` / `docs/architecture.md` |
| A choice someone may question later | New ADR in `docs/decisions/` |
| Release | Follow `RELEASING.md` (bump `VERSION`, rename both unreleased headings) |

## Conventions

- Code comments, commit messages, and docs in English; visitor-facing text in both locales, always edited together
- **UI follows [DESIGN.md](DESIGN.md)** (Apple style): one accent (Action Blue `#0066cc`), sections alternate
  white / parchment / black, no borders or shadows on cards. Read it before any UI change
- Check every UI change at **393 px** and **1440 px** wide, in both `/` and `/en/`
- Render code must work in Node (prerender): touch `window`/`document` only inside `useEffect`
- Absolute URLs use `https://bluz.dev` (`SITE_URL` in `scripts/prerender.mjs`)
- Changelog bullets are for visitors (what they can see), one `- ` line each, `**bold**` allowed; no NEW badge
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
