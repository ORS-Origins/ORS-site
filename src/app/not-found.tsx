// Global 404 page: Minecraft-styled not-found page.
// 全局 404 页面：Minecraft 风格页面未找到。

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col items-center justify-center p-6">
      <div className="mc-panel p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          {/* biome-ignore lint/performance/noImgElement: small static pixel-art icon */}
          <img
            src="/imgs/blocks/bedrock.png"
            alt="404"
            className="w-16 h-16 image-pixelated"
            loading="eager"
          />
        </div>
        <h1 className="text-4xl font-minecrafter text-white/80 text-shadow-lg">404</h1>
        <p className="text-white/60 font-minecraft-ae">
          你访问的页面可能已被移除、重命名或暂时不可用。
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="mc-button px-5 py-2 text-sm no-underline">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
