'use client';

import Link from 'next/link';
import { type MouseEvent, type ReactNode, useRef } from 'react';
import { storageKeys } from '@/config';

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

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    let x = e.clientX;
    let y = e.clientY;

    if (x === 0 && y === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    // Provide immediate tactile feedback via direct DOM manipulation
    // (avoids React state update that could abort the in-flight RSC fetch).
    // 通过直接 DOM 操作提供即时触觉反馈
    // （避免 React 状态更新触发重渲染，从而中止进行中的 RSC 请求）。
    if (spanRef.current) {
      spanRef.current.style.transform = 'scale(0.92)';
      spanRef.current.style.opacity = '0.7';
    }

    // Clone the current native DOM shell as a string and cache it;
    // the new page restores it via dangerouslySetInnerHTML on mount.
    // Also capture the current scroll offset — HomeLayout is taller than
    // the viewport (sticky navbar + min-h-screen inner main), so the user
    // may be scrolled by up to navbar-height pixels. Without this, the
    // cloned snapshot renders at scrollY=0 and the content appears to
    // "jump to the top of the page" the instant the mask appears.
    // 把当前屏幕里的原生态 DOM 节点外壳克隆下来，作为字符串存入缓存
    // 新页面挂载时通过 dangerouslySetInnerHTML 直接还原
    // 同时记录当前滚动偏移 — HomeLayout 总高 = 顶部 sticky navbar + min-h-screen
    // 内层主区，比视口高，用户最多可滚动 navbar 那点高度。不记录的话，克隆快照
    // 总以 scrollY=0 渲染，遮罩出现的瞬间内容会"瞬间跳到页面顶部"。
    const mainNode = document.querySelector('main');

    if (mainNode) {
      const domHTML = mainNode.outerHTML;
      const scrollY = window.scrollY;
      const data = {
        x,
        y,
        domHTML,
        scrollY,
        ts: Date.now(),
        isTransitioning: true,
      };
      sessionStorage.setItem(storageKeys.transitionData, JSON.stringify(data));
    }

    // Do NOT call e.preventDefault() or router.push() here.
    // Let the <Link> handle navigation natively — calling router.push
    // alongside a React state update causes the ?_rsc= fetch to be aborted.
    // 不要调用 e.preventDefault() 或 router.push()。
    // 让 <Link> 原生处理导航 — 在 React 状态更新旁调用 router.push
    // 会导致 ?_rsc= 请求被中止。
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      <span ref={spanRef} className="inline-block transition-all duration-300 ease-out">
        {children}
      </span>
    </Link>
  );
}
