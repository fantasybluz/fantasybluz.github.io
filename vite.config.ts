import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const version = readFileSync(new URL('./VERSION', import.meta.url), 'utf8').trim()

// GitHub Actions sets GITHUB_SHA; locally ask git, and leave it empty if neither works.
function buildSha(): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return ''
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Footer version label and the changelog page (see RELEASING.md)
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __BUILD_SHA__: JSON.stringify(buildSha()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
})
