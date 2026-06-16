'use client';

import { useLayoutEffect, useState } from 'react';
import { brandConfig, eventNames } from '@/config';

// Fixed index for SSR to avoid hydration mismatch; swap to random on client.
const ssrIndex = 0;

function randomSplash(previousText?: string): string {
  const texts: readonly string[] = brandConfig.splashTexts;
  if (texts.length === 0) return '';
  if (texts.length === 1) return texts[0];

  let index = Math.floor(Math.random() * texts.length);
  if (texts[index] === previousText) {
    index = (index + 1) % texts.length;
  }

  return texts[index];
}

export function SplashText() {
  const [text, setText] = useState<string>(brandConfig.splashTexts[ssrIndex]);

  useLayoutEffect(() => {
    setText((currentText) => randomSplash(currentText));

    const handleSplashShuffle = () => {
      // Re-randomize on same-route logo clicks after the home page has mounted.
      setText((currentText) => randomSplash(currentText));
    };

    window.addEventListener(eventNames.splashShuffle, handleSplashShuffle);

    return () => {
      window.removeEventListener(eventNames.splashShuffle, handleSplashShuffle);
    };
  }, []);

  if (!text) return null;

  return (
    <div className="mc-splash">
      <span className="mc-splash__text font-minecraft-ae">{text}</span>
    </div>
  );
}
