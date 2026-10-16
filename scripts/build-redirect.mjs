// Builds the site that now lives at the old GitHub Pages address (https://fantasybluz.github.io).
// The real site moved to Cloudflare Pages (https://marklan.pages.dev); every old URL forwards to the
// same path there, so shared links and search results keep working. Output: redirect-dist/
import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const NEW_SITE = 'https://marklan.pages.dev'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'redirect-dist')

// A meta refresh works without JavaScript; the script keeps the path, query and hash for any URL (404.html).
const page = (target) => `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Moved to ${NEW_SITE}</title>
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <script>
      location.replace('${NEW_SITE}' + location.pathname + location.search + location.hash)
    </script>
  </head>
  <body>
    <p>網站搬家了 / This site has moved: <a href="${target}">${target}</a></p>
  </body>
</html>
`

await rm(outDir, { recursive: true, force: true })
await mkdir(path.join(outDir, 'en'), { recursive: true })
await writeFile(path.join(outDir, 'index.html'), page(`${NEW_SITE}/`))
await writeFile(path.join(outDir, 'en', 'index.html'), page(`${NEW_SITE}/en/`))
// GitHub Pages serves 404.html for every other path
await writeFile(path.join(outDir, '404.html'), page(`${NEW_SITE}/`))
// Let crawlers in so they see the redirects; the sitemap now lives on the new site
await writeFile(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${NEW_SITE}/sitemap.xml\n`)
// Keep the Google Search Console verification files so the old property stays verified
for (const file of await readdir(path.join(root, 'public'))) {
  if (/^google[0-9a-f]+\.html$/.test(file)) await copyFile(path.join(root, 'public', file), path.join(outDir, file))
}
// Plain static files, no Jekyll processing
await writeFile(path.join(outDir, '.nojekyll'), '')
console.log(`redirect site written to ${path.relative(root, outDir)}/ -> ${NEW_SITE}`)
