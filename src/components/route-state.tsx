// Shared route state surface for loading, 404, and error boundaries.
// 共享路由状态界面，用于加载、404 与错误边界。
import type { ReactNode } from 'react';
import { siteConfig, uiConfig } from '@/config';

export type RouteStateVariant = 'error' | 'loading' | 'not-found';

type RouteStateProps = {
  variant: RouteStateVariant;
  title: string;
  description?: string;
  code?: string;
  digest?: string;
  actions?: ReactNode;
};

export function RouteState({
  variant,
  title,
  description,
  code,
  digest,
  actions,
}: RouteStateProps) {
  const titleId = `route-state-${variant}-title`;
  const isLoading = variant === 'loading';

  return (
    <main
      aria-busy={isLoading}
      aria-labelledby={titleId}
      className="route-state"
      role={variant === 'error' ? 'alert' : undefined}
    >
      <RouteStateBackground />

      {/* Route state card: keeps special route UI aligned with the homepage/docs glass style.
          路由状态卡片：让特殊路由界面与首页 / 文档玻璃风格保持一致。 */}
      <section className={`route-state__card route-state__card--${variant} glass-card home-enter`}>
        <div className="route-state__brand">
          {/* biome-ignore lint/performance/noImgElement: small static site logo */}
          <img src={siteConfig.logoPath} alt="" className="route-state__logo" aria-hidden="true" />
          <span className="brand-wordmark font-minecraft-ae">{siteConfig.appName}</span>
        </div>

        {isLoading ? (
          <RouteStateLoader />
        ) : (
          <div className="route-state__icon-shell" data-variant={variant}>
            {variant === 'not-found' ? (
              // Decorative status icon: configurable asset path for 404 surfaces.
              // 装饰性状态图标：404 界面使用可配置资源路径。
              // biome-ignore lint/performance/noImgElement: small static pixel-art status icon
              <img
                src={uiConfig.routeState.notFoundIconPath}
                alt=""
                className="route-state__status-image"
                aria-hidden="true"
              />
            ) : (
              // Decorative error core, replacing the old block-breaking animation.
              // 装饰性错误核心，替代旧的方块破坏动画。
              <span className="route-state__error-core" aria-hidden="true" />
            )}
          </div>
        )}

        {code ? (
          <p className="route-state__code font-minecrafter" aria-hidden="true">
            {code}
          </p>
        ) : null}

        <div className="route-state__copy">
          <h1 id={titleId} className="route-state__title font-minecraft-ae">
            {title}
          </h1>
          {description ? (
            <p className="route-state__description font-minecraft-ae">{description}</p>
          ) : null}
          {digest ? <p className="route-state__digest font-mono">{digest}</p> : null}
        </div>

        {actions ? <div className="route-state__actions">{actions}</div> : null}
      </section>
    </main>
  );
}

function RouteStateLoader() {
  return (
    <div className="route-state__loader" aria-hidden="true">
      {/* ORS loading core: brand-colored energy ring with pixel blocks.
          ORS 加载核心：品牌色能量环与像素方块。 */}
      <div className="route-state__loader-ring">
        <span className="route-state__loader-cube route-state__loader-cube--one" />
        <span className="route-state__loader-cube route-state__loader-cube--two" />
        <span className="route-state__loader-cube route-state__loader-cube--three" />
        <span className="route-state__loader-cube route-state__loader-cube--four" />
      </div>
      <div className="route-state__loader-core">
        {/* biome-ignore lint/performance/noImgElement: small static site logo inside the loader */}
        <img src={siteConfig.logoPath} alt="" className="route-state__loader-logo" />
      </div>
    </div>
  );
}

function RouteStateBackground() {
  return (
    <>
      {/* Ambient gradient background shared with the homepage palette.
          与首页配色一致的环境渐变背景。 */}
      <div aria-hidden="true" className="home-gradient-bg pointer-events-none absolute inset-0">
        <div className="home-gradient-bg__orb home-gradient-bg__orb--one" />
        <div className="home-gradient-bg__orb home-gradient-bg__orb--two" />
        <div className="home-gradient-bg__orb home-gradient-bg__orb--three" />
      </div>

      {/* Subtle route-state Minecraft atmosphere using existing docs background primitives.
          使用现有文档背景元素营造轻量 Minecraft 路由状态氛围。 */}
      <div aria-hidden="true" className="route-state__ambient">
        <div className="mc-doc-halo mc-doc-halo--emerald" />
        <div className="mc-doc-halo mc-doc-halo--sky" />
        <div className="mc-doc-halo mc-doc-halo--amethyst" />
        <div className="mc-doc-float-block mc-doc-float-block--diamond" />
        <div className="mc-doc-float-block mc-doc-float-block--emerald" />
        <div className="mc-doc-float-block mc-doc-float-block--lapis" />
        <div className="mc-doc-float-block mc-doc-float-block--prismarine" />
        <div className="mc-doc-pixel-dust" />
        <div className="mc-doc-pixel-dust" />
        <div className="mc-doc-pixel-dust" />
        <div className="mc-doc-pixel-dust" />
      </div>

      <div aria-hidden="true" className="home-vignette" />
    </>
  );
}
