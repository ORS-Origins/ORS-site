// Centralized site configuration — all tuneable constants live here.
// 集中式站点配置 —— 所有可调常量统一在此管理。

// ── Site / 站点 ──────────────────────────────────────────────────
export const siteConfig = {
  /** Application name displayed in <title>, nav bar, and hero. / 应用名称，显示在标题栏、导航栏和首页。 */
  appName: 'ORS',
  /** Default docs entry path after locale prefix. / 语言前缀后的默认文档入口路径。 */
  defaultDocsPath: 'guide',
  /** Fumadocs source base URL. / Fumadocs 文档基础路径。 */
  docsBaseUrl: '/docs',
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
};

// ── Search / 搜索 ────────────────────────────────────────────────
export const searchConfig = {
  /** Orama search threshold for CJK tokenizer. / CJK 分词器的 Orama 搜索阈值。 */
  threshold: 0,
  /** Orama search tolerance for CJK tokenizer. / CJK 分词器的 Orama 搜索容差。 */
  tolerance: 0,
} as const;

// ── Storage keys / localStorage 键名 ─────────────────────────────
export const storageKeys = {
  /** Sidebar collapsed state key. / 侧栏折叠状态 localStorage 键名。 */
  sidebarCollapsed: 'sidebar-collapsed',
} as const;
