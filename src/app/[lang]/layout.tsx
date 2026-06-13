// Locale-aware layout. RootProvider with i18n support.
// 语言感知布局。带 i18n 支持的 RootProvider。
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { ContextMenu } from '@/components/context-menu';
import { CursorAnimator } from '@/components/cursor-animator';
import DefaultSearchDialog from '@/components/search';
import MaskReveal from '@/components/transition/mask-reveal';

import { siteConfig } from '@/config';
import { getPageDictionary } from '@/dictionaries';
import { i18n, type Locale } from '@/lib/i18n';
import { i18nProvider, i18nUI } from '@/lib/layout.shared';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export async function generateMetadata(props: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await props.params;
  const locale = (lang as Locale) ?? i18n.defaultLanguage;
  const dict = getPageDictionary(locale);

  return {
    title: siteConfig.appName,
    description: dict.tagline,
    icons: {
      icon: siteConfig.faviconPath,
    },
  };
}

export default async function LangLayout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  const locale = (lang as Locale) ?? i18n.defaultLanguage;

  return (
    <RootProvider
      search={{
        SearchDialog: DefaultSearchDialog,
      }}
      theme={{ enabled: false }}
      i18n={i18nProvider(i18nUI, locale)}
    >
      <CursorAnimator />
      <ContextMenu locale={locale} />
      <MaskReveal />
      {children}
    </RootProvider>
  );
}
