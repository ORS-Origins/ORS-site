// Global error boundary: Minecraft-styled error page.
// 全局错误边界：Minecraft 风格错误页面。

'use client';

import { Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RouteState } from '@/components/route-state';
import { getPageDictionary } from '@/dictionaries';
import { i18n } from '@/lib/i18n';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Render a client-side timestamp so users can correlate screenshots with server logs.
  // 渲染客户端时间戳，方便用户将截图与服务器日志对应。
  const [trace, setTrace] = useState('');
  useEffect(() => {
    setTrace(new Date().toISOString());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const dict = getPageDictionary(i18n.defaultLanguage);

  return (
    <RouteState
      variant="error"
      title={dict.errorTitle}
      description={dict.errorDesc}
      digest={trace ? `${error.name} · ${trace}` : error.name}
      actions={
        // Error recovery actions: retry the boundary or leave for the localized home route.
        // 错误恢复操作：重试边界或返回本地化首页。
        <>
          <button type="button" onClick={reset} className="mc-button route-state__action">
            <RotateCcw className="size-4" aria-hidden="true" />
            <span>{dict.errorRetry}</span>
          </button>
          <Link href={`/${i18n.defaultLanguage}`} className="mc-button route-state__action">
            <Home className="size-4" aria-hidden="true" />
            <span>{dict.errorHome}</span>
          </Link>
        </>
      }
    />
  );
}
