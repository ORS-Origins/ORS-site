// Deferred skin viewer: keeps docs navigation responsive before mounting the 3D viewer.
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { uiConfig } from '@/config';

const LazySkinViewer = dynamic(
  () => import('@/components/skin-viewer').then((module) => module.SkinViewerComponent),
  {
    loading: () => null,
    ssr: false,
  },
);

export function DeferredSkinViewer() {
  const [canMount, setCanMount] = useState(false);

  useEffect(() => {
    const mountTimer = window.setTimeout(() => {
      setCanMount(true);
    }, uiConfig.skinViewer.deferredMountDelayMs);

    return () => {
      window.clearTimeout(mountTimer);
    };
  }, []);

  return canMount ? <LazySkinViewer /> : null;
}
