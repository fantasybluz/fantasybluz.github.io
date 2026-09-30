# Bluz Lan Portfolio

Production website: <https://fantasybluz.github.io/>

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
- CI/CD: GitHub Actions (deploy to GitHub Pages)

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
- `public/google12b722e4207bfe96.html` (Google Search Console HTML verification)

Post-deploy verification URL:

`https://fantasybluz.github.io/google12b722e4207bfe96.html`

## 8. Deployment Pipeline

Deployment is automated by GitHub Actions:

- Workflow file: `.github/workflows/deploy.yml`
- Trigger: push to `main`
- Build command: `npm run build`
- Published artifact directory: `dist/`
- Published branch: `gh-pages`

## 9. Repository Structure

```text
.
├── .github/workflows/deploy.yml
├── index.html
├── scripts/
│   └── prerender.mjs
├── public/
│   ├── Bluz_Lan.jpg
│   ├── logo.png
│   ├── robots.txt
│   ├── sitemap.xml
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
- Update profile image: replace `public/Bluz_Lan.jpg`
- Update favicon/logo: replace `public/logo.png`
- Update per-locale title/description: edit `seoByLocale` in `src/locale.ts`
- Update shared SEO metadata (JSON-LD, image, hreflang): edit `index.html`, `public/robots.txt`, `public/sitemap.xml`

## 11. License

MIT
