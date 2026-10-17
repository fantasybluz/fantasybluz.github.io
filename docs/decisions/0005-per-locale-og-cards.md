# 0005 One 1200 × 630 link-preview card per locale, rendered with headless Chrome

- Status: Accepted
- Date: 2026-10-16

## Context

`og:image` was the 800 × 800 portrait. LINE and Facebook crop previews to about 1.91:1, so the face was cut off, and the
image said nothing about who or what the site is. Both locales shared the same image.

## Decision

- Two cards, `public/og-zh.png` and `public/og-en.png`, 1200 × 630: name, role, and the photo, styled per DESIGN.md
- One HTML template, `scripts/og/card.html`, with the locale in the URL hash (`#zh` / `#en`)
- `npm run og` (`scripts/render-og.mjs`) screenshots it with local Chrome headless (`--window-size=1200,630`,
  scale factor 1); `CHROME=/path` if Chrome is elsewhere
- The PNGs are committed, so the normal build and CI do not need Chrome
- `ogImage` and `imageAlt` per locale in `seoByLocale`; the prerender writes `og:image`, `og:image:alt`,
  `twitter:image`, `twitter:image:alt` for each page

## Trade-offs

- Changing the card, the photo, or the role means running `npm run og` by hand and committing two PNGs (about 180 KB each)
- The changelog pages reuse the locale's home card
- LINE and Facebook cache previews by image URL; to update old shares the files must be renamed
