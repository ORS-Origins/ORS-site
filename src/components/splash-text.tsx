'use client';

// Minecraft splash text component: displays a random splash text
// next to the brand wordmark with a pulsing zoom animation.
// Minecraft 闪烁标语组件：在品牌标题旁随机显示标语文本，带脉冲缩放动画。

import { useLayoutEffect, useState } from 'react';
import { brandConfig } from '@/config';

// Fixed index for SSR to avoid hydration mismatch; swap to random on client.
// SSR 使用固定索引避免水合不匹配；客户端切换为随机。
const ssrIndex = 0;

function randomSplash(): string {
  return brandConfig.splashTexts[Math.floor(Math.random() * brandConfig.splashTexts.length)];
}

export function SplashText() {
  const [text, setText] = useState<string>(brandConfig.splashTexts[ssrIndex]);

  useLayoutEffect(() => {
    setText(randomSplash());
  }, []);

  if (!text) return null;

  return (
    <div className="mc-splash">
      <span className="mc-splash__text font-minecraft-ae">{text}</span>
    </div>
  );
}
