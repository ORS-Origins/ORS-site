// Fumadocs UI translations + locale-aware base layout options.
// Fumadocs UI 翻译 + 语言感知的基础布局选项。
import { i18nProvider, uiTranslations } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { siteConfig } from '@/config';
import { i18n, type Locale } from '@/lib/i18n';

export const i18nUI = i18n
  .translations()
  .extend(uiTranslations())
  .add('ui', {
    zh: {
      displayName: '中文',
      search: '搜索',
      searchNoResult: '未找到结果',
      toc: '本页目录',
      tocNoHeadings: '无标题',
      tocInline: '目录',
      lastUpdate: '最后更新于',
      chooseLanguage: '选择语言',
      nextPage: '下一页',
      previousPage: '上一页',
      chooseTheme: '主题',
      editOnGithub: '在 GitHub 上编辑',
      themeLight: '浅色',
      themeDark: '深色',
      themeSystem: '跟随系统',
      codeBlockCopy: '复制',
      codeBlockCopied: '已复制',
      accordionCopyAnchor: '复制链接',
      headingCopyAnchor: '复制锚点链接',
      bannerClose: '关闭横幅',
      searchOpen: '打开搜索',
      searchClose: '关闭搜索',
      menuToggle: '切换菜单',
      themeToggle: '切换主题',
      sidebarOpen: '打开侧栏',
      sidebarCollapse: '折叠侧栏',
      notFoundTitle: '页面未找到',
      notFoundDescription: '你访问的页面可能已被移除、重命名或暂时不可用。',
      notFoundLink: '返回首页',
    },
    en: {
      displayName: 'English',
    },
  });

export { i18nProvider };

export function baseOptions(locale: Locale = i18n.defaultLanguage): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2">
          {/* biome-ignore lint/performance/noImgElement: static site logo */}
          <img src="/imgs/widget/ors.png" alt="ORS" className="h-6 w-auto" />
          <span className="font-minecraft-ae font-bold text-xl tracking-wider">
            {siteConfig.appName}
          </span>
        </span>
      ),
      url: `/${locale}`,
    },
    links: [],
  };
}
