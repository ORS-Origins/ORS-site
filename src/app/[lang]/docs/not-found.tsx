// Docs not-found page.
// 文档 404 页面。
import { notFound } from 'next/navigation';

export default function DocsNotFoundPage() {
  // Trigger the root not-found boundary for consistent 404 handling.
  // 触发根级 not-found 边界，保持 404 处理一致性。
  notFound();
}
