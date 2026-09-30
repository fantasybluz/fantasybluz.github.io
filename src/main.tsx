import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getLocaleFromPath } from './locale.ts'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App locale={getLocaleFromPath(window.location.pathname)} />
  </StrictMode>
)

// Production HTML is prerendered per locale, so hydrate it; the dev server serves an empty root.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
