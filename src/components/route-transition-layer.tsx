// Persistent route transition layer: keeps the loading surface visible across root redirects.
// 常驻路由过渡层：在根路径重定向期间保持加载界面可见。
'use client';

import { useEffect, useRef, useState } from 'react';
import { RouteState } from '@/components/route-state';
import { eventNames, uiConfig } from '@/config';
import { getPageDictionary } from '@/dictionaries';
import { i18n } from '@/lib/i18n';

type TransitionPhase = 'hidden' | 'visible' | 'leaving';

export function RouteTransitionLayer() {
  const phaseRef = useRef<TransitionPhase>('hidden');
  const hideTimeoutRef = useRef<number | null>(null);
  const readyTimeoutRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('hidden');
  const dict = getPageDictionary(i18n.defaultLanguage);

  useEffect(() => {
    const clearHideTimeout = () => {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
    const clearReadyTimeout = () => {
      if (readyTimeoutRef.current !== null) {
        window.clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = null;
      }
    };
    const setTransitionPhase = (nextPhase: TransitionPhase) => {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
    };
    const showLayer = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      clearHideTimeout();
      clearReadyTimeout();
      setTransitionPhase('visible');

      readyTimeoutRef.current = window.setTimeout(
        startLeaving,
        uiConfig.routeTransition.redirectWaitTimeoutMs,
      );
    };
    const startLeaving = () => {
      if (phaseRef.current !== 'visible') {
        return;
      }

      clearReadyTimeout();
      setTransitionPhase('leaving');
      hideTimeoutRef.current = window.setTimeout(() => {
        setTransitionPhase('hidden');
        hideTimeoutRef.current = null;
      }, uiConfig.routeTransition.rootRedirectDurationMs);
    };

    const handleRootRedirectStart = () => {
      showLayer();
    };

    const handleInternalLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target || link.hasAttribute('download')) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      const isSameOrigin = url.origin === window.location.origin;
      const isSameDocumentRoute =
        url.pathname === window.location.pathname && url.search === window.location.search;

      if (isSameOrigin && !isSameDocumentRoute) {
        // Start before the next route mounts so the current page fades smoothly into loading.
        // 在下一个路由挂载前启动，使当前页面平滑过渡到加载态。
        showLayer();
      }
    };

    const handleRootRedirectReady = () => {
      clearReadyTimeout();
      readyTimeoutRef.current = window.setTimeout(() => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(startLeaving);
        });
      }, uiConfig.routeTransition.readyRevealDelayMs);
    };

    document.addEventListener('click', handleInternalLinkClick);
    window.addEventListener(eventNames.rootRedirectTransitionStart, handleRootRedirectStart);
    window.addEventListener(eventNames.rootRedirectTransitionReady, handleRootRedirectReady);

    return () => {
      clearHideTimeout();
      clearReadyTimeout();
      document.removeEventListener('click', handleInternalLinkClick);
      window.removeEventListener(eventNames.rootRedirectTransitionStart, handleRootRedirectStart);
      window.removeEventListener(eventNames.rootRedirectTransitionReady, handleRootRedirectReady);
    };
  }, []);

  if (phase === 'hidden') {
    return null;
  }

  return (
    <div className={`route-transition-layer route-transition-layer--${phase}`} aria-hidden="true">
      <RouteState variant="loading" title={dict.loadingTitle} description={dict.loadingDesc} />
    </div>
  );
}

export function RouteTransitionReadySignal() {
  useEffect(() => {
    // Tell the persistent layer that this page can now be revealed.
    // 通知常驻过渡层当前页面已经可以揭示。
    window.dispatchEvent(new Event(eventNames.rootRedirectTransitionReady));
  }, []);

  return null;
}
