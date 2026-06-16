// Global loading page: Minecraft block-breaking animation.
// 全局加载页面：Minecraft 方块破坏动画。

'use client';

import { usePathname } from 'next/navigation';
import { RouteState } from '@/components/route-state';
import { getPageDictionary } from '@/dictionaries';
import { getLocaleFromPathname } from '@/lib/i18n';

export default function GlobalLoading() {
  const dict = getPageDictionary(getLocaleFromPathname(usePathname()));

  return <RouteState variant="loading" title={dict.loadingTitle} description={dict.loadingDesc} />;
}
