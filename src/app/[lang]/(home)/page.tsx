// Locale home page: brand entry + MC server status component + dynamic light & shadow.
// 多语言首页：品牌入口 + MC 服务器状态组件 + 动态光影。

import { McServerStatus } from '@/components/mc-status';
import { SplashText } from '@/components/splash-text';
import EnterDocsButton from '@/components/transition/enter-docs-button';
import { brandConfig, siteConfig } from '@/config';
import { getPageDictionary } from '@/dictionaries';

import { i18n, type Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const locale = (lang as Locale) ?? i18n.defaultLanguage;
  const dict = getPageDictionary(locale);

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
      {/* Animated gradient background for the homepage only. / 首页动态渐变背景。 */}
      <div aria-hidden="true" className="home-gradient-bg pointer-events-none absolute inset-0">
        <div className="home-gradient-bg__orb home-gradient-bg__orb--one" />
        <div className="home-gradient-bg__orb home-gradient-bg__orb--two" />
        <div className="home-gradient-bg__orb home-gradient-bg__orb--three" />
      </div>

      {/* Large soft halos around blocks.
          方块周围的大范围柔光晕。 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-4">
        <div className="mc-block-halo mc-block-halo--emerald" />
        <div className="mc-block-halo mc-block-halo--sky" />
        <div className="mc-block-halo mc-block-halo--amethyst" />
        <div className="mc-block-halo mc-block-halo--sea-lantern" />
        <div className="mc-block-halo mc-block-halo--teal" />
      </div>

      {/* Floating luminous Minecraft blocks.
          自发光浮动方块。 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-5">
        <div className="mc-float-block mc-float-block--grass" />
        <div className="mc-float-block mc-float-block--diamond" />
        <div className="mc-float-block mc-float-block--lapis" />
        <div className="mc-float-block mc-float-block--emerald" />
        <div className="mc-float-block mc-float-block--ice" />
        <div className="mc-float-block mc-float-block--prismarine" />
      </div>

      {/* Light beams.
          光柱效果。 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-6">
        <div className="mc-light-beam mc-light-beam--1" />
        <div className="mc-light-beam mc-light-beam--2" />
        <div className="mc-light-beam mc-light-beam--3" />
      </div>

      {/* Block breaking particles / 方块破坏粒子 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-7">
        <div className="mc-particle mc-particle--dirt" />
        <div className="mc-particle mc-particle--stone" />
        <div className="mc-particle mc-particle--coal" />
        <div className="mc-particle mc-particle--lapis" />
        <div className="mc-particle mc-particle--emerald-ore" />
      </div>

      {/* Pixel dust (colored glowing dots) / 彩色像素光点尘埃 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-8">
        <div className="mc-pixel-dust" />
        <div className="mc-pixel-dust" />
        <div className="mc-pixel-dust" />
        <div className="mc-pixel-dust" />
        <div className="mc-pixel-dust" />
        <div className="mc-pixel-dust" />
        <div className="mc-pixel-dust" />
        <div className="mc-pixel-dust" />
      </div>

      {/* Vignette to enhance center light / 暗角增强中心光感 */}
      <div aria-hidden="true" className="home-vignette" />

      {/* Main content area / 主内容区域 */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="home-enter home-enter--delay-1 relative">
          <h1 className="brand-wordmark home-title font-minecrafter">{brandConfig.homeTitle}</h1>
          <div className="home-splash-wrap">
            <SplashText key={Date.now()} />
          </div>
        </div>
        <p className="home-enter home-enter--delay-2 text-xl md:text-2xl max-w-xl mx-auto font-minecraft-ae leading-relaxed home-tagline">
          {dict.tagline}
        </p>
      </div>

      {/* MC Server Status Component / MC 服务器状态组件 */}
      <div className="home-enter home-enter--delay-3 z-10 mt-10 w-full max-w-sm">
        <McServerStatus locale={locale} />
      </div>

      <EnterDocsButton
        href={`/${locale}/docs/${siteConfig.defaultDocsPath}`}
        className="home-enter home-enter--delay-4 z-10 mt-8 glass-chip px-10 py-4 rounded-2xl text-lg font-semibold font-minecraft-ae inline-block no-underline text-foreground hover:scale-105 transition-transform duration-200"
      >
        {dict.enterDocs} →
      </EnterDocsButton>
    </main>
  );
}
