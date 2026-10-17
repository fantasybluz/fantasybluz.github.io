# Setup and deploy

## Local development

Node.js 20+ and npm 10+ (CI uses Node 22).

```bash
npm install
npm run dev        # http://localhost:5173 (client-rendered, no prerender)
```

## Checks

```bash
npm run lint         # ESLint
npm run lint:css     # Stylelint (with --fix, so it may rewrite src/**/*.css)
npm run check:docs   # relative links in the Markdown docs
npm run build        # docs links + tsc -b + client build + SSR build + prerender (see architecture.md)
npm run preview      # serve dist/; check /, /en/, /changelog/, /en/changelog/
```

`npm run build` also fails if `VERSION` and the two changelogs disagree, or a page is missing from the sitemap
([docs/README.md](README.md#automated-checks)).

UI changes: look at 393 px (iPhone) and 1440 px (desktop) wide in both locales. The CSS breakpoints are
1068, 900, 768, and 480 px (`src/App.css`).

## Link-preview cards

```bash
npm run og   # renders public/og-zh.png and public/og-en.png from scripts/og/card.html with local Chrome
```

Set `CHROME=/path/to/chrome` if Chrome is not at `/Applications/Google Chrome.app`. Commit the PNGs.

## Deploy (Cloudflare Pages)

The site is the Cloudflare Pages project **`marklan`** (production branch `main`).

From a laptop (first `npx wrangler login` with the Cloudflare account):

```bash
npm run deploy   # npm run build + npx wrangler@4 pages deploy dist --project-name marklan --branch main
```

From GitHub Actions: `.github/workflows/deploy.yml` runs on every push to `main` (and by hand, `workflow_dispatch`).
Job `cloudflare-pages` builds and deploys the same way. It is skipped (not failed) until these repository secrets exist
(Settings › Secrets and variables › Actions):

| Secret | Where |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare › My Profile › API Tokens, with **Cloudflare Pages: Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID on the Cloudflare Workers & Pages page |

### Custom domain

`bluz.dev` is attached in the Cloudflare dashboard: Workers & Pages › `marklan` › Custom domains. This is not in the
repo. The default address `https://marklan.pages.dev` stays reachable: the script in `index.html` sends visitors to
`bluz.dev`, and `public/_headers` marks it `noindex`.

If the domain ever changes, update `SITE_URL` in `scripts/prerender.mjs`, every absolute URL in `index.html`,
`public/sitemap.xml`, `public/robots.txt`, the redirect script in `index.html`, and `NEW_SITE` in
`scripts/build-redirect.mjs`.

## Old address (GitHub Pages redirect)

Job `github-pages-redirect` in the same workflow runs on every push to `main`, without secrets:

1. `node scripts/build-redirect.mjs` writes `redirect-dist/`
2. `peaceiris/actions-gh-pages@v3` publishes it to the `gh-pages` branch with `GITHUB_TOKEN`
   (the workflow has `permissions: contents: write`)

GitHub Pages must serve the `gh-pages` branch (repo Settings › Pages › Deploy from a branch). To try it locally:
`npm run build:redirect`, then open `redirect-dist/index.html`.

## Google Search Console

- Old property `https://fantasybluz.github.io/`: verified by the HTML files `public/google12b722e4207bfe96.html`
  (added 2026-02-24) and `public/google87dc5c9a64f8a1f6.html` (added 2026-09-30). They are deployed to `bluz.dev` too,
  and `build-redirect.mjs` copies every `public/google*.html` to the redirect site, so the old property stays verified.
  Do not delete them.
- New address: add `bluz.dev` as a **Domain** property and verify it with the DNS TXT record Search Console gives you
  (DNS is on Cloudflare). Submit `https://bluz.dev/sitemap.xml`.
- `google12b722e4207bfe96.html` at the repo root is a duplicate of the `public/` file (added in the same commit).
  Vite only copies `public/`, so the build does not use it.
