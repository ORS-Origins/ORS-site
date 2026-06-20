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
- 🎭 **纸娃娃查看器** — 浮动 Minecraft 玩家皮肤展示，支持深浅色模式切换
- 📊 **Mermaid 图表** — 支持流程图、时序图等 Mermaid 图表渲染与交互式缩放
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
| 图表 | [Mermaid](https://mermaid.js.org/) | 11.x |
| 主题 | [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.x |
| 包管理器 | [Bun](https://bun.sh/) | 1.0+ |
| 代码规范 | [Biome](https://biomejs.dev/) | 2.4.16 |

---

## 项目结构

```txt
.
├── content/docs/                  # 文档源文件
│   ├── zh/                        # 中文文档
│   │   ├── about/                 # 关于 ORS
│   │   │   ├── index.mdx          # 关于首页
│   │   │   ├── contributing.mdx   # 贡献指南
│   │   │   ├── code-tabs-demo.mdx # 代码块标签页演示
│   │   │   ├── syntax-example.md  # 语法示例
│   │   │   └── meta.json          # 目录元数据
│   │   ├── guide/                 # 新手指南
│   │   │   ├── index.mdx          # 指南首页
│   │   │   └── meta.json          # 目录元数据
│   │   └── meta.json              # 顶级元数据
│   └── en/                        # 英文文档（与 zh 镜像）
│       ├── about/
│       │   ├── index.mdx
│       │   └── meta.json
│       ├── guide/
│       │   ├── index.mdx
│       │   └── meta.json
│       └── meta.json
├── public/                        # 静态资源
│   ├── imgs/                      # 图片资源
│   │   ├── avatars/               # 玩家头像
│   │   ├── blocks/                # Minecraft 方块纹理
│   │   ├── icons/                 # UI 图标
│   │   ├── items/                 # Minecraft 物品纹理
│   │   ├── paintings/             # 画作纹理
│   │   ├── photos/                # 首页轮播照片
│   │   ├── ui/                    # Minecraft UI 元素（按钮、面板、槽位等）
│   │   └── widget/                # 小部件（Logo、加载动画）
│   ├── fonts/                     # Minecraft 风格字体
│   │   ├── Minecraft-*.woff2      # Minecraft 官方字体
│   │   ├── Minecrafter*.woff2     # Minecrafter 装饰字体
│   │   ├── MinecraftEvenings.woff2
│   │   └── Monocraft.woff2        # 等宽编程字体
│   └── audios/                    # 音效文件
│       ├── Block.barrel.*.wav     # 木桶开关音效
│       ├── Tannng.mp3             # 唱片机音频
│       ├── click.wav              # 点击音效
│       ├── fuse.wav               # 引信音效
│       ├── orb.wav                # 经验球音效
│       ├── Step.wood3.wav         # 木板脚步声
│       └── Tannng.mp3             # 自定义音效
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── [lang]/                # 多语言路由
│   │   │   ├── (home)/            # 首页（路由组）
│   │   │   │   ├── page.tsx       # 首页组件
│   │   │   │   ├── layout.tsx     # 首页布局
│   │   │   │   └── template.tsx   # 首页过渡模板
│   │   │   ├── docs/              # 文档页
│   │   │   │   ├── [...slug]/     # 动态路由
│   │   │   │   │   └── page.tsx   # 文档页面组件
│   │   │   │   ├── layout.tsx     # 文档布局
│   │   │   │   ├── not-found.tsx  # 文档 404
│   │   │   │   └── template.tsx   # 文档过渡模板
│   │   │   ├── error.tsx          # 多语言路由错误边界
│   │   │   └── layout.tsx         # 多语言根布局
│   │   ├── api/search/            # 搜索 API 路由
│   │   │   └── route.ts           # Orama 全文搜索接口
│   │   ├── error.tsx              # 全局错误边界
│   │   ├── globals.css            # 全局样式入口
│   │   ├── layout.tsx             # 应用根布局
│   │   ├── not-found.tsx          # 全局 404 页面
│   │   └── page.tsx               # 根路径重定向
│   ├── components/                # React 组件
│   │   ├── mdx/                   # MDX 自定义组件
│   │   │   ├── code-tabs.tsx          # 多语言代码块标签页
│   │   │   ├── custom-codeblock.tsx   # 自定义代码块
│   │   │   ├── docs-author.tsx        # 文档作者组件
│   │   │   └── mermaid.tsx            # Mermaid 图表组件
│   │   ├── transition/            # 过渡动画组件
│   │   │   ├── enter-docs-button.tsx  # 进入文档按钮动画
│   │   │   └── mask-reveal.tsx        # 遮罩揭示过渡
│   │   ├── context-menu.tsx       # 右键自定义菜单
│   │   ├── mc-status.tsx          # Minecraft 服务器状态卡片
│   │   ├── nav-logo.tsx           # 导航栏 Logo
│   │   ├── route-state.tsx        # 路由状态（加载/404）
│   │   ├── route-transition-layer.tsx # 根路由过渡覆盖层
│   │   ├── search.tsx             # 搜索组件
│   │   ├── sidebar-provider.tsx   # 侧栏状态管理
│   │   ├── skin-viewer.tsx        # 纸娃娃查看器
│   │   └── splash-text.tsx        # 闪烁标语组件
│   ├── dictionaries/              # 页面级 i18n 文案
│   │   ├── index.ts               # 字典入口
│   │   ├── zh.ts                  # 中文文案
│   │   └── en.ts                  # 英文文案
│   ├── lib/                       # 工具库
│   │   ├── i18n.ts                # i18n 路由配置
│   │   ├── source.ts              # Fumadocs 文档源配置
│   │   ├── language-mapping.ts    # 语言代码映射
│   │   ├── layout.shared.tsx      # 共享布局组件
│   │   ├── motion.ts              # Framer Motion 动画工具
│   │   ├── parse-author.ts        # 作者信息解析
│   │   ├── remark-code-title.ts   # 代码块标题 remark 插件
│   │   ├── remark-collapsible-alert.ts # 可折叠提示框 remark 插件
│   │   ├── search-tokenizer.ts    # Orama 搜索分词器
│   │   └── transformer-meta-title.ts  # 元数据标题转换器
│   ├── styles/                    # 自定义 CSS 样式
│   │   ├── a11y.css               # 无障碍样式
│   │   ├── fumadocs-glass.css     # Fumadocs 玻璃化覆盖
│   │   ├── glass.css              # 液态玻璃基础样式
│   │   ├── home.css               # 首页特效样式
│   │   ├── mermaid.css            # Mermaid 图表样式
│   │   ├── minecraft.css          # Minecraft 主题样式
│   │   ├── route-transition.css   # 路由加载与页面进入过渡
│   │   ├── skinviewer.css         # 纸娃娃查看器样式
│   │   ├── skinviewer-animation.css # 纸娃娃动画样式
│   │   ├── theme.css              # 主题变量与过渡
│   │   └── typography.css         # 排版样式（代码块、表格等）
│   └── config.ts                  # 站点集中式配置
├── .mimocode/                     # MiMoCode 工作流配置
│   ├── command/                   # 命令模板
│   │   └── git-commit.md          # Git 提交规范
│   ├── plans/                     # 任务计划
│   ├── skills/                    # 自定义技能
│   │   └── post-edit-verify/      # 编辑后验证技能
│   ├── package.json               # MiMoCode 依赖
│   └── .gitignore                 # Git 忽略配置
├── .source/                       # Fumadocs 构建产物
│   ├── browser.ts
│   ├── dynamic.ts
│   ├── server.ts
│   └── source.config.mjs
├── .vscode/                       # VS Code 配置
│   ├── prompt/                    # 提示词模板
│   │   └── commit-instruction.md  # 提交信息规范
│   └── settings.json              # 编辑器设置
├── scripts/                       # 脚本目录
├── next.config.ts                 # Next.js 配置
├── biome.json                     # Biome 格式化与 lint 配置
├── postcss.config.mjs             # PostCSS 配置（Tailwind CSS）
├── source.config.ts               # Fumadocs MDX 源配置
├── tsconfig.json                  # TypeScript 配置
├── bun.lock                       # Bun 锁文件
├── LICENSE                        # MIT 许可证
└── package.json                   # 项目依赖与脚本
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
| `bun run typecheck` | 运行 TypeScript 类型检查（含 `next typegen` 和 `fumadocs-mdx`） |
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

### 品牌配置（`brandConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `homeTitle` | `ORS` | 首页大号品牌标题 |
| `aboutUrl` | GitHub 仓库地址 | 右键菜单"关于"跳转链接 |
| `splashTexts` | 玩家标语文本数组 | 首页闪烁标语文本池 |

### Minecraft 服务器配置（`mcConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `serverIp` | `bgp.strynir.cloud` | 服务器域名或 IP |
| `defaultPort` | `58608` | 服务器端口 |
| `statusApiBase` | `https://api.mcsrvstat.us/3` | 状态查询 API |
| `avatarApiBase` | `https://mc-heads.net/avatar` | 玩家头像 API |
| `avatarSize` | `16` | 头像图片尺寸（px） |
| `pollingIntervalMs` | `60000` | 状态轮询间隔（毫秒） |
| `showServerIp` | `true` | 是否显示服务器 IP |

### 主题与动画配置（`themeConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `transitionDurationMs` | `300` | 主题切换过渡时长 |
| `maskRevealDurationMs` | `2500` | 页面过渡动画时长 |
| `maskRevealEase` | `[0.22, 0.61, 0.36, 1.0]` | 遮罩揭示缓动曲线 |
| `docsTransitionMaxAgeMs` | `3000` | 文档过渡最大有效期 |
| `docsTransitionSnapshotIdleTimeoutMs` | `1000` | 首页过渡快照空闲缓存超时 |
| `docsTransitionReadySelector` | `#nd-docs-layout` | 文档布局就绪后再播放揭示动画的选择器 |
| `docsTransitionReadyTimeoutMs` | `5000` | 等待文档布局就绪的最长时间 |
| `docsTransitionSnapshotFreezeSelectors` | 见 `src/config.ts` | 过渡快照中需要冻结当前视觉状态的选择器 |

### UI 配置（`uiConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `contextMenu.width` | `192` | 右键菜单宽度（px） |
| `contextMenu.itemHeight` | `40` | 右键菜单项高度（px） |
| `docsLayout.sidebarWidth` | `268px` | 文档侧栏宽度 |
| `tocStyle` | `clerk` | 目录样式 |
| `skinViewer.*` | — | 纸娃娃查看器位置与样式参数 |
| `routeState.loadingIconPath` | `/imgs/widget/loading.png` | 加载动画图标路径 |
| `routeState.notFoundIconPath` | `/imgs/blocks/bedrock.png` | 404 页面图标路径 |
| `routeTransition.loadingEnterDurationMs` | `220` | 加载页淡入时长（毫秒） |
| `routeTransition.pageEnterDurationMs` | `360` | 页面内容淡入时长（毫秒） |
| `routeTransition.rootRedirectDurationMs` | `420` | 根加载重定向覆盖层淡出时长（毫秒） |
| `routeTransition.readyRevealDelayMs` | `320` | 目标页面就绪后开始揭示前的延迟（毫秒） |
| `routeTransition.redirectWaitTimeoutMs` | `1200` | 等待重定向路由稳定的最长时间（毫秒） |
| `routeTransition.overlayZIndex` | `80` | 根路由过渡覆盖层层级 |
| `routeTransition.easing` | `cubic-bezier(0.16, 1, 0.3, 1)` | 路由过渡缓动曲线 |

### Mermaid 图表配置（`mermaidConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `minScale` | `0.25` | 最小缩放比例 |
| `maxScale` | `4` | 最大缩放比例 |
| `scaleStep` | `0.25` | 每次点击缩放步进值 |
| `defaultScale` | `1` | 默认缩放比例 |

### 搜索配置（`searchConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `threshold` | `0` | CJK 分词器搜索阈值 |
| `tolerance` | `0` | CJK 分词器搜索容差 |

### 唱片机配置（`jukeboxConfig`）

| 字段 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `defaultVolume` | `0.5` | 唱片与 UI 音效默认音量 |
| `toggleSoundPath` | `/audios/Step.wood3.wav` | 唱片机展开 / 收起音效 |
| `jukeboxIconPath` | `/imgs/blocks/jukebox.png` | 唱片机按钮方块图标 |
| `discs` | Minecraft 唱片数组 | 唱片图标与音频资源映射 |
| `zIndex` | `45` | 唱片机停靠层级 |
| `toggleSizePx` | `36` | 唱片机按钮尺寸 |
| `dockTopOffsetPx` | `58` | 停靠按钮顶部偏移 |
| `dockRightOffsetPx` | `24` | 停靠按钮右侧偏移 |
| `panelWidthPx` | `216` | 唱片机面板宽度 |
| `panelGapPx` | `8` | 按钮与面板间距 |
| `deckSizePx` | `96` | 主唱片仓区域尺寸 |
| `discIconSizePx` | `58` | 唱片图标尺寸（正在播放舞台） |
| `discThumbSizePx` | `26` | 唱片缩略图尺寸（唱片库网格） |
| `controlButtonSizePx` | `34` | 播放控制按钮尺寸 |

### 存储键名（`storageKeys`）

| 字段 | 键名 | 说明 |
| :--- | :--- | :--- |
| `sidebarCollapsed` | `sidebar-collapsed` | 侧栏折叠状态 |
| `skinViewerCollapsed` | `skin-viewer-collapsed` | 纸娃娃收起状态 |
| `transitionData` | `nd-docs-transition` | 页面过渡快照数据 |
| `transitionSnapshot` | `nd-docs-transition-snapshot` | 页面过渡 DOM 快照 |
| `jukeboxLastDisc` | `jukebox-last-disc` | 上次选择的唱片 |

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

更多语法与组件用法请参阅 `content/docs/zh/about/contributing.mdx` 下的贡献指南文档。

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

详细的贡献流程请参阅站内文档：[贡献指南](content/docs/zh/about/contributing.mdx)

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
