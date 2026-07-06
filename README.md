# Portfolio

个人 CS 作品集网站。

## 技术栈
- Next.js 14+ (App Router, SSG)
- TypeScript
- Tailwind CSS
- Vercel

## 本地开发
```bash
npm install
npm run dev
```

## 添加新项目
1. 在 `src/data/projects/` 下创建 `your-slug.json`
2. 按现有 JSON 结构填写所有字段
3. 在 `public/images/projects/your-slug/` 下放入图片
4. `npm run build` 确认无报错
5. `git push` 触发 Vercel 自动部署

## 修改设计
所有视觉变量在 `src/styles/design-tokens.css`，修改即全局调整。
