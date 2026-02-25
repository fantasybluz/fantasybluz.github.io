import { useEffect, useState } from 'react'
import './App.css'

type Locale = 'zh' | 'en'
const sectionIds = ['about', 'experience', 'skills', 'projects', 'credentials', 'contact'] as const
type SectionId = (typeof sectionIds)[number]

const LOCALE_STORAGE_KEY = 'bluz-tech-locale'

interface SkillItem {
  category: string
  items: string[]
}

interface Project {
  title: string
  description: string
  technologies: string[]
}

interface ExperienceSegment {
  period: string
  bullets: string[]
}

interface Experience {
  title: string
  company: string
  employmentType: string
  segments: ExperienceSegment[]
}

interface SocialLink {
  name: string
  url: string
}

interface ContactMethod {
  label: string
  value: string
  href: string
}

interface CredentialGroup {
  title: string
  items: string[]
}

interface SeoContent {
  title: string
  description: string
  ogLocale: string
}

interface PageContent {
  nav: {
    about: string
    experience: string
    skills: string
    projects: string
    credentials: string
    contact: string
  }
  mobileMenuOpenLabel: string
  mobileMenuCloseLabel: string
  languageLabel: string
  seo: SeoContent
  hero: {
    greeting: string
    name: string
    detailLine: string
  }
  about: {
    title: string
    imageAlt: string
    paragraphs: string[]
  }
  summaryTitle: string
  summaryBullets: string[]
  experienceTitle: string
  skillsTitle: string
  projectsTitle: string
  credentialsTitle: string
  contact: {
    title: string
    subtitle: string
  }
  footer: string
  experiences: Experience[]
  skills: SkillItem[]
  projects: Project[]
  credentials: CredentialGroup[]
  contactMethods: ContactMethod[]
  socials: SocialLink[]
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'zh'
  }

  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (savedLocale === 'zh' || savedLocale === 'en') {
    return savedLocale
  }

  const browserLocale = window.navigator.language.toLowerCase()
  return browserLocale.startsWith('zh') ? 'zh' : 'en'
}

const contentByLocale: Record<Locale, PageContent> = {
  zh: {
    nav: {
      about: '關於',
      experience: '經歷',
      skills: '技能',
      projects: '專案',
      credentials: '履歷',
      contact: '聯絡'
    },
    mobileMenuOpenLabel: '開啟選單',
    mobileMenuCloseLabel: '關閉選單',
    languageLabel: '切換語言',
    seo: {
      title: '藍詠弘 Bluz Lan | 軟體工程師作品集',
      description:
        '藍詠弘（Bluz Lan）個人履歷網站，聚焦後端、前端、雲端、DevOps 與 ML，具 OpenStack、Kubernetes、GPU 平台整合實務經驗。',
      ogLocale: 'zh_TW'
    },
    hero: {
      greeting: 'Hi, 我是',
      name: 'Bluz',
      detailLine: '「簡單，往往比複雜更難做到。」— Steve Jobs'
    },
    about: {
      title: '關於我',
      imageAlt: 'Bluz Lan',
      paragraphs: [
        '我是藍詠弘（Bluz Lan），具備後端、前端、雲端平台、DevOps 與機器學習整合能力的軟體工程師。',
        '目前任職於緯創資通 Chthonia 團隊，負責 OpenStack 與 Kubernetes 平台建置、GPU 節點納管及儲存權限策略設計，並持續參與企業系統開發、敏捷流程與跨團隊協作交付。',
        '業餘時間持續投入 AI Agent 相關研究與實作，聚焦流程自動化、任務協作與落地應用。'
      ]
    },
    summaryTitle: '專業摘要',
    summaryBullets: [
      '具備後端 / 前端 / 雲端 / DevOps / ML 綜合背景，能從平台到應用端進行整合開發。',
      '目前於緯創 Chthonia / AIDC 專案負責 OpenStack、Kubernetes、GPU Node 與 Storage 權限規劃與落地。',
      '曾參與企業內部系統（DPOM、SPOS）、行動裝置 App、ERP 系統維護與智慧製造 / 工業物聯網研究計畫。',
      '於緯創多個專案中實際參與 Scrum 敏捷流程（Sprint 規劃、Daily、Review、Retrospective）。'
    ],
    experienceTitle: '工作經驗',
    skillsTitle: '技能總覽',
    projectsTitle: '代表性專案',
    credentialsTitle: '履歷亮點',
    contact: {
      title: '聯絡方式',
      subtitle: '歡迎透過以下方式聯絡我'
    },
    footer: '© 2026 BLUZ TECH. All rights reserved.',
    experiences: [
      {
        title: '軟體工程師（Chthonia / AIDC 團隊）',
        company: 'Wistron',
        employmentType: '全職',
        segments: [
          {
            period: '2025 年 9 月 - 至今',
            bullets: [
              '開發 Go/Gin 中介層 API，整合 OpenStack（Keystone、Ironic、Nova），實現多叢集統一管理。',
              '建構 Next.js + TypeScript 前端 Monorepo（Turborepo + pnpm），涵蓋 Admin Portal 與 Service Portal。',
              '實作 WebSocket BMC Console（VNC/Serial），支援即時遠端裸機管理與維運排錯。',
              '設計 GitHub Actions CI/CD Pipeline，涵蓋 Lint、Unit Test、E2E Test、Security Scan、Multi-arch Docker Build 與 Helm GitOps 部署。'
            ]
          }
        ]
      },
      {
        title: '軟體工程師（DPOM 專案）',
        company: 'Wistron',
        employmentType: '全職',
        segments: [
          {
            period: '2024 年 12 月 - 2025 年 9 月',
            bullets: [
              '參與數位訂單管理系統（DPOM）開發與維運。',
              '使用 React（TypeScript）開發前端，並以 Node.js（TypeScript）實作後端服務與 RESTful API。',
              '設計與維護 PostgreSQL 的訂單、交易與報表資料模型，執行查詢優化與索引調校。',
              '建置角色權限流程與頁面層級存取控制，支援不同事業單位需求。',
              '於 Scrum 流程中與 PM、前後端與測試協作，以 Sprint 迭代交付功能。',
              '以 BullMQ 將資料庫同步與報表產生流程改為非同步處理，提升系統效能與使用者體驗。'
            ]
          }
        ]
      },
      {
        title: '軟體工程師（SPOS 專案）',
        company: 'Wistron',
        employmentType: '全職',
        segments: [
          {
            period: '2024 年 8 月 - 2025 年 12 月',
            bullets: [
              '參與物料供應鏈計劃最佳化系統（SPOS）開發。',
              '系統聚焦於物料資訊查詢、資訊整合平台與報表自動產生。',
              '前端使用 React + TypeScript 開發畫面與可重用元件。',
              '後端使用 Node.js + TypeScript 開發 API 與交易流程邏輯。',
              '資料庫使用 PostgreSQL，支援交易資料與報表查詢。',
              '依 Scrum 流程進行需求拆解、排程與版本釋出。'
            ]
          }
        ]
      },
      {
        title: '工程師',
        company: '高雄捷運股份有限公司',
        employmentType: '全職',
        segments: [
          {
            period: '2023 年 7 月 - 2024 年 8 月 · 1 年 2 個月',
            bullets: [
              '開發 ERP 權限控管模組，使用 Vue.js 前端與 Java Spring Web MVC / Spring Boot 後端，資料庫為 DB2。',
              '整合 MOXA NPort 序列設備伺服器，連接現場設備並提升門禁與監控系統穩定度。',
              '參與高雄捷運通勤助理 App（Xamarin / .NET Framework），負責 UI 與後端邏輯整合。',
              '以 paddleOCR 開發首/末班車倒數辨識功能。',
              '使用 pandas / NumPy 進行運料資料處理與圖形化分析。',
              '與營運及 IT 團隊釐清需求、於測試環境驗證功能行為，並支援正式環境部署。',
              '維護既有模組（除錯與重構舊程式碼），提升系統穩定性與可維護性。'
            ]
          }
        ]
      },
    ],
    skills: [
      {
        category: '程式語言與基礎能力',
        items: ['JavaScript', 'TypeScript', 'Golang（Go）', 'Python（機器學習 / 資料處理）', 'Java（Spring MVC / Spring Boot）', 'C#（.NET Framework / Xamarin）']
      },
      {
        category: '後端開發',
        items: ['Node.js（TypeScript）', 'Express.js（Node.js Framework）', 'Golang + Gin API 開發', 'Gophercloud（OpenStack SDK）整合', 'RESTful API 設計與實作', 'Java Spring Web MVC / Spring Boot', 'Django / Flask 基本 Web 服務']
      },
      {
        category: '前端開發',
        items: ['React（TypeScript）', 'Vue.js', 'Xamarin（.NET Framework）', '企業內部系統 UI / 表單 / 權限頁面開發']
      },
      {
        category: '雲端、容器與 DevOps',
        items: ['Docker', 'Kubernetes', 'OpenStack', 'Azure DevOps Pipeline', 'GitLab CI/CD', 'GPU Node 納管與資源管理']
      },
      {
        category: '資料庫',
        items: ['PostgreSQL', 'MySQL', 'MariaDB', 'MS-SQL', 'DB2', 'Schema 設計', '索引與效能調校']
      },
      {
        category: '開發流程與協作',
        items: ['Scrum 敏捷開發', 'Sprint 規劃 / Daily / Review / Retro', 'Git 版本控制', 'Code Review', '跨團隊協作（PM / Infra / QA / RD）']
      },
      {
        category: '機器學習與資料處理',
        items: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'paddleOCR']
      },
      {
        category: '嵌入式與工控',
        items: ['Raspberry Pi', 'MCU 基礎開發概念', 'MOXA NPort 串接', 'IIoT / 智慧製造場域與資安概念']
      }
    ],
    projects: [
      {
        title: 'Chthonia',
        description: '在緯創資通 Chthonia 團隊中開發 AIDC 產品，以 Golang + Gin 開發 API，並結合 Gophercloud 串接 OpenStack 服務；同時整合 Kubernetes 與 GPU 節點，支援 AI/ML 工作負載與多租戶儲存權限管理。',
        technologies: ['Golang', 'Gin', 'Gophercloud', 'OpenStack', 'Kubernetes', 'GPU Node', 'Storage ACL', 'Scrum']
      },
      {
        title: 'DPOM 企業內部訂單管理系統',
        description: '使用 React + Node.js + PostgreSQL 實作企業系統；透過 BullMQ 將資料同步與報表流程改為非同步，提升效能。',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'BullMQ']
      },
      {
        title: 'SPOS 供應鏈計畫最佳化系統',
        description: '負責物料資訊整合、查詢與報表平台功能，包含前端元件、後端 API 及 PostgreSQL 資料查詢設計。',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'REST API', 'Scrum']
      },
      {
        title: '高雄捷運 ERP 與行動 App 開發',
        description: 'ERP 權限模組與工控設備串接、通勤助理 App 開發，涵蓋 Vue.js、Spring、DB2、Xamarin 等技術棧。',
        technologies: ['Vue.js', 'Spring Boot', 'DB2', 'Xamarin', 'MOXA NPort']
      }
    ],
    credentials: [
      {
        title: '在職績效',
        items: ['2025 年 緯創資通年中績效考察：甲等', '2025 年 緯創資通年末績效考察：甲等']
      },
      {
        title: '研究計畫與學術經歷',
        items: [
          '具安全性異質工業物聯網之智慧製造系統場域建置與認證 (2/3)｜MOST 111-2218-E-194-007｜111/06/01 - 112/05/31',
          '具安全性異質工業物聯網之智慧製造系統場域建置與認證 (1/3)｜MOST 110-2218-E-194-010｜110/11/01 - 111/05/31',
          '109 科技部-國家實驗研究院專案計畫｜2020/12/01 - 2021/05/31'
        ]
      },
      {
        title: '學歷',
        items: [
          '國立勤益科技大學 資訊工程系 學士（2020）',
          '國立勤益科技大學 資訊工程所 碩士（2022）'
        ]
      },
      {
        title: '競賽與活動',
        items: [
          '2019 ZERO HUNGER 黑客松 技職盃全國大賽 中區賽 佳作',
          '2019 ZERO HUNGER 黑客松 技職盃全國大賽 全國賽 最佳簡報獎',
          '108 學年度「資通訊在智慧機械產業之應用營」Java/Android App 基礎課程 助教',
          '108 學年度「Python 微學分程式設計課程」助教',
          '110/111 學年度「程式設計與實習」課程 助教',
          '110 學年度高教深耕磨課師計畫「農業物聯網感測數據資料搜集應用與實作」課程 助教',
          '110 學年度 國立勤益科大電資學院院專題研究所組 佳作',
          '2021 ZERO HUNGER 黑客松 技職盃全國大賽 中區賽 評審團大獎',
          '2021 計算機多媒體綜合能力與人工智慧素養及商務專業應用大賽 全國賽 CIW 大數據分析師組 冠軍',
          '2021 計算機多媒體綜合能力與人工智慧素養及商務專業應用大賽 中區賽 CIW 大數據分析師組 冠軍',
          '2021 計算機多媒體綜合能力與人工智慧素養及商務專業應用大賽 中區賽 AIL 人工智慧素養組 冠軍',
          '2021 專業英(日)文詞彙與聽力能力大賽 中區賽 ICT 組 亞軍',
          '2021 教育部智慧創新跨域跨校專題研究成果聯合競賽 潛力無限獎（門禁防疫監控系統）',
          '2022（第十屆）全國計算機多媒體綜合能力與人工智能素養及商務專業應用大賽 中區賽 AIL 組 冠軍',
          '2022（第十屆）全國計算機多媒體綜合能力與人工智能素養及商務專業應用大賽 全國賽 AIL 組 季軍',
          '2022 ZERO HUNGER 黑客松 技職盃全國大賽 中區分區賽 入選',
          'AERC 2022 亞洲智慧型機器人大賽 機器人障礙挑戰大專 C 組 佳作',
          '2022 第五屆臺中市英文菁英盃（人工智慧組）季軍'
        ]
      },
      {
        title: '學術研討會文章著作',
        items: [
          '2021：一種基於電腦視覺特徵檢測之人臉圖像去識別化技術（AII2021）',
          '2021：一種低延遲的非接觸式人機互動方法（ITAOI2021）',
          '2022：一種非同質化代幣應用於房屋租賃契約平台（AII2022）',
          '2022：一種非同質化代幣技術應用於會員社群平台（ILT2022）'
        ]
      },
      {
        title: '論文與專題',
        items: [
          '碩士論文：一種針對自駕車於通信網路攻擊的入侵檢測系統（https://hdl.handle.net/11296/x3tn93）',
          '大學專題：基於機器學習以單鏡頭辨識活體人臉系統'
        ]
      },
      {
        title: '其他',
        items: [
          '習慣使用 Git 進行版本控制與團隊協作。',
          '具企業內部專案協作經驗，能與 PM、RD、Infra 團隊合作推進專案。'
        ]
      }
    ],
    contactMethods: [
      { label: 'Email', value: 'fantasybluz@gmail.com', href: 'mailto:fantasybluz@gmail.com' }
    ],
    socials: [
      {
        name: 'instagram',
        url: 'https://www.instagram.com/fantasybluzz/'
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/yung-hung-lan-556575146/'
      },
      {
        name: 'Bluz Computer Studio',
        url: 'https://www.instagram.com/bluz_computer_studio/'
      }
    ]
  },
  en: {
    nav: {
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      credentials: 'Resume',
      contact: 'Contact'
    },
    mobileMenuOpenLabel: 'Open menu',
    mobileMenuCloseLabel: 'Close menu',
    languageLabel: 'Switch language',
    seo: {
      title: 'Bluz Lan | Software Engineer Portfolio',
      description:
        'Software Engineer portfolio of Bluz Lan, focused on backend, frontend, cloud, DevOps, and ML with hands-on OpenStack, Kubernetes, and GPU platform integration.',
      ogLocale: 'en_US'
    },
    hero: {
      greeting: 'Hi, I am',
      name: 'Bluz',
      detailLine: '"Simple can be harder than complex." — Steve Jobs'
    },
    about: {
      title: 'About Me',
      imageAlt: 'Bluz Lan',
      paragraphs: [
        'I am Bluz Lan, a software engineer with hands-on experience across backend, frontend, cloud platform engineering, DevOps, and ML-related work.',
        'I currently work on Wistron Chthonia/AIDC initiatives focused on OpenStack, Kubernetes, GPU node onboarding, and storage access control.',
        'I am also actively researching and prototyping AI Agent solutions, with a focus on workflow automation, multi-step task collaboration, and practical use cases.'
      ]
    },
    summaryTitle: 'Professional Summary',
    summaryBullets: [
      'Cross-domain experience in backend, frontend, cloud infrastructure, DevOps, and ML workflows.',
      'Delivered Wistron AIDC initiatives across OpenStack, Kubernetes, GPU node setup, and storage permission design.',
      'Built and maintained enterprise systems (DPOM, SPOS), mobile applications, ERP modules, and research projects in smart manufacturing / IIoT.',
      'Strong Scrum execution experience: sprint planning, daily stand-ups, reviews, and retrospectives.'
    ],
    experienceTitle: 'Work Experience',
    skillsTitle: 'Skills',
    projectsTitle: 'Projects',
    credentialsTitle: 'Resume Highlights',
    contact: {
      title: 'Contact Me',
      subtitle: 'Reach out using the methods below'
    },
    footer: '© 2026 BLUZ TECH. All rights reserved.',
    experiences: [
      {
        title: 'Software Development Engineer',
        company: 'Wistron · Chthonia / AIDC Team',
        employmentType: 'Full-time',
        segments: [
          {
            period: 'Sep 2025 - Present',
            bullets: [
              'Developed a Go/Gin middleware API layer integrating OpenStack (Keystone, Ironic, Nova) to provide unified multi-cluster management APIs.',
              'Built a Next.js + TypeScript frontend monorepo (Turborepo + pnpm) for both the Admin Portal and Service Portal.',
              'Implemented a WebSocket BMC console (VNC/Serial) for real-time remote bare-metal operations and troubleshooting.',
              'Designed a GitHub Actions CI/CD pipeline covering linting, unit tests, E2E tests, security scanning, multi-arch Docker builds, and Helm-based GitOps deployments.'
            ]
          }
        ]
      },
      {
        title: 'Software Development Engineer · DPOM',
        company: 'Wistron',
        employmentType: 'Full-time',
        segments: [
          {
            period: 'Dec 2024 - Sep 2025',
            bullets: [
              'Developed and maintained an internal digital purchasing/order management platform.',
              'Built React + TypeScript frontend features and Node.js + TypeScript backend APIs.',
              'Designed and optimized PostgreSQL schemas, queries, and indexes for orders, transactions, and reporting.',
              'Implemented role-based permissions and page-level access control.',
              'Introduced BullMQ-based asynchronous processing to improve synchronization and report-generation performance.'
            ]
          }
        ]
      },
      {
        title: 'Software Development Engineer · SPOS',
        company: 'Wistron',
        employmentType: 'Full-time',
        segments: [
          {
            period: 'Aug 2024 - Dec 2025',
            bullets: [
              'Contributed to the development of the Supply Planning Optimization Solution (SPOS).',
              'Built features for material data query, integration, and automated reporting.',
              'Implemented frontend modules in React + TypeScript and backend APIs in Node.js + TypeScript.',
              'Used PostgreSQL for transaction and reporting workloads.',
              'Delivered features through Scrum-based iterative development.'
            ]
          }
        ]
      },
      {
        title: 'Engineer',
        company: 'Kaohsiung Rapid Transit Corporation',
        employmentType: 'Full-time',
        segments: [
          {
            period: 'Jul 2023 - Aug 2024 · 1 yr 2 mos',
            bullets: [
              'Developed ERP access-control modules with Vue.js frontend and Java Spring MVC / Spring Boot backend on DB2.',
              'Integrated MOXA NPort serial device servers with existing systems.',
              'Contributed to the Kaohsiung Metro Commuter Assistant app using Xamarin (.NET Framework).',
              'Implemented OCR use cases and data processing workflows (pandas / NumPy) for internal operational scenarios.'
            ]
          }
        ]
      }
    ],
    skills: [
      {
        category: 'Languages and Core Skills',
        items: ['JavaScript', 'TypeScript', 'Golang (Go)', 'Python', 'Java', 'C#', 'SQL']
      },
      {
        category: 'Backend Development',
        items: ['Node.js (TypeScript)', 'Express.js', 'Golang + Gin API development', 'Gophercloud (OpenStack SDK) integration', 'RESTful APIs', 'Java Spring MVC / Spring Boot', 'Django / Flask']
      },
      {
        category: 'Frontend Development',
        items: ['React (TypeScript)', 'Vue.js', 'Xamarin (.NET Framework)', 'Enterprise UI development']
      },
      {
        category: 'Cloud, Container, and DevOps',
        items: ['Docker', 'Kubernetes', 'OpenStack', 'Azure DevOps Pipeline', 'GitLab CI/CD', 'GPU Node Management']
      },
      {
        category: 'Database',
        items: ['PostgreSQL', 'MySQL', 'MariaDB', 'MS-SQL', 'DB2', 'Schema and Index Optimization']
      },
      {
        category: 'ML and Data',
        items: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'paddleOCR']
      }
    ],
    projects: [
      {
        title: 'Chthonia',
        description: 'Built APIs with Golang and Gin, integrated OpenStack services via Gophercloud, and combined Kubernetes with GPU nodes to support internal AI/ML workloads with tenant-aware storage access control.',
        technologies: ['Golang', 'Gin', 'Gophercloud', 'OpenStack', 'Kubernetes', 'GPU', 'Storage ACL', 'Scrum']
      },
      {
        title: 'DPOM Enterprise System',
        description: 'Built React/Node/PostgreSQL workflows and improved performance by introducing asynchronous job processing with BullMQ.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'BullMQ', 'TypeScript']
      },
      {
        title: 'SPOS Supply Planning Platform',
        description: 'Delivered material query/integration/reporting features with React, Node.js, and PostgreSQL in Scrum iterations.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'REST API', 'Scrum']
      },
      {
        title: 'KRTC ERP and Mobile App',
        description: 'Developed ERP modules, integrated industrial serial device servers, and contributed to a commuter mobile app.',
        technologies: ['Vue.js', 'Spring Boot', 'DB2', 'Xamarin', 'MOXA NPort']
      }
    ],
    credentials: [
      {
        title: 'Performance',
        items: ['Wistron Mid-Year Performance 2025: Grade A', 'Wistron Year-End Performance 2025: Grade A']
      },
      {
        title: 'Research Projects',
        items: [
          'MOST 111-2218-E-194-007 (Smart Manufacturing and Secure IIoT) · 2022-06 to 2023-05',
          'MOST 110-2218-E-194-010 (Smart Manufacturing and Secure IIoT) · 2021-11 to 2022-05',
          'National Applied Research Labs project · 2020-12 to 2021-05'
        ]
      },
      {
        title: 'Education',
        items: [
          'B.S., Department of Computer Science and Information Engineering, National Chin-Yi University of Technology (2020)',
          'M.S., Graduate Institute of Computer Science and Information Engineering, National Chin-Yi University of Technology (2022)'
        ]
      },
      {
        title: 'Publications',
        items: [
          'AII 2021: Face-image de-identification based on computer-vision feature detection',
          'ITAOI 2021: A low-latency contactless human-computer interaction approach',
          'AII 2022: NFT-based housing rental contract platform',
          'ILT 2022: NFT technology applied to membership community platform'
        ]
      },
      {
        title: 'Thesis and Projects',
        items: [
          'Master Thesis: Intrusion Detection System for Autonomous Vehicles under Communication Network Attacks',
          'University Project: Single-camera live-face recognition system based on machine learning'
        ]
      }
    ],
    contactMethods: [
      { label: 'Email', value: 'fantasybluz@gmail.com', href: 'mailto:fantasybluz@gmail.com' }
    ],
    socials: [
      {
        name: 'instagram',
        url: 'https://www.instagram.com/fantasybluzz/'
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/yung-hung-lan-556575146/'
      },
      {
        name: 'Bluz Computer Studio',
        url: 'https://www.instagram.com/bluz_computer_studio/'
      }
    ]
  }
}

function setMetaContent(attribute: 'name' | 'property', key: string, value: string) {
  const selector = `meta[${attribute}="${key}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', value)
}

function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('about')
  const content = contentByLocale[locale]
  const navItems: Array<{ id: SectionId; label: string }> = [
    { id: 'about', label: content.nav.about },
    { id: 'experience', label: content.nav.experience },
    { id: 'skills', label: content.nav.skills },
    { id: 'projects', label: content.nav.projects },
    { id: 'credentials', label: content.nav.credentials },
    { id: 'contact', label: content.nav.contact }
  ]

  useEffect(() => {
    const seo = contentByLocale[locale].seo

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale === 'zh' ? 'zh-Hant' : 'en'
    document.title = seo.title

    setMetaContent('name', 'description', seo.description)
    setMetaContent('property', 'og:title', seo.title)
    setMetaContent('property', 'og:description', seo.description)
    setMetaContent('property', 'og:locale', seo.ogLocale)
    setMetaContent('name', 'twitter:title', seo.title)
    setMetaContent('name', 'twitter:description', seo.description)
  }, [locale])

  useEffect(() => {
    const updateNavbarState = () => {
      setIsScrolled(window.scrollY > 12)

      const headerElement = document.querySelector('.header')
      const headerOffset = headerElement instanceof HTMLElement ? headerElement.offsetHeight + 32 : 120

      let currentSection: SectionId = sectionIds[0]

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId)
        if (!section) {
          continue
        }

        if (window.scrollY >= section.offsetTop - headerOffset) {
          currentSection = sectionId
        }
      }

      setActiveSection(currentSection)
    }

    updateNavbarState()

    window.addEventListener('scroll', updateNavbarState, { passive: true })
    window.addEventListener('resize', updateNavbarState)

    return () => {
      window.removeEventListener('scroll', updateNavbarState)
      window.removeEventListener('resize', updateNavbarState)
    }
  }, [])

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    closeMenuOnDesktop()
    window.addEventListener('resize', closeMenuOnDesktop)

    return () => {
      window.removeEventListener('resize', closeMenuOnDesktop)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  const handleNavLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="app">
      {/* Background Geometric Shapes */}
      <div className="geometric-background">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
        <div className="geometric-shape shape-4"></div>
        <div className="geometric-shape shape-5"></div>
        <div className="geometric-shape shape-6"></div>
        <div className="geometric-shape shape-7"></div>
        <div className="geometric-shape shape-8"></div>
        <div className="geometric-shape shape-9"></div>
        <div className="geometric-shape shape-10"></div>
        <div className="tech-grid"></div>
      </div>

      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="navbar">
          <a href="#about" className="logo-text" onClick={handleNavLinkClick}>
            BLUZ TECH
          </a>

          <button
            type="button"
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMenuOpen ? content.mobileMenuCloseLabel : content.mobileMenuOpenLabel}
            onClick={() => setIsMenuOpen((prevOpen) => !prevOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div id="primary-navigation" className={`nav-right ${isMenuOpen ? 'open' : ''}`}>
            <div className="nav-center">
              <ul className="nav-links">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={activeSection === item.id ? 'active' : ''}
                      aria-current={activeSection === item.id ? 'page' : undefined}
                      onClick={handleNavLinkClick}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="language-switcher" role="group" aria-label={content.languageLabel}>
              <button
                type="button"
                className={`lang-btn ${locale === 'zh' ? 'active' : ''}`}
                onClick={() => {
                  setLocale('zh')
                  setIsMenuOpen(false)
                }}
                aria-pressed={locale === 'zh'}
              >
                中
              </button>
              <span className="lang-divider">/</span>
              <button
                type="button"
                className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
                onClick={() => {
                  setLocale('en')
                  setIsMenuOpen(false)
                }}
                aria-pressed={locale === 'en'}
              >
                EN
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>
              {content.hero.greeting} <strong>{content.hero.name}</strong>
            </h1>
            {content.hero.detailLine ? <p>{content.hero.detailLine}</p> : null}
            <div className="hero-divider"></div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <div className="container">
            <h2>{content.about.title}</h2>
            <div className="about-wrapper">
              <div className="about-image">
                <img src="/Bluz_Lan.jpg" alt={content.about.imageAlt} />
              </div>
              <div className="about-content">
                {content.about.paragraphs.map((paragraph, index) => (
                  <p key={`${locale}-about-${index}`}>{paragraph}</p>
                ))}

                <div className="summary-card">
                  <h3>{content.summaryTitle}</h3>
                  <ul className="summary-list">
                    {content.summaryBullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="experience">
          <div className="container">
            <h2>{content.experienceTitle}</h2>
            <div className="experience-timeline">
              {content.experiences.map((experience) => (
                <article key={`${experience.company}-${experience.title}`} className="experience-card">
                  <header className="experience-header">
                    <div>
                      <h3>{experience.title}</h3>
                      <p className="experience-company">{experience.company}</p>
                    </div>
                    <span className="experience-type">{experience.employmentType}</span>
                  </header>

                  <div className="experience-segments">
                    {experience.segments.map((segment) => (
                      <div key={`${experience.company}-${segment.period}`} className="experience-segment">
                        <p className="experience-period">{segment.period}</p>
                        <ul className="experience-bullets">
                          {segment.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills">
          <div className="container">
            <h2>{content.skillsTitle}</h2>
            <div className="skills-grid">
              {content.skills.map((skillGroup) => (
                <div key={skillGroup.category} className="skill-card">
                  <h3>{skillGroup.category}</h3>
                  <ul>
                    {skillGroup.items.map((item) => (
                      <li key={item}>
                        <span className="skill-dot"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects">
          <div className="container">
            <h2>{content.projectsTitle}</h2>
            <div className="projects-grid">
              {content.projects.map((project) => (
                <div key={project.title} className="project-card">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <div className="project-accent"></div>
                  </div>
                  <p>{project.description}</p>
                  <div className="technologies">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials Section */}
        <section id="credentials" className="credentials">
          <div className="container">
            <h2>{content.credentialsTitle}</h2>
            <div className="credentials-grid">
              {content.credentials.map((group) => (
                <article key={group.title} className="credential-card">
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <div className="container">
            <h2>{content.contact.title}</h2>
            <p className="contact-subtitle">{content.contact.subtitle}</p>
            <div className="contact-methods">
              {content.contactMethods.map((method) => (
                <a key={method.label} href={method.href} className="contact-method">
                  <span className="contact-method-label">{method.label}</span>
                  <span className="contact-method-value">{method.value}</span>
                </a>
              ))}
            </div>
            <div className="contact-links">
              {content.socials.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-divider"></div>
        <p>{content.footer}</p>
      </footer>
    </div>
  )
}

export default App
