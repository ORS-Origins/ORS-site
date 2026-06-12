// Home page template: pass-through wrapper (no animation).
// The framer-motion page-enter animation was removed because it caused
// background images to flicker on every route change.
// 首页模板：透传包裹层（无动画）。
// framer-motion 页面进入动画已移除，因为每次路由切换时会导致背景图片闪烁。

import type { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
