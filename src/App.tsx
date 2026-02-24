import './App.css'

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

function App() {
  const skills: SkillItem[] = [
    {
      category: '後端開發',
      items: ['Node.js / TypeScript', 'Java Spring Boot', 'Spring MVC', 'Python Django/Flask', 'RESTful API']
    },
    {
      category: '前端開發',
      items: ['React (TypeScript)', 'Vue.js', '企業級Web應用', 'HTML5', 'CSS3']
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
  ]

  const projects: Project[] = [
    {
      title: '企業級全棧應用',
      description: '使用 ReactTypeScript 前端搭配 Node.js/Java Spring Boot 後端，PostgreSQL 資料庫的完整企業應用開發與部署。',
      technologies: ['React', 'TypeScript', 'Node.js', 'Spring Boot', 'PostgreSQL']
    },
    {
      title: '微服務與容器化',
      description: '基於 Kubernetes 和 Docker 的微服務架構設計與實現，支援自動化部署和彈性擴展。',
      technologies: ['Kubernetes', 'Docker', 'Microservices', 'CI/CD']
    },
    {
      title: '多資料庫整合',
      description: '跨多個資料庫系統的應用設計，包括 MySQL、MS-SQL、DB2 等關聯式資料庫的架構與優化。',
      technologies: ['MySQL', 'MS-SQL', 'DB2', 'Schema Design', 'Performance Tuning']
    },
    {
      title: 'Bluz Computer Studio',
      description: '專業的電腦硬體客製化與組裝工作室，提供高性能系統設計、硬體優化和客服服務。',
      technologies: ['硬體設計', '系統優化', '性能測試']
    }
  ]

  const socials: SocialLink[] = [
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
      <header className="header">
        <nav className="navbar">
          <h1 className="logo-text">BLUZ TECH</h1>
          <ul className="nav-links">
            <li><a href="#about">關於</a></li>
            <li><a href="#skills">技能</a></li>
            <li><a href="#projects">項目</a></li>
            <li><a href="#contact">聯繫</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Hi 我是 <strong>Bluz</strong></h2>
          <p>全端軟體工程師 × 雲端基礎設施 × 硬體客製專家<br />3+ 年實戰經驗 | 從後端邏輯到前端頁面，從容器編排到硬體優化</p>
          <div className="hero-divider"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2>關於我</h2>
          <div className="about-wrapper">
            <div className="about-image">
              <img src="/Bluz_Lan.jpeg" alt="Bluz Lan" />
            </div>
            <div className="about-content">
              <p>
                我是 <strong>Bluz Lan</strong>，一名擁有 3 年以上軟體工程經驗的全棧開發工程師。
                專長於後端系統設計 (Node.js/TypeScript、Java Spring、Python)、
                企業級前端應用 (React、Vue.js)、以及雲端基礎設施 (Docker、Kubernetes)。
              </p>
              <p>
                熟悉多種關聯式資料庫 (PostgreSQL、MySQL、MS-SQL、DB2) 的架構設計與性能優化。
                擁有敏捷開發經驗，了解 Git 工作流與完整的 Code Review 流程。
              </p>
              <p>
                透過 <strong>Bluz Computer Studio</strong>，
                我進一步延伸技能至硬體領域，提供高性能客製化主機設計與系統優化服務。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <h2>技能</h2>
          <div className="skills-grid">
            {skills.map((skillGroup) => (
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
          <h2>項目</h2>
          <div className="projects-grid">
            {projects.map((project) => (
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
          <h2>聯繫我</h2>
          <p className="contact-subtitle">透過以下方式與我聯繫</p>
          <div className="contact-links">
            {socials.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="contact-link">
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-divider"></div>
        <p>&copy; 2026 BLUZ TECH. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
