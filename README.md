# 個人自我介紹網站

這是一個使用 React + TypeScript + Vite 構建的現代化自我介紹網站。

## 功能特性

- 現代化的設計和漸變色彩
- 完全響應式設計，適配各種設備
- 使用 Vite 進行快速開發和構建
- TypeScript 類型安全
- 平滑的導航和錨點連結

## 包含的頁面

- **首頁** - 吸引人的 Hero 部分
- **關於我** - 個人介紹
- **技能** - 展示你的技能和專長
- **項目** - 展示你的作品
- **聯繫** - 聯繫方式

## 快速開始

### 安裝依賴

\`\`\`bash
npm install
\`\`\`

### 開發模式

\`\`\`bash
npm run dev
\`\`\`

訪問 [http://localhost:5173](http://localhost:5173) 查看網站效果。

### 構建生產版本

\`\`\`bash
npm run build
\`\`\`

### 預覽生產版本

\`\`\`bash
npm run preview
\`\`\`

## 自訂您的網站

### 編輯內容

編輯 [src/App.tsx](src/App.tsx) 中的以下部分：

- **skills** 數組：更新你的技能
- **projects** 數組：添加你的項目
- **聯繫方式**：更新聯繫信息

### 編輯樣式

- [src/App.css](src/App.css) - 主要組件樣式
- [src/index.css](src/index.css) - 全局樣式

## 技術棧

- React 19
- TypeScript
- Vite 7
- CSS3

## 部署

該網站是靜態的，可以部署到任何靜態託管平台：

- GitHub Pages
- Vercel
- Netlify
- AWS S3

## 許可證

此項目採用 MIT 許可證。

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
