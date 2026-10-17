# 0002 English at /en/ with hreflang, language chosen by the URL

- Status: Accepted
- Date: 2026-09-30

## Context

Both languages were served from `/`. `getInitialLocale()` in `App.tsx` picked the language from `localStorage`,
then `navigator.language`, and the switcher was a button that changed React state. Search engines index one URL
once, so the English version could not be found, and the prerendered HTML ([ADR 0001](0001-prerender-at-build-time.md))
could only be in one language.

## Decision

Each language has its own URL (`d53038c`):

- `/` is zh (`zh-Hant`), `/en/` is en; `getLocaleFromPath()` in `src/locale.ts` decides, nothing else
- No redirect by browser language and no stored preference, so crawlers reach both
- The language switcher is two links
- Each page has `hreflang` alternates for `zh-Hant`, `en`, and `x-default` (the zh page), in the HTML and in
  `public/sitemap.xml`
- SEO strings moved to `seoByLocale` in `src/locale.ts`; the prerender writes `dist/index.html` and `dist/en/index.html`
- The hero `h1` shows the full name (later the zh hero was shortened to "Bluz" in `d6b87fc`; the full name stays in
  title, meta, about text, and JSON-LD)

Later pages follow the same pattern: `/changelog/` and `/en/changelog/` (`pagePaths`).

## Trade-offs

- A visitor whose browser is English still lands on zh at `/` and has to click the switcher
- Every new page needs a path per locale in `pagePaths` and an entry with alternates in the hand-written sitemap
  (the build checks the sitemap)
- Old links with an English preference in `localStorage` now open zh
