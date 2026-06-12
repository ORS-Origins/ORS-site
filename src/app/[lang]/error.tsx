// Locale-aware error boundary: Minecraft-styled error page.
// 多语言错误边界：Minecraft 风格错误页面。

'use client';

import { useEffect } from 'react';
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
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col items-center justify-center p-6">
      <div className="mc-panel p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="mc-destroy-anim w-16 h-16" />
        </div>
        <h1 className="text-2xl font-minecraft-ae text-red-400 text-shadow-md">
          {dict.errorTitle}
        </h1>
        <p className="text-white/60 font-minecraft-ae text-sm">{dict.errorDesc}</p>
        {error.digest && <p className="text-xs text-white/30 font-mono">{error.digest}</p>}
        <button type="button" onClick={reset} className="mc-button px-6 py-2 text-sm">
          {dict.errorRetry}
        </button>
      </div>
    </div>
  );
}
