// Locale-aware error boundary: Minecraft-styled error page.
// 多语言错误边界：Minecraft 风格错误页面。

'use client';

import { Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { RouteState } from '@/components/route-state';
import { getPageDictionary } from '@/dictionaries';
import { i18n } from '@/lib/i18n';

export default function LocaleError({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  params: { lang: string };
}) {
  const locale = i18n.languages.includes(params.lang as (typeof i18n.languages)[number])
    ? (params.lang as (typeof i18n.languages)[number])
    : i18n.defaultLanguage;
  const dict = getPageDictionary(locale);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <RouteState
      variant="error"
      title={dict.errorTitle}
      description={dict.errorDesc}
      digest={error.digest}
      actions={
        // Locale-aware recovery actions for nested route errors.
        // 嵌套路由错误的本地化恢复操作。
        <>
          <button type="button" onClick={reset} className="mc-button route-state__action">
            <RotateCcw className="size-4" aria-hidden="true" />
            <span>{dict.errorRetry}</span>
          </button>
          <Link href={`/${locale}`} className="mc-button route-state__action">
            <Home className="size-4" aria-hidden="true" />
            <span>{dict.errorHome}</span>
          </Link>
        </>
      }
    />
  );
}
