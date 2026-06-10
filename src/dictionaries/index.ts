// Page dictionary index.
// 页面字典入口。
import type { Locale } from '@/lib/i18n';
import { i18n } from '@/lib/i18n';
import { en } from './en';
import { zh } from './zh';

const dictionaries = { zh, en } as const;

export function getPageDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[i18n.defaultLanguage];
}
