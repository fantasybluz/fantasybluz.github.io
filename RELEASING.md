# Releasing

The version number tells visitors what changed; it is shown in the footer ("v2.0.0 · 更新紀錄" / "v2.0.0 · Changelog")
and links to the changelog page (`/changelog/`, `/en/changelog/`).

## Changelog files

- `CHANGELOG.md` (zh, shown at `/changelog/`) and `CHANGELOG.en.md` (en, shown at `/en/changelog/`) hold the same
  releases in two languages. Keep their versions and dates identical.
- Newest first. Headings are `## x.y.z - YYYY-MM-DD`; the top section is `## 未發佈` (zh) / `## Unreleased` (en).
- Only `- ` bullets are shown on the site (one line each; `**bold**` works). Other text is a note for the maintainer.
- Write for visitors: what they can see or use, not how it was built.

## Steps

1. Note each change under `## 未發佈` and `## Unreleased` as you go (an empty section is hidden on the site).
2. Check: `npm run lint`, `npm run lint:css`, `npm run build`, then `npm run preview` and look at `/changelog/` and `/en/changelog/`.
3. To release: set `VERSION` (e.g. `2.1.0`), rename both unreleased headings to `## 2.1.0 - <today>`,
   and add new empty `## 未發佈` / `## Unreleased` sections above them.
4. Commit, tag, and push:

   ```bash
   git tag v2.1.0
   git push origin main v2.1.0
   ```

5. Deploy: pushing `main` runs `.github/workflows/deploy.yml` (Cloudflare Pages project `marklan`, once the
   Cloudflare secrets are set). Until then deploy from a laptop with `npm run deploy`
   (`npm run build` + `wrangler pages deploy dist --project-name marklan --branch main`).

## Which number to bump

- New section, new side project, or a visible feature: minor (`2.1.0`)
- Fixes and wording only: patch (`2.0.1`)
- Redesign or a new address: major (`3.0.0`)

## How it works

- `vite.config.ts` reads `VERSION`, the commit (`GITHUB_SHA` on GitHub Actions, otherwise `git rev-parse`), and the build
  date into `__APP_VERSION__`, `__BUILD_SHA__`, and `__BUILD_DATE__`.
- `src/changelog.ts` imports both changelog files with `?raw` and parses them; `src/Changelog.tsx` renders the page.
- `scripts/prerender.mjs` writes the changelog pages next to the home pages and calls `checkChangelogs()` first:
  the build fails if `VERSION` is not the newest release, a version is not `x.y.z` newest first, a release has no date
  or items, or the two files list different releases.
- New pages are listed in `pagePaths` (`src/locale.ts`) and `public/sitemap.xml`, each with `hreflang` alternates.
