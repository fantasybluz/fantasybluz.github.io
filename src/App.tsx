import { useEffect, useState } from 'react'
import './App.css'
import Changelog from './Changelog.tsx'
import { APP_VERSION, changelogTextByLocale } from './changelog.ts'
import { getPageSeo, localePaths, pagePaths, type Locale, type Page } from './locale.ts'

const sectionIds = ['about', 'experience', 'skills', 'projects', 'side-projects', 'credentials', 'contact'] as const
type SectionId = (typeof sectionIds)[number]

interface SkillItem {
  category: string
  items: string[]
}

interface Project {
  title: string
  description: string
  technologies: string[]
}

interface ProjectLink {
  label: string
  url: string
}

interface Screenshot {
  src: string
  alt: string
}

interface SideProject extends Project {
  // Screenshots live in public/screenshots/<slug>/
  slug: string
  tagline: string
  highlights: string[]
  screenshots: Screenshot[]
  links?: ProjectLink[]
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

interface PageContent {
  nav: {
    about: string
    experience: string
    skills: string
    projects: string
    sideProjects: string
    credentials: string
    contact: string
  }
  mobileMenuOpenLabel: string
  mobileMenuCloseLabel: string
  languageLabel: string
  hero: {
    greeting: string
    name: string
    detailLine: string
    primaryCta: string
    secondaryCta: string
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
  sideProjectsTitle: string
  credentialsTitle: string
  contact: {
    title: string
    subtitle: string
  }
  footer: string
  experiences: Experience[]
  skills: SkillItem[]
  projects: Project[]
  sideProjects: SideProject[]
  credentials: CredentialGroup[]
  contactMethods: ContactMethod[]
  socials: SocialLink[]
}

const contentByLocale: Record<Locale, PageContent> = {
  zh: {
    nav: {
      about: '關於',
      experience: '經歷',
      skills: '技能',
      projects: '專案',
      sideProjects: '個人專案',
      credentials: '履歷',
      contact: '聯絡'
    },
    mobileMenuOpenLabel: '開啟選單',
    mobileMenuCloseLabel: '關閉選單',
    languageLabel: '切換語言',
    hero: {
      greeting: 'Hi, 我是',
      name: 'Bluz',
      detailLine: '「簡單，往往比複雜更難做到。」— Steve Jobs',
      primaryCta: '聯絡我',
      secondaryCta: '看看作品'
    },
    about: {
      title: '關於我',
      imageAlt: '藍詠弘 Bluz Lan 個人照片',
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
    sideProjectsTitle: '個人專案',
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
        items: ['Node.js（TypeScript）', 'Express.js（Node.js Framework）', 'Golang + Gin API 開發', 'Gophercloud（OpenStack SDK）整合', 'RESTful API 設計與實作', 'WebSocket 即時連線', 'BullMQ 非同步任務佇列', 'FastAPI', 'Java Spring Web MVC / Spring Boot', 'Django / Flask 基本 Web 服務']
      },
      {
        category: '前端開發',
        items: ['React（TypeScript）', 'Next.js', 'Turborepo + pnpm Monorepo', 'Tailwind CSS', 'Vue.js', 'Xamarin（.NET Framework）', '企業內部系統 UI / 表單 / 權限頁面開發']
      },
      {
        category: '雲端、容器與 DevOps',
        items: ['Docker / Podman', 'Kubernetes', 'Kubernetes Operator（Kubebuilder）', 'Helm + GitOps 部署', 'OpenStack', 'GitHub Actions', 'Azure DevOps Pipeline', 'GitLab CI/CD', 'Multi-arch 容器映像建置', 'GPU Node 納管與資源管理', 'Tailscale']
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
        category: 'AI / LLM 應用',
        items: ['Ollama / llama.cpp / MLX 本機推論', 'RAG 檢索增強生成', 'Embedding 語意搜尋（pgvector）', 'MCP（Model Context Protocol）Server', 'diffusers（FLUX.1 / SDXL）', 'LLM 評測（MMLU / GSM8K）']
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
    sideProjects: [
      {
        title: '摳摳 CoCo',
        slug: 'trip-ledger',
        tagline: '旅遊與日常分帳 App',
        description: '出國旅行、室友、朋友各自用手機記帳，自動換成台幣、算出誰該給誰多少，最後一次結清。用 LINE 登入，邀請連結傳到群組就能加入；前後端一起部署在 Cloudflare Workers，已正式上線。',
        highlights: [
          '每筆花費以消費當天的匯率換成台幣（預設國際匯率，結算前可貼上台銀匯率）；可平分、依份數、指定金額，或只跟其中幾個人分。',
          '結算以最少的轉帳次數算出誰該給誰，可把家庭、情侶合成一戶計算並記錄還款；有人還沒還清就不能刪帳本。',
          '首頁一次看所有帳本的欠款、花費類別與每月趨勢；帳本裡的動態紀錄寫出誰新增、修改、刪除了哪一筆；在國外沒訊號也能先記，有網路再自動上傳。',
          '每個邀請、結算連結都有自己的分享縮圖（Canvas 畫好存到 R2）；手機、平板、電腦各有版面，可加到 iPhone / Android 主畫面當 App 開。',
          'LINE Login（OpenID Connect + PKCE），資料庫只存 session token 的雜湊、可登出所有裝置；搭配 Rate Limiting、CSP 與安全標頭。'
        ],
        technologies: ['React', 'TypeScript', 'Vite', 'Cloudflare Workers', 'D1', 'R2', 'LINE Login', 'OpenID Connect', 'Canvas', 'PWA', 'Vitest'],
        screenshots: [
          { src: '/screenshots/trip-ledger/home.jpg', alt: '摳摳 CoCo 電腦版首頁：欠款、花費類別圓餅圖與每月花費' },
          { src: '/screenshots/trip-ledger/ledger.jpg', alt: '摳摳 CoCo 旅行帳本：每天的花費與換算後的台幣' }
        ],
        links: [{ label: '網站', url: 'https://trip-ledger.fantasybluz.workers.dev' }]
      },
      {
        title: '零售管理系統',
        slug: 'retail-system',
        tagline: '報價、訂單、庫存與營收一站式管理',
        description: '串起報價、成交追蹤、出庫、出貨前檢測到營收統計的完整零售流程，部署在自架主機並實際上線營運。',
        highlights: [
          '報價單支援組新機、中古機、筆電與維修保養四種單別，可即時預覽並匯出 PDF / JPG。',
          '庫存含進出庫與盤點紀錄、攤平成本與安全庫存示警；訂單進入組裝階段時自動扣庫存。',
          '營收總覽依月 / 年統計營收與利潤，並分析客源與地區；客戶主檔依累計消費自動分級。',
          '管理者 / 員工角色權限與 Passkey（Touch ID / Face ID）登入；推上 master 即由 self-hosted runner 自動部署。'
        ],
        technologies: ['Go', 'Gin', 'GORM', 'PostgreSQL', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Podman', 'Kubernetes', 'Tailscale', 'GitHub Actions'],
        screenshots: []
      },
      {
        title: 'mneme',
        slug: 'mneme',
        tagline: '結合本機 LLM 與 AI Agent 的個人知識庫',
        description: '像 Notion 的筆記、資料庫、待辦與日記系統，部署在自架主機：平常透過 Tailscale 連線，在外面則經 Cloudflare Tunnel 登入。語意搜尋與問答都由本機模型處理，筆記內容不會送到外面。',
        highlights: [
          '語意搜尋：以 Ollama bge-m3 產生向量、存進 PostgreSQL pgvector，用詞不同也找得到；中文關鍵字搜尋使用 pg_trgm。',
          '問 mneme（RAG）：用一句話問自己的筆記，挑出最相關的段落交給本機 LLM 回答，並以 [1]、[2] 標出引用來源。',
          'MCP Server：讓 Claude Code 搜尋、讀取筆記並寫入工作日誌與開發紀錄；只開放指定分類，只能查詢與新增。',
          '區塊編輯器、巢狀頁面、資料庫（表格 / 看板 / 行事曆）與版本紀錄，並與 Google 行事曆雙向同步。',
          '外網連線：Cloudflare Tunnel 不用開任何對外的埠，Cloudflare Access 只放行指定的 email；後端再自己驗一次 Access 的 JWT（RS256 簽章、發行者、AUD、效期、email 白名單），MCP 仍只開放在 Tailscale。'
        ],
        technologies: ['Go', 'Gin', 'PostgreSQL', 'pgvector', 'Ollama', 'RAG', 'MCP', 'React', 'TypeScript', 'Tailwind CSS', 'Podman', 'Tailscale', 'Cloudflare Tunnel', 'Cloudflare Access'],
        screenshots: []
      },
      {
        title: 'llm-operator',
        slug: 'llm-operator',
        tagline: '在 Kubernetes 上部署本機 LLM 的 Operator',
        description: '用一個 LLMService 自訂資源描述要跑的模型，Operator 就會下載模型、啟動推論伺服器，並在叢集內提供 OpenAI 相容的 API。',
        highlights: [
          '支援 Ollama 與 llama.cpp 兩種推論引擎，對外都是同一個 Service 埠與 OpenAI 相容的 /v1 路徑。',
          '以 StatefulSet 為每個副本配置獨立的模型快取 PV，模型只下載一次、重啟後保留；換模型時自動滾動更新。',
          'GPU 排程：設定 gpus 即申請 nvidia.com/gpu，llama.cpp 會自動切換 CUDA 映像並將所有層卸載到 GPU。',
          'Status 的 Phase 與 Conditions 說明未就緒原因（模型下載失敗、映像拉不到、沒有可用 GPU）；支援 scale 子資源與 HPA，並以 CEL 在 API 層驗證 spec。'
        ],
        technologies: ['Go', 'Kubebuilder', 'controller-runtime', 'Kubernetes', 'CRD', 'Ollama', 'llama.cpp', 'GPU', 'envtest', 'kind'],
        screenshots: [],
        links: [{ label: 'GitHub', url: 'https://github.com/fantasybluz/llm-operator' }]
      },
      {
        title: 'llm-bench',
        slug: 'llm-bench',
        tagline: '本機 LLM 速度與能力評測工具',
        description: '用同一套方法比較同一個模型在 Ollama、llama.cpp、MLX 三種推論引擎上的表現，產生互動式網頁報表與 PDF，並保留每次結果以便跨次比較。',
        highlights: [
          '速度指標：首個 token 時間（TTFT）、輸出與讀入 prompt 速度、載入時間與記憶體峰值。',
          '能力評測：MMLU（57 科）與 GSM8K，溫度 0、固定 seed，逐題保留回答以檢查誤判。',
          '只用 Python 標準函式庫，題庫下載後以 sha256 驗證來源。',
          'ECharts 報表含可篩選排序的總表、速度 vs 正確率散佈圖與歷次比較。'
        ],
        technologies: ['Python', 'Ollama', 'llama.cpp', 'MLX', 'ECharts', 'MMLU', 'GSM8K'],
        screenshots: []
      },
      {
        title: 'Atum',
        slug: 'atum',
        tagline: '本機 AI 生圖網頁應用',
        description: '在自己的電腦上用瀏覽器生圖，支援 FLUX.1-dev（NF4 量化）與 WAI Illustrious SDXL，圖片全程在本機產生，不會上傳任何資料。',
        highlights: [
          '前後端分離：FastAPI 後端、React + TypeScript 前端，支援生圖佇列、即時進度與預估剩餘時間。',
          '自動偵測硬體：Apple Silicon（MPS）與 NVIDIA 顯卡（CUDA），支援 macOS、Windows、Linux。',
          '一鍵安裝與線上更新（更新前自動備份、失敗自動還原），並提供 amd64 / arm64 容器映像檔。',
          '提示詞組合器與可自訂詞庫，生成前進行內容安全檢查。'
        ],
        technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'PyTorch', 'diffusers', 'FLUX.1', 'SDXL', 'Docker'],
        screenshots: []
      },
      {
        title: '超商調酒拉霸機',
        slug: 'cocktail-party',
        tagline: '像素風的聚會喝酒小工具',
        description: '拉一下拉霸機，用超商買得到的酒和飲料轉出一杯調酒；再加上一支手機就能大家輪流玩的喝酒遊戲。純前端靜態網站，放在 Cloudflare Pages，貼到 LINE 群組就能直接開。',
        highlights: [
          '三個轉輪（基酒、材料一、材料二）轉出 27 種現成酒譜，附比例、口感與估算的酒感、甜度、氣泡；可鎖定家裡有的酒，只轉那支酒的酒譜。',
          '惡魔開關：機台變暗紅色，只轉出高濃度組合（約 19～26%），每杯寫出容易醉的原因。',
          '20 種喝酒遊戲加 2 個聚會工具，輸了可以直接去轉拉霸機，或記到喝酒記分板，最後出派對結算。',
          '依人數算出「買最少、能做最多杯」的採買清單；GoatCounter 計算來訪人數，不用 cookie。'
        ],
        technologies: ['React', 'TypeScript', 'Vite', 'Canvas', 'Cloudflare Pages', 'GitHub Actions', 'Vitest'],
        screenshots: [{ src: '/screenshots/cocktail-party/slot.jpg', alt: '超商調酒拉霸機：三個轉輪、拉桿與惡魔開關' }],
        links: [
          { label: '網站', url: 'https://drunk.bluz.dev' },
          { label: 'GitHub', url: 'https://github.com/fantasybluz/cocktail-party' }
        ]
      },
      {
        title: '台灣隨機旅行',
        slug: 'taiwan-random-trip',
        tagline: '搭火車的隨機旅行轉盤',
        description: '分三層轉：地區、縣市、車站，轉到哪就去哪。有區間車（240 站）和自強3000（76 站）兩個版本，車站與班次資料來自台鐵開放資料。',
        highlights: [
          '像素風轉盤以 Canvas 逐像素繪製，轉動時每一幀照新角度重畫，像素永遠是正的；字型用俐方體 11 號。',
          '轉到車站後出一張「車票」：地址、一天大約幾班停，附 Google 地圖與維基百科連結；班次太少會提醒先查回程。',
          '可排除不想去的縣市，轉盤與站數跟著扣掉；只剩一個選項的那層直接選好，不用轉。',
          '腳本從台鐵開放資料抓一週時刻表，算出每站停幾班；用「騰雲座艙」辨識 EMU3000，台鐵改車種代碼時會發出警告。'
        ],
        technologies: ['React', 'TypeScript', 'Vite', 'Canvas', 'Node.js', 'TRA Open Data', 'Vitest'],
        screenshots: [{ src: '/screenshots/taiwan-random-trip/wheel.jpg', alt: '台灣隨機旅行：區間車版本的地區轉盤' }],
        links: [
          { label: '網站', url: 'https://fantasybluz.github.io/taiwan-random-trip/' },
          { label: 'GitHub', url: 'https://github.com/fantasybluz/taiwan-random-trip' }
        ]
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
      sideProjects: 'Side Projects',
      credentials: 'Resume',
      contact: 'Contact'
    },
    mobileMenuOpenLabel: 'Open menu',
    mobileMenuCloseLabel: 'Close menu',
    languageLabel: 'Switch language',
    hero: {
      greeting: 'Hi, I am',
      name: 'Bluz Lan',
      detailLine: '"Simple can be harder than complex." — Steve Jobs',
      primaryCta: 'Get in touch',
      secondaryCta: 'See my work'
    },
    about: {
      title: 'About Me',
      imageAlt: 'Portrait of Bluz Lan',
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
    sideProjectsTitle: 'Side Projects',
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
        items: ['Node.js (TypeScript)', 'Express.js', 'Golang + Gin API development', 'Gophercloud (OpenStack SDK) integration', 'RESTful APIs', 'WebSocket', 'BullMQ job queues', 'FastAPI', 'Java Spring MVC / Spring Boot', 'Django / Flask']
      },
      {
        category: 'Frontend Development',
        items: ['React (TypeScript)', 'Next.js', 'Turborepo + pnpm monorepos', 'Tailwind CSS', 'Vue.js', 'Xamarin (.NET Framework)', 'Enterprise UI development']
      },
      {
        category: 'Cloud, Container, and DevOps',
        items: ['Docker / Podman', 'Kubernetes', 'Kubernetes Operators (Kubebuilder)', 'Helm + GitOps deployment', 'OpenStack', 'GitHub Actions', 'Azure DevOps Pipeline', 'GitLab CI/CD', 'Multi-arch container builds', 'GPU Node Management', 'Tailscale']
      },
      {
        category: 'Database',
        items: ['PostgreSQL', 'MySQL', 'MariaDB', 'MS-SQL', 'DB2', 'Schema and Index Optimization']
      },
      {
        category: 'AI / LLM Applications',
        items: ['Local inference with Ollama / llama.cpp / MLX', 'Retrieval-augmented generation (RAG)', 'Embedding-based semantic search (pgvector)', 'MCP (Model Context Protocol) servers', 'diffusers (FLUX.1 / SDXL)', 'LLM evaluation (MMLU / GSM8K)']
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
    sideProjects: [
      {
        title: 'CoCo',
        slug: 'trip-ledger',
        tagline: 'Expense splitting for trips and everyday life',
        description: 'Friends, roommates, and travel groups each log expenses on their own phones; the app converts everything to TWD, works out who owes whom, and settles up in one go. Sign in with LINE and join from an invite link in the group chat. Frontend and API ship together on Cloudflare Workers and are live in production.',
        highlights: [
          'Each expense is converted at that day\'s exchange rate (market rate by default, or pasted Bank of Taiwan rates before settling); split evenly, by shares, by exact amounts, or among just a few people.',
          'Settlement finds the fewest transfers, can group families and couples into one household, and records repayments; a ledger cannot be deleted while anyone still owes money.',
          'The home page sums up balances, spending by category, and monthly trends across every ledger; an activity feed shows who added, edited, or deleted what; expenses logged offline abroad upload once the phone is back online.',
          'Every invite and settlement link gets its own share image (drawn on Canvas and stored in R2); separate phone, tablet, and desktop layouts, and installable to the iPhone / Android home screen.',
          'LINE Login (OpenID Connect + PKCE) with only session-token hashes stored and sign-out from all devices, plus rate limiting, CSP, and security headers.'
        ],
        technologies: ['React', 'TypeScript', 'Vite', 'Cloudflare Workers', 'D1', 'R2', 'LINE Login', 'OpenID Connect', 'Canvas', 'PWA', 'Vitest'],
        screenshots: [
          { src: '/screenshots/trip-ledger/home.jpg', alt: 'CoCo desktop home: balances, spending by category, and monthly spending' },
          { src: '/screenshots/trip-ledger/ledger.jpg', alt: 'CoCo trip ledger: daily expenses with their TWD amounts' }
        ],
        links: [{ label: 'Live site', url: 'https://trip-ledger.fantasybluz.workers.dev' }]
      },
      {
        title: 'Retail Management System',
        slug: 'retail-system',
        tagline: 'Quotes, orders, inventory, and revenue in one place',
        description: 'Covers the full retail flow from quoting and deal tracking to stock pulls, pre-delivery inspection, and revenue reporting. Self-hosted and used in live daily operations.',
        highlights: [
          'Quotes for new builds, used PCs, laptops, and repairs, with live preview and PDF / JPG export.',
          'Inventory with stock movements, stock-take records, average cost, and low-stock alerts; stock is pulled automatically when an order enters assembly.',
          'Revenue dashboard by month and year with profit, customer-source, and region breakdowns; customers are tiered by lifetime spend.',
          'Admin / staff roles with Passkey (Touch ID / Face ID) sign-in; pushes to master deploy automatically through a self-hosted runner.'
        ],
        technologies: ['Go', 'Gin', 'GORM', 'PostgreSQL', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Podman', 'Kubernetes', 'Tailscale', 'GitHub Actions'],
        screenshots: []
      },
      {
        title: 'mneme',
        slug: 'mneme',
        tagline: 'Personal knowledge base with local LLMs and AI agent access',
        description: 'A Notion-style app for notes, databases, to-dos, and a journal, self-hosted and reached over Tailscale at home and through Cloudflare Tunnel when I am out. Semantic search and Q&A run on local models, so notes never leave the machine.',
        highlights: [
          'Semantic search: Ollama bge-m3 embeddings stored in PostgreSQL pgvector find notes even when the wording differs; pg_trgm handles Chinese keyword search.',
          'Ask mneme (RAG): ask a question in plain language; the most relevant passages go to a local LLM, which answers with [1], [2] citations back to the notes.',
          'MCP server: lets Claude Code search and read notes and append to work logs and dev logs, limited to chosen categories and to read and append only.',
          'Block editor, nested pages, databases (table / board / calendar), version history, and two-way sync with Google Calendar.',
          'Remote access: Cloudflare Tunnel opens no inbound ports and Cloudflare Access admits only listed emails; the backend verifies the Access JWT itself (RS256 signature, issuer, audience, expiry, email allow-list), and MCP stays Tailscale-only.'
        ],
        technologies: ['Go', 'Gin', 'PostgreSQL', 'pgvector', 'Ollama', 'RAG', 'MCP', 'React', 'TypeScript', 'Tailwind CSS', 'Podman', 'Tailscale', 'Cloudflare Tunnel', 'Cloudflare Access'],
        screenshots: []
      },
      {
        title: 'llm-operator',
        slug: 'llm-operator',
        tagline: 'Kubernetes operator for serving local LLMs',
        description: 'Describe a model in one LLMService custom resource; the operator fetches the model, runs the inference server, and exposes an OpenAI-compatible API inside the cluster.',
        highlights: [
          'Two engines, Ollama and llama.cpp, behind the same Service port and OpenAI-compatible /v1 path.',
          'A StatefulSet gives each replica its own model cache volume, so models download once and survive restarts; changing the model rolls the pods.',
          'GPU scheduling: setting gpus requests nvidia.com/gpu, and llama.cpp switches to the CUDA image and offloads every layer to the GPU.',
          'Status phases and conditions explain why a service is not ready (model download, image pull, or no free GPU); supports the scale subresource and HPA, with CEL validation at the API.'
        ],
        technologies: ['Go', 'Kubebuilder', 'controller-runtime', 'Kubernetes', 'CRD', 'Ollama', 'llama.cpp', 'GPU', 'envtest', 'kind'],
        screenshots: [],
        links: [{ label: 'GitHub', url: 'https://github.com/fantasybluz/llm-operator' }]
      },
      {
        title: 'llm-bench',
        slug: 'llm-bench',
        tagline: 'Local LLM speed and capability benchmark',
        description: 'Benchmarks the same model across three inference engines (Ollama, llama.cpp, and MLX) with one consistent method, producing an interactive HTML report and a PDF while keeping every run for comparison.',
        highlights: [
          'Speed: time to first token (TTFT), output and prompt-processing throughput, load time, and peak memory.',
          'Capability: MMLU (57 subjects) and GSM8K at temperature 0 with a fixed seed, keeping every answer for review.',
          'Built on the Python standard library only; datasets are verified by sha256 after download.',
          'ECharts report with a sortable, filterable summary table, speed-vs-accuracy scatter plot, and run history.'
        ],
        technologies: ['Python', 'Ollama', 'llama.cpp', 'MLX', 'ECharts', 'MMLU', 'GSM8K'],
        screenshots: []
      },
      {
        title: 'Atum',
        slug: 'atum',
        tagline: 'Local AI image generation web app',
        description: 'Generates images on your own machine from the browser with FLUX.1-dev (NF4 quantized) and WAI Illustrious SDXL; images never leave the device.',
        highlights: [
          'FastAPI backend and React + TypeScript frontend with a job queue, live progress, and time-remaining estimates.',
          'Detects hardware automatically: Apple Silicon (MPS) and NVIDIA GPUs (CUDA) on macOS, Windows, and Linux.',
          'One-click install and in-app updates with automatic backup and rollback, plus amd64 / arm64 container images.',
          'Prompt builder with an editable tag library and content-safety checks before generation.'
        ],
        technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'PyTorch', 'diffusers', 'FLUX.1', 'SDXL', 'Docker'],
        screenshots: []
      },
      {
        title: 'Convenience Store Cocktail Slots',
        slug: 'cocktail-party',
        tagline: 'Pixel-art drinking game kit for parties',
        description: 'Pull the lever and the slot machine mixes a cocktail from drinks you can buy at any convenience store, alongside party games that everyone plays on one phone. A static frontend on Cloudflare Pages that opens straight from a LINE group chat.',
        highlights: [
          'Three reels (base spirit, mixer, extra) land on 27 ready-made recipes with ratios, flavor notes, and estimated strength, sweetness, and fizz; lock a reel to the bottle you already have.',
          'Devil switch: the machine turns dark red and only spins high-ABV combos (about 19–26%), each with a note on why it hits hard.',
          '20 one-phone drinking games plus 2 party tools; losers can jump straight to the slot machine or log a drink on the scoreboard, which feeds an end-of-party summary.',
          'Shopping lists by group size that buy the fewest items for the most recipes; cookie-free visit counts with GoatCounter.'
        ],
        technologies: ['React', 'TypeScript', 'Vite', 'Canvas', 'Cloudflare Pages', 'GitHub Actions', 'Vitest'],
        screenshots: [{ src: '/screenshots/cocktail-party/slot.jpg', alt: 'Cocktail slot machine with three reels, a lever, and the devil switch' }],
        links: [
          { label: 'Live site', url: 'https://drunk.bluz.dev' },
          { label: 'GitHub', url: 'https://github.com/fantasybluz/cocktail-party' }
        ]
      },
      {
        title: 'Taiwan Random Trip',
        slug: 'taiwan-random-trip',
        tagline: 'Spin the wheel, take the train',
        description: 'Spin three times: region, county, then station, and go wherever it lands. Two versions cover local trains (240 stations) and EMU3000 express trains (76 stations), built from Taiwan Railway open data.',
        highlights: [
          'A pixel-art wheel drawn pixel by pixel on Canvas and redrawn every frame at the new angle, so pixels stay square while it spins; set in the Cubic 11 pixel font.',
          'Landing on a station prints a "ticket" with its address, roughly how many trains stop each day, and Google Maps and Wikipedia links, with a warning to check the way back when service is sparse.',
          'Exclude counties you do not want and the wheels and station counts shrink to match; a level with only one option left is picked automatically.',
          'A script pulls a week of timetables from the open data to count stops per station, spotting EMU3000 services by their premium car and warning when the railway changes its train-type codes.'
        ],
        technologies: ['React', 'TypeScript', 'Vite', 'Canvas', 'Node.js', 'TRA Open Data', 'Vitest'],
        screenshots: [{ src: '/screenshots/taiwan-random-trip/wheel.jpg', alt: 'Taiwan Random Trip: the region wheel for local trains' }],
        links: [
          { label: 'Live site', url: 'https://fantasybluz.github.io/taiwan-random-trip/' },
          { label: 'GitHub', url: 'https://github.com/fantasybluz/taiwan-random-trip' }
        ]
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

interface AppProps {
  locale: Locale
  page?: Page
}

function App({ locale, page = 'home' }: AppProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('about')
  const content = contentByLocale[locale]
  const isHome = page === 'home'
  // On the changelog page the nav jumps back to the home page's sections
  const homeHref = (hash: string) => (isHome ? hash : `${localePaths[locale]}${hash}`)
  const navItems: Array<{ id: SectionId; label: string }> = [
    { id: 'about', label: content.nav.about },
    { id: 'experience', label: content.nav.experience },
    { id: 'skills', label: content.nav.skills },
    { id: 'projects', label: content.nav.projects },
    { id: 'side-projects', label: content.nav.sideProjects },
    { id: 'credentials', label: content.nav.credentials },
    { id: 'contact', label: content.nav.contact }
  ]

  useEffect(() => {
    const seo = getPageSeo(locale, page)

    document.documentElement.lang = seo.htmlLang
    document.title = seo.title

    setMetaContent('name', 'description', seo.description)
    setMetaContent('property', 'og:title', seo.title)
    setMetaContent('property', 'og:description', seo.description)
    setMetaContent('property', 'og:locale', seo.ogLocale)
    setMetaContent('name', 'twitter:title', seo.title)
    setMetaContent('name', 'twitter:description', seo.description)
  }, [locale, page])

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
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="navbar">
          <a href={isHome ? '#about' : localePaths[locale]} className="logo-text" onClick={handleNavLinkClick}>
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
                      href={homeHref(`#${item.id}`)}
                      className={isHome && activeSection === item.id ? 'active' : ''}
                      aria-current={isHome && activeSection === item.id ? 'page' : undefined}
                      onClick={handleNavLinkClick}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="language-switcher" role="group" aria-label={content.languageLabel}>
              <a
                href={pagePaths[page].zh}
                hrefLang="zh-Hant"
                lang="zh-Hant"
                className={`lang-btn ${locale === 'zh' ? 'active' : ''}`}
                aria-current={locale === 'zh' ? 'true' : undefined}
              >
                中
              </a>
              <span className="lang-divider">/</span>
              <a
                href={pagePaths[page].en}
                hrefLang="en"
                lang="en"
                className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
                aria-current={locale === 'en' ? 'true' : undefined}
              >
                EN
              </a>
            </div>
          </div>
        </nav>
      </header>

      {isHome ? (
        <main id="main-content">
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1>
                {content.hero.greeting} <strong>{content.hero.name}</strong>
              </h1>
              {content.hero.detailLine ? <p>{content.hero.detailLine}</p> : null}
              <div className="hero-actions">
                <a href="#contact" className="button-primary">{content.hero.primaryCta}</a>
                <a href="#side-projects" className="button-secondary">{content.hero.secondaryCta}</a>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="about">
            <div className="container">
              <h2>{content.about.title}</h2>
              <div className="about-wrapper">
                <div className="about-image">
                  <img src="/Bluz_Lan.jpg" alt={content.about.imageAlt} width={800} height={800} decoding="async" />
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
                        <li key={item}>{item}</li>
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

          {/* Side Projects Section */}
          <section id="side-projects" className="side-projects">
            <div className="container">
              <h2>{content.sideProjectsTitle}</h2>
              <div className="projects-grid">
                {content.sideProjects.map((project) => (
                  <article key={project.title} className="project-card">
                    <div className="project-header">
                      <h3>{project.title}</h3>
                      <div className="project-accent"></div>
                    </div>
                    <p className="project-tagline">{project.tagline}</p>
                    {project.screenshots.length > 0 ? (
                      <div className="project-screenshots">
                        {project.screenshots.map((screenshot) => (
                          <a key={screenshot.src} href={screenshot.src} target="_blank" rel="noopener noreferrer" className="project-screenshot">
                            <img src={screenshot.src} alt={screenshot.alt} loading="lazy" decoding="async" />
                          </a>
                        ))}
                      </div>
                    ) : import.meta.env.DEV ? (
                      // Dev-only reminder of where this project's screenshots go; hidden in the production build.
                      <div className="project-screenshot-placeholder">public/screenshots/{project.slug}/</div>
                    ) : null}
                    <p className="project-description">{project.description}</p>
                    <ul className="project-highlights">
                      {project.highlights.map((highlight) => (
                        <li key={highlight} className="project-highlight">{highlight}</li>
                      ))}
                    </ul>
                    <div className="technologies">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    {project.links ? (
                      <div className="project-links">
                        {project.links.map((link) => (
                          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="project-link">
                            {link.label} <span aria-hidden="true">↗</span>
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </article>
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
                  <a key={social.name} href={social.url} target="_blank" rel="me noopener noreferrer" className="contact-link">
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </main>
      ) : (
        <Changelog locale={locale} />
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-divider"></div>
        <div className="footer-inner">
          <p>{content.footer}</p>
          <a
            className="footer-version"
            href={pagePaths.changelog[locale]}
            aria-current={page === 'changelog' ? 'page' : undefined}
          >
            {`v${APP_VERSION} · ${changelogTextByLocale[locale].link}`}
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
