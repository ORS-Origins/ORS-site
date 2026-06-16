// Global 404 page: Minecraft-styled not-found page.
// 全局 404 页面：Minecraft 风格页面未找到。

'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RouteState } from '@/components/route-state';
import { getPageDictionary } from '@/dictionaries';
import { getLocaleFromPathname } from '@/lib/i18n';

export default function NotFoundPage() {
  const locale = getLocaleFromPathname(usePathname());
  const dict = getPageDictionary(locale);

  return (
    <RouteState
      variant="not-found"
      code="404"
      title={dict.notFoundTitle}
      description={dict.notFoundDesc}
      actions={
        // Home action keeps the global 404 recoverable without relying on browser history.
        // 返回首页操作让全局 404 不依赖浏览器历史也能恢复。
        <Link href={`/${locale}`} className="mc-button route-state__action">
          <Home className="size-4" aria-hidden="true" />
          <span>{dict.notFoundHome}</span>
        </Link>
      }
    />
  );
}
