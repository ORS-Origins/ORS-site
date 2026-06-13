// Docs layout: pulls the locale-specific page tree.
// 文档布局：按语言取页面树。

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { Sidebar, SidebarTrigger, useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import type { CSSProperties } from 'react';
import { SidebarProvider } from '@/components/sidebar-provider';
import { SkinViewerComponent } from '@/components/skin-viewer';
import MaskReveal from '@/components/transition/mask-reveal';
import { uiConfig } from '@/config';
import { i18n, type Locale } from '@/lib/i18n';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

// Docs layout sizing bridge: feeds configurable Fumadocs CSS variables to the official containerProps API.
// 文档布局尺寸桥接：通过官方 containerProps API 注入可配置的 Fumadocs CSS 变量。
const docsLayoutStyle = {
  '--fd-layout-width': uiConfig.docsLayout.layoutWidth,
  '--fd-sidebar-width': uiConfig.docsLayout.sidebarWidth,
} satisfies CSSProperties & Record<'--fd-layout-width' | '--fd-sidebar-width', string>;

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function Layout({ params, children }: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;
  const locale = (lang as Locale) ?? i18n.defaultLanguage;

  return (
    <>
      <MaskReveal />
      {/* Unified docs background container / 统一的文档背景容器 */}
      <div className="mc-doc-shell">
        {/* Subtle Minecraft-themed ambient background effects.
            微妙的 Minecraft 风格环境背景光效。 */}
        <div aria-hidden="true" className="mc-doc-background">
          <div className="mc-doc-halo mc-doc-halo--emerald" />
          <div className="mc-doc-halo mc-doc-halo--sky" />
          <div className="mc-doc-halo mc-doc-halo--amethyst" />
          <div className="mc-doc-float-block mc-doc-float-block--diamond" />
          <div className="mc-doc-float-block mc-doc-float-block--emerald" />
          <div className="mc-doc-float-block mc-doc-float-block--lapis" />
          <div className="mc-doc-float-block mc-doc-float-block--glowstone" />
          <div className="mc-doc-float-block mc-doc-float-block--prismarine" />
          <div className="mc-doc-float-block mc-doc-float-block--redstone" />
          <div className="mc-doc-float-block mc-doc-float-block--iron" />
          <div className="mc-doc-pixel-dust" />
          <div className="mc-doc-pixel-dust" />
          <div className="mc-doc-pixel-dust" />
          <div className="mc-doc-pixel-dust" />
          <div className="mc-doc-pixel-dust" />
          <div className="mc-doc-pixel-dust" />
          <div className="mc-doc-pixel-dust" />
          <div className="mc-doc-pixel-dust" />
        </div>
        <div className="mc-doc-content">
          <DocsLayout
            tree={source.pageTree[locale]}
            {...baseOptions(locale)}
            containerProps={{
              style: docsLayoutStyle,
            }}
            slots={{
              sidebar: {
                provider: SidebarProvider,
                root: Sidebar,
                trigger: SidebarTrigger,
                useSidebar,
              },
            }}
          >
            {children}
          </DocsLayout>
        </div>
      </div>
      <SkinViewerComponent />
    </>
  );
}
