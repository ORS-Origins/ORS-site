// Persistent route transition layer: keeps the loading surface visible across root redirects.
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

    const handleRootRedirectStart = () => {
      showLayer();
    };
    const handleRootRedirectReady = () => {
      clearReadyTimeout();
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(startLeaving);
      });
    };

    window.addEventListener(eventNames.rootRedirectTransitionStart, handleRootRedirectStart);
    window.addEventListener(eventNames.rootRedirectTransitionReady, handleRootRedirectReady);

    return () => {
      clearHideTimeout();
      clearReadyTimeout();
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
    window.dispatchEvent(new Event(eventNames.rootRedirectTransitionReady));
  }, []);

  return null;
}
