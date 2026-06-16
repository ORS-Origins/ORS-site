// Shared i18n config (single source of truth).
// 集中式 i18n 配置（唯一来源）。
import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'zh',
  languages: ['zh', 'en'],
  parser: 'dir',
});

export type Locale = (typeof i18n.languages)[number];

export function getLocaleFromPathname(pathname: string | null | undefined): Locale {
  // Resolve locale from the first route segment for global route-state boundaries.
  // 为全局路由状态边界从首个路径片段解析语言。
  const [firstSegment] = pathname?.split('/').filter(Boolean) ?? [];

  return i18n.languages.includes(firstSegment as Locale)
    ? (firstSegment as Locale)
    : i18n.defaultLanguage;
}
