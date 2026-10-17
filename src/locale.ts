export type Locale = 'zh' | 'en'

// Each locale has its own URL so crawlers can index both languages.
export const localePaths: Record<Locale, string> = {
  zh: '/',
  en: '/en/'
}

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh'
}

export type Page = 'home' | 'changelog'

// Every page exists in both languages; scripts/prerender.mjs writes dist/<path>index.html for each.
export const pagePaths: Record<Page, Record<Locale, string>> = {
  home: localePaths,
  changelog: { zh: '/changelog/', en: '/en/changelog/' }
}

export function getPageFromPath(pathname: string): Page {
  return /^\/(en\/)?changelog\/?$/.test(pathname) ? 'changelog' : 'home'
}

export interface SeoContent {
  htmlLang: string
  title: string
  description: string
  ogLocale: string
  // Link-preview card, rendered by `npm run og` from scripts/og/card.html
  ogImage: string
  imageAlt: string
}

// Read by App at runtime and by scripts/prerender.mjs when writing each locale's <head>.
export const seoByLocale: Record<Locale, SeoContent> = {
  zh: {
    htmlLang: 'zh-Hant',
    title: '藍詠弘 Bluz Lan | 軟體工程師作品集',
    description:
      '藍詠弘（Bluz Lan）個人履歷網站，聚焦後端、前端、雲端、DevOps 與 ML，具 OpenStack、Kubernetes、GPU 平台整合實務經驗。',
    ogLocale: 'zh_TW',
    ogImage: '/og-zh.png',
    imageAlt: '藍詠弘 Bluz Lan，軟體工程師：後端、前端、雲端、DevOps 與 AI Agent'
  },
  en: {
    htmlLang: 'en',
    title: 'Bluz Lan | Software Engineer Portfolio',
    description:
      'Software Engineer portfolio of Bluz Lan, focused on backend, frontend, cloud, DevOps, and ML with hands-on OpenStack, Kubernetes, and GPU platform integration.',
    ogLocale: 'en_US',
    ogImage: '/og-en.png',
    imageAlt: 'Bluz Lan, Software Engineer: backend, frontend, cloud, DevOps, and AI agents'
  }
}

// Title and description of the changelog page (the rest of the <head> comes from seoByLocale).
export const changelogSeoByLocale: Record<Locale, Pick<SeoContent, 'title' | 'description'>> = {
  zh: {
    title: '更新紀錄 | 藍詠弘 Bluz Lan',
    description: '藍詠弘（Bluz Lan）個人作品集網站每一版改了什麼。'
  },
  en: {
    title: 'Changelog | Bluz Lan',
    description: 'What changed in each version of the Bluz Lan portfolio site.'
  }
}

export function getPageSeo(locale: Locale, page: Page): SeoContent {
  return page === 'changelog' ? { ...seoByLocale[locale], ...changelogSeoByLocale[locale] } : seoByLocale[locale]
}
