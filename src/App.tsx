import { useEffect, useState } from 'react'
import './App.css'

type Locale = 'zh' | 'en'
const sectionIds = ['about', 'skills', 'projects', 'contact'] as const
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

interface SocialLink {
  name: string
  url: string
  icon: string
}

interface PageContent {
  nav: {
    about: string
    skills: string
    projects: string
    contact: string
  }
  mobileMenuOpenLabel: string
  mobileMenuCloseLabel: string
  languageLabel: string
  hero: {
    greeting: string
    name: string
    roleLine: string
    detailLine: string
  }
  about: {
    title: string
    imageAlt: string
    paragraphs: string[]
  }
  skillsTitle: string
  projectsTitle: string
  contact: {
    title: string
    subtitle: string
  }
  footer: string
  skills: SkillItem[]
  projects: Project[]
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
      skills: '技能',
      projects: '項目',
      contact: '聯繫'
    },
    mobileMenuOpenLabel: '開啟選單',
    mobileMenuCloseLabel: '關閉選單',
    languageLabel: '切換語言',
    hero: {
      greeting: 'Hi 我是',
      name: 'Bluz',
      roleLine: '全端軟體工程師 × 雲端基礎設施 × 硬體客製專家',
      detailLine: '3+ 年實戰經驗 | 從後端邏輯到前端頁面，從容器編排到硬體優化'
    },
    about: {
      title: '關於我',
      imageAlt: 'Bluz Lan',
      paragraphs: [
        '我是 Bluz Lan，一名擁有 3 年以上軟體工程經驗的全棧開發工程師。專長於後端系統設計（Node.js/TypeScript、Java Spring、Python）、企業級前端應用（React、Vue.js）、以及雲端基礎設施（Docker、Kubernetes）。',
        '熟悉多種關聯式資料庫（PostgreSQL、MySQL、MS-SQL、DB2）的架構設計與性能優化。擁有敏捷開發經驗，了解 Git 工作流與完整的 Code Review 流程。',
        '透過 Bluz Computer Studio，我進一步延伸技能至硬體領域，提供高性能客製化主機設計與系統優化服務。'
      ]
    },
    skillsTitle: '技能',
    projectsTitle: '項目',
    contact: {
      title: '聯繫我',
      subtitle: '透過以下方式與我聯繫'
    },
    footer: '© 2026 BLUZ TECH. All rights reserved.',
    skills: [
      {
        category: '後端開發',
        items: ['Node.js / TypeScript', 'Java Spring Boot', 'Spring MVC', 'Python Django/Flask', 'RESTful API']
      },
      {
        category: '前端開發',
        items: ['React (TypeScript)', 'Vue.js', '企業級 Web 應用', 'HTML5', 'CSS3']
      },
      {
        category: '資料庫',
        items: ['PostgreSQL', 'MySQL', 'MariaDB', 'MS-SQL', 'DB2', 'Schema 設計', '性能優化']
      },
      {
        category: '雲端與基礎設施',
        items: ['Docker', 'Kubernetes', '容器編排', '基礎設施自動化', '微服務架構']
      },
      {
        category: '工作流程',
        items: ['Git 工作流', 'Code Review', 'Scrum/Agile', 'CI/CD Pipeline', 'DevOps']
      },
      {
        category: '硬體客製化',
        items: ['系統組裝', '硬體優化', 'BIOS 調整', '效能測試', '客製配置']
      }
    ],
    projects: [
      {
        title: '企業級全棧應用',
        description: '使用 React + TypeScript 前端，搭配 Node.js / Java Spring Boot 後端與 PostgreSQL 資料庫，完成企業應用開發與部署。',
        technologies: ['React', 'TypeScript', 'Node.js', 'Spring Boot', 'PostgreSQL']
      },
      {
        title: '微服務與容器化',
        description: '基於 Kubernetes 和 Docker 的微服務架構設計與實作，支援自動化部署與彈性擴展。',
        technologies: ['Kubernetes', 'Docker', 'Microservices', 'CI/CD']
      },
      {
        title: '多資料庫整合',
        description: '整合 MySQL、MS-SQL、DB2 等關聯式資料庫，提供跨資料庫架構設計與性能優化方案。',
        technologies: ['MySQL', 'MS-SQL', 'DB2', 'Schema Design', 'Performance Tuning']
      },
      {
        title: 'Bluz Computer Studio',
        description: '專業電腦硬體客製與組裝服務，提供高性能系統設計、硬體優化與售後支援。',
        technologies: ['硬體設計', '系統優化', '性能測試']
      }
    ],
    socials: [
      {
        name: '個人 Instagram',
        url: 'https://www.instagram.com/fantasybluzz/',
        icon: '📸'
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/yung-hung-lan-556575146/',
        icon: '💼'
      },
      {
        name: 'Bluz 電腦工作室',
        url: 'https://www.instagram.com/bluz_computer_studio/',
        icon: '🖥️'
      }
    ]
  },
  en: {
    nav: {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact'
    },
    mobileMenuOpenLabel: 'Open menu',
    mobileMenuCloseLabel: 'Close menu',
    languageLabel: 'Switch language',
    hero: {
      greeting: "Hi, I'm",
      name: 'Bluz',
      roleLine: 'Full-Stack Software Engineer × Cloud Infrastructure × Custom PC Specialist',
      detailLine: '3+ years of hands-on experience | From backend logic to frontend interfaces, from container orchestration to hardware optimization'
    },
    about: {
      title: 'About Me',
      imageAlt: 'Bluz Lan',
      paragraphs: [
        'I am Bluz Lan, a full-stack engineer with over 3 years of software engineering experience. I focus on backend system design (Node.js/TypeScript, Java Spring, Python), enterprise web applications (React, Vue.js), and cloud infrastructure (Docker, Kubernetes).',
        'I have experience with multiple relational databases, including PostgreSQL, MySQL, MS-SQL, and DB2, from schema design to performance tuning. I also work in Agile teams with solid Git workflows and code review practices.',
        'Through Bluz Computer Studio, I extend my expertise to hardware services, delivering high-performance custom PC design and system optimization.'
      ]
    },
    skillsTitle: 'Skills',
    projectsTitle: 'Projects',
    contact: {
      title: 'Contact Me',
      subtitle: 'Reach out through the channels below'
    },
    footer: '© 2026 BLUZ TECH. All rights reserved.',
    skills: [
      {
        category: 'Backend Development',
        items: ['Node.js / TypeScript', 'Java Spring Boot', 'Spring MVC', 'Python Django/Flask', 'RESTful API']
      },
      {
        category: 'Frontend Development',
        items: ['React (TypeScript)', 'Vue.js', 'Enterprise Web Apps', 'HTML5', 'CSS3']
      },
      {
        category: 'Databases',
        items: ['PostgreSQL', 'MySQL', 'MariaDB', 'MS-SQL', 'DB2', 'Schema Design', 'Performance Tuning']
      },
      {
        category: 'Cloud & Infrastructure',
        items: ['Docker', 'Kubernetes', 'Container Orchestration', 'Infrastructure Automation', 'Microservices']
      },
      {
        category: 'Workflow',
        items: ['Git Workflow', 'Code Review', 'Scrum/Agile', 'CI/CD Pipeline', 'DevOps']
      },
      {
        category: 'Hardware Customization',
        items: ['System Assembly', 'Hardware Optimization', 'BIOS Tuning', 'Performance Testing', 'Custom Build Planning']
      }
    ],
    projects: [
      {
        title: 'Enterprise Full-Stack Application',
        description: 'Developed and deployed an enterprise application with a React + TypeScript frontend, Node.js / Java Spring Boot backend, and PostgreSQL database.',
        technologies: ['React', 'TypeScript', 'Node.js', 'Spring Boot', 'PostgreSQL']
      },
      {
        title: 'Microservices and Containerization',
        description: 'Designed and implemented a Kubernetes and Docker based microservices architecture with automated deployment and horizontal scalability.',
        technologies: ['Kubernetes', 'Docker', 'Microservices', 'CI/CD']
      },
      {
        title: 'Multi-Database Integration',
        description: 'Built solutions across MySQL, MS-SQL, and DB2 with a focus on schema planning, integration strategy, and performance optimization.',
        technologies: ['MySQL', 'MS-SQL', 'DB2', 'Schema Design', 'Performance Tuning']
      },
      {
        title: 'Bluz Computer Studio',
        description: 'Professional custom PC services with high-performance system design, hardware optimization, and long-term support.',
        technologies: ['Hardware Design', 'System Optimization', 'Performance Testing']
      }
    ],
    socials: [
      {
        name: 'Personal Instagram',
        url: 'https://www.instagram.com/fantasybluzz/',
        icon: '📸'
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/yung-hung-lan-556575146/',
        icon: '💼'
      },
      {
        name: 'Bluz Computer Studio',
        url: 'https://www.instagram.com/bluz_computer_studio/',
        icon: '🖥️'
      }
    ]
  }
}

function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('about')
  const content = contentByLocale[locale]
  const navItems: Array<{ id: SectionId; label: string }> = [
    { id: 'about', label: content.nav.about },
    { id: 'skills', label: content.nav.skills },
    { id: 'projects', label: content.nav.projects },
    { id: 'contact', label: content.nav.contact }
  ]

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale === 'zh' ? 'zh-Hant' : 'en'
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
          <h1 className="logo-text">BLUZ TECH</h1>

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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>
            {content.hero.greeting} <strong>{content.hero.name}</strong>
          </h2>
          <p>
            {content.hero.roleLine}
            <br />
            {content.hero.detailLine}
          </p>
          <div className="hero-divider"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2>{content.about.title}</h2>
          <div className="about-wrapper">
            <div className="about-image">
              <img src="/Bluz_Lan.jpeg" alt={content.about.imageAlt} />
            </div>
            <div className="about-content">
              {content.about.paragraphs.map((paragraph, index) => (
                <p key={`${locale}-about-${index}`}>{paragraph}</p>
              ))}
            </div>
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

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>{content.contact.title}</h2>
          <p className="contact-subtitle">{content.contact.subtitle}</p>
          <div className="contact-links">
            {content.socials.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="contact-link">
                <span className="contact-icon" aria-hidden="true">{social.icon}</span>
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-divider"></div>
        <p>{content.footer}</p>
      </footer>
    </div>
  )
}

export default App
