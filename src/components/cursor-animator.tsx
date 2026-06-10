// Animated cursor system: cycles through multi-frame PNG cursors based on
// the currently hovered element type. Matches Minecraft cursor style.
// 动态鼠标指针系统：根据当前悬停的元素类型循环播放多帧 PNG 光标。
// 匹配 Minecraft 指针风格。
'use client';

import { useEffect, useRef } from 'react';

// Frame sequences for each cursor type / 每种指针类型的帧序列
const CURSOR_SEQUENCES = {
  pointer: Array.from(
    { length: 11 },
    (_, i) => `/imgs/widget/cursor/pointer_page_${String(i + 1).padStart(2, '0')}.png`,
  ),
  grabbing: Array.from(
    { length: 8 },
    (_, i) => `/imgs/widget/cursor/grabbing_page_${String(i + 1).padStart(2, '0')}.png`,
  ),
  notAllowed: Array.from(
    { length: 8 },
    (_, i) => `/imgs/widget/cursor/not-allowed_page_${String(i + 1).padStart(2, '0')}.png`,
  ),
} as const;

// Fallback single-frame cursors / 单帧回退光标
const STATIC_CURSORS: Record<string, string> = {
  default: '/imgs/widget/cursor/default.png',
  pointer: '/imgs/widget/cursor/pointer_page_01.png',
  text: '/imgs/widget/cursor/text.png',
  grab: '/imgs/widget/cursor/grab.png',
  grabbing: '/imgs/widget/cursor/grabbing_page_01.png',
  crosshair: '/imgs/widget/cursor/crosshair.png',
  help: '/imgs/widget/cursor/help.png',
  'not-allowed': '/imgs/widget/cursor/not-allowed_page_01.png',
  'ns-resize': '/imgs/widget/cursor/resize-ns.png',
  'ew-resize': '/imgs/widget/cursor/resize-ew.png',
  'nesw-resize': '/imgs/widget/cursor/resize-ne.png',
  'nwse-resize': '/imgs/widget/cursor/resize-nw.png',
};

// Map CSS cursor keyword to our animated sequence / 将 CSS cursor 关键字映射到动画序列
const SEQUENCE_MAP: Record<string, keyof typeof CURSOR_SEQUENCES> = {
  pointer: 'pointer',
  grabbing: 'grabbing',
  'not-allowed': 'notAllowed',
};

// Frame interval in ms / 帧间隔（毫秒）
const FRAME_INTERVAL = 80;

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
      // Hotspot coordinates match minecraft.css definitions / 热点坐标匹配 minecraft.css 定义
      const hotspots: Record<string, string> = {
        default: '16 16',
        pointer: '18 18',
        text: '36 16',
        grab: '18 18',
        grabbing: '18 6',
        crosshair: '30 30',
        help: '16 6',
        'not-allowed': '31 31',
        'ns-resize': '31 31',
        'ew-resize': '31 31',
        'nesw-resize': '31 31',
        'nwse-resize': '31 31',
      };
      const hotspot = hotspots[type] ?? '16 16';
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
    intervalRef.current = window.setInterval(tick, FRAME_INTERVAL);
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
