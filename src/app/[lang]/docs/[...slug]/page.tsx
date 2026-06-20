// Dynamic doc page: renders MDX content with Mermaid support.
// 动态文档页：渲染 MDX 内容，支持 Mermaid 图表。
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Tab, Tabs } from '@/components/mdx/code-tabs';
import { CustomCodeBlock } from '@/components/mdx/custom-codeblock';
import { DocsAuthor, DocsContributors } from '@/components/mdx/docs-author';
import { Mermaid } from '@/components/mdx/mermaid';
import { RouteTransitionReadySignal } from '@/components/route-transition-layer';
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
  // Contributor frontmatter supports both singular and plural keys.
  // 贡献者 frontmatter 同时兼容单数与复数字段。
  const contributors = page.data.contributors ?? page.data.contributor;

  return (
    // Page enter transition: apply to the article container without wrapping Fumadocs grid siblings.
    // 页面进入过渡：挂到文章容器上，避免额外包裹破坏 Fumadocs 网格兄弟节点。
    <DocsPage
      className="route-page-enter"
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: uiConfig.tocStyle }}
    >
      <RouteTransitionReadySignal />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {page.data.author && <DocsAuthor author={page.data.author} label={dict.primaryAuthorLabel} />}
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, Mermaid, pre: CustomCodeBlock, Tabs, Tab }} />
      </DocsBody>
      {contributors && (
        <DocsContributors contributors={contributors} title={dict.documentContributorsTitle} />
      )}
    </DocsPage>
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
