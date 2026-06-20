// Root layout: hosts <html>/<body>, global fonts, and the theme provider.
// 根布局：承载 <html>/<body>、全局字体和主题提供器。
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import type { CSSProperties, ReactNode } from 'react';
import { RouteTransitionLayer } from '@/components/route-transition-layer';
import { uiConfig } from '@/config';
import { i18n } from '@/lib/i18n';
import '@/app/globals.css';

export const metadata: Metadata = {
  icons: {
    icon: '/imgs/widget/ors.png',
  },
};

// Route transition CSS variables: keep animation timing configurable from uiConfig.
// 路由过渡 CSS 变量：从 uiConfig 注入可配置的动画时序。
const routeTransitionStyle = {
  '--route-transition-loading-duration': `${uiConfig.routeTransition.loadingEnterDurationMs}ms`,
  '--route-transition-page-duration': `${uiConfig.routeTransition.pageEnterDurationMs}ms`,
  '--route-transition-root-duration': `${uiConfig.routeTransition.rootRedirectDurationMs}ms`,
  '--route-transition-overlay-z-index': String(uiConfig.routeTransition.overlayZIndex),
  '--route-transition-ease': uiConfig.routeTransition.easing,
} satisfies CSSProperties &
  Record<
    | '--route-transition-loading-duration'
    | '--route-transition-page-duration'
    | '--route-transition-root-duration'
    | '--route-transition-overlay-z-index'
    | '--route-transition-ease',
    string
  >;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={i18n.defaultLanguage} suppressHydrationWarning>
      <body className="antialiased min-h-screen" style={routeTransitionStyle}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <RouteTransitionLayer />
        </ThemeProvider>
      </body>
    </html>
  );
}
