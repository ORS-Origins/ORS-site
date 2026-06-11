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
  aboutUrl: 'https://github.com/EmptyDreams/ORS',
  /** Splash image directory path prefix. / 闪烁标语图片目录路径前缀。 */
  splashPathPrefix: '/imgs/splash',
} as const;

// ── Minecraft server / Minecraft 服务器 ──────────────────────────
export const mcConfig = {
  /** MC server hostname or IP. / MC 服务器域名或 IP。 */
  serverIp: 'rio.mc6.cn',
  /** MC server default port. / MC 服务器默认端口。 */
  defaultPort: 31015 as number,
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
} as const;

// ── Cursor / 光标 ────────────────────────────────────────────────
export const cursorConfig = {
  /** Frame interval in ms for animated cursors. / 动态光标帧间隔（毫秒）。 */
  frameIntervalMs: 80,
  /** Base path for cursor images. / 光标图片基础路径。 */
  pathPrefix: '/imgs/widget/cursor',
  /** Animated cursor frame sequences. / 动态光标帧序列配置。 */
  frameSequences: {
    pointer: { length: 11, filenameTemplate: 'pointer_page_{frame}.png' },
    grabbing: { length: 8, filenameTemplate: 'grabbing_page_{frame}.png' },
    notAllowed: { length: 8, filenameTemplate: 'not-allowed_page_{frame}.png' },
  },
  /** Static fallback cursor filenames. / 静态回退光标文件名。 */
  staticCursors: {
    default: 'default.png',
    pointer: 'pointer_page_01.png',
    text: 'text.png',
    grab: 'grab.png',
    grabbing: 'grabbing_page_01.png',
    crosshair: 'crosshair.png',
    help: 'help.png',
    'not-allowed': 'not-allowed_page_01.png',
    'ns-resize': 'resize-ns.png',
    'ew-resize': 'resize-ew.png',
    'nesw-resize': 'resize-ne.png',
    'nwse-resize': 'resize-nw.png',
  },
  /** Cursor hotspot coordinates. / 光标热点坐标。 */
  hotspots: {
    default: '16 16',
    pointer: '18 18',
    text: '36 16',
    grab: '18 18',
    grabbing: '18 6',
    crosshair: '30 30',
    help: '16 6',
    'not-allowed': '31 31',
    'ns-resize': '31 31',
    'ew-resize': '31 31',
    'nesw-resize': '31 31',
    'nwse-resize': '31 31',
  },
} as const;

// ── UI / 用户界面 ────────────────────────────────────────────────
export const uiConfig = {
  /** Context menu dimensions (px). / 右键菜单尺寸（像素）。 */
  contextMenu: {
    width: 192,
    itemHeight: 40,
    padding: 8,
  },
  /** Docs table of contents style. / 文档目录样式。 */
  tocStyle: 'clerk' as const,
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

// ── Storage keys / localStorage & sessionStorage 键名 ────────────
export const storageKeys = {
  /** Sidebar collapsed state key. / 侧栏折叠状态 localStorage 键名。 */
  sidebarCollapsed: 'sidebar-collapsed',
  /** Page transition snapshot data key. / 页面过渡快照数据 sessionStorage 键名。 */
  transitionData: 'nd-docs-transition',
} as const;
