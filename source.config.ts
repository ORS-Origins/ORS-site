import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert';
import { z } from 'zod';

// Shared person field schema for author and contributor frontmatter.
// 作者与贡献者 frontmatter 共用的人名字段 schema。
const personFieldSchema = z.union([z.string(), z.array(z.string())]);

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      author: personFieldSchema.optional(),
      contributor: personFieldSchema.optional(),
      contributors: personFieldSchema.optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkGithubBlockquoteAlert, remarkMdxMermaid],
    rehypeCodeOptions: {
      transformers: [],
    } as never,
  },
});
