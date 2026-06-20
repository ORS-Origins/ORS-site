// Localized route loading surface: reuses page dictionaries inside loading boundaries.
'use client';

import { useParams } from 'next/navigation';
import { RouteState } from '@/components/route-state';
import { getPageDictionary } from '@/dictionaries';
import { i18n, type Locale } from '@/lib/i18n';

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && i18n.languages.includes(value as Locale);
}

export function LocalizedRouteLoading() {
  const params = useParams<{ lang?: string }>();
  const locale = isLocale(params.lang) ? params.lang : i18n.defaultLanguage;
  const dict = getPageDictionary(locale);

  return <RouteState variant="loading" title={dict.loadingTitle} description={dict.loadingDesc} />;
}
