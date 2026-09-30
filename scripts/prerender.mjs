// Writes one prerendered HTML file per locale (dist/index.html, dist/en/index.html)
// and stamps sitemap lastmod with the build date.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const SITE_URL = 'https://fantasybluz.github.io'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, localePaths, seoByLocale } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

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

function renderPage(locale) {
  const seo = seoByLocale[locale]
  const otherLocale = locale === 'zh' ? 'en' : 'zh'
  const pageUrl = `${SITE_URL}${localePaths[locale]}`
  let html = template

  html = replaceOnce(html, /<html lang="[^"]*">/, `<html lang="${seo.htmlLang}">`, '<html lang>')
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeAttr(seo.title)}</title>`, '<title>')
  html = replaceOnce(
    html,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${pageUrl}$2`,
    'canonical link',
  )
  html = setMeta(html, 'name', 'description', seo.description)
  html = setMeta(html, 'property', 'og:url', pageUrl)
  html = setMeta(html, 'property', 'og:title', seo.title)
  html = setMeta(html, 'property', 'og:description', seo.description)
  html = setMeta(html, 'property', 'og:locale', seo.ogLocale)
  html = setMeta(html, 'property', 'og:locale:alternate', seoByLocale[otherLocale].ogLocale)
  html = setMeta(html, 'property', 'og:image:alt', seo.imageAlt)
  html = setMeta(html, 'name', 'twitter:title', seo.title)
  html = setMeta(html, 'name', 'twitter:description', seo.description)
  html = setMeta(html, 'name', 'twitter:image:alt', seo.imageAlt)
  html = replaceOnce(
    html,
    /<div id="root"><\/div>/,
    `<div id="root">${render(locale)}</div>`,
    'root element',
  )

  return html
}

for (const locale of Object.keys(localePaths)) {
  const outDir = path.join(distDir, localePaths[locale])
  await mkdir(outDir, { recursive: true })
  await writeFile(path.join(outDir, 'index.html'), renderPage(locale))
  console.log(`prerender: ${path.relative(root, outDir)}/index.html (${locale})`)
}

const sitemapPath = path.join(distDir, 'sitemap.xml')
const today = new Date().toISOString().slice(0, 10)
const sitemap = await readFile(sitemapPath, 'utf8')
await writeFile(sitemapPath, sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`))
console.log(`prerender: sitemap lastmod = ${today}`)

await rm(ssrDir, { recursive: true, force: true })
