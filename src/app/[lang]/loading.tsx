// Locale-aware loading page: Minecraft block-breaking animation.
// loading.tsx does not receive params in Next.js App Router;
// we fall back to the default language.
// 多语言加载页面：Minecraft 方块破坏动画。
// loading.tsx 在 Next.js App Router 中不接收 params，回退到默认语言。

import { getPageDictionary } from '@/dictionaries';
import { i18n } from '@/lib/i18n';

export default function LocaleLoading() {
  const dict = getPageDictionary(i18n.defaultLanguage);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0d14]">
      <div className="mc-destroy-anim w-12 h-12" />
      <span className="mc-loading-text mt-4 text-white/80 text-lg">{dict.loading}</span>
    </div>
  );
}
