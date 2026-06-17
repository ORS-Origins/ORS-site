// Page-level custom copy (NOT fumadocs UI translations).
// fumadocs-ui internal labels live in src/lib/layout.shared.tsx via defineI18nUI.
// This dictionary only holds tagline / nav text / etc. consumed by app pages.
// 页面自定义文案（非 fumadocs UI 翻译）。
// fumadocs-ui 内部 UI 文案由 src/lib/layout.shared.tsx 的 defineI18nUI 管理。
// 本字典只承载页面用到的 副标题 / 导航栏名 / 卡片标题等业务文案。

export const en = {
  // Route state labels / 路由状态界面文案
  loading: 'Loading...',
  loadingTitle: 'Loading Page',
  loadingDesc: 'Generating chunks. Please wait...',
  tagline: 'A Minecraft Server Documentation',
  enterDocs: 'Enter',
  primaryAuthorLabel: 'Primary author:',
  documentContributorsTitle: 'Document contributors',
  communityTitle: 'Discussion',
  communityDesc: 'Welcome to share your thoughts and feedback',
  backToDocs: 'Back to Docs',
  errorTitle: 'Page Failed to Load',
  errorDesc: 'An unexpected error occurred. Please try reloading the page.',
  errorRetry: 'Retry',
  errorHome: 'Back to Home',
  notFoundTitle: 'Page Not Found',
  notFoundDesc:
    'The page you are looking for might have been removed, renamed, or temporarily unavailable.',
  notFoundBack: 'Go Back',
  notFoundHome: 'Back to Home',
  // MC server status labels / MC 服务器状态文案
  serverStatus: 'Server Status',
  serverOnline: 'Online',
  serverOffline: 'Offline',
  serverPlayers: 'Players',
  serverIp: 'Server IP',
  realPlayers: 'Real Players',
  fakePlayers: 'Fake Players',
  fakePlayerUnit: '',
  // Mermaid toolbar a11y labels / Mermaid 工具栏无障碍标签
  mermaidZoomOut: 'Zoom out',
  mermaidZoomIn: 'Zoom in',
  mermaidReset: 'Reset zoom',
  mermaidMaximize: 'Maximize',
  mermaidRestore: 'Restore',
  mermaidToolbar: 'Diagram toolbar',
  // Context menu / 右键菜单
  ctxMenuBackHome: 'Back to Home',
  ctxMenuReload: 'Reload Page',
  ctxMenuCopyLink: 'Copy Link',
  ctxMenuCopyText: 'Copy Selection',
  ctxMenuAbout: 'About ORS',
  // MC status copy IP button / MC 状态 IP 复制按钮
  copiedLabel: 'Copied',
  clickToCopyLabel: 'Click to copy',
  // Skin viewer collapse toggle / 纸娃娃收回切换按钮
  skinViewerCollapse: 'Collapse paper doll',
  skinViewerExpand: 'Expand paper doll',
  // Jukebox music disc player / 唱片机音乐播放器
  jukeboxTitle: 'Jukebox',
  jukeboxToggle: 'Open jukebox',
  jukeboxClose: 'Close jukebox',
  jukeboxPlay: 'Play',
  jukeboxPause: 'Pause',
  jukeboxStop: 'Stop',
  jukeboxNowPlaying: 'Now Playing',
  jukeboxReady: 'Loaded',
  jukeboxNoSelection: 'No disc selected',
  jukeboxPlaybackError: 'Unable to play the selected disc',
  jukeboxDiscNames: {
    Tannng: 'Tannng vocal cut',
    Tannng2: 'Tannng vocal cut 2',
    Tannng3: 'Tannng vocal cut 3',
    Tannng4: 'Tannng vocal cut 4',
    Tannng5: 'Tannng vocal cut 5',
    Tannng6: 'Tannng vocal cut 6',
    Tannng7: 'Tannng vocal cut 7',
    Tannng8: 'Tannng vocal cut 8',
    Tannng9: 'Tannng vocal cut 9',
    Tannng10: 'Tannng vocal cut 10',
  },
} as const;
