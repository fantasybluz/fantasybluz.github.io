// Writes one prerendered HTML file per page and locale (dist/index.html, dist/en/index.html,
// dist/changelog/index.html, dist/en/changelog/index.html) and stamps sitemap lastmod with the build date.
// Fails the build first if VERSION, CHANGELOG.md, and CHANGELOG.en.md disagree, or a page is missing from the sitemap.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const SITE_URL = 'https://bluz.dev'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, pagePaths, getPageSeo, checkChangelogs } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

const changelogProblems = checkChangelogs()
if (changelogProblems.length > 0) {
  throw new Error(`prerender: changelog check failed (see RELEASING.md)\n- ${changelogProblems.join('\n- ')}`)
}
console.log('prerender: VERSION matches CHANGELOG.md and CHANGELOG.en.md')

const sitemapPath = path.join(distDir, 'sitemap.xml')
const sitemap = await readFile(sitemapPath, 'utf8')
// Every page in pagePaths must be in public/sitemap.xml (docs/README.md, "Where to change what")
const missing = Object.values(pagePaths)
  .flatMap((paths) => Object.values(paths))
  .filter((pagePath) => !sitemap.includes(`<loc>${SITE_URL}${pagePath}</loc>`))
if (missing.length > 0) {
  throw new Error(`prerender: public/sitemap.xml has no <loc> for ${missing.join(', ')}`)
}

const template = await readFile(path.join(distDir, 'index.html'), 'utf8')

const escapeAttr = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

// Replaces exactly one match so a template change can't silently drop a tag.
function replaceOnce(html, pattern, replacement, label) {
  const matches = html.match(new RegExp(pattern.source, `${pattern.flags}g`))
  if (matches?.length !== 1) {
    throw new Error(`prerender: expected one ${label} in index.html, found ${matches?.length ?? 0}`)
  }
  return html.replace(pattern, replacement)
}

function setMeta(html, attribute, key, value) {
  const pattern = new RegExp(`(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*(")`)
  return replaceOnce(html, pattern, `$1${escapeAttr(value)}$2`, `${attribute}="${key}"`)
}

function renderPage(page, locale) {
  const seo = getPageSeo(locale, page)
  const otherLocale = locale === 'zh' ? 'en' : 'zh'
  const paths = pagePaths[page]
  const pageUrl = `${SITE_URL}${paths[locale]}`
  let html = template

  html = replaceOnce(html, /<html lang="[^"]*">/, `<html lang="${seo.htmlLang}">`, '<html lang>')
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeAttr(seo.title)}</title>`, '<title>')
  html = replaceOnce(
    html,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${pageUrl}$2`,
    'canonical link',
  )
  // hreflang alternates point at this page in each language; x-default is the zh page
  for (const [hreflang, pagePath] of [['zh-Hant', paths.zh], ['en', paths.en], ['x-default', paths.zh]]) {
    html = replaceOnce(
      html,
      new RegExp(`(<link rel="alternate" hreflang="${hreflang}" href=")[^"]*(")`),
      `$1${SITE_URL}${pagePath}$2`,
      `hreflang="${hreflang}" link`,
    )
  }
  html = setMeta(html, 'name', 'description', seo.description)
  html = setMeta(html, 'property', 'og:url', pageUrl)
  html = setMeta(html, 'property', 'og:title', seo.title)
  html = setMeta(html, 'property', 'og:description', seo.description)
  html = setMeta(html, 'property', 'og:locale', seo.ogLocale)
  html = setMeta(html, 'property', 'og:locale:alternate', getPageSeo(otherLocale, page).ogLocale)
  html = setMeta(html, 'property', 'og:image', `${SITE_URL}${seo.ogImage}`)
  html = setMeta(html, 'property', 'og:image:alt', seo.imageAlt)
  html = setMeta(html, 'name', 'twitter:title', seo.title)
  html = setMeta(html, 'name', 'twitter:description', seo.description)
  html = setMeta(html, 'name', 'twitter:image', `${SITE_URL}${seo.ogImage}`)
  html = setMeta(html, 'name', 'twitter:image:alt', seo.imageAlt)
  html = replaceOnce(
    html,
    /<div id="root"><\/div>/,
    `<div id="root">${render(locale, page)}</div>`,
    'root element',
  )

  return html
}

for (const page of Object.keys(pagePaths)) {
  for (const locale of Object.keys(pagePaths[page])) {
    const outDir = path.join(distDir, pagePaths[page][locale])
    await mkdir(outDir, { recursive: true })
    await writeFile(path.join(outDir, 'index.html'), renderPage(page, locale))
    console.log(`prerender: ${path.relative(root, outDir)}/index.html (${page}, ${locale})`)
  }
}

const today = new Date().toISOString().slice(0, 10)
await writeFile(sitemapPath, sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`))
console.log(`prerender: sitemap lastmod = ${today}`)

await rm(ssrDir, { recursive: true, force: true })
