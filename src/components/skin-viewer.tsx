// Minecraft 3D Skin Viewer Component / Minecraft 3D 皮肤查看器组件
// A React wrapper around the legacy SkinViewer class that renders a 3D
// Minecraft character model using CSS 3D transforms.
// 对 legacy SkinViewer 类的 React 封装，使用 CSS 3D 变换渲染 Minecraft 角色模型。

'use client';

import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { storageKeys, uiConfig } from '@/config';
import { getPageDictionary } from '@/dictionaries';
import { i18n, type Locale } from '@/lib/i18n';

// ── Texture map: defines UV regions on a 64x64 skin image / 纹理映射：定义 64x64 皮肤图像上的 UV 区域 ──
const TEXTURE_MAP = {
  head: {
    inner: [
      [8, 8, 8, 8],
      [24, 8, 8, 8],
      [0, 8, 8, 8],
      [16, 8, 8, 8],
      [8, 0, 8, 8],
      [16, 0, 8, 8],
    ],
    outer: [
      [40, 8, 8, 8],
      [56, 8, 8, 8],
      [32, 8, 8, 8],
      [48, 8, 8, 8],
      [40, 0, 8, 8],
      [48, 0, 8, 8],
    ],
  },
  underhead: {
    body: {
      inner: [
        [20, 20, 8, 12],
        [32, 20, 8, 12],
        [16, 20, 4, 12],
        [28, 20, 4, 12],
        [20, 16, 8, 4],
        [28, 16, 8, 4],
      ],
      outer: [
        [20, 36, 8, 12],
        [32, 36, 8, 12],
        [16, 36, 4, 12],
        [28, 36, 4, 12],
        [20, 32, 8, 4],
        [28, 32, 8, 4],
      ],
    },
    legs: {
      left: {
        inner: [
          [20, 52, 4, 12],
          [28, 52, 4, 12],
          [16, 52, 4, 12],
          [24, 52, 4, 12],
          [20, 48, 4, 4],
          [24, 48, 4, 4],
        ],
        outer: [
          [4, 52, 4, 12],
          [12, 52, 4, 12],
          [0, 52, 4, 12],
          [8, 52, 4, 12],
          [4, 48, 4, 4],
          [8, 48, 4, 4],
        ],
      },
      right: {
        inner: [
          [4, 20, 4, 12],
          [12, 20, 4, 12],
          [0, 20, 4, 12],
          [8, 20, 4, 12],
          [4, 16, 4, 4],
          [8, 16, 4, 4],
        ],
        outer: [
          [4, 36, 4, 12],
          [12, 36, 4, 12],
          [0, 36, 4, 12],
          [8, 36, 4, 12],
          [4, 32, 4, 4],
          [8, 32, 4, 4],
        ],
      },
    },
    arms: {
      left: {
        inner: [
          [36, 52, 4, 12],
          [44, 52, 4, 12],
          [32, 52, 4, 12],
          [40, 52, 4, 12],
          [36, 48, 4, 4],
          [40, 48, 4, 4],
        ],
        outer: [
          [52, 52, 4, 12],
          [60, 52, 4, 12],
          [48, 52, 4, 12],
          [56, 52, 4, 12],
          [52, 48, 4, 4],
          [56, 48, 4, 4],
        ],
      },
      left_alex: {
        inner: [
          [36, 52, 3, 12],
          [43, 52, 3, 12],
          [32, 52, 4, 12],
          [40, 52, 4, 12],
          [36, 48, 3, 4],
          [39, 48, 3, 4],
        ],
        outer: [
          [52, 52, 3, 12],
          [59, 52, 3, 12],
          [48, 52, 4, 12],
          [56, 52, 4, 12],
          [52, 48, 3, 4],
          [55, 48, 3, 4],
        ],
      },
      right: {
        inner: [
          [44, 20, 4, 12],
          [52, 20, 4, 12],
          [40, 20, 4, 12],
          [48, 20, 4, 12],
          [44, 16, 4, 4],
          [48, 16, 4, 4],
        ],
        outer: [
          [44, 36, 4, 12],
          [52, 36, 4, 12],
          [40, 36, 4, 12],
          [48, 36, 4, 12],
          [44, 32, 4, 4],
          [48, 32, 4, 4],
        ],
      },
      right_alex: {
        inner: [
          [44, 20, 3, 12],
          [51, 20, 3, 12],
          [40, 20, 4, 12],
          [48, 20, 4, 12],
          [44, 16, 3, 4],
          [47, 16, 3, 4],
        ],
        outer: [
          [44, 36, 3, 12],
          [51, 36, 3, 12],
          [40, 36, 4, 12],
          [48, 36, 4, 12],
          [44, 32, 3, 4],
          [47, 32, 3, 4],
        ],
      },
    },
  },
} as const;

const SKIN_TYPE_STEVE = 'steve';
const SKIN_TYPE_ALEX = 'alex';
type SkinType = typeof SKIN_TYPE_STEVE | typeof SKIN_TYPE_ALEX;

type RegionMap = ReadonlyArray<readonly [number, number, number, number]>;
type CoverList = HTMLImageElement[];

interface SkinElements {
  skinContainer: HTMLDivElement;
  skinMain: HTMLDivElement;
  skinMainRotate: HTMLDivElement;
  skinMainTranslate: HTMLDivElement;
  skinHead: HTMLDivElement;
  skinHeadInner: HTMLDivElement;
  headInnerList: CoverList;
  skinHeadOuter: HTMLDivElement;
  headOuterList: CoverList;
  skinUnderHead: HTMLDivElement;
  skinBody: HTMLDivElement;
  skinBodyInner: HTMLDivElement;
  bodyInnerList: CoverList;
  skinBodyOuter: HTMLDivElement;
  bodyOuterList: CoverList;
  skinLegs: HTMLDivElement;
  skinLegLeft: HTMLDivElement;
  skinLegLeftInner: HTMLDivElement;
  legLeftInnerList: CoverList;
  skinLegLeftOuter: HTMLDivElement;
  legLeftOuterList: CoverList;
  skinLegRight: HTMLDivElement;
  skinLegRightInner: HTMLDivElement;
  legRightInnerList: CoverList;
  skinLegRightOuter: HTMLDivElement;
  legRightOuterList: CoverList;
  skinArms: HTMLDivElement;
  skinArmLeft: HTMLDivElement;
  skinArmLeftInner: HTMLDivElement;
  armLeftInnerList: CoverList;
  skinArmLeftOuter: HTMLDivElement;
  armLeftOuterList: CoverList;
  skinArmRight: HTMLDivElement;
  skinArmRightInner: HTMLDivElement;
  armRightInnerList: CoverList;
  skinArmRightOuter: HTMLDivElement;
  armRightOuterList: CoverList;
}

// Lazily initialize DEFAULT_SKIN on first access to avoid calling Image()
// at module scope (which fails during SSR where Image is undefined).
let _defaultSkin: HTMLImageElement | null = null;
function getDefaultSkin(): HTMLImageElement {
  if (!_defaultSkin) {
    _defaultSkin = new Image();
    _defaultSkin.src =
      'data:image/png;base64,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';
  }
  return _defaultSkin;
}

// Wait for the base64 skin to decode before slicing it into canvas textures.
// 等待 base64 皮肤完成解码后，再切分为 canvas 纹理。
function waitForImageReady(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  if (typeof image.decode === 'function') {
    return image.decode().catch(
      () =>
        new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        }),
    );
  }

  return new Promise((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => resolve(), { once: true });
  });
}

function createCover(className: string, index: number): HTMLImageElement {
  const img = document.createElement('img');
  img.classList.add(className);
  img.classList.add(`${className}-${index}`);
  return img;
}

function createElementWithClass<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
}

function initElement(container: HTMLElement): SkinElements {
  const skinContainer = createElementWithClass('div', 'd-skin-container');
  const skinMain = createElementWithClass('div', 'd-skin-main');
  const skinMainRotate = createElementWithClass('div', 'd-skin-main-rotate');
  const skinMainTranslate = createElementWithClass('div', 'd-skin-main-translate');
  const skinHead = createElementWithClass('div', 'd-skin-head');
  const skinHeadInner = createElementWithClass('div', 'd-skin-head-inner');
  const skinHeadOuter = createElementWithClass('div', 'd-skin-head-outer');
  const skinUnderHead = createElementWithClass('div', 'd-skin-underhead');
  const skinBody = createElementWithClass('div', 'd-skin-body');
  const skinBodyInner = createElementWithClass('div', 'd-skin-body-inner');
  const skinBodyOuter = createElementWithClass('div', 'd-skin-body-outer');
  const skinLegs = createElementWithClass('div', 'd-skin-legs');
  const skinLegLeft = createElementWithClass('div', 'd-skin-leg-left');
  const skinLegLeftInner = createElementWithClass('div', 'd-skin-leg-left-inner');
  const skinLegLeftOuter = createElementWithClass('div', 'd-skin-leg-left-outer');
  const skinLegRight = createElementWithClass('div', 'd-skin-leg-right');
  const skinLegRightInner = createElementWithClass('div', 'd-skin-leg-right-inner');
  const skinLegRightOuter = createElementWithClass('div', 'd-skin-leg-right-outer');
  const skinArms = createElementWithClass('div', 'd-skin-arms');
  const skinArmLeft = createElementWithClass('div', 'd-skin-arm-left');
  const skinArmLeftInner = createElementWithClass('div', 'd-skin-arm-left-inner');
  const skinArmLeftOuter = createElementWithClass('div', 'd-skin-arm-left-outer');
  const skinArmRight = createElementWithClass('div', 'd-skin-arm-right');
  const skinArmRightInner = createElementWithClass('div', 'd-skin-arm-right-inner');
  const skinArmRightOuter = createElementWithClass('div', 'd-skin-arm-right-outer');

  skinContainer.append(skinMain);
  skinMain.append(skinMainRotate);
  skinMainRotate.append(skinMainTranslate);
  skinMainTranslate.append(skinHead, skinUnderHead);
  skinHead.append(skinHeadInner, skinHeadOuter);
  skinUnderHead.append(skinBody, skinLegs, skinArms);
  skinBody.append(skinBodyInner, skinBodyOuter);
  skinLegs.append(skinLegLeft, skinLegRight);
  skinLegLeft.append(skinLegLeftInner, skinLegLeftOuter);
  skinLegRight.append(skinLegRightInner, skinLegRightOuter);
  skinArms.append(skinArmLeft, skinArmRight);
  skinArmLeft.append(skinArmLeftInner, skinArmLeftOuter);
  skinArmRight.append(skinArmRightInner, skinArmRightOuter);

  const buildList = (parent: HTMLElement, className: string, coverClass: string): CoverList => {
    const list: CoverList = [];
    for (let i = 0; i < 6; i++) {
      const img = createCover(className, i);
      img.classList.add(`d-${coverClass}-${i}`);
      parent.append(img);
      list.push(img);
    }
    return list;
  };

  const elements: SkinElements = {
    skinContainer,
    skinMain,
    skinMainRotate,
    skinMainTranslate,
    skinHead,
    skinHeadInner,
    headInnerList: buildList(skinHeadInner, 'd-skin-head-inner-cover', 'cover'),
    skinHeadOuter,
    headOuterList: buildList(skinHeadOuter, 'd-skin-head-outer-cover', 'cover'),
    skinUnderHead,
    skinBody,
    skinBodyInner,
    bodyInnerList: buildList(skinBodyInner, 'd-skin-body-inner-cover', 'body-cover'),
    skinBodyOuter,
    bodyOuterList: buildList(skinBodyOuter, 'd-skin-body-outer-cover', 'body-cover'),
    skinLegs,
    skinLegLeft,
    skinLegLeftInner,
    legLeftInnerList: buildList(skinLegLeftInner, 'd-skin-leg-left-inner-cover', 'leg-cover'),
    skinLegLeftOuter,
    legLeftOuterList: buildList(skinLegLeftOuter, 'd-skin-leg-left-outer-cover', 'leg-cover'),
    skinLegRight,
    skinLegRightInner,
    legRightInnerList: buildList(skinLegRightInner, 'd-skin-leg-right-inner-cover', 'leg-cover'),
    skinLegRightOuter,
    legRightOuterList: buildList(skinLegRightOuter, 'd-skin-leg-right-outer-cover', 'leg-cover'),
    skinArms,
    skinArmLeft,
    skinArmLeftInner,
    armLeftInnerList: buildList(skinArmLeftInner, 'd-skin-arm-left-inner-cover', 'arm-cover'),
    skinArmLeftOuter,
    armLeftOuterList: buildList(skinArmLeftOuter, 'd-skin-arm-left-outer-cover', 'arm-cover'),
    skinArmRight,
    skinArmRightInner,
    armRightInnerList: buildList(skinArmRightInner, 'd-skin-arm-right-inner-cover', 'arm-cover'),
    skinArmRightOuter,
    armRightOuterList: buildList(skinArmRightOuter, 'd-skin-arm-right-outer-cover', 'arm-cover'),
  };

  container.append(skinContainer);
  return elements;
}

function attachTexture(
  element: HTMLImageElement,
  skin: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const cvs = document.createElement('canvas');
  cvs.width = width;
  cvs.height = height;
  const ctx = cvs.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(skin, x, y, width, height, 0, 0, width, height);
  element.src = cvs.toDataURL();
}

function refreshCoverList(list: CoverList, mapList: RegionMap, skin: HTMLImageElement): void {
  for (let i = 0; i < 6; i++) {
    const [x, y, w, h] = mapList[i];
    attachTexture(list[i], skin, x, y, w, h);
  }
}

function refreshTexture(elements: SkinElements, skin: HTMLImageElement, skinType: SkinType): void {
  refreshCoverList(elements.headInnerList, TEXTURE_MAP.head.inner, skin);
  refreshCoverList(elements.headOuterList, TEXTURE_MAP.head.outer, skin);
  refreshCoverList(elements.bodyInnerList, TEXTURE_MAP.underhead.body.inner, skin);
  refreshCoverList(elements.bodyOuterList, TEXTURE_MAP.underhead.body.outer, skin);
  refreshCoverList(elements.legLeftInnerList, TEXTURE_MAP.underhead.legs.left.inner, skin);
  refreshCoverList(elements.legLeftOuterList, TEXTURE_MAP.underhead.legs.left.outer, skin);
  refreshCoverList(elements.legRightInnerList, TEXTURE_MAP.underhead.legs.right.inner, skin);
  refreshCoverList(elements.legRightOuterList, TEXTURE_MAP.underhead.legs.right.outer, skin);

  const armLeftKey = skinType === SKIN_TYPE_ALEX ? 'left_alex' : 'left';
  const armRightKey = skinType === SKIN_TYPE_ALEX ? 'right_alex' : 'right';

  refreshCoverList(elements.armLeftInnerList, TEXTURE_MAP.underhead.arms[armLeftKey].inner, skin);
  refreshCoverList(elements.armLeftOuterList, TEXTURE_MAP.underhead.arms[armLeftKey].outer, skin);
  refreshCoverList(elements.armRightInnerList, TEXTURE_MAP.underhead.arms[armRightKey].inner, skin);
  refreshCoverList(elements.armRightOuterList, TEXTURE_MAP.underhead.arms[armRightKey].outer, skin);
}

class SkinViewer {
  public static readonly SKIN_TYPE = {
    STEVE: SKIN_TYPE_STEVE,
    ALEX: SKIN_TYPE_ALEX,
  } as const;

  private elements: SkinElements;
  private skin: HTMLImageElement = getDefaultSkin();
  private skinType: SkinType = SKIN_TYPE_STEVE;
  private rotate: [number, number, number] = [0, 0, 0];

  constructor(options: { container: HTMLElement }) {
    const { container } = options;
    if (!container) throw new Error('container is required');
    if (!(container instanceof HTMLElement)) {
      throw new Error('container must be a DOM element');
    }
    this.elements = initElement(container);
    refreshTexture(this.elements, this.skin, this.skinType);
  }

  setSkinType(skinType: SkinType): void {
    if (this.skinType === skinType) return;
    this.skinType = skinType;
    this.elements.skinArms.classList.toggle('d-skin-arms-alex', skinType === SKIN_TYPE_ALEX);
    refreshTexture(this.elements, this.skin, this.skinType);
  }

  setSkin(skin: HTMLImageElement | HTMLCanvasElement): void {
    if (!(skin instanceof HTMLCanvasElement) && !(skin instanceof HTMLImageElement)) {
      throw new Error('skin must be a canvas or image element');
    }
    this.skin = skin instanceof HTMLImageElement ? skin : (skin as unknown as HTMLImageElement);
    refreshTexture(this.elements, this.skin, this.skinType);
  }

  // Re-slice the current skin after late image decoding finishes.
  // 图片延迟解码完成后，重新切分当前皮肤纹理。
  refreshSkinTexture(): void {
    refreshTexture(this.elements, this.skin, this.skinType);
  }

  private refreshMainRotate(): void {
    const [rx, ry, rz] = this.rotate.map((v) => v % 360) as [number, number, number];
    this.elements.skinMain.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
  }

  setMainRotate(x: number, y: number, z: number): void {
    this.rotate = [x, y, z];
    this.refreshMainRotate();
  }

  setMainRotateX(x: number): void {
    this.rotate[0] = x;
    this.refreshMainRotate();
  }

  setMainRotateY(y: number): void {
    this.rotate[1] = y;
    this.refreshMainRotate();
  }

  setMainRotateZ(z: number): void {
    this.rotate[2] = z;
    this.refreshMainRotate();
  }

  getMainRotate(): [number, number, number] {
    return [...this.rotate] as [number, number, number];
  }

  resetMainRotate(): void {
    this.elements.skinMain.classList.add('d-skin-main-transition');
    this.rotate = [0, 0, 0];
    this.refreshMainRotate();
    window.setTimeout(() => {
      this.elements.skinMain.classList.remove('d-skin-main-transition');
    }, 300);
  }
}

// ── React Component / React 组件 ──

interface SkinViewerProps {
  /** CSS class for the container / 容器 CSS 类 */
  className?: string;
  /** Initial skin type / 初始皮肤类型 */
  skinType?: 'steve' | 'alex';
  /** Enable mouse tracking rotation / 启用鼠标跟踪旋转 */
  enableMouseTrack?: boolean;
  /** Add walking animation class / 添加行走动画类 */
  animation?: 'walk' | 'stand' | 'run' | 'none';
}

export function SkinViewerComponent({
  className = '',
  skinType = 'steve',
  enableMouseTrack = true,
  animation = 'walk',
}: SkinViewerProps) {
  const { locale } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);
  const currentLocale = i18n.languages.includes(locale as Locale)
    ? (locale as Locale)
    : i18n.defaultLanguage;
  const dict = getPageDictionary(currentLocale);
  const controlLabel = collapsed ? dict.skinViewerExpand : dict.skinViewerCollapse;
  // Skin viewer CSS variables keep spacing configurable from uiConfig.
  // 纸娃娃 CSS 变量从 uiConfig 读取，避免将间距写死在样式中。
  const skinViewerStyle = {
    '--skinviewer-right': `${uiConfig.skinViewer.rightOffsetPx}px`,
    '--skinviewer-bottom': `${uiConfig.skinViewer.bottomOffsetPx}px`,
    '--skinviewer-control-gap': `${uiConfig.skinViewer.controlGapPx}px`,
    '--skinviewer-control-left': `${uiConfig.skinViewer.controlLeftPx}px`,
    '--skinviewer-control-top': `${uiConfig.skinViewer.controlTopPx}px`,
    '--skinviewer-control-width': `${uiConfig.skinViewer.controlWidthPx}px`,
    '--skinviewer-control-height': `${uiConfig.skinViewer.controlHeightPx}px`,
    '--skinviewer-collapsed-control-offset': `${uiConfig.skinViewer.collapsedControlOffsetPx}px`,
    '--skinviewer-slide-offset': `${uiConfig.skinViewer.slideOffsetPx}px`,
  } satisfies CSSProperties &
    Record<
      | '--skinviewer-right'
      | '--skinviewer-bottom'
      | '--skinviewer-control-gap'
      | '--skinviewer-control-left'
      | '--skinviewer-control-top'
      | '--skinviewer-control-width'
      | '--skinviewer-control-height'
      | '--skinviewer-collapsed-control-offset'
      | '--skinviewer-slide-offset',
      string
    >;

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(storageKeys.skinViewerCollapsed) === 'true');
  }, []);

  const handleToggleCollapsed = () => {
    setCollapsed((value) => {
      const nextValue = !value;
      window.localStorage.setItem(storageKeys.skinViewerCollapsed, String(nextValue));
      return nextValue;
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const viewer = new SkinViewer({ container });
    viewerRef.current = viewer;

    if (skinType === 'alex') {
      viewer.setSkinType('alex');
    }

    // Refresh once the embedded skin image is decoded to avoid first-entry blank textures.
    // 内嵌皮肤图片解码后刷新一次，避免首次进入文档时纹理为空。
    void waitForImageReady(getDefaultSkin()).then(() => {
      if (viewerRef.current === viewer) {
        viewer.refreshSkinTexture();
      }
    });

    // Apply animation class / 应用动画类
    const animClass = animation !== 'none' ? `d-skin-action-${animation}` : null;
    if (animClass) {
      container.classList.add(animClass);
    }

    // Mouse tracking / 鼠标跟踪
    let mouseHandler: ((e: MouseEvent) => void) | null = null;
    if (enableMouseTrack && window.matchMedia('(min-width: 1024px)').matches) {
      mouseHandler = (e: MouseEvent) => {
        viewer.setMainRotate(
          (window.innerHeight - 250 - e.clientY) / 20,
          (e.clientX - window.innerWidth + 150) / 40,
          0,
        );
      };
      document.addEventListener('mousemove', mouseHandler);
    }

    return () => {
      if (mouseHandler) {
        document.removeEventListener('mousemove', mouseHandler);
      }
      // Remove animation class on cleanup / 清理时移除动画类
      if (animClass) {
        container.classList.remove(animClass);
      }
      container.innerHTML = '';
      viewerRef.current = null;
    };
  }, [skinType, enableMouseTrack, animation]);

  return (
    <div
      className={`skinviewer-shell ${collapsed ? 'skinviewer-shell--collapsed' : ''} ${className}`}
      style={skinViewerStyle}
    >
      <div
        ref={containerRef}
        className={`skinviewer-container ${collapsed ? 'skinviewer-container--collapsed' : ''}`}
        aria-hidden="true"
      />
      {/* Floating collapse toggle below the character's feet. / 悬浮在人物脚下方的收回切换按钮。 */}
      <button
        type="button"
        className="skinviewer-toggle"
        aria-label={controlLabel}
        title={controlLabel}
        aria-expanded={!collapsed}
        onClick={handleToggleCollapsed}
      >
        {collapsed ? (
          <ChevronLeft className="skinviewer-toggle__icon" aria-hidden="true" />
        ) : (
          <ChevronRight className="skinviewer-toggle__icon" aria-hidden="true" />
        )}
        <span className="sr-only">{controlLabel}</span>
      </button>
    </div>
  );
}
