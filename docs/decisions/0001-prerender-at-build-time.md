# 0001 Prerender every page to static HTML at build time

- Status: Accepted
- Date: 2026-09-30

## Context

The site was a client-rendered single-page app: `index.html` shipped an empty `<div id="root">` and `main.tsx`
called `createRoot().render()`. Crawlers and link-preview bots that do not run JavaScript saw no content, only
the static `<head>`. The site was on GitHub Pages at the time, so there was no server to render per request.

Options:

1. Keep client rendering and rely on Google running JavaScript
2. A framework with static generation (Next.js, Astro) — a rewrite of a one-page site
3. A prerender plugin that drives a headless browser at build time — Chrome in every build and CI run
4. Vite's own SSR build + `react-dom/server` `renderToString`, plus a small script that writes the HTML

## Decision

Option 4 (`19c513e`).

- `npm run build` adds `vite build --ssr src/entry-server.tsx --outDir dist-ssr` and `node scripts/prerender.mjs`
- `scripts/prerender.mjs` fills `#root` with `renderToString(<App />)` and rewrites the `<head>` tags per page
  and locale; `main.tsx` uses `hydrateRoot` when `#root` has children
- No new dependency; the output is still plain files, so any static host works
- The same commit enriched the metadata: `og:image` size and alt, a `WebSite` + `ProfilePage` + `Person` JSON-LD graph,
  `rel="me"` on social links, and sitemap `lastmod` stamped with the build date

## Trade-offs

- The build has five steps and takes longer than a plain `vite build`
- Render code must not touch `window`/`document` (only `useEffect` may), or the prerender crashes or hydration mismatches
- Every tag the script rewrites must exist exactly once in `index.html`; `replaceOnce` fails the build otherwise,
  so editing the template means checking the script
- `npm run dev` does not prerender, so problems that only happen during hydration show up in `npm run preview`
