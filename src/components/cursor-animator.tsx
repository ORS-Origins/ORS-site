// Animated cursor system: cycles through multi-frame PNG cursors based on
// the currently hovered element type. Matches Minecraft cursor style.
// 动态鼠标指针系统：根据当前悬停的元素类型循环播放多帧 PNG 光标。
// 匹配 Minecraft 指针风格。
'use client';

import { useEffect, useRef } from 'react';
import { cursorConfig } from '@/config';

// Build frame sequence arrays from config / 根据配置构建帧序列数组
function buildFrameSequence(key: keyof typeof cursorConfig.frameSequences): string[] {
  const cfg = cursorConfig.frameSequences[key];
  return Array.from({ length: cfg.length }, (_, i) => {
    const frame = String(i + 1).padStart(2, '0');
    return `${cursorConfig.pathPrefix}/${cfg.filenameTemplate.replace('{frame}', frame)}`;
  });
}

const CURSOR_SEQUENCES = {
  pointer: buildFrameSequence('pointer'),
  grabbing: buildFrameSequence('grabbing'),
  notAllowed: buildFrameSequence('notAllowed'),
} as const;

// Build static cursor paths from config / 根据配置构建静态光标路径
const STATIC_CURSORS: Record<string, string> = Object.fromEntries(
  Object.entries(cursorConfig.staticCursors).map(([key, filename]) => [
    key,
    `${cursorConfig.pathPrefix}/${filename}`,
  ]),
);

// Map CSS cursor keyword to our animated sequence / 将 CSS cursor 关键字映射到动画序列
const SEQUENCE_MAP: Record<string, keyof typeof CURSOR_SEQUENCES> = {
  pointer: 'pointer',
  grabbing: 'grabbing',
  'not-allowed': 'notAllowed',
};

export function CursorAnimator() {
  const intervalRef = useRef<number>(0);
  const frameIndexRef = useRef<number>(0);
  const currentTypeRef = useRef<string>('default');
  const currentElRef = useRef<Element | null>(null);

  useEffect(() => {
    // Preload cursor images to avoid flicker / 预加载光标图片避免闪烁
    for (const seq of Object.values(CURSOR_SEQUENCES)) {
      for (const src of seq) {
        const img = new Image();
        img.src = src;
      }
    }
    for (const src of Object.values(STATIC_CURSORS)) {
      const img = new Image();
      img.src = src;
    }

    function getCursorType(el: Element | null): string {
      if (!el) return 'default';

      const style = window.getComputedStyle(el);
      const cursor = style.cursor;

      // Extract the fallback keyword from computed cursor value.
      // e.g. url("...") 18 18, pointer -> pointer
      // 从计算出的 cursor 值中提取回退关键字。
      const match = cursor.match(/,\s*(\w+(?:-\w+)*)\s*$/);
      const keyword = match ? match[1] : cursor;
      if (keyword in STATIC_CURSORS) return keyword;

      // Detect element type for fallback / 根据元素类型检测回退
      const tag = el.tagName.toLowerCase();
      if (
        tag === 'a' ||
        tag === 'button' ||
        tag === 'summary' ||
        tag === 'label' ||
        el.closest('a') ||
        el.closest('button') ||
        el.closest('[role="button"]')
      )
        return 'pointer';
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el.closest('input'))
        return 'text';
      if (el.closest('[draggable="true"]') || el.classList.contains('grab')) return 'grab';
      if (el.closest('[disabled]') || el.closest('[aria-disabled="true"]')) return 'not-allowed';

      return 'default';
    }

    function applyCursor(type: string, frameUrl?: string) {
      const url = frameUrl ?? STATIC_CURSORS[type] ?? STATIC_CURSORS.default;
      // Hotspot coordinates from config / 热点坐标来自配置
      const hotspot =
        cursorConfig.hotspots[type as keyof typeof cursorConfig.hotspots] ??
        cursorConfig.hotspots.default;
      const fallback = type === 'default' ? 'auto' : type;
      const cursorValue = `url("${url}") ${hotspot}, ${fallback}`;

      if (currentElRef.current && currentElRef.current instanceof HTMLElement) {
        currentElRef.current.style.setProperty('cursor', cursorValue, 'important');
      }
    }

    function tick() {
      const type = currentTypeRef.current;
      const seqKey = SEQUENCE_MAP[type];
      if (!seqKey) {
        // Static cursor: let CSS rules handle it / 静态光标：让 CSS 规则处理
        return;
      }

      const seq = CURSOR_SEQUENCES[seqKey];
      const frame = seq[frameIndexRef.current % seq.length];
      applyCursor(type, frame);
      frameIndexRef.current += 1;
    }

    function onMouseMove(e: MouseEvent) {
      const target = e.target as Element | null;
      const newType = getCursorType(target);

      if (newType !== currentTypeRef.current || currentElRef.current !== target) {
        const prevEl = currentElRef.current;
        if (prevEl && prevEl instanceof HTMLElement) {
          prevEl.style.removeProperty('cursor');
        }
        currentElRef.current = target;
        currentTypeRef.current = newType;
        frameIndexRef.current = 0;
        tick();
      }
    }

    // Start animation loop / 启动动画循环
    intervalRef.current = window.setInterval(tick, cursorConfig.frameIntervalMs);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('mousemove', onMouseMove);
      const el = currentElRef.current;
      if (el && el instanceof HTMLElement) {
        el.style.removeProperty('cursor');
      }
    };
  }, []);

  return null;
}
