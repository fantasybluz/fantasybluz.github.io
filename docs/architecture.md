# Architecture

## Overview

```
visitor / crawler
   │
   ▼
Cloudflare Pages project "marklan"  ── https://bluz.dev  (marklan.pages.dev → script redirect, noindex)
   └─ dist/: prerendered HTML per page and locale + hashed assets/ + public/ files
              │
              └─ React hydrates the HTML (src/main.tsx)

https://fantasybluz.github.io (gh-pages branch) ── redirect pages only → same path on https://bluz.dev
```

- A static site: no server code, no API. Everything is built by `npm run build` into `dist/`.
- React 19 + TypeScript + Vite 7. One component tree (`src/App.tsx`) renders both pages; content lives in
  `contentByLocale` in the same file.
- Two languages, two pages each, four HTML files. Each one is full HTML at build time, so crawlers and link previews
  get the content without running JavaScript ([ADR 0001](decisions/0001-prerender-at-build-time.md)).

| Path | What |
|---|---|
| `src/App.tsx` | Content model (`contentByLocale`), sections, nav, footer; renders the home page or `Changelog` |
| `src/locale.ts` | Locales, page paths (`pagePaths`), per-locale SEO strings (`seoByLocale`, `changelogSeoByLocale`) |
| `src/changelog.ts`, `src/Changelog.tsx` | Changelog parser + build check, changelog page |
| `src/main.tsx` | Browser entry: picks locale and page from the URL, hydrates (or renders in dev) |
| `src/entry-server.tsx` | SSR entry used only by the prerender: `render()`, plus re-exports for the script |
| `src/App.css`, `src/index.css` | Component styles; global styles and design tokens (per [DESIGN.md](../DESIGN.md)) |
| `index.html` | HTML shell with every SEO tag the prerender rewrites, JSON-LD, the `marklan.pages.dev` redirect script |
| `scripts/prerender.mjs` | Writes the four HTML files, checks changelogs and sitemap, stamps sitemap `lastmod` |
| `scripts/render-og.mjs`, `scripts/og/card.html` | Renders the link-preview cards (`npm run og`) |
| `scripts/build-redirect.mjs` | Builds `redirect-dist/` for the old GitHub Pages address |
| `scripts/check-docs.mjs` | Fails the build on broken relative links in the Markdown docs |
| `public/` | Copied as-is: photo, logo, `og-zh.png`, `og-en.png`, `screenshots/`, `robots.txt`, `sitemap.xml`, `_headers`, Google verification files |

## Build pipeline

`npm run build` runs, in order:

1. `node scripts/check-docs.mjs`: every relative Markdown link resolves
2. `tsc -b`: type check (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`)
3. `vite build`: client bundle into `dist/` (`dist/index.html` is the shell with an empty `#root`)
4. `vite build --ssr src/entry-server.tsx --outDir dist-ssr`: the same app as a Node module
5. `node scripts/prerender.mjs`:
   - imports `dist-ssr/entry-server.js`, runs `checkChangelogs()` and stops on any problem
   - checks every URL in `pagePaths` has a `<loc>` in `dist/sitemap.xml`
   - for each page × locale, copies `dist/index.html` and rewrites `<html lang>`, `<title>`, description, canonical,
     the three `hreflang` links, `og:url`/`title`/`description`/`locale`/`locale:alternate`/`image`/`image:alt`,
     `twitter:title`/`description`/`image`/`image:alt`, and fills `#root` with `renderToString(<App />)`.
     Each tag must match exactly once (`replaceOnce`), so a template change cannot silently drop a tag
   - writes `dist/index.html`, `dist/en/index.html`, `dist/changelog/index.html`, `dist/en/changelog/index.html`
   - sets every `<lastmod>` in `dist/sitemap.xml` to the build date, then deletes `dist-ssr/`

`vite.config.ts` injects `__APP_VERSION__` (from `VERSION`), `__BUILD_SHA__` (`GITHUB_SHA` or `git rev-parse --short HEAD`,
empty if neither works), and `__BUILD_DATE__`.

In `npm run dev` nothing is prerendered: `#root` is empty and `main.tsx` uses `createRoot` instead of `hydrateRoot`.
Code that runs during render must not touch `window` or `document` (put it in `useEffect`), or the prerender crashes
or hydration mismatches.

## Pages and locales

`src/locale.ts` is the single source:

| Page | zh | en |
|---|---|---|
| `home` | `/` | `/en/` |
| `changelog` | `/changelog/` | `/en/changelog/` |

- The URL decides the language: `getLocaleFromPath()` is `en` for `/en` and `/en/...`, otherwise `zh`.
  There is no browser-language redirect and nothing in `localStorage`, so crawlers reach both versions
  ([ADR 0002](decisions/0002-locale-in-url-path.md)).
- The language switcher is a pair of plain links to the other locale's path.
- `getPageFromPath()` matches `/changelog/` and `/en/changelog/`; everything else is `home`.
- On the changelog page the nav links go back to the home page's sections (`/#about`, `/en/#about`).
- At runtime `App` also updates `lang`, `title`, description, and the OG/Twitter title and description in a
  `useEffect`; the prerendered values are the same, so this only matters in dev.

## SEO

- Every absolute URL (canonical, `hreflang`, Open Graph, JSON-LD, sitemap, robots) uses `https://bluz.dev`.
  `SITE_URL` in `scripts/prerender.mjs` must match.
- `hreflang`: each page links to itself in `zh-Hant` and `en`; `x-default` is the zh page.
- `og:locale` is `zh_TW` / `en_US`, with the other one as `og:locale:alternate`.
- JSON-LD in `index.html`: a `WebSite` + `ProfilePage` + `Person` graph. It is not rewritten per locale.
- `public/sitemap.xml` lists all four URLs with `xhtml:link` alternates (hand-written; `lastmod` is stamped at build).
- `public/robots.txt` allows everything and points to the sitemap.
- `public/_headers` sends `X-Robots-Tag: noindex` on `https://marklan.pages.dev/*`, so only `bluz.dev` is indexed.

## Version and changelog

- `VERSION` holds the current version (`2.1.0`). The footer shows `v<VERSION> · 更新紀錄` / `v<VERSION> · Changelog`,
  linking to the changelog page of the same locale.
- `CHANGELOG.md` (zh) and `CHANGELOG.en.md` (en) list the same releases with the same dates
  ([ADR 0006](decisions/0006-bilingual-changelog.md)). `src/changelog.ts` imports both with `?raw`.
- `parseChangelog()` reads only `## <version> - <date>` headings and `- ` bullets (indented lines continue the bullet);
  `**bold**` becomes `<strong>`. Other text is a note for the maintainer.
- The `## 未發佈` / `## Unreleased` section is shown as "下一版" / "Next version" when it has items, hidden when empty.
- The page header shows the current version, build commit, and build date. There is no NEW badge.
- Format and release steps: [RELEASING.md](../RELEASING.md).

## Link-preview cards

- `public/og-zh.png` and `public/og-en.png`, 1200 × 630, one per locale (`ogImage` in `seoByLocale`)
  ([ADR 0005](decisions/0005-per-locale-og-cards.md)).
- Drawn from `scripts/og/card.html` (name, role, photo, styled per DESIGN.md); the locale comes from the URL hash
  (`#zh` / `#en`).
- `npm run og` runs `scripts/render-og.mjs`: local Chrome headless, `--window-size=1200,630`, scale factor 1,
  screenshot to `public/og-<locale>.png`. Chrome path defaults to macOS
  (`/Applications/Google Chrome.app/...`); set `CHROME=/path/to/chrome` otherwise.
- The PNGs are committed, so a normal build and CI do not need Chrome.
- LINE and Facebook cache previews per image URL; rename the files when an old share must update.

## Assets

- `public/Bluz_Lan.jpg` is the profile photo used on the page and on the cards (`Bluz_Lan.jpeg` and `Bluz_Lan.png`
  are also in `public/`).
- `public/screenshots/<slug>/` has one folder per side project. An empty `screenshots` list shows a dashed
  placeholder with the folder path in `npm run dev` only; the production build shows nothing.
- `public/_headers` (Cloudflare Pages): `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Frame-Options: DENY`, `Permissions-Policy` off for camera, microphone, geolocation, and
  `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` (Vite adds a content hash to those names).

## Hosting

- Cloudflare Pages project `marklan`, custom domain `bluz.dev` ([ADR 0003](decisions/0003-cloudflare-pages-bluz-dev.md)).
- `index.html` has a small script that sends `marklan.pages.dev` visitors to the same path on `bluz.dev`.
- The old address `https://fantasybluz.github.io` serves only redirect pages from the `gh-pages` branch, built by
  `scripts/build-redirect.mjs`:
  - `index.html`, `en/index.html`, and `404.html` (GitHub Pages serves it for every other path) each have a
    `meta refresh` (works without JS) and a script that keeps path, query, and hash
  - `robots.txt` allows crawling so search engines see the redirects; it points to `https://bluz.dev/sitemap.xml`
  - the `google*.html` verification files from `public/` are copied so the old Search Console property stays verified
  - `.nojekyll` turns off Jekyll processing
- Deploy steps: [setup.md](setup.md).
