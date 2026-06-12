// Mask-reveal page transition: reads a DOM snapshot and click coordinates from
// sessionStorage, then animates a radial-gradient clip-path from the click point
// outward — the inner circle reveals the target docs page while the outer area
// shows the snapshot overlay.
// 遮罩揭示页面过渡：从 sessionStorage 读取 DOM 快照与点击坐标，然后从点击
// 位置向外扩展 radial-gradient 裁剪动画——内圈揭示目标文档页，外圈展示快照遮罩。

'use client';

import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { maskRevealTransition } from '@/lib/motion';

export default function MaskReveal() {
  // Read data synchronously in useState initializer.
  // 在 useState 初始化函数中同步读取数据。
  const [revealData, setRevealData] = useState(() => {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem('nd-docs-transition');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.isTransitioning && Date.now() - data.ts < 3000) {
          return data;
        }
      } catch {}
    }
    return null;
  });

  const radius = useMotionValue(0);
  const feather = useMotionValue(5);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealData) {
      // Clear immediately after reading to prevent re-trigger on refresh or back navigation
      // 阅后即焚，避免刷新或后退后误触发
      sessionStorage.removeItem('nd-docs-transition');

      // Calculate the maximum radius needed to cover the screen using the Pythagorean theorem
      // 勾股定理算出覆盖屏幕需要的最大半径
      const maxRadius =
        Math.max(
          window.innerWidth,
          window.innerHeight,
          Math.hypot(window.innerWidth, window.innerHeight),
        ) * 1.2; // Slightly enlarge to ensure corners are covered / 稍微扩大保障角落

      // Defer animation start by one frame so the browser has time to paint
      // the innerHTML snapshot before the mask-radius begins growing.
      // Without this, the large DOM injection blocks the main thread and
      // the first second of the animation is dropped (swallowed).
      // 将动画启动推迟一帧，让浏览器有时间在 mask-radius 开始增长之前
      // 先绘制 innerHTML 快照。否则大量 DOM 注入会阻塞主线程，
      // 导致动画的第一秒被丢弃（吞掉）。
      let rafId: number;
      let controls: ReturnType<typeof animate>;
      let featherControls: ReturnType<typeof animate>;

      rafId = requestAnimationFrame(() => {
        controls = animate(radius, maxRadius, {
          ...maskRevealTransition,
          onComplete: () => {
            setRevealData(null);
          },
        });

        // Feather animation: gradually increase feather size for softer edge reveal
        // 羽化动画：逐渐增大羽化尺寸，使边缘揭示更柔和
        featherControls = animate(feather, maxRadius * 0.35, {
          duration: maskRevealTransition.duration,
          ease: maskRevealTransition.ease,
        });
      });

      return () => {
        cancelAnimationFrame(rafId);
        controls?.stop();
        featherControls?.stop();
      };
    } else {
      sessionStorage.removeItem('nd-docs-transition');
    }
  }, [revealData, radius, feather]);

  // The soul of the reverse cutout: the transparent part (inner circle) makes the div transparent,
  // revealing the actual target document page underneath. The black part (outer) makes the div opaque,
  // showing the snapshot background of the main page!
  // 反向镂空的灵魂：transparent 部分（内部圈）会让所在 div【透明】，露出该 div 下方真正的目标文档页。
  // black 部分（外部）会让所在 div【不透明】，展示出该 div 的主版快照背景！
  // Added feathering: transparent → black transition with a gradient band for soft edges.
  // 添加羽化：transparent → black 之间增加渐变带，实现柔和边缘。
  // Use useTransform to combine radius + feather into a reactive feathered edge value.
  // 使用 useTransform 将 radius + feather 组合为响应式羽化边缘值。
  const featheredEdge = useTransform([radius, feather], ([r, f]) => Number(r) + Number(f));
  const maskImage = useMotionTemplate`radial-gradient(circle at ${revealData?.x ?? 0}px ${revealData?.y ?? 0}px, transparent ${radius}px, black ${featheredEdge}px)`;

  // Set innerHTML via ref to avoid using dangerouslySetInnerHTML.
  // Must run in useLayoutEffect (synchronous before paint) — if deferred to
  // useEffect, the first frame would render an empty mask, briefly exposing
  // the underlying docs page at scrollTop=0 before the snapshot covers it,
  // which looks like "the page jumps to the top before the animation plays".
  // When the user had scrolled the homepage at click time, wrap the snapshot
  // in a translateY(-scrollY) shell so it renders at the exact viewport offset
  // they were looking at — otherwise the snapshot lays out at scrollY=0 inside
  // the fixed mask and the content below the sticky navbar visibly snaps back
  // toward the top of the page the instant the mask appears.
  // 通过 ref 设置 innerHTML，避免使用 dangerouslySetInnerHTML。
  // 必须放在 useLayoutEffect（绘制前同步执行）— 若放在 useEffect，首帧会渲染出
  // 空的遮罩，让下方已滚动到顶部的文档页面短暂裸露，再被快照覆盖、动画启动，
  // 视觉上就是"页面立即回到顶部再触发动画"。
  // 若点击时用户已经滚动了首页，用 translateY(-scrollY) 外壳包裹快照，使其按
  // 用户当时实际看到的视口偏移渲染 — 否则快照会以 scrollY=0 排版到固定遮罩里，
  // sticky 导航栏下方的内容就会在遮罩出现的瞬间明显地"向页顶弹回"。
  useLayoutEffect(() => {
    if (maskRef.current && revealData) {
      maskRef.current.innerHTML =
        revealData.scrollY > 0
          ? `<div style="transform:translateY(${-revealData.scrollY}px);will-change:transform;">${revealData.domHTML}</div>`
          : revealData.domHTML;
    }
  }, [revealData]);

  if (!revealData) return null;

  return (
    <motion.div
      id="nd-docs-transition-mask"
      // Apply bg-background to prevent cloned DOM with transparent areas from showing through
      // 指定 bg-background 防止克隆过来的 DOM 有透明底的区域穿帮
      className="fixed inset-0 z-[9999] pointer-events-none bg-background"
      ref={maskRef}
      style={{
        opacity: 1, // Must be absolutely opaque / 必须绝对不透明
        willChange: 'mask-image, -webkit-mask-image',
        WebkitMaskImage: maskImage,
        maskImage,
      }}
    />
  );
}
