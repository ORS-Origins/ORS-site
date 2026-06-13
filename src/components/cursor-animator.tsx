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

const CURSOR_DATA_ATTR = 'data-mc-cursor';
const CURSOR_STYLE_ID = 'mc-cursor-animator-style';

// Cursor owner selectors keep animation state on the interactive ancestor,
// preventing child SVG/text nodes from resetting the frame sequence.
// 光标归属选择器把动画状态绑定到可交互祖先，避免 SVG/文字子节点反复重置帧序列。
const CURSOR_OWNER_SELECTORS: Partial<Record<string, string>> = {
  pointer:
    'a, button, [role="button"], .glass-cta, .mc-button, summary, label, .mc-chip, .mc-item-slot',
  text: 'input, textarea, select, [contenteditable="true"]',
  grab: '[draggable="true"], .mc-draggable, .grab',
  grabbing: '[draggable="true"], .mc-draggable, .grab, .grabbing',
  'not-allowed': '.mc-not-allowed, [disabled], [aria-disabled="true"]',
  help: '.mc-help, [aria-label*="?"], abbr[title]',
  crosshair: '.mc-crosshair, code, pre, .mc-block, kbd',
  wait: '.mc-wait, [aria-busy="true"]',
  'ns-resize': '.resize-y, .mc-resize-ns, textarea[rows]',
  'ew-resize': '.resize-x, .mc-resize-ew',
  'nesw-resize': '.resize-tr, .mc-resize-ne',
  'nwse-resize': '.resize-tl, .mc-resize-nw',
};

export function CursorAnimator() {
  const intervalRef = useRef<number>(0);
  const frameIndexRef = useRef<number>(0);
  const currentTypeRef = useRef<string>('default');
  const currentElRef = useRef<Element | null>(null);
  const mouseDownRef = useRef(false);

  useEffect(() => {
    // Runtime style rule for animated cursor frames; updating one rule is more
    // stable than writing inline cursor styles to rapidly changing child nodes.
    // 动态光标帧运行时样式；更新单条规则比写入频繁变化的子节点内联样式更稳定。
    const styleEl = document.createElement('style');
    styleEl.id = CURSOR_STYLE_ID;
    document.head.appendChild(styleEl);

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

    function getCursorKeyword(el: Element): string {
      const cursor = window.getComputedStyle(el).cursor;

      // Extract the fallback keyword from computed cursor value.
      // e.g. url("...") 18 18, pointer -> pointer
      // 从计算出的 cursor 值中提取回退关键字。
      const match = cursor.match(/,\s*(\w+(?:-\w+)*)\s*$/);
      return match ? match[1] : cursor;
    }

    function resolveCursorOwner(el: Element, type: string): Element {
      const selector = CURSOR_OWNER_SELECTORS[type];
      const owner = selector ? el.closest(selector) : null;
      return owner ?? el;
    }

    function getCursorState(el: Element | null): { owner: Element | null; type: string } {
      if (!el) return { owner: null, type: 'default' };

      // Prefer semantic selectors over computed fallback keywords because CSS uses
      // `none` as the URL fallback to prevent the native cursor from flashing.
      // 优先通过语义选择器判断类型，因为 CSS 使用 `none` 作为 URL 回退以避免系统光标闪现。
      for (const type of [
        'not-allowed',
        'text',
        'grabbing',
        'grab',
        'pointer',
        'help',
        'crosshair',
        'wait',
        'ns-resize',
        'ew-resize',
        'nesw-resize',
        'nwse-resize',
      ]) {
        const selector = CURSOR_OWNER_SELECTORS[type];
        const owner = selector ? el.closest(selector) : null;
        if (owner) {
          const resolvedType =
            mouseDownRef.current && (type === 'grab' || type === 'grabbing') ? 'grabbing' : type;
          return {
            owner,
            type: resolvedType,
          };
        }
      }

      const keyword = getCursorKeyword(el);
      if (keyword in STATIC_CURSORS) {
        const type =
          mouseDownRef.current && keyword === 'grab' && CURSOR_SEQUENCES.grabbing.length > 0
            ? 'grabbing'
            : keyword;
        return {
          owner: resolveCursorOwner(el, type),
          type,
        };
      }

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
        return {
          owner: resolveCursorOwner(el, 'pointer'),
          type: 'pointer',
        };
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el.closest('input'))
        return {
          owner: resolveCursorOwner(el, 'text'),
          type: 'text',
        };
      if (el.closest('[draggable="true"]') || el.classList.contains('grab')) {
        const type = mouseDownRef.current ? 'grabbing' : 'grab';
        return {
          owner: resolveCursorOwner(el, type),
          type,
        };
      }
      if (el.closest('[disabled]') || el.closest('[aria-disabled="true"]'))
        return {
          owner: resolveCursorOwner(el, 'not-allowed'),
          type: 'not-allowed',
        };

      return {
        owner: el,
        type: 'default',
      };
    }

    function buildCursorValue(type: string, frameUrl?: string) {
      const url = frameUrl ?? STATIC_CURSORS[type] ?? STATIC_CURSORS.default;
      // Hotspot coordinates from config / 热点坐标来自配置
      const hotspot =
        cursorConfig.hotspots[type as keyof typeof cursorConfig.hotspots] ??
        cursorConfig.hotspots.default;
      const fallback =
        cursorConfig.fallbacks[type as keyof typeof cursorConfig.fallbacks] ??
        cursorConfig.fallbacks.default;
      return `url("${url}") ${hotspot}, ${fallback}`;
    }

    function applyCursorRule(type: string, frameUrl?: string) {
      const cursorValue = buildCursorValue(type, frameUrl);
      styleEl.textContent = `[${CURSOR_DATA_ATTR}="${type}"], [${CURSOR_DATA_ATTR}="${type}"] * { cursor: ${cursorValue} !important; }`;
    }

    function clearAnimatedCursor() {
      styleEl.textContent = '';
      if (currentElRef.current) {
        currentElRef.current.removeAttribute(CURSOR_DATA_ATTR);
      }
      currentElRef.current = null;
      currentTypeRef.current = 'default';
      frameIndexRef.current = 0;
    }

    function tick() {
      const type = currentTypeRef.current;
      const seqKey = SEQUENCE_MAP[type];
      if (!seqKey) {
        // Static cursor: let CSS rules handle it / 静态光标：让 CSS 规则处理。
        styleEl.textContent = '';
        return;
      }

      const seq = CURSOR_SEQUENCES[seqKey];
      const frame = seq[frameIndexRef.current % seq.length];
      applyCursorRule(type, frame);
      frameIndexRef.current += 1;
    }

    function updateCursorFromTarget(target: EventTarget | null) {
      const targetEl = target instanceof Element ? target : null;
      const { owner, type: newType } = getCursorState(targetEl);

      if (!owner) {
        clearAnimatedCursor();
        return;
      }

      if (newType !== currentTypeRef.current || currentElRef.current !== owner) {
        const prevEl = currentElRef.current;
        if (prevEl) {
          prevEl.removeAttribute(CURSOR_DATA_ATTR);
        }
        currentElRef.current = owner;
        currentTypeRef.current = newType;
        frameIndexRef.current = 0;
        owner.setAttribute(CURSOR_DATA_ATTR, newType);
      }

      tick();
    }

    function onMouseMove(e: MouseEvent) {
      updateCursorFromTarget(e.target);
    }

    function onMouseDown(e: MouseEvent) {
      mouseDownRef.current = true;
      updateCursorFromTarget(e.target);
    }

    function onMouseUp(e: MouseEvent) {
      mouseDownRef.current = false;
      updateCursorFromTarget(e.target);
    }

    function onMouseOut(e: MouseEvent) {
      if (!e.relatedTarget) clearAnimatedCursor();
    }

    // Start animation loop / 启动动画循环
    intervalRef.current = window.setInterval(tick, cursorConfig.frameIntervalMs);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseout', onMouseOut);
      clearAnimatedCursor();
      styleEl.remove();
    };
  }, []);

  return null;
}
