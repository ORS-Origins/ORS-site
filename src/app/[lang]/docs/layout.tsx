// Docs layout: pulls the locale-specific page tree.
// 文档布局：按语言取页面树。

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { Sidebar, SidebarTrigger, useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { SidebarProvider } from '@/components/sidebar-provider';
import { SkinViewerComponent } from '@/components/skin-viewer';
import MaskReveal from '@/components/transition/mask-reveal';
import { i18n, type Locale } from '@/lib/i18n';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function Layout({ params, children }: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;
  const locale = (lang as Locale) ?? i18n.defaultLanguage;

  return (
    <>
      <MaskReveal />
      <DocsLayout
        tree={source.pageTree[locale]}
        {...baseOptions(locale)}
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
      <SkinViewerComponent />
    </>
  );
}
