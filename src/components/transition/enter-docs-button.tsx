'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type MouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { eventNames, storageKeys, themeConfig } from '@/config';

// Native browser shortcuts should keep their default link behavior.
// 浏览器原生快捷操作应保留默认链接行为。
function isNativeLinkIntent(e: MouseEvent<HTMLAnchorElement>) {
  return e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}

function visualFreezeStyle(style: CSSStyleDeclaration) {
  return [
    `opacity:${style.opacity}`,
    `transform:${style.transform}`,
    `filter:${style.filter}`,
    'animation:none !important',
    'transition:none !important',
    'will-change:auto',
  ].join(';');
}

function querySnapshotNodes(root: Element, selector: string) {
  const nodes = Array.from(root.querySelectorAll(selector));
  return root.matches(selector) ? [root, ...nodes] : nodes;
}

function freezeSnapshotStyles(sourceRoot: Element, cloneRoot: Element) {
  for (const selector of themeConfig.docsTransitionSnapshotFreezeSelectors) {
    const sourceNodes = querySnapshotNodes(sourceRoot, selector);
    const cloneNodes = querySnapshotNodes(cloneRoot, selector);

    sourceNodes.forEach((sourceNode, index) => {
      const cloneNode = cloneNodes[index];
      if (!cloneNode) return;

      // Freeze only the visually volatile properties; copying every computed CSS
      // property is noticeably expensive on the animated homepage.
      // 只冻结视觉上会跳变的属性；复制全部计算样式会让动画首页点击时明显卡顿。
      cloneNode.setAttribute('style', visualFreezeStyle(getComputedStyle(sourceNode)));
    });
  }
}

function createSnapshotHTML() {
  const mainNode = document.querySelector('main');
  if (!mainNode) return null;

  const clone = mainNode.cloneNode(true) as Element;

  // Freeze the copied page at the exact clicked visual frame.
  // 将复制页面冻结在点击瞬间的视觉帧。
  freezeSnapshotStyles(mainNode, clone);
  clone.setAttribute('aria-hidden', 'true');

  return clone.outerHTML;
}

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
  const hasPointerSnapshotRef = useRef(false);
  const router = useRouter();
  const [isTransitionReady, setIsTransitionReady] = useState(false);
  const pointerSnapshotRef = useRef<string | null>(null);

  const cacheSnapshot = useCallback((options?: { force?: boolean; persist?: boolean }) => {
    try {
      const existingSnapshot = sessionStorage.getItem(storageKeys.transitionSnapshot);
      if (existingSnapshot && !options?.force) return existingSnapshot;

      // Cache the heavy DOM snapshot before click time so click feedback and navigation start immediately.
      // 在点击前缓存较重的 DOM 快照，让点击反馈与导航能够立即开始。
      const nextSnapshot = createSnapshotHTML();
      if (!nextSnapshot) return null;

      if (options?.persist !== false) {
        sessionStorage.setItem(storageKeys.transitionSnapshot, nextSnapshot);
      }

      return nextSnapshot;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    router.prefetch(href);

    // Enable the CTA after hydration; pointerdown captures the exact visual frame for the transition.
    // hydration 后启用 CTA；pointerdown 会捕获用于过渡的精确视觉帧。
    setIsTransitionReady(true);

    let idleId: number | null = null;
    let frameId: number | null = null;
    const requestIdle = window.requestIdleCallback;

    if (requestIdle) {
      idleId = requestIdle(
        () => {
          cacheSnapshot();
        },
        {
          timeout: themeConfig.docsTransitionSnapshotIdleTimeoutMs,
        },
      );
    } else {
      frameId = globalThis.requestAnimationFrame(() => {
        cacheSnapshot();
      });
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

  const handlePointerDown = () => {
    pressButton();
    pointerSnapshotRef.current = cacheSnapshot({ force: true, persist: false });
    hasPointerSnapshotRef.current = Boolean(pointerSnapshotRef.current);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isNativeLinkIntent(e)) return;

    e.preventDefault();

    if (!isTransitionReady) {
      return;
    }

    let x = e.clientX;
    let y = e.clientY;

    if (x === 0 && y === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    pressButton();

    const domHTML = hasPointerSnapshotRef.current
      ? pointerSnapshotRef.current
      : cacheSnapshot({ force: true, persist: false });
    hasPointerSnapshotRef.current = false;
    pointerSnapshotRef.current = null;

    if (!domHTML) {
      router.push(href);
      return;
    }

    const data = {
      x,
      y,
      scrollY: window.scrollY,
      ts: Date.now(),
      isTransitioning: true,
    };

    // Hold the current homepage snapshot immediately; the reveal waits for docs readiness.
    // 立即持有当前首页快照；揭示动画会等待文档就绪后再播放。
    window.dispatchEvent(
      new CustomEvent(eventNames.docsTransitionStart, {
        detail: {
          ...data,
          domHTML,
        },
      }),
    );

    // Store only lightweight transition metadata at click time; the DOM snapshot
    // is already cached during hydration, idle, or pointer warmup.
    // 点击时只写入轻量过渡元数据；DOM 快照已在 hydration、空闲或指针预热阶段缓存。
    try {
      sessionStorage.setItem(storageKeys.transitionData, JSON.stringify(data));
    } catch {
      router.push(href);
      return;
    }

    // Navigate after the transition payload is committed so first-load clicks cannot outrun the reveal.
    // 在过渡数据写入后再导航，避免首次加载点击抢跑导致遮罩动画丢失。
    requestAnimationFrame(() => {
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      className={`${className ?? ''} group ${isTransitionReady ? '' : 'pointer-events-none'}`}
      onClick={handleClick}
      onFocus={warmupTransition}
      onPointerDown={handlePointerDown}
      onPointerEnter={warmupTransition}
      aria-disabled={!isTransitionReady}
      tabIndex={isTransitionReady ? undefined : -1}
      prefetch
    >
      {/* CSS active state gives same-frame feedback before JavaScript finishes click handling.
          CSS active 状态在 JavaScript 点击处理完成前提供同帧反馈。*/}
      <span
        ref={spanRef}
        className="inline-block transition-all duration-300 ease-out group-active:scale-[0.92] group-active:opacity-70"
      >
        {children}
      </span>
    </Link>
  );
}
