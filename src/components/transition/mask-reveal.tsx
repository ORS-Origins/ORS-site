// Mask-reveal page transition: reads a DOM snapshot and click coordinates
// from sessionStorage, then reveals the target docs page under the snapshot.
// 遮罩揭示页面过渡：从 sessionStorage 读取 DOM 快照与点击坐标，然后揭示快照下方的目标文档页。
'use client';

import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { eventNames, siteConfig, storageKeys, themeConfig } from '@/config';
import { maskRevealTransition } from '@/lib/motion';

interface RevealData {
  x: number;
  y: number;
  domHTML: string;
  scrollY: number;
}

export default function MaskReveal() {
  const pathname = usePathname();
  const isDocsRoute = pathname.includes(siteConfig.docsBaseUrl);

  const readRevealData = useCallback((): RevealData | null => {
    if (typeof window === 'undefined') return null;
    if (!window.location.pathname.includes(siteConfig.docsBaseUrl)) return null;

    const raw = sessionStorage.getItem(storageKeys.transitionData);
    if (!raw) return null;

    try {
      const data = JSON.parse(raw);
      if (!data.isTransitioning || Date.now() - data.ts >= themeConfig.docsTransitionMaxAgeMs) {
        return null;
      }

      const domHTML = data.domHTML ?? sessionStorage.getItem(storageKeys.transitionSnapshot);
      return domHTML
        ? {
            x: data.x,
            y: data.y,
            domHTML,
            scrollY: data.scrollY ?? 0,
          }
        : null;
    } catch {
      return null;
    }
  }, []);

  const [revealData, setRevealData] = useState<RevealData | null>(() =>
    typeof window !== 'undefined' && window.location.pathname.includes(siteConfig.docsBaseUrl)
      ? readRevealData()
      : null,
  );
  const [isRevealReady, setIsRevealReady] = useState(false);
  const [isHoldingOutgoingPage, setIsHoldingOutgoingPage] = useState(false);

  const radius = useMotionValue<number>(0);
  const feather = useMotionValue<number>(themeConfig.maskRevealInitialFeatherPx);
  const maskRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!revealData) return;

    // Reset persistent motion values because this component lives in the root layout.
    // 该组件挂在根布局中不会卸载，因此每次新过渡都要重置持久化的 motion value。
    radius.set(0);
    feather.set(themeConfig.maskRevealInitialFeatherPx);
    if (isDocsRoute) {
      sessionStorage.removeItem(storageKeys.transitionData);
      sessionStorage.removeItem(storageKeys.transitionSnapshot);
    }
  }, [isDocsRoute, revealData, radius, feather]);

  useEffect(() => {
    const handleTransitionStart = (event: Event) => {
      const detail = (event as CustomEvent<RevealData>).detail;
      if (!(detail && typeof detail.domHTML === 'string')) return;

      // Hold the outgoing page before navigation so cold docs loads cannot flash through.
      // 导航前先持有离开页，避免冷加载文档时露出闪烁。
      setIsHoldingOutgoingPage(true);
      setIsRevealReady(false);
      setRevealData({
        x: detail.x,
        y: detail.y,
        domHTML: detail.domHTML,
        scrollY: detail.scrollY ?? 0,
      });
    };

    window.addEventListener(eventNames.docsTransitionStart, handleTransitionStart);

    return () => {
      window.removeEventListener(eventNames.docsTransitionStart, handleTransitionStart);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isDocsRoute) {
      setIsRevealReady(false);
      radius.set(0);
      feather.set(themeConfig.maskRevealInitialFeatherPx);
      if (!isHoldingOutgoingPage) {
        setRevealData(null);
        sessionStorage.removeItem(storageKeys.transitionData);
        sessionStorage.removeItem(storageKeys.transitionSnapshot);
      }
      return;
    }

    setIsHoldingOutgoingPage(false);

    const nextRevealData = readRevealData();
    if (!nextRevealData) return;

    setRevealData((current) => current ?? nextRevealData);
  }, [isDocsRoute, isHoldingOutgoingPage, readRevealData, radius, feather]);

  useEffect(() => {
    if (!revealData || isDocsRoute || !isHoldingOutgoingPage) return;

    const fallbackId = window.setTimeout(
      () => {
        setRevealData(null);
        setIsHoldingOutgoingPage(false);
      },
      Math.max(themeConfig.docsTransitionMaxAgeMs, themeConfig.docsTransitionReadyTimeoutMs),
    );

    return () => {
      window.clearTimeout(fallbackId);
    };
  }, [isDocsRoute, isHoldingOutgoingPage, revealData]);

  useEffect(() => {
    if (!revealData) {
      setIsRevealReady(false);
      return;
    }

    if (!isDocsRoute) {
      setIsRevealReady(false);
      return;
    }

    let frameId: number | null = null;
    let isCancelled = false;
    const startedAt = Date.now();

    const waitForDocsLayout = () => {
      if (isCancelled) return;

      const hasDocsLayout = Boolean(
        document.querySelector(themeConfig.docsTransitionReadySelector),
      );
      const hasTimedOut = Date.now() - startedAt >= themeConfig.docsTransitionReadyTimeoutMs;

      if (hasDocsLayout || hasTimedOut) {
        setIsRevealReady(true);
        return;
      }

      frameId = requestAnimationFrame(waitForDocsLayout);
    };

    waitForDocsLayout();

    return () => {
      isCancelled = true;
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isDocsRoute, revealData]);

  useEffect(() => {
    if (!(revealData && isRevealReady)) return;

    const maxRadius =
      Math.max(
        window.innerWidth,
        window.innerHeight,
        Math.hypot(window.innerWidth, window.innerHeight),
      ) * themeConfig.maskRevealRadiusScale;

    let controls: ReturnType<typeof animate> | null = null;
    let featherControls: ReturnType<typeof animate> | null = null;

    // Start on the next paint after the snapshot is injected, otherwise route
    // rendering can consume the first visible frames and make the reveal jump.
    // 在快照注入后的下一帧启动动画，避免路由渲染吞掉首批可见帧导致揭示半径跳变。
    const frameId = requestAnimationFrame(() => {
      controls = animate(radius, maxRadius, {
        ...maskRevealTransition,
        onComplete: () => {
          setRevealData(null);
          setIsHoldingOutgoingPage(false);
        },
      });

      // Feather animation softens the edge while the cutout expands.
      // 羽化动画会在圆形裁切扩张时柔化边缘。
      featherControls = animate(feather, maxRadius * themeConfig.maskRevealFeatherScale, {
        duration: maskRevealTransition.duration,
        ease: maskRevealTransition.ease,
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
      controls?.stop();
      featherControls?.stop();
    };
  }, [isRevealReady, revealData, radius, feather]);

  const featheredEdge = useTransform([radius, feather], ([r, f]) => Number(r) + Number(f));
  const maskImage = useMotionTemplate`radial-gradient(circle at ${revealData?.x ?? 0}px ${revealData?.y ?? 0}px, transparent ${radius}px, black ${featheredEdge}px)`;
  const activeMaskImage = isRevealReady ? maskImage : 'linear-gradient(black, black)';

  // Render the snapshot HTML with the overlay so its first paint already contains the held page.
  // 随遮罩同步渲染快照 HTML，确保首帧就已经持有离开页。
  const snapshotHTML = revealData
    ? revealData.scrollY > 0
      ? `<div style="transform:translateY(${-revealData.scrollY}px);will-change:transform;">${revealData.domHTML}</div>`
      : revealData.domHTML
    : '';

  useLayoutEffect(() => {
    if (!(maskRef.current && revealData)) return;

    maskRef.current.innerHTML = snapshotHTML;
  }, [revealData, snapshotHTML]);

  if (!revealData) return null;

  return (
    <motion.div
      id="nd-docs-transition-mask"
      className="fixed inset-0 z-[9999] pointer-events-none bg-background"
      ref={maskRef}
      style={{
        opacity: 1,
        willChange: 'mask-image, -webkit-mask-image',
        WebkitMaskImage: activeMaskImage,
        maskImage: activeMaskImage,
      }}
    />
  );
}
