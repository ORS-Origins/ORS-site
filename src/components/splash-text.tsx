'use client';

// Minecraft splash text component: displays a random player splash image
// next to the brand wordmark with a pulsing zoom animation.
// Minecraft 闪烁标语组件：在品牌标题旁随机显示玩家标语图片，带脉冲缩放动画。

import { useLayoutEffect, useState } from 'react';
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

function getInitialSplashSrc(files: readonly string[], pathPrefix: string): string | null {
  const file = files[0];
  return file ? buildSplashSrc(pathPrefix, file) : null;
}

export function SplashText({
  files,
  pathPrefix = brandConfig.splashPathPrefix,
  alt = '',
}: SplashTextProps) {
  const [src, setSrc] = useState<string | null>(() => getInitialSplashSrc(files, pathPrefix));

  useLayoutEffect(() => {
    // Swap before paint after hydration to avoid a blank or sluggish splash update.
    // 水合后、绘制前切换随机图，避免闪烁标语空白或切换迟钝。
    const file = pickRandomSplashFile(files);
    setSrc(file ? buildSplashSrc(pathPrefix, file) : getInitialSplashSrc(files, pathPrefix));
  }, [files, pathPrefix]);

  if (!src) return null;

  return (
    <div className="mc-splash">
      {/* biome-ignore lint/performance/noImgElement: pixel-art splash image, dynamic src */}
      <img src={src} alt={alt} className="mc-splash__img" loading="eager" />
    </div>
  );
}
