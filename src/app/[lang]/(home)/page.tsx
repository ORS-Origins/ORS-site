// Locale home page: brand entry + MC server status component + dynamic light & shadow.
// 多语言首页：品牌入口 + MC 服务器状态组件 + 动态光影。

import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { McServerStatus } from '@/components/mc-status';
import { SplashText } from '@/components/splash-text';
import EnterDocsButton from '@/components/transition/enter-docs-button';
import { brandConfig, siteConfig } from '@/config';
import { getPageDictionary } from '@/dictionaries';

import { i18n, type Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

function getRandomSplash(): string | null {
  try {
    const splashDir = join(process.cwd(), 'public', 'imgs', 'splash');
    const files = readdirSync(splashDir).filter((f) => f.endsWith('.png'));
    if (files.length === 0) return null;
    const random = Math.floor(Math.random() * files.length);
    return `/imgs/splash/${files[random]}`;
  } catch {
    return null;
  }
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const locale = (lang as Locale) ?? i18n.defaultLanguage;
  const dict = getPageDictionary(locale);
  const splashSrc = getRandomSplash();

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Bottom-layer photo carousel from /imgs/photos. / 底层照片轮播。 */}
      <div aria-hidden="true" className="home-photo-carousel">
        <div className="home-photo-carousel__slide home-photo-carousel__slide--1" />
        <div className="home-photo-carousel__slide home-photo-carousel__slide--2" />
        <div className="home-photo-carousel__slide home-photo-carousel__slide--3" />
        <div className="home-photo-carousel__slide home-photo-carousel__slide--4" />
        <div className="home-photo-carousel__slide home-photo-carousel__slide--5" />
        <div className="home-photo-carousel__slide home-photo-carousel__slide--6" />
        <div className="home-photo-carousel__overlay" />
      </div>

      {/* Animated gradient background for the homepage only. / 首页动态渐变背景。 */}
      <div aria-hidden="true" className="home-gradient-bg pointer-events-none absolute inset-0">
        <div className="home-gradient-bg__orb home-gradient-bg__orb--one" />
        <div className="home-gradient-bg__orb home-gradient-bg__orb--two" />
        <div className="home-gradient-bg__orb home-gradient-bg__orb--three" />
      </div>

      {/* Large soft halos around blocks (Photo 1 inspiration).
          方块周围的大范围柔光晕（照片 1 灵感）。 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-4">
        <div className="mc-block-halo mc-block-halo--emerald" />
        <div className="mc-block-halo mc-block-halo--sky" />
        <div className="mc-block-halo mc-block-halo--amethyst" />
        <div className="mc-block-halo mc-block-halo--sea-lantern" />
        <div className="mc-block-halo mc-block-halo--teal" />
      </div>

      {/* Floating luminous Minecraft blocks (Photo 1 inspiration).
          自发光浮动方块（照片 1 灵感）。 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-5">
        <div className="mc-float-block mc-float-block--grass" />
        <div className="mc-float-block mc-float-block--diamond" />
        <div className="mc-float-block mc-float-block--lapis" />
        <div className="mc-float-block mc-float-block--emerald" />
        <div className="mc-float-block mc-float-block--ice" />
        <div className="mc-float-block mc-float-block--prismarine" />
      </div>

      {/* Light beams (central white block in Photo 1).
          光柱效果（照片 1 中央白色方块）。 */}
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

      <div className="relative z-10 space-y-6 text-center">
        <div className="home-enter home-enter--delay-1 relative inline-block">
          <h1 className="text-6xl md:text-8xl font-minecrafter tracking-widest text-shadow-md text-white/80 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            {brandConfig.homeTitle}
          </h1>
          {splashSrc && (
            <div className="hidden md:block absolute -right-20 -bottom-8 md:-right-24 md:-bottom-10">
              <SplashText src={splashSrc} />
            </div>
          )}
        </div>
        <p className="home-enter home-enter--delay-2 text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-minecraft-ae drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
          {dict.tagline}
        </p>
      </div>

      {/* MC Server Status Component / MC 服务器状态组件 */}
      <div className="home-enter home-enter--delay-3 z-10 mt-10 w-full max-w-md">
        <McServerStatus locale={locale} />
      </div>

      <EnterDocsButton
        href={`/${locale}/docs/${siteConfig.defaultDocsPath}`}
        className="home-enter home-enter--delay-4 z-10 mt-8 glass-cta px-12 py-4 rounded-2xl text-lg font-semibold font-minecraft-ae inline-block no-underline text-foreground"
      >
        {dict.enterDocs} →
      </EnterDocsButton>
    </main>
  );
}
