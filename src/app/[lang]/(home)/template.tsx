// Home page template: pass-through wrapper (no animation).
// 首页模板：透传包裹层（无动画）。

import type { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
