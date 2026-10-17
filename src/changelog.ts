import zhRaw from '../CHANGELOG.md?raw'
import enRaw from '../CHANGELOG.en.md?raw'
import type { Locale } from './locale.ts'

export const APP_VERSION = __APP_VERSION__
export const BUILD_SHA = __BUILD_SHA__
export const BUILD_DATE = __BUILD_DATE__

export interface ChangelogSection {
  // null for the "## 未發佈" / "## Unreleased" section
  version: string | null
  date: string | null
  items: string[]
}

interface ChangelogText {
  title: string
  // Footer link next to the version number
  link: string
  currentVersion: string
  build: string
  unreleased: string
  unreleasedNote: string
  backHome: string
}

export const changelogTextByLocale: Record<Locale, ChangelogText> = {
  zh: {
    title: '更新紀錄',
    link: '更新紀錄',
    currentVersion: '目前版本',
    build: '建置',
    unreleased: '下一版',
    unreleasedNote: '已經上線，還沒發版',
    backHome: '回到首頁'
  },
  en: {
    title: 'Changelog',
    link: 'Changelog',
    currentVersion: 'Current version',
    build: 'Build',
    unreleased: 'Next version',
    unreleasedNote: 'Live, not yet released',
    backHome: 'Back to home'
  }
}

const UNRELEASED_HEADINGS = ['未發佈', 'Unreleased']

// Reads only "## version - date" headings and "- item" bullets (an indented line continues the previous item);
// other text is notes for the maintainer and is skipped.
export function parseChangelog(text: string): ChangelogSection[] {
  const sections: ChangelogSection[] = []
  for (const line of text.split('\n')) {
    const heading = line.match(/^## (.+)$/)
    if (heading) {
      const title = heading[1].trim()
      const [version, date] = title.split(/\s+-\s+/)
      sections.push(
        UNRELEASED_HEADINGS.includes(title)
          ? { version: null, date: null, items: [] }
          : { version: version.trim(), date: date?.trim() ?? null, items: [] },
      )
      continue
    }
    const current = sections.at(-1)
    if (!current) continue
    if (line.startsWith('- ')) current.items.push(line.slice(2).trim())
    else if (/^\s{2,}\S/.test(line) && current.items.length > 0) {
      current.items[current.items.length - 1] += ` ${line.trim()}`
    }
  }
  return sections
}

const rawByLocale: Record<Locale, string> = { zh: zhRaw, en: enRaw }

// What the changelog page shows; an empty unreleased section is hidden.
export const changelogByLocale: Record<Locale, ChangelogSection[]> = {
  zh: parseChangelog(rawByLocale.zh).filter((section) => section.items.length > 0),
  en: parseChangelog(rawByLocale.en).filter((section) => section.items.length > 0),
}

// "**bold**" split into parts; odd indexes are bold.
export function splitBold(text: string): string[] {
  return text.split('**')
}

function compareVersions(a: string, b: string): number {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number))
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]
}

// Run by scripts/prerender.mjs, which fails the build on any problem:
// VERSION matches the newest release, versions are x.y.z newest first, and both languages list the same releases.
export function checkChangelogs(): string[] {
  const problems: string[] = []
  const released = (Object.keys(rawByLocale) as Locale[]).map((locale) => {
    const sections = parseChangelog(rawByLocale[locale])
    const releases = sections.filter((section) => section.version !== null)
    const file = locale === 'zh' ? 'CHANGELOG.md' : 'CHANGELOG.en.md'

    if (sections[0]?.version !== null) problems.push(`${file}: the first section must be the unreleased one`)
    if (releases[0]?.version !== APP_VERSION) {
      problems.push(`${file}: newest release is ${releases[0]?.version ?? 'missing'}, VERSION is ${APP_VERSION}`)
    }
    releases.forEach((section, index) => {
      if (!/^\d+\.\d+\.\d+$/.test(section.version!)) problems.push(`${file}: "${section.version}" is not x.y.z`)
      else if (index > 0 && compareVersions(releases[index - 1].version!, section.version!) <= 0) {
        problems.push(`${file}: ${section.version} is not older than ${releases[index - 1].version}`)
      }
      if (!section.date || !/^\d{4}-\d{2}-\d{2}$/.test(section.date)) {
        problems.push(`${file}: ${section.version} needs a date (## ${section.version} - YYYY-MM-DD)`)
      }
      if (section.items.length === 0) problems.push(`${file}: ${section.version} has no items`)
    })
    return releases.map((section) => `${section.version} - ${section.date}`).join(', ')
  })

  if (released[0] !== released[1]) {
    problems.push(`CHANGELOG.md and CHANGELOG.en.md list different releases:\n  zh: ${released[0]}\n  en: ${released[1]}`)
  }
  return problems
}
