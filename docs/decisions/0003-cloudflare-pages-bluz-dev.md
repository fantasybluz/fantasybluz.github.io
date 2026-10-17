# 0003 Host on Cloudflare Pages at bluz.dev, old GitHub Pages address redirects

- Status: Accepted
- Date: 2026-10-16

## Context

The site was built by GitHub Actions and published to the `gh-pages` branch at `https://fantasybluz.github.io/`.
GitHub Pages cannot set response headers (security headers, long cache for hashed assets) and the address was tied
to the GitHub user name. The other projects were moving to Cloudflare the same day (cocktail-party to
`drunk.bluz.dev` on Cloudflare Pages), with `bluz.dev` as the shared domain.

## Decision

- Cloudflare Pages project `marklan` (`62ed63e`), then the custom domain `https://bluz.dev` (`7abdaeb`)
- Deploy with `npm run deploy` (build + `wrangler@4 pages deploy dist --project-name marklan --branch main`);
  the workflow job `cloudflare-pages` does the same once `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set,
  and is skipped until then
- `public/_headers`: `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, and a one-year
  immutable cache for `/assets/*`
- `marklan.pages.dev` redirects to `bluz.dev` (script in `index.html`) and gets `X-Robots-Tag: noindex`
- All absolute URLs (canonical, `hreflang`, Open Graph, JSON-LD, sitemap, robots) use `https://bluz.dev`
- The `gh-pages` branch now holds only redirect pages from `scripts/build-redirect.mjs`: every path, query, and hash
  goes to the same place on `bluz.dev` (`meta refresh` + script, `404.html` for any other path). The Google verification
  files are copied there so the old Search Console property stays verified

## Trade-offs

- Two hosts to keep: Cloudflare Pages for the site, GitHub Pages for the redirect (the job runs on every push)
- GitHub Pages cannot send a real 301, so the redirect is client-side; search engines move rankings more slowly than
  with a server redirect
- Until the Cloudflare secrets are added to the repo, deploys are manual from a laptop
- The custom domain lives in the Cloudflare dashboard, not in the repo
