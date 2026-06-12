// Nav logo component for fumadocs layout.
// Fumadocs wraps nav.title in its own <Link>, so this component must NOT render
// any <a>, <Link>, or <button> to avoid nested anchor hydration errors.
// 导航栏 Logo 组件，专用于 fumadocs 布局。
// fumadocs 会自动将 nav.title 包裹在 <Link> 中，因此本组件禁止渲染任何
// <a>、<Link> 或 <button>，以避免嵌套锚点导致的 hydration 错误。

import { siteConfig } from '@/config';

export function NavLogo() {
  return (
    <span className="flex items-center gap-2">
      {/* biome-ignore lint/performance/noImgElement: static site logo */}
      <img src={siteConfig.logoPath} alt={siteConfig.appName} className="h-6 w-auto" />
      <span className="font-minecraft-ae font-bold text-xl tracking-wider">
        {siteConfig.appName}
      </span>
    </span>
  );
}
