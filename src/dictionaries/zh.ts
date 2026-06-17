// Page-level custom copy (NOT fumadocs UI translations).
// fumadocs-ui internal labels live in src/lib/layout.shared.tsx via defineI18nUI.
// This dictionary only holds tagline / nav text / etc. consumed by app pages.
// 页面自定义文案（非 fumadocs UI 翻译）。
// fumadocs-ui 内部 UI 文案由 src/lib/layout.shared.tsx 的 defineI18nUI 管理。
// 本字典只承载页面用到的 副标题 / 导航栏名 / 卡片标题等业务文案。

export const zh = {
  // Route state labels / 路由状态界面文案
  loading: '加载中…',
  loadingTitle: '正在加载页面',
  loadingDesc: '区块正在生成，请稍候……',
  tagline: '一个 Minecraft 服务器文档站',
  enterDocs: '进入文档',
  primaryAuthorLabel: '主要编写者：',
  documentContributorsTitle: '本文档贡献者',
  communityTitle: '讨论区',
  communityDesc: '欢迎分享你的想法与反馈',
  backToDocs: '返回文档',
  errorTitle: '页面加载失败',
  errorDesc: '发生了意外错误，请尝试重新加载页面。',
  errorRetry: '重试',
  errorHome: '返回首页',
  notFoundTitle: '页面未找到',
  notFoundDesc: '你访问的页面可能已被移除、重命名或暂时不可用。',
  notFoundBack: '返回上一页',
  notFoundHome: '返回首页',
  // MC server status labels / MC 服务器状态文案
  serverStatus: '服务器状态',
  serverOnline: '在线',
  serverOffline: '离线',
  serverPlayers: '玩家',
  serverIp: '服务器 IP',
  realPlayers: '真人玩家',
  fakePlayers: '假人',
  fakePlayerUnit: '个',
  // Mermaid toolbar a11y labels / Mermaid 工具栏无障碍标签
  mermaidZoomOut: '缩小图表',
  mermaidZoomIn: '放大图表',
  mermaidReset: '重置缩放',
  mermaidMaximize: '放大查看',
  mermaidRestore: '还原',
  mermaidToolbar: '图表工具栏',
  // Context menu / 右键菜单
  ctxMenuBackHome: '返回首页',
  ctxMenuReload: '刷新页面',
  ctxMenuCopyLink: '复制链接',
  ctxMenuCopyText: '复制选中内容',
  ctxMenuAbout: '关于 ORS',
  // MC status copy IP button / MC 状态 IP 复制按钮
  copiedLabel: '已复制',
  clickToCopyLabel: '点击复制',
  // Skin viewer collapse toggle / 纸娃娃收回切换按钮
  skinViewerCollapse: '收回纸娃娃',
  skinViewerExpand: '展开纸娃娃',
  // Jukebox music disc player / 唱片机音乐播放器
  jukeboxTitle: '唱片机',
  jukeboxToggle: '打开唱片机',
  jukeboxClose: '关闭唱片机',
  jukeboxPlay: '播放',
  jukeboxPause: '暂停',
  jukeboxStop: '停止',
  jukeboxNowPlaying: '正在播放',
  jukeboxReady: '已装入',
  jukeboxNoSelection: '未选择唱片',
  jukeboxPlaybackError: '无法播放所选唱片',
  jukeboxDiscNames: {
    Tannng: '阿汤娇喘纯享版',
    Tannng2: '阿汤娇喘纯享版 2',
    Tannng3: '阿汤娇喘纯享版 3',
    Tannng4: '阿汤娇喘纯享版 4',
    Tannng5: '阿汤娇喘纯享版 5',
    Tannng6: '阿汤娇喘纯享版 6',
    Tannng7: '阿汤娇喘纯享版 7',
    Tannng8: '阿汤娇喘纯享版 8',
    Tannng9: '阿汤娇喘纯享版 9',
    Tannng10: '阿汤娇喘纯享版 10',
  },
} as const;
