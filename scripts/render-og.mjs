// Renders the link-preview cards (scripts/og/card.html) to public/og-zh.png and public/og-en.png
// with the local Chrome in headless mode. Run `npm run og` after changing the card or the photo;
// the PNGs are committed, so a normal build does not need Chrome.
// Set CHROME=/path/to/chrome if Chrome is not in the default macOS location.
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const card = pathToFileURL(path.join(root, 'scripts/og/card.html')).href

for (const locale of ['zh', 'en']) {
  const out = path.join(root, 'public', `og-${locale}.png`)
  execFileSync(CHROME, [
    '--headless=new',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--allow-file-access-from-files',
    '--virtual-time-budget=2000',
    `--screenshot=${out}`,
    `${card}#${locale}`,
  ], { stdio: 'ignore' })
  console.log(`og: ${path.relative(root, out)}`)
}
