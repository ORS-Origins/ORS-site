// Mask-reveal page transition: reads a DOM snapshot and click coordinates
// from sessionStorage, then reveals the target docs page under the snapshot.
// 遮罩揭示页面过渡：从 sessionStorage 读取 DOM 快照与点击坐标，然后揭示快照下方的目标文档页。
'use client';

import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { siteConfig, storageKeys, themeConfig } from '@/config';
import { maskRevealTransition } from '@/lib/motion';

interface RevealData {
  x: number;
  y: number;
  domHTML: string;
  scrollY: number;
}

export default function MaskReveal() {
  const pathname = usePathname();

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

  const radius = useMotionValue<number>(0);
  const feather = useMotionValue<number>(themeConfig.maskRevealInitialFeatherPx);
  const maskRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!revealData) return;

    // Reset persistent motion values because this component lives in the root layout.
    // 该组件挂在根布局中不会卸载，因此每次新过渡都要重置持久化的 motion value。
    radius.set(0);
    feather.set(themeConfig.maskRevealInitialFeatherPx);
    sessionStorage.removeItem(storageKeys.transitionData);
    sessionStorage.removeItem(storageKeys.transitionSnapshot);
  }, [revealData, radius, feather]);

  useLayoutEffect(() => {
    if (!pathname.includes(siteConfig.docsBaseUrl)) {
      setRevealData(null);
      radius.set(0);
      feather.set(themeConfig.maskRevealInitialFeatherPx);
      sessionStorage.removeItem(storageKeys.transitionData);
      sessionStorage.removeItem(storageKeys.transitionSnapshot);
      return;
    }

    const nextRevealData = readRevealData();
    if (!nextRevealData) return;

    setRevealData((current) => current ?? nextRevealData);
  }, [pathname, readRevealData, radius, feather]);

  useEffect(() => {
    if (!revealData) return;

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
  }, [revealData, radius, feather]);

  const featheredEdge = useTransform([radius, feather], ([r, f]) => Number(r) + Number(f));
  const maskImage = useMotionTemplate`radial-gradient(circle at ${revealData?.x ?? 0}px ${revealData?.y ?? 0}px, transparent ${radius}px, black ${featheredEdge}px)`;

  useLayoutEffect(() => {
    if (!(maskRef.current && revealData)) return;

    maskRef.current.innerHTML =
      revealData.scrollY > 0
        ? `<div style="transform:translateY(${-revealData.scrollY}px);will-change:transform;">${revealData.domHTML}</div>`
        : revealData.domHTML;
  }, [revealData]);

  if (!revealData) return null;

  return (
    <motion.div
      id="nd-docs-transition-mask"
      className="fixed inset-0 z-[9999] pointer-events-none bg-background"
      ref={maskRef}
      style={{
        opacity: 1,
        willChange: 'mask-image, -webkit-mask-image',
        WebkitMaskImage: maskImage,
        maskImage,
      }}
    />
  );
}
