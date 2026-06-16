// Root redirect: static export does not support Next.js middleware,
// so we use useRouter for reliable client-side redirect.
// 根路径重定向：静态导出不支持 Next.js middleware，
// 使用 useRouter 实现可靠的客户端重定向。

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RouteState } from '@/components/route-state';
import { getPageDictionary } from '@/dictionaries';
import { i18n } from '@/lib/i18n';

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${i18n.defaultLanguage}`);
  }, [router]);

  const dict = getPageDictionary(i18n.defaultLanguage);

  return <RouteState variant="loading" title={dict.loadingTitle} description={dict.loadingDesc} />;
}
