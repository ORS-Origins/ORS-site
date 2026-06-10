import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

// Enable `output: 'export'` only for production builds.
// 仅在生产构建启用 `output: 'export'`。
const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  // No special headers needed — the cursor pack was converted to PNG and
  // is served by Next.js's public/ directory with the standard image/png
  // Content-Type, which all modern browsers accept for CSS cursor URLs.
  // 无需特殊 headers——指针包已转换为 PNG，Next.js 通过 public/ 目录以
  // 标准 image/png Content-Type 提供，所有现代浏览器都接受 CSS cursor URL。
};

export default withMDX(nextConfig);
