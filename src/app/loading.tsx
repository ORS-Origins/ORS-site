// Global loading page: minimal spinner shown during route transitions.
// 全局加载页面：路由切换期间显示的最小化加载指示器。
'use client';

export default function GlobalLoading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #060c18, #0a0d14, #0c1222)' }}
    >
      <div className="route-state__loader" aria-hidden="true">
        <div className="route-state__loader-track" />
      </div>
    </div>
  );
}
