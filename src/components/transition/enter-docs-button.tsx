'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type MouseEvent, type ReactNode, useCallback, useEffect, useRef } from 'react';
import { storageKeys, themeConfig } from '@/config';

export default function EnterDocsButton({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  const cacheSnapshot = useCallback(() => {
    if (sessionStorage.getItem(storageKeys.transitionSnapshot)) return;

    const mainNode = document.querySelector('main');
    if (!mainNode) return;

    // Cache the heavy DOM snapshot before click time so click feedback and navigation start immediately.
    // 在点击前缓存较重的 DOM 快照，让点击反馈与导航能够立即开始。
    sessionStorage.setItem(storageKeys.transitionSnapshot, mainNode.outerHTML);
  }, []);

  useEffect(() => {
    router.prefetch(href);

    let idleId: number | null = null;
    let frameId: number | null = null;
    const requestIdle = window.requestIdleCallback;

    if (requestIdle) {
      idleId = requestIdle(cacheSnapshot, {
        timeout: themeConfig.docsTransitionSnapshotIdleTimeoutMs,
      });
    } else {
      frameId = globalThis.requestAnimationFrame(cacheSnapshot);
    }

    return () => {
      if (idleId !== null) {
        window.cancelIdleCallback(idleId);
      }
      if (frameId !== null) {
        globalThis.cancelAnimationFrame(frameId);
      }
    };
  }, [cacheSnapshot, href, router]);

  const pressButton = () => {
    // Match Neoverse-Doc's instant CTA feedback without waiting for navigation.
    // 对齐 Neoverse-Doc 的 CTA 即时反馈，不等待路由跳转完成。
    if (spanRef.current) {
      spanRef.current.style.transform = 'scale(0.92)';
      spanRef.current.style.opacity = '0.7';
    }
  };

  const warmupTransition = () => {
    router.prefetch(href);
    cacheSnapshot();
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    let x = e.clientX;
    let y = e.clientY;

    if (x === 0 && y === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    pressButton();

    if (!sessionStorage.getItem(storageKeys.transitionSnapshot)) {
      cacheSnapshot();
    }

    const data = {
      x,
      y,
      scrollY: window.scrollY,
      ts: Date.now(),
      isTransitioning: true,
    };

    // Store only lightweight transition metadata at click time; the DOM snapshot
    // is already cached during idle/pointer warmup.
    // 点击时只写入轻量过渡元数据；DOM 快照已在空闲或指针预热阶段缓存。
    sessionStorage.setItem(storageKeys.transitionData, JSON.stringify(data));

    // Let <Link> handle navigation natively to avoid aborting the in-flight RSC fetch.
    // 让 <Link> 原生处理导航，避免中止进行中的 RSC 请求。
  };

  return (
    <Link
      href={href}
      className={`${className ?? ''} group`}
      onClick={handleClick}
      onFocus={warmupTransition}
      onPointerDown={pressButton}
      onPointerEnter={warmupTransition}
      prefetch
    >
      {/* CSS active state gives same-frame feedback before JavaScript finishes click handling.
          CSS active 状态在 JavaScript 点击处理完成前提供同帧反馈。 */}
      <span
        ref={spanRef}
        className="inline-block transition-all duration-300 ease-out group-active:scale-[0.92] group-active:opacity-70"
      >
        {children}
      </span>
    </Link>
  );
}
