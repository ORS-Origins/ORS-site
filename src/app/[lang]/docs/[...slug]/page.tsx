// Dynamic doc page: renders MDX content with Mermaid support.
// 动态文档页：渲染 MDX 内容，支持 Mermaid 图表。
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CustomCodeBlock } from '@/components/mdx/custom-codeblock';
import { Mermaid } from '@/components/mdx/mermaid';
import { uiConfig } from '@/config';
import { getPageDictionary } from '@/dictionaries';
import { i18n, type Locale } from '@/lib/i18n';
import { source } from '@/lib/source';

export default async function Page(props: PageProps<'/[lang]/docs/[...slug]'>) {
  const { slug, lang } = await props.params;
  const locale = (lang as Locale) ?? i18n.defaultLanguage;
  const dict = getPageDictionary(locale);
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const MDX = page.data.body;
  const _contributors = page.data.contributors ?? page.data.contributor;

  return (
    <div className="relative isolate">
      {/* Subtle Minecraft-themed ambient background effects.
          微妙的 Minecraft 风格环境背景光效。 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
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

      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        tableOfContent={{ style: uiConfig.tocStyle }}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        {page.data.author && (
          <p className="text-sm text-fd-muted-foreground mb-4">
            {dict.primaryAuthorLabel}
            {page.data.author}
          </p>
        )}
        <DocsBody>
          <MDX components={{ ...defaultMdxComponents, Mermaid, pre: CustomCodeBlock }} />
        </DocsBody>
      </DocsPage>
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/[lang]/docs/[...slug]'>,
): Promise<Metadata> {
  const { slug, lang } = await props.params;
  const locale = (lang as Locale) ?? i18n.defaultLanguage;
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
