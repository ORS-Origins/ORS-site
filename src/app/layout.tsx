// Root layout: hosts <html>/<body>, global fonts, and the theme provider.
// 根布局：承载 <html>/<body>、全局字体和主题提供器。
import { ThemeProvider } from 'next-themes';
import { i18n } from '@/lib/i18n';
import '@/app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={i18n.defaultLanguage} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
