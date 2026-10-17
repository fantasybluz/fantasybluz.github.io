// Fails when a relative link in the Markdown docs points at a file that does not exist.
// Checks README.md, RELEASING.md, CLAUDE.md, both changelogs, and docs/**/*.md; links inside ``` blocks are skipped.
// Run by `npm run build` (first step) and `npm run check:docs`.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = path.join(root, 'docs')
const files = [
  ...['README.md', 'RELEASING.md', 'CLAUDE.md', 'CHANGELOG.md', 'CHANGELOG.en.md'].map((file) => path.join(root, file)),
  ...readdirSync(docsDir, { recursive: true })
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.join(docsDir, file)),
].filter((file) => existsSync(file))

const broken = []
for (const file of files) {
  const text = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '')
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue
    const resolved = path.resolve(path.dirname(file), decodeURIComponent(target.split('#')[0]))
    if (!existsSync(resolved)) broken.push(`${path.relative(root, file)}: ${target}`)
  }
}

if (broken.length > 0) {
  console.error(`check-docs: broken relative links\n- ${broken.join('\n- ')}`)
  process.exit(1)
}
console.log(`check-docs: ${files.length} files, all relative links resolve`)
