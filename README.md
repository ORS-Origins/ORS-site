<p align="center">
  <img src="public/imgs/widget/ors.png" alt="ORS Logo" width="120" />
</p>

<h1 align="center">ORS-Site</h1>

<p align="center">
  <strong>Minecraft 服务器文档站</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.6-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Biome-2.4.16-60a5fa?style=flat-square" alt="Biome" />
  <img src="https://img.shields.io/badge/Bun-1.0+-fbf78f?style=flat-square&logo=bun" alt="Bun" />
  <br />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</p>

---

## 简介

ORS-Site 是一个基于 [Next.js](https://nextjs.org/) 与 [Fumadocs](https://fumadocs.vercel.app/) 构建的 **Minecraft 服务器文档站**，采用 Minecraft 主题风格设计，致力于为玩家提供美观、易用的文档浏览体验。

### 核心特性

- 🎮 **Minecraft 主题风格首页** — 动态渐变背景、浮动发光方块、照片轮播、像素破坏粒子动画
- 🌐 **多语言支持** — 默认简体中文，支持英文切换
- 📚 **文档系统** — Markdown/MDX 渲染、自动生成目录导航、Orama 全文搜索
- 🖱️ **自定义交互** — Minecraft 风格光标动画、右键自定义菜单、页面过渡动画
- 🚀 **静态导出** — 可部署到 Vercel、Cloudflare Pages、GitHub Pages 等平台

---

## 目录

- [简介](#简介)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [可用脚本](#可用脚本)
- [配置说明](#配置说明)
- [文档编写](#文档编写)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 技术栈

| 类别 | 技术 | 版本 |
| :--- | :--- | :--- |
| 框架 | [Next.js](https://nextjs.org/) | 16.2.6 |
| 运行时 | [React](https://react.dev/) | 19.2.6 |
| 语言 | [TypeScript](https://www.typescriptlang.org/) | 5.x |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| 文档引擎 | [Fumadocs](https://fumadocs.vercel.app/) | Core / UI / MDX |
| 动画 | [Framer Motion](https://www.framer.com/motion/) | 12.x |
| 搜索 | [Orama](https://orama.com/) + `@orama/tokenizers` | — |
| 图标 | [Lucide React](https://lucide.dev/) | — |
| 包管理器 | [Bun](https://bun.sh/) | 1.0+ |
| 代码规范 | [Biome](https://biomejs.dev/) | 2.4.16 |

---

## 项目结构

```txt
.
├── content/docs/              # 文档源文件
│   ├── zh/                    # 中文文档
│   │   ├── about/             # 关于 ORS
│   │   ├── guide/             # 新手指南
│   │   └── rules/             # 服务器规则
│   └── en/                    # 英文文档（与 zh 镜像）
├── public/                    # 静态资源
│   ├── imgs/                  # 图片资源
│   │   ├── avatars/           # 玩家头像
│   │   ├── blocks/            # Minecraft 方块纹理
│   │   ├── items/             # Minecraft 物品纹理
│   │   ├── icons/             # UI 图标
│   │   ├── paintings/         # 画作纹理
│   │   ├── photos/            # 首页轮播照片
│   │   └── splash/            # 闪烁标语图片
│   ├── fonts/                 # Minecraft 风格字体
│   └── audios/                # 音效文件
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── [lang]/            # 多语言路由
│   │   │   ├── (home)/        # 首页
│   │   │   └── docs/          # 文档页
│   │   ├── api/search/        # 搜索 API 路由
│   │   ├── layout.tsx         # 根布局
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   │   ├── mdx/               # MDX 自定义组件
│   │   └── transition/        # 过渡动画组件
│   ├── dictionaries/          # 页面级 i18n 文案
│   ├── lib/                   # 工具库
│   │   ├── i18n.ts            # i18n 配置
│   │   ├── source.ts          # Fumadocs 文档源配置
│   │   └── search-tokenizer.ts
│   ├── styles/                # 自定义 CSS
│   │   ├── minecraft.css      # Minecraft 主题样式
│   │   ├── home.css           # 首页特效样式
│   │   └── theme.css          # 主题变量
│   └── config.ts              # 站点集中式配置
├── next.config.ts             # Next.js 配置
├── biome.json                 # Biome 配置
├── postcss.config.mjs         # PostCSS 配置
└── package.json
```

---

## 快速开始

### 环境要求

- [Bun](https://bun.sh/) 1.0 或更高版本
- Node.js 20 或更高版本（若使用 npm / pnpm / yarn）

### 安装依赖

```bash
bun install
```

### 启动开发服务器

```bash
bun dev
```

默认在 [http://localhost:3000](http://localhost:3000) 运行。

### 构建生产版本

```bash
bun run build
```

构建产物输出至 `out/` 目录，为纯静态文件，可直接部署到 [Vercel](https://vercel.com/)、[Cloudflare Pages](https://pages.cloudflare.com/)、[GitHub Pages](https://pages.github.com/) 等平台。

### 本地预览生产构建

```bash
bun start
```

---

## 可用脚本

| 脚本 | 说明 |
| :--- | :--- |
| `bun dev` | 启动 Next.js 开发服务器 |
| `bun run build` | 构建生产版本（静态导出） |
| `bun start` | 使用 `serve` 预览 `out/` 目录 |
| `bun run typecheck` | 运行 TypeScript 类型检查 |
| `bun run lint` | 运行 Biome Linter |
| `bun run format` | 运行 Biome 格式化 |
| `bun run check` | 运行 Biome 检查与自动修复 |

---

## 配置说明

所有可调参数集中在 [`src/config.ts`](src/config.ts) 中管理，主要配置项如下：

### 站点配置（`siteConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `appName` | `ORS` | 应用名称 |
| `logoPath` | `/imgs/widget/ors.png` | 站点 Logo 路径 |
| `faviconPath` | `/imgs/widget/ors.png` | Favicon 路径 |
| `defaultDocsPath` | `guide` | 默认文档入口路径 |
| `docsBaseUrl` | `/docs` | Fumadocs 文档基础路径 |

### Minecraft 服务器配置（`mcConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `serverIp` | `rio.mc6.cn` | 服务器域名或 IP |
| `defaultPort` | `31015` | 服务器端口 |
| `statusApiBase` | `https://api.mcsrvstat.us/3` | 状态查询 API |
| `pollingIntervalMs` | `60000` | 状态轮询间隔（毫秒） |
| `showServerIp` | `true` | 是否显示服务器 IP |

### 主题与动画配置（`themeConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `transitionDurationMs` | `300` | 主题切换过渡时长 |
| `maskRevealDurationMs` | `2500` | 页面过渡动画时长 |

---

## 文档编写

文档存放于 `content/docs/<lang>/` 目录下，支持 Markdown（`.md`）与 MDX（`.mdx`）格式。

### 目录结构

每个文档目录需包含：

- `index.md` 或 `index.mdx` — 文档正文
- `meta.json` — 目录元数据（标题、排序等）

### 多语言同步

若修改 `content/docs/zh/` 下的文档，请务必同步更新 `content/docs/en/` 下的对应内容。

### 元数据示例

```yaml
---
title: 服务器规则
description: ORS Minecraft 服务器规则，所有玩家必须遵守。
---
```

更多语法与组件用法请参阅 `content/docs/zh/contributing/` 下的贡献指南文档。

---

## 贡献指南

我们欢迎社区贡献！在提交代码前，请遵循以下流程：

1. **Fork 本仓库** 并创建功能分支
2. **编写代码**：遵循现有代码风格，确保通过 Biome 检查
3. **更新文档**：若修改功能，同步更新相关文档及中英文版本
4. **运行检查**：

   ```bash
   bun run format
   bun run check
   bun run typecheck
   ```

5. **提交 PR**：按照 `.vscode/prompt/commit-instruction.md` 规范编写 Commit Message

详细的贡献流程请参阅站内文档：[贡献指南](content/docs/zh/contributing/guide.md)

---

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

```txt
MIT License

Copyright (c) 2026 ORS-Origins
```

---

## 致谢

- 感谢所有为 ORS 服务器和文档站贡献的玩家与开发者
- 感谢 zzZoxer 为 ORS 网站设计与部分交互提供灵感
