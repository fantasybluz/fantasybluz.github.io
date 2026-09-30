import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import type { Locale } from './locale.ts'

export { localePaths, seoByLocale } from './locale.ts'

// Used at build time by scripts/prerender.mjs so crawlers receive full HTML instead of an empty root.
export function render(locale: Locale) {
  return renderToString(
    <StrictMode>
      <App locale={locale} />
    </StrictMode>,
  )
}
