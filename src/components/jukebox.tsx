// Global Minecraft jukebox music player with multi-disc selection.
// 全局 Minecraft 唱片机音乐播放器，支持多唱片选择。
'use client';

import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { Disc3, Pause, Play, Square, X } from 'lucide-react';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { jukeboxConfig, storageKeys } from '@/config';
import { getPageDictionary } from '@/dictionaries';
import { i18n, type Locale } from '@/lib/i18n';

type JukeboxDisc = (typeof jukeboxConfig.discs)[number];
type JukeboxDiscId = JukeboxDisc['id'];
type JukeboxCssVariable =
  | '--jukebox-z-index'
  | '--jukebox-toggle-size'
  | '--jukebox-dock-top'
  | '--jukebox-dock-right'
  | '--jukebox-panel-width'
  | '--jukebox-panel-gap'
  | '--jukebox-deck-size'
  | '--jukebox-disc-size'
  | '--jukebox-disc-thumb-size'
  | '--jukebox-control-size'
  | '--jukebox-icon-toggle-size';

type PanelPosition = Pick<CSSProperties, 'top' | 'right' | 'left'>;

function resolveLocale(locale: string | undefined): Locale {
  return i18n.languages.includes(locale as Locale) ? (locale as Locale) : i18n.defaultLanguage;
}

function isJukeboxDiscId(value: string | null): value is JukeboxDiscId {
  return jukeboxConfig.discs.some((disc) => disc.id === value);
}

function playOneShotSound(path: string, volume: number) {
  const audio = new Audio(path);
  audio.volume = volume;
  void audio.play().catch(() => {
    // Browser autoplay policies or missing assets can block short UI sounds.
    // 浏览器自动播放策略或资源缺失可能会阻止短促 UI 音效。
  });
}

function storeLastDisc(discId: JukeboxDiscId) {
  try {
    window.localStorage.setItem(storageKeys.jukeboxLastDisc, discId);
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
    // 受限浏览器环境中 localStorage 可能不可用。
  }
}

interface JukeboxProps {
  /** Placement variant controls panel alignment relative to the toggle button. / 放置变体控制面板相对于按钮的对齐方式。 */
  variant?: 'nav' | 'sidebar' | 'header' | 'icon';
}

export function Jukebox({ variant = 'nav' }: JukeboxProps) {
  const { locale } = useI18n();
  const currentLocale = resolveLocale(locale);
  const dict = getPageDictionary(currentLocale);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDiscId, setSelectedDiscId] = useState<JukeboxDiscId | null>(null);
  const [playbackError, setPlaybackError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioDiscIdRef = useRef<JukeboxDiscId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const panelTitleId = 'mc-jukebox-title';
  const normalizedVolume = Math.min(1, Math.max(0, jukeboxConfig.defaultVolume));
  const discById = useMemo(
    () => new Map<JukeboxDiscId, JukeboxDisc>(jukeboxConfig.discs.map((disc) => [disc.id, disc])),
    [],
  );
  const selectedDisc = selectedDiscId ? (discById.get(selectedDiscId) ?? null) : null;
  const selectedDiscName = selectedDisc
    ? dict.jukeboxDiscNames[selectedDisc.id]
    : dict.jukeboxNoSelection;
  const jukeboxStyle = {
    '--jukebox-z-index': String(jukeboxConfig.zIndex),
    '--jukebox-toggle-size': `${jukeboxConfig.toggleSizePx}px`,
    '--jukebox-icon-toggle-size': `${jukeboxConfig.iconToggleSizePx}px`,
    '--jukebox-dock-top': `${jukeboxConfig.dockTopOffsetPx}px`,
    '--jukebox-dock-right': `${jukeboxConfig.dockRightOffsetPx}px`,
    '--jukebox-panel-width': `${jukeboxConfig.panelWidthPx}px`,
    '--jukebox-panel-gap': `${jukeboxConfig.panelGapPx}px`,
    '--jukebox-deck-size': `${jukeboxConfig.deckSizePx}px`,
    '--jukebox-disc-size': `${jukeboxConfig.discIconSizePx}px`,
    '--jukebox-disc-thumb-size': `${jukeboxConfig.discThumbSizePx}px`,
    '--jukebox-control-size': `${jukeboxConfig.controlButtonSizePx}px`,
  } satisfies CSSProperties & Record<JukeboxCssVariable, string>;

  const releaseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.onended = null;
    audio.onerror = null;
    audioRef.current = null;
    audioDiscIdRef.current = null;
  }, []);

  const playDisc = useCallback(
    async (discId: JukeboxDiscId) => {
      const disc = discById.get(discId);
      if (!disc) return;

      setSelectedDiscId(discId);
      setPlaybackError(false);
      storeLastDisc(discId);

      let audio = audioRef.current;
      if (!audio || audioDiscIdRef.current !== discId) {
        releaseAudio();
        audio = new Audio(disc.audioPath);
        audio.volume = normalizedVolume;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          setPlaybackError(true);
        };
        audioRef.current = audio;
        audioDiscIdRef.current = discId;
      } else {
        audio.volume = normalizedVolume;
      }

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
        setPlaybackError(true);
      }
    },
    [discById, normalizedVolume, releaseAudio],
  );

  // Select a disc without auto-playing; keeps the now-playing artwork in sync.
  // 仅选中唱片但不自动播放，保持当前播放唱片的封面同步。
  const selectDisc = useCallback((discId: JukeboxDiscId) => {
    setSelectedDiscId(discId);
    setPlaybackError(false);
    storeLastDisc(discId);
  }, []);

  const togglePlayback = () => {
    if (!selectedDiscId) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    void playDisc(selectedDiscId);
  };

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const storedDiscId = window.localStorage.getItem(storageKeys.jukeboxLastDisc);
      if (isJukeboxDiscId(storedDiscId)) {
        setSelectedDiscId(storedDiscId);
      } else if (jukeboxConfig.discs.length > 0) {
        // Pre-select the first disc so the panel shows artwork immediately.
        // 预选第一张唱片，使面板打开即可显示封面。
        setSelectedDiscId(jukeboxConfig.discs[0].id);
      }
    } catch {
      // Keep the player usable when persisted state is unavailable.
      // 持久化状态不可用时仍保持播放器可用。
    }

    return releaseAudio;
  }, [releaseAudio]);

  const updatePanelPosition = useCallback(() => {
    const toggle = toggleRef.current;
    const panel = panelRef.current;
    if (!toggle) return;

    const rect = toggle.getBoundingClientRect();
    const gap = jukeboxConfig.panelGapPx;
    const panelWidth = jukeboxConfig.panelWidthPx;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const viewportPadding = 8;
    // Measure the real rendered panel height, falling back to a safe estimate.
    // 测量真实渲染后的面板高度，失败时回退到安全估算值。
    const panelHeight = panel?.offsetHeight ?? 280;

    const nextPosition: PanelPosition = {};

    if (variant === 'sidebar' || variant === 'icon') {
      // Docs/sidebar/icon variant: align panel left with the toggle and clamp to viewport.
      // 文档 / 侧栏 / 图标变体：面板左对齐按钮并限制在视口内。
      const left = Math.max(
        viewportPadding,
        Math.min(rect.left, viewportWidth - panelWidth - viewportPadding),
      );
      nextPosition.left = `${left}px`;
    } else {
      // Header/default variant: align panel right with the toggle and clamp to viewport.
      // 标题栏 / 默认变体：面板右对齐按钮并限制在视口内。
      const rawRight = viewportWidth - rect.right;
      const right = Math.max(
        viewportPadding,
        Math.min(rawRight, viewportWidth - panelWidth - viewportPadding),
      );
      nextPosition.right = `${right}px`;
    }

    // Vertical placement: prefer below, flip above when bottom space is insufficient,
    // and clamp if the panel is taller than both available spaces.
    // 垂直定位：优先向下展开；下方空间不足时向上翻转；
    // 若上下空间均不足，则钳制在视口内。
    const spaceBelow = viewportHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;

    if (panelHeight <= spaceBelow) {
      nextPosition.top = `${rect.bottom + gap}px`;
    } else if (panelHeight <= spaceAbove) {
      nextPosition.top = `${rect.top - panelHeight - gap}px`;
    } else {
      const fallbackTop = Math.max(
        viewportPadding,
        Math.min(rect.bottom + gap, viewportHeight - panelHeight - viewportPadding),
      );
      nextPosition.top = `${fallbackTop}px`;
    }

    setPanelPosition(nextPosition);
  }, [variant]);

  const togglePanel = (event?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the surrounding Fumadocs icon link from navigating when the jukebox is embedded as an icon.
    // 当唱片机作为图标嵌入时，阻止外层 Fumadocs 图标链接跳转。
    event?.preventDefault();
    event?.stopPropagation();
    playOneShotSound(jukeboxConfig.toggleSoundPath, normalizedVolume);
    setIsOpen((value) => {
      const nextOpen = !value;
      if (nextOpen) {
        // Defer position calculation until after the panel is rendered.
        // 延迟计算位置，确保面板渲染后再计算。
        window.setTimeout(updatePanelPosition, 0);
      }
      return nextOpen;
    });
  };

  // Close the inline panel when clicking outside or pressing Escape.
  // 点击面板外部或按下 Escape 时关闭内联面板。
  useEffect(() => {
    if (!isOpen) return;

    updatePanelPosition();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedToggle = containerRef.current?.contains(target);
      const clickedPanel = panelRef.current?.contains(target);
      if (!clickedToggle && !clickedPanel) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleLayoutChange = () => updatePanelPosition();

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleLayoutChange);
    window.addEventListener('scroll', handleLayoutChange, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleLayoutChange);
      window.removeEventListener('scroll', handleLayoutChange, true);
    };
  }, [isOpen, updatePanelPosition]);

  const panelContent = (
    <div
      ref={panelRef}
      className="mc-jukebox__panel"
      role="dialog"
      aria-labelledby={panelTitleId}
      style={{ ...jukeboxStyle, ...(panelPosition ?? {}) }}
    >
      <div className="mc-jukebox__header">
        <div className="mc-jukebox__title-wrap">
          <Disc3 className="mc-jukebox__title-icon" aria-hidden="true" />
          <span id={panelTitleId} className="font-minecraft-ae">
            {dict.jukeboxTitle}
          </span>
        </div>
        <button
          type="button"
          className="mc-jukebox__close"
          aria-label={dict.jukeboxClose}
          title={dict.jukeboxClose}
          onClick={() => setIsOpen(false)}
        >
          <X className="mc-jukebox__icon" aria-hidden="true" />
        </button>
      </div>

      {/* Compact record deck: disc slot, tonearm, and current track metadata. / 紧凑唱片仓：唱片槽、唱针与当前曲目信息。 */}
      <div className="mc-jukebox__deck-row">
        <button
          type="button"
          className={`mc-jukebox__deck ${isPlaying ? 'mc-jukebox__deck--playing' : ''}`}
          aria-label={`${isPlaying ? dict.jukeboxPause : dict.jukeboxPlay} ${selectedDiscName}`}
          aria-pressed={isPlaying}
          title={`${isPlaying ? dict.jukeboxPause : dict.jukeboxPlay} ${selectedDiscName}`}
          // The record deck mirrors the footer play button, so clicking it toggles play and pause.
          // 主唱片仓与底部播放按钮保持一致，点击即可在播放与暂停之间切换。
          onClick={togglePlayback}
          disabled={!selectedDiscId}
        >
          <span className="mc-jukebox__deck-grid" aria-hidden="true" />
          {selectedDisc ? (
            <>
              {/* draggable={false} prevents the disc texture from being dragged out of the page. / draggable={false} 防止唱片贴图被拖出页面。 */}
              <Image
                src={selectedDisc.iconPath}
                alt=""
                width={jukeboxConfig.discIconSizePx}
                height={jukeboxConfig.discIconSizePx}
                className="mc-jukebox__disc"
                draggable={false}
                unoptimized
              />
              <span className="mc-jukebox__needle" aria-hidden="true" />
            </>
          ) : null}
        </button>

        <div className="mc-jukebox__meta">
          <p className="mc-jukebox__disc-name font-minecraft-ae">{selectedDiscName}</p>
          <span className={`mc-jukebox__status ${isPlaying ? 'mc-jukebox__status--playing' : ''}`}>
            {isPlaying ? dict.jukeboxNowPlaying : dict.jukeboxReady}
          </span>
        </div>
      </div>

      {/* Disc library grid: pick a disc without auto-playing. / 唱片库网格：选择唱片但不自动播放。 */}
      {jukeboxConfig.discs.length > 1 ? (
        <div className="mc-jukebox__library" role="listbox" aria-label={dict.jukeboxTitle}>
          {jukeboxConfig.discs.map((disc) => {
            const isActive = disc.id === selectedDiscId;
            const isCurrent = disc.id === audioDiscIdRef.current && isPlaying;
            return (
              <button
                key={disc.id}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`mc-jukebox__disc-thumb ${isActive ? 'mc-jukebox__disc-thumb--active' : ''}`}
                title={dict.jukeboxDiscNames[disc.id]}
                onClick={() => selectDisc(disc.id)}
              >
                {/* draggable={false} prevents the disc texture from being dragged out of the page. / draggable={false} 防止唱片贴图被拖出页面。 */}
                <Image
                  src={disc.iconPath}
                  alt=""
                  width={jukeboxConfig.discThumbSizePx}
                  height={jukeboxConfig.discThumbSizePx}
                  className="mc-jukebox__disc-thumb-img"
                  draggable={false}
                  unoptimized
                />
                {isCurrent ? (
                  <span className="mc-jukebox__disc-thumb-playing" aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {playbackError ? (
        <p className="mc-jukebox__error font-minecraft-ae" role="status">
          {dict.jukeboxPlaybackError}
        </p>
      ) : null}

      <div className="mc-jukebox__controls">
        <button
          type="button"
          className="mc-jukebox__btn"
          disabled={!selectedDiscId}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? dict.jukeboxPause : dict.jukeboxPlay}
          title={isPlaying ? dict.jukeboxPause : dict.jukeboxPlay}
          onClick={togglePlayback}
        >
          {isPlaying ? (
            <Pause className="mc-jukebox__icon" aria-hidden="true" />
          ) : (
            <Play className="mc-jukebox__icon" aria-hidden="true" />
          )}
          <span className="sr-only">{isPlaying ? dict.jukeboxPause : dict.jukeboxPlay}</span>
        </button>
        <button
          type="button"
          className="mc-jukebox__btn"
          disabled={!selectedDiscId}
          aria-label={dict.jukeboxStop}
          title={dict.jukeboxStop}
          onClick={stopPlayback}
        >
          <Square className="mc-jukebox__icon" aria-hidden="true" />
          <span className="sr-only">{dict.jukeboxStop}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={`mc-jukebox mc-jukebox--${variant}`} style={jukeboxStyle}>
      {isOpen && mounted ? createPortal(panelContent, document.body) : null}

      <button
        ref={toggleRef}
        type="button"
        className="mc-jukebox__toggle"
        aria-label={isOpen ? dict.jukeboxClose : dict.jukeboxToggle}
        aria-expanded={isOpen}
        title={isOpen ? dict.jukeboxClose : dict.jukeboxToggle}
        onClick={togglePanel}
      >
        {/* draggable={false} prevents the jukebox block texture from being dragged out of the page. / draggable={false} 防止唱片机方块贴图被拖出页面。 */}
        <Image
          src={jukeboxConfig.jukeboxIconPath}
          alt=""
          width={jukeboxConfig.toggleSizePx}
          height={jukeboxConfig.toggleSizePx}
          className="mc-jukebox__toggle-img"
          draggable={false}
          priority
          unoptimized
        />
      </button>
    </div>
  );
}
