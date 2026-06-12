// Global loading page: Minecraft block-breaking animation.
// 全局加载页面：Minecraft 方块破坏动画。

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0d14]">
      <div className="mc-destroy-anim w-12 h-12" />
      <span className="mc-loading-text mt-4 text-white/80 text-lg">Loading...</span>
    </div>
  );
}
