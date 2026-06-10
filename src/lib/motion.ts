// Shared framer-motion animation presets for consistent transitions across the app.
// framer-motion 动画预设，确保全站过渡效果一致。

import { themeConfig } from '@/config';

// Optimized mask reveal: added feathering via mask-size animation for softer edge reveal.
// 优化后的遮罩揭示：通过 mask-size 动画添加羽化边缘，揭示更柔和。
export const maskRevealTransition = {
  duration: themeConfig.maskRevealDurationMs / 1000,
  ease: themeConfig.maskRevealEase,
} as const;
