// Root redirect: static export does not support Next.js middleware,
// so we use useRouter for reliable client-side redirect.
// 根路径重定向：静态导出不支持 Next.js middleware，
// 使用 useRouter 实现可靠的客户端重定向。

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RouteState } from '@/components/route-state';
import { eventNames, uiConfig } from '@/config';
import { getPageDictionary } from '@/dictionaries';
import { i18n } from '@/lib/i18n';

let rootRedirectInProgress = false;

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (rootRedirectInProgress) {
      return;
    }

    rootRedirectInProgress = true;

    const destination = `/${i18n.defaultLanguage}`;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navigate = () => {
      router.replace(destination);
      window.setTimeout(() => {
        rootRedirectInProgress = false;
      }, uiConfig.routeTransition.redirectWaitTimeoutMs);
    };

    if (reducedMotion) {
      navigate();
      return;
    }

    // Keep a persistent loading overlay alive across the client redirect.
    // 在客户端重定向期间保持常驻加载覆盖层，避免根加载页到首页出现断层。
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event(eventNames.rootRedirectTransitionStart));
      window.requestAnimationFrame(navigate);
    });
  }, [router]);

  const dict = getPageDictionary(i18n.defaultLanguage);

  return <RouteState variant="loading" title={dict.loadingTitle} description={dict.loadingDesc} />;
}
