'use client';

// Minecraft splash text component: displays a random player splash image
// next to the brand wordmark with a pulsing zoom animation.
// Minecraft 闪烁标语组件：在品牌标题旁随机显示玩家标语图片，带脉冲缩放动画。

import { useEffect, useState } from 'react';
import { brandConfig } from '@/config';

interface SplashTextProps {
  files: readonly string[];
  pathPrefix?: string;
  alt?: string;
}

function buildSplashSrc(pathPrefix: string, file: string): string {
  return `${pathPrefix.replace(/\/+$/, '')}/${file}`;
}

function pickRandomSplashFile(files: readonly string[]): string | null {
  return files[Math.floor(Math.random() * files.length)] ?? null;
}

export function SplashText({
  files,
  pathPrefix = brandConfig.splashPathPrefix,
  alt = '',
}: SplashTextProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    // Pick after hydration so static exports can change splash images on refresh.
    // 在客户端挂载后再随机选择，确保静态导出页面刷新时闪烁标语会变化。
    const file = pickRandomSplashFile(files);
    setSrc(file ? buildSplashSrc(pathPrefix, file) : null);
  }, [files, pathPrefix]);

  if (!src) return null;

  return (
    <div className="mc-splash">
      {/* biome-ignore lint/performance/noImgElement: pixel-art splash image, dynamic src */}
      <img src={src} alt={alt} className="mc-splash__img" loading="eager" />
    </div>
  );
}
