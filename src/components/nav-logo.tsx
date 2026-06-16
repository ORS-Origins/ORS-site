'use client';

import { useEffect, useRef } from 'react';
import { eventNames, siteConfig } from '@/config';

// Nav logo component for fumadocs layout.
// Fumadocs wraps nav.title in its own Link, so this component must not render
// any anchor, Link, or button to avoid nested-anchor hydration errors.
export function NavLogo() {
  const logoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const logoNode = logoRef.current;
    const linkNode = logoNode?.closest('a') ?? logoNode;
    if (!linkNode) return;

    const reshuffleSplash = () => {
      // Notify the mounted homepage splash without forcing a same-route reload.
      window.dispatchEvent(new Event(eventNames.splashShuffle));
    };

    linkNode.addEventListener('click', reshuffleSplash);

    return () => {
      linkNode.removeEventListener('click', reshuffleSplash);
    };
  }, []);

  return (
    <span ref={logoRef} className="flex items-center gap-2">
      {/* biome-ignore lint/performance/noImgElement: static site logo */}
      <img src={siteConfig.logoPath} alt={siteConfig.appName} className="h-6 w-auto" />
      <span className="brand-wordmark font-minecraft-ae font-bold text-xl">
        {siteConfig.appName}
      </span>
    </span>
  );
}
