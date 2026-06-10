// Shared i18n config (single source of truth).
// 集中式 i18n 配置（唯一来源）。
import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'zh',
  languages: ['zh', 'en'],
  parser: 'dir',
});

export type Locale = (typeof i18n.languages)[number];
