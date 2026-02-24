# Bluz Lan Portfolio

This is Bluz Lan's personal portfolio and resume site, built with React + TypeScript + Vite, with bilingual content support (Chinese/English) and SEO optimization.

Website: <https://fantasybluz.github.io/>

## Features

- Chinese/English language switch with locale persistence
- Responsive layout (desktop/tablet/mobile)
- Sticky navbar with translucent state on scroll
- Resume sections: About, Experience, Skills, Projects, Highlights, Contact
- SEO enhancements (meta / Open Graph / Twitter / JSON-LD / sitemap / robots)
- Google Search Console HTML verification support

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- ESLint 9
- Stylelint 17

## Local Development

Node.js 20+ is recommended.

```bash
npm install
npm run dev
```

Dev URL: <http://localhost:5173>

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build production files into dist
npm run preview   # Preview production build locally
npm run lint      # Lint TypeScript/JavaScript
npm run lint:css  # Lint and auto-fix CSS
```

## Main Editable Files

- Main resume/content data: `src/App.tsx` (`contentByLocale`)
- Main component styles: `src/App.css`
- Global styles: `src/index.css`
- Profile image: `public/Bluz_Lan.jpg`
- Site icon: `public/logo.png`

## SEO & Search Setup

- Main meta tags and structured data: `index.html`
- Robots file: `public/robots.txt`
- Sitemap: `public/sitemap.xml`
- Google verification file: `public/google12b722e4207bfe96.html`

After deployment, verify the Google file at:

`https://fantasybluz.github.io/google12b722e4207bfe96.html`

## Deployment (GitHub Pages)

This project is configured with GitHub Actions to deploy automatically when `main` is updated:

- Workflow: `.github/workflows/deploy.yml`
- Build output: `dist`
- Publish branch: `gh-pages`

## License

MIT
