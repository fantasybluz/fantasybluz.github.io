import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import type { Locale, Page } from './locale.ts'

export { getPageSeo, localePaths, pagePaths } from './locale.ts'
export { checkChangelogs } from './changelog.ts'

// Used at build time by scripts/prerender.mjs so crawlers receive full HTML instead of an empty root.
export function render(locale: Locale, page: Page) {
  return renderToString(
    <StrictMode>
      <App locale={locale} page={page} />
    </StrictMode>,
  )
}
