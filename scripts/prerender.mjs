// Injects server-rendered HTML into dist/index.html and stamps sitemap lastmod with the build date.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const indexPath = path.join(distDir, 'index.html')
const template = await readFile(indexPath, 'utf8')
const rootMarker = '<div id="root"></div>'

if (!template.includes(rootMarker)) {
  throw new Error(`prerender: "${rootMarker}" not found in dist/index.html`)
}

await writeFile(indexPath, template.replace(rootMarker, `<div id="root">${render()}</div>`))

const sitemapPath = path.join(distDir, 'sitemap.xml')
const today = new Date().toISOString().slice(0, 10)
const sitemap = await readFile(sitemapPath, 'utf8')
await writeFile(sitemapPath, sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`))

await rm(ssrDir, { recursive: true, force: true })

console.log(`prerender: dist/index.html rendered, sitemap lastmod = ${today}`)
