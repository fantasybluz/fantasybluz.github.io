# Docs

This folder holds what the code does not show: how the site is put together, how it is deployed, and why it is built this way.
Details of a single function stay in code comments.

| Doc | What | Update when |
|---|---|---|
| [architecture.md](architecture.md) | Build and prerender pipeline, pages and locales, SEO, changelog, link-preview cards, assets, hosting | Adding a page, changing the build, SEO tags, or response headers |
| [setup.md](setup.md) | Local dev, checks, deploy to Cloudflare Pages, custom domain, GitHub Pages redirect, Search Console | Deploy steps, secrets, or domains change |
| [decisions/](decisions/) | Why things are the way they are (ADRs) | Making a choice someone may later ask "why not X?" about |
| [../RELEASING.md](../RELEASING.md) | Changelog format, release steps, which number to bump | The release process changes |
| [../DESIGN.md](../DESIGN.md) | Apple-style design spec (from `npx getdesign@latest add apple`) | Changing the overall look (write an ADR too) |
| [../CHANGELOG.md](../CHANGELOG.md), [../CHANGELOG.en.md](../CHANGELOG.en.md) | What visitors see changed, zh and en | Every visible change, both files |

## Maintenance rules

1. **Docs go in the same commit as the code.** Changed a page, the build, or a deploy step? Fix the doc in that commit, not later.
2. **Use the table above to find the doc.** If unsure, ask: would the next person (or AI) reading only the docs be misled?
3. **Changelog is for visitors**: what they can see or use, not which file changed. Write each change in both
   `CHANGELOG.md` and `CHANGELOG.en.md` under the unreleased heading; the build fails if the two disagree.
4. **Decisions become ADRs**: when you pick A over B and someone may ask "why not B?", add `decisions/000N-short-name.md`
   (next number) with Context, Decision, Trade-offs. When a decision changes, add a new ADR and mark the old one
   "Superseded by 000N" instead of deleting it.
5. **Write concrete facts**: numbers, paths, commands, file names ("1200 × 630", "`npm run og`"), not "some limits".

## Where to change what

| Change | Where |
|---|---|
| Resume content | `contentByLocale` in `src/App.tsx`, `zh` and `en` together |
| Side-project screenshots | Images in `public/screenshots/<slug>/`, listed in that project's `screenshots` in both locales (shown 16:10, cropped from the top) |
| Side-project links | `links` on that project, e.g. `[{ label: 'GitHub', url: '...' }]` |
| Per-locale title and description | `seoByLocale` (home) and `changelogSeoByLocale` (changelog) in `src/locale.ts` |
| Shared SEO (JSON-LD, hreflang template) | `index.html`; sitemap in `public/sitemap.xml`; `public/robots.txt` |
| New page | `pagePaths` in `src/locale.ts` and a `<url>` with `hreflang` alternates in `public/sitemap.xml` (the build checks) |
| Profile photo | `public/Bluz_Lan.jpg`, then `npm run og` (the cards use the same photo) |
| Link-preview card | `scripts/og/card.html`, then `npm run og`; commit the PNGs |
| Favicon / logo | `public/logo.png` |
| Response headers | `public/_headers` |
| Version and changelog | See [RELEASING.md](../RELEASING.md) |

## Automated checks

`npm run build` fails when:

- a relative link in `README.md`, `RELEASING.md`, `CLAUDE.md`, the changelogs, or `docs/` points at a missing file
  ([`scripts/check-docs.mjs`](../scripts/check-docs.mjs), also `npm run check:docs`)
- `VERSION` is not the newest release in both changelogs, a version is not `x.y.z` newest first, a release has no date
  or items, or the two files list different releases (`checkChangelogs()` in [`src/changelog.ts`](../src/changelog.ts))
- a page in `pagePaths` has no `<loc>` in `public/sitemap.xml` ([`scripts/prerender.mjs`](../scripts/prerender.mjs))
- a tag the prerender rewrites (title, description, canonical, hreflang, Open Graph, Twitter, `#root`) is missing from
  `index.html` or appears more than once

GitHub Actions runs `npm run build` on every push to `main` once the Cloudflare secrets are set ([setup.md](setup.md)).
