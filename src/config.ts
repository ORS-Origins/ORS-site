// Centralized site configuration — all tuneable constants live here.
// 集中式站点配置 —— 所有可调常量统一在此管理。

// ── Site / 站点 ──────────────────────────────────────────────────
export const siteConfig = {
  /** Application name displayed in <title>, nav bar, and hero. / 应用名称，显示在标题栏、导航栏和首页。 */
  appName: 'ORS',
  /** Site logo path. / 站点 Logo 路径。 */
  logoPath: '/imgs/widget/ors.png',
  /** Site favicon path. / 站点 Favicon 路径。 */
  faviconPath: '/imgs/widget/ors.png',
  /** Default docs entry path after locale prefix. / 语言前缀后的默认文档入口路径。 */
  defaultDocsPath: 'guide',
  /** Fumadocs source base URL. / Fumadocs 文档基础路径。 */
  docsBaseUrl: '/docs',
} as const;

// ── Brand / 品牌 ─────────────────────────────────────────────────
export const brandConfig = {
  /** Large brand title on homepage. / 首页大号品牌标题。 */
  homeTitle: 'ORS',
  /** External about URL for context menu. / 右键菜单"关于"跳转的外部链接。 */
  aboutUrl: 'https://github.com/ORS-Origins/ORS-site',
  /** Splash text pool (extracted from existing player splash images). / 闪烁标语文本池（从现有玩家标语图片中识别提取）。 */
  splashTexts: [
    '阿汤娇喘！！！',
    'Aaaaa_Bai 阿白！',
    'Adam_XH 暮风的宝贝！',
    'Astronault0717！',
    'AyMeow 猫仔！',
    'BlowNia 已成为社畜！',
    'CherryBlossom_6 樱苒！',
    'ColdKiller000 小学生！',
    'fanfan1024 帆帆！',
    'Hao_cch 浩仔！',
    'Havewhite 忆白！',
    'Memories_white 忆白！',
    'How_Low_Hello！',
    'ItsTinyLamb 翔子！',
    'M_muu 摸鱼快乐木！',
    'MiaoYanDaoRen 鱼镇炸鱼人！',
    'moyueAA 墨月！',
    'NaTanitani 摸鱼ing！',
    'nghngn 摸100中！',
    'Sabes_CN！',
    'Tannng 阿汤！',
    'W996 精通摸鱼摆烂！',
    'WindCarve 晖晖的玩具！',
    'Xiao_Ming3 小明！',
    'StarryConnection 废物！',
    'Young912！',
    'Zaizai0409 边缘人！',
    'zzZoxer 文谷！',
    'SSJ | 搞新玩意ing...',
  ],
} as const;

// ── Minecraft server / Minecraft 服务器 ──────────────────────────
export const mcConfig = {
  /** MC server hostname or IP. / MC 服务器域名或 IP。 */
  serverIp: 'bgp.strynir.cloud',
  /** MC server default port. / MC 服务器默认端口。 */
  defaultPort: 58608 as number,
  /** mcsrvstat.us status API base URL (no trailing slash). / mcsrvstat.us 状态 API 基础地址（无尾部斜杠）。 */
  statusApiBase: 'https://api.mcsrvstat.us/3',
  /** mc-heads.net avatar API base URL (no trailing slash). / mc-heads.net 头像 API 基础地址（无尾部斜杠）。 */
  avatarApiBase: 'https://mc-heads.net/avatar',
  /** Avatar image size in pixels. / 头像图片像素尺寸。 */
  avatarSize: 16,
  /** Server status polling interval in ms. / 服务器状态轮询间隔（毫秒）。 */
  pollingIntervalMs: 60_000,
  /** Whether to show the server IP address in the status card. / 是否在状态卡片中显示服务器 IP 地址。 */
  showServerIp: true,
} as const;

// ── Theme & Animation / 主题与动画 ───────────────────────────────
export const themeConfig = {
  /** CSS theme transition duration in ms. / CSS 主题切换过渡时长（毫秒）。 */
  transitionDurationMs: 300,
  /** Mask reveal page transition duration in ms. / 遮罩揭示页面过渡时长（毫秒）。 */
  maskRevealDurationMs: 2500,
  /** Mask reveal easing curve (cubic-bezier). / 遮罩揭示缓动曲线（cubic-bezier）。 */
  maskRevealEase: [0.22, 0.61, 0.36, 1.0] as [number, number, number, number],
  /** Mask reveal radius multiplier for covering viewport corners. / 遮罩揭示覆盖视口角落的半径倍率。 */
  maskRevealRadiusScale: 1.2,
  /** Initial soft edge width for mask reveal in px. / 遮罩揭示初始柔边宽度（像素）。 */
  maskRevealInitialFeatherPx: 40,
  /** Final soft edge width as a ratio of reveal radius. / 最终柔边宽度相对揭示半径的比例。 */
  maskRevealFeatherScale: 0.35,
  /** Maximum age of a pending docs transition in ms. / 待执行文档过渡的最大有效期（毫秒）。 */
  docsTransitionMaxAgeMs: 3000,
  /** Idle timeout for caching homepage transition snapshot in ms. / 首页过渡快照空闲缓存超时（毫秒）。 */
  docsTransitionSnapshotIdleTimeoutMs: 1000,
} as const;

// ── UI / 用户界面 ────────────────────────────────────────────────
export const uiConfig = {
  /** Context menu dimensions (px). / 右键菜单尺寸（像素）。 */
  contextMenu: {
    width: 192,
    itemHeight: 40,
    padding: 8,
  },
  /** Docs layout CSS variables for Fumadocs grid sizing. / Fumadocs 文档布局网格尺寸 CSS 变量。 */
  docsLayout: {
    layoutWidth: '100vw',
    sidebarWidth: '268px',
  },
  /** Docs table of contents style. / 文档目录样式。 */
  tocStyle: 'clerk' as const,
  /** Floating skin viewer collapse control spacing. / 悬浮纸娃娃收回控件间距。 */
  skinViewer: {
    rightOffsetPx: 20,
    bottomOffsetPx: 20,
    controlGapPx: 8,
    controlLeftPx: 22,
    controlTopPx: 175,
    controlWidthPx: 34,
    controlHeightPx: 28,
    /** Collapsed toggle reserved space for the system scrollbar. / 折叠按钮为系统滚动条预留的安全距离。 */
    scrollbarSafeAreaPx: 18,
    /** Dark mode toggle surface color. / 深色模式切换按钮表面色。 */
    darkControlSurface: 'rgba(18, 33, 68, 0.92)',
    /** Dark mode toggle hover surface color. / 深色模式切换按钮悬浮表面色。 */
    darkControlSurfaceHover: 'rgba(28, 50, 96, 0.96)',
    /** Dark mode toggle border color. / 深色模式切换按钮边框色。 */
    darkControlBorder: 'rgba(95, 145, 220, 0.42)',
    /** Dark mode toggle glow color. / 深色模式切换按钮光晕色。 */
    darkControlGlow: 'rgba(80, 140, 220, 0.34)',
    collapsedControlOffsetPx: 0,
    slideOffsetPx: 24,
  },
} as const;

// ── Mermaid viewer / Mermaid 图表查看器 ──────────────────────────
export const mermaidConfig = {
  /** Minimum zoom scale. / 最小缩放比例。 */
  minScale: 0.25,
  /** Maximum zoom scale. / 最大缩放比例。 */
  maxScale: 4,
  /** Zoom step per click. / 每次点击缩放步进值。 */
  scaleStep: 0.25,
  /** Default (1:1) zoom scale. / 默认（1:1）缩放比例。 */
  defaultScale: 1,
  /** Viewport fit-to-view padding (px). / 自适应视口四周留白（px）。 */
  viewportFitPadding: 48,
  /** Viewport toolbar bottom gap (px). / 自适应视口工具栏底部间距（px）。 */
  viewportToolbarGap: 72,
  /** SVG bbox safety padding (user units) covering shadow + stroke. / SVG bbox 安全 padding（用户单位），覆盖阴影 + stroke。 */
  bboxPadding: 16,
  /** Epsilon for float comparison when deciding if reset is needed. / 判断是否需要重置时的浮点容差。 */
  resetEpsilon: 0.005,
} as const;

// ── Search / 搜索 ────────────────────────────────────────────────
export const searchConfig = {
  /** Orama search threshold for CJK tokenizer. / CJK 分词器的 Orama 搜索阈值。 */
  threshold: 0,
  /** Orama search tolerance for CJK tokenizer. / CJK 分词器的 Orama 搜索容差。 */
  tolerance: 0,
} as const;

// ── DOM events / DOM 事件 ─────────────────────────────────────────
export const eventNames = {
  /** Fired when the brand logo should reshuffle the homepage splash text. / 品牌 Logo 触发首页闪烁标语切换时派发。 */
  splashShuffle: 'ors:splash-shuffle',
} as const;

// ── Storage keys / localStorage & sessionStorage 键名 ────────────
export const storageKeys = {
  /** Sidebar collapsed state key. / 侧栏折叠状态 localStorage 键名。 */
  sidebarCollapsed: 'sidebar-collapsed',
  /** Floating skin viewer collapsed state key. / 悬浮纸娃娃收起状态 localStorage 键名。 */
  skinViewerCollapsed: 'skin-viewer-collapsed',
  /** Page transition snapshot data key. / 页面过渡快照数据 sessionStorage 键名。 */
  transitionData: 'nd-docs-transition',
  /** Page transition DOM snapshot key. / 页面过渡 DOM 快照 sessionStorage 键名。 */
  transitionSnapshot: 'nd-docs-transition-snapshot',
} as const;
