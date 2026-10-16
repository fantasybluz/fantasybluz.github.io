# Bluz Lan Portfolio

Production website: <https://bluz.dev/> (Cloudflare Pages project `marklan`; <https://marklan.pages.dev> forwards to it).
The old address <https://fantasybluz.github.io/> forwards every path to the new site.

## 1. Overview

This repository contains a static portfolio/resume website implemented with React + TypeScript + Vite.
The site supports bilingual content (zh at `/`, en at `/en/`), responsive layouts, and SEO-oriented metadata for search and social sharing.
Each locale is prerendered to static HTML at build time, so crawlers receive full content without running JavaScript.

## 2. Tech Stack

- Runtime/UI: React 19
- Language: TypeScript 5
- Build tool: Vite 7
- Linting: ESLint 9
- CSS linting: Stylelint 17
- Hosting: Cloudflare Pages (the old GitHub Pages address redirects)
- CI/CD: GitHub Actions

## 3. System Architecture

- Entry point: `src/main.tsx` (picks the locale from the URL path, hydrates prerendered HTML)
- Application container and content model: `src/App.tsx`
- Locale routing and SEO strings: `src/locale.ts`
- Build-time rendering: `src/entry-server.tsx` + `scripts/prerender.mjs`
- Component styling: `src/App.css`
- Global styling: `src/index.css`
- Static assets: `public/`
- HTML shell + SEO metadata: `index.html`

### 3.1 Content Model

The primary content source is `contentByLocale` in `src/App.tsx`:

- `zh` and `en` locale objects
- Shared section schema (`hero`, `about`, `experience`, `skills`, `projects`, `credentials`, `contact`)

Locale-specific SEO content (`title`, `description`, `ogLocale`, `imageAlt`) lives in `seoByLocale` in `src/locale.ts`.

### 3.2 Locale Routing and Prerendering

- The URL decides the language: `/` renders `zh`, `/en/` renders `en`. There is no browser-language redirect, so crawlers can reach both versions.
- The language switcher is a pair of links to those URLs.
- `npm run build` runs three steps: the client build, an SSR build of `src/entry-server.tsx` into `dist-ssr/`, then `scripts/prerender.mjs`.
- `scripts/prerender.mjs` writes `dist/index.html` and `dist/en/index.html`, rewriting each page's `lang`, title, description, canonical, Open Graph, and Twitter tags from `seoByLocale`. It fails the build if an expected tag is missing from `index.html`.
- It also stamps every `<lastmod>` in `dist/sitemap.xml` with the build date, then removes `dist-ssr/`.

## 4. Prerequisites

- Node.js 20+ (recommended)
- npm 10+ (recommended)

## 5. Local Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Default local URL: <http://localhost:5173>

## 6. Build, Validate, and Preview

### 6.1 Build

```bash
npm run build
```

Output directory: `dist/` (`index.html` for zh, `en/index.html` for en)

### 6.2 Lint (TS/JS)

```bash
npm run lint
```

### 6.3 Lint (CSS)

```bash
npm run lint:css
```

### 6.4 Preview Production Build

```bash
npm run preview
```

## 7. SEO and Search Configuration

SEO resources are managed in:

- `index.html`
  - `meta` description/robots/canonical
  - Open Graph and Twitter cards
  - `hreflang` alternates for `zh-Hant`, `en`, and `x-default`
  - JSON-LD graph (`WebSite`, `ProfilePage`, `Person`)
  - Per-locale values are overwritten at build time from `src/locale.ts`
- `public/robots.txt`
- `public/sitemap.xml` (both locale URLs with `hreflang` alternates)
- `public/google12b722e4207bfe96.html` (Google Search Console HTML verification for the old `fantasybluz.github.io` property)
- `public/_headers` (Cloudflare Pages response headers: security headers, long cache for hashed `assets/`)

All absolute URLs (canonical, `hreflang`, Open Graph, JSON-LD, sitemap, robots) use `https://bluz.dev`;
`SITE_URL` in `scripts/prerender.mjs` must match.

To track the new address in Google Search Console, add `bluz.dev` as a Domain property
(verified through a DNS TXT record on Cloudflare).

## 8. Deployment Pipeline

The site is hosted on Cloudflare Pages (project `marklan`) at <https://bluz.dev>; the default address
<https://marklan.pages.dev> redirects there (script in `index.html`) and is marked `noindex` (`public/_headers`).

Deploy from a laptop (needs `wrangler login` with the Cloudflare account):

```bash
npm run deploy   # npm run build + wrangler pages deploy dist --project-name marklan --branch main
```

GitHub Actions (`.github/workflows/deploy.yml`, on push to `main`) runs two jobs:

- `cloudflare-pages`: builds and deploys to Cloudflare Pages. Skipped until the repository secrets
  `CLOUDFLARE_API_TOKEN` (Cloudflare Pages: Edit permission) and `CLOUDFLARE_ACCOUNT_ID` are set.
- `github-pages-redirect`: runs `scripts/build-redirect.mjs` and publishes `redirect-dist/` to the `gh-pages` branch,
  so <https://fantasybluz.github.io/> forwards every path (including query and hash) to the same path on the new site.
  The Google verification files are kept there so the old Search Console property stays verified.

## 9. Repository Structure

```text
.
├── .github/workflows/deploy.yml
├── index.html
├── scripts/
│   ├── prerender.mjs
│   └── build-redirect.mjs  # old GitHub Pages address -> new site
├── public/
│   ├── Bluz_Lan.jpg
│   ├── logo.png
│   ├── robots.txt
│   ├── screenshots/        # one folder per side project (slug)
│   ├── sitemap.xml
│   ├── _headers            # Cloudflare Pages response headers
│   └── google12b722e4207bfe96.html
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── entry-server.tsx
│   ├── index.css
│   ├── locale.ts
│   └── main.tsx
└── package.json
```

## 10. Common Update Scenarios

- Update resume content: edit `contentByLocale` in `src/App.tsx`
- Add side-project screenshots: put images in `public/screenshots/<slug>/`, then list them in that project's `screenshots` (e.g. `{ src: '/screenshots/mneme/home.png', alt: '...' }`) in both `zh` and `en`. Images are shown at 16:10, cropped from the top; extra screenshots scroll sideways. While the list is empty, `npm run dev` shows a dashed placeholder with the folder path, and the production build shows nothing.
- Add side-project links (repo, demo): add `links` to that project, e.g. `[{ label: 'GitHub', url: '...' }]`
- Update profile image: replace `public/Bluz_Lan.jpg`
- Update favicon/logo: replace `public/logo.png`
- Update per-locale title/description: edit `seoByLocale` in `src/locale.ts`
- Update shared SEO metadata (JSON-LD, image, hreflang): edit `index.html`, `public/robots.txt`, `public/sitemap.xml`

## 11. License

MIT
