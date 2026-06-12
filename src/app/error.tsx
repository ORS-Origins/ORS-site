// Global error boundary: Minecraft-styled error page.
// 全局错误边界：Minecraft 风格错误页面。

'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="zh">
      <body className="antialiased min-h-screen bg-[#0a0d14] text-white flex flex-col items-center justify-center p-6">
        <div className="mc-panel p-8 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="mc-destroy-anim w-16 h-16" />
          </div>
          <h1 className="text-2xl font-minecraft-ae text-red-400 text-shadow-md">页面发生了错误</h1>
          <p className="text-white/60 font-minecraft-ae text-sm">
            发生了意外错误，请尝试重新加载页面。
          </p>
          {error.digest && <p className="text-xs text-white/30 font-mono">{error.digest}</p>}
          <button type="button" onClick={reset} className="mc-button px-6 py-2 text-sm">
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
