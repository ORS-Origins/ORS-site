// Fumadocs source loader: reuses shared i18n config.
// Fumadocs source loader：复用共享 i18n 配置。
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { docs } from '@/.source/server';
import { siteConfig } from '@/config';
import { i18n } from '@/lib/i18n';

export const source = loader({
  baseUrl: siteConfig.docsBaseUrl,
  source: docs.toFumadocsSource(),
  i18n,
  icon(icon) {
    if (!icon) return;
    if (icon in icons) {
      return createElement(icons[icon as keyof typeof icons]);
    }
  },
});
