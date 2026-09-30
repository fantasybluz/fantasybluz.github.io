export type Locale = 'zh' | 'en'

// Each locale has its own URL so crawlers can index both languages.
export const localePaths: Record<Locale, string> = {
  zh: '/',
  en: '/en/'
}

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh'
}

export interface SeoContent {
  htmlLang: string
  title: string
  description: string
  ogLocale: string
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
    imageAlt: '藍詠弘 Bluz Lan 個人照片'
  },
  en: {
    htmlLang: 'en',
    title: 'Bluz Lan | Software Engineer Portfolio',
    description:
      'Software Engineer portfolio of Bluz Lan, focused on backend, frontend, cloud, DevOps, and ML with hands-on OpenStack, Kubernetes, and GPU platform integration.',
    ogLocale: 'en_US',
    imageAlt: 'Portrait of Bluz Lan'
  }
}
