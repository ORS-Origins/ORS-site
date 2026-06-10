// Minecraft splash text component: displays a random player splash image
// next to the brand wordmark with a pulsing zoom animation.
// Minecraft 闪烁标语组件：在品牌标题旁随机显示玩家标语图片，带脉冲缩放动画。

interface SplashTextProps {
  src: string;
  alt?: string;
}

export function SplashText({ src, alt = 'splash' }: SplashTextProps) {
  return (
    <div className="mc-splash">
      {/* biome-ignore lint/performance/noImgElement: pixel-art splash image, dynamic src */}
      <img src={src} alt={alt} className="mc-splash__img" loading="eager" />
    </div>
  );
}
