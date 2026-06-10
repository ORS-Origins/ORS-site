// Global context menu with Minecraft pixel-art style.
// 全局右键菜单，采用 Minecraft 像素艺术风格。
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Home, Info, Link2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getPageDictionary } from '@/dictionaries';
import type { Locale } from '@/lib/i18n';

interface ContextMenuProps {
  locale: Locale;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  divider?: boolean;
}

export function ContextMenu({ locale }: ContextMenuProps) {
  const dict = getPageDictionary(locale);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const baseItems: MenuItem[] = [
    {
      id: 'home',
      label: dict.ctxMenuBackHome,
      icon: <Home className="w-4 h-4" />,
      action: () => {
        window.location.href = `/${locale}`;
      },
    },
    {
      id: 'reload',
      label: dict.ctxMenuReload,
      icon: <RefreshCw className="w-4 h-4" />,
      action: () => {
        window.location.reload();
      },
    },
    {
      id: 'copy-link',
      label: dict.ctxMenuCopyLink,
      icon: <Link2 className="w-4 h-4" />,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
      },
    },
    {
      id: 'about',
      label: dict.ctxMenuAbout,
      icon: <Info className="w-4 h-4" />,
      action: () => {
        window.open('https://github.com/EmptyDreams/ORS', '_blank');
      },
      divider: true,
    },
  ];

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      // Do not intercept on interactive elements / 不拦截交互元素上的右键
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[contenteditable="true"]') ||
        target.closest('img') ||
        target.closest('video')
      ) {
        return;
      }

      e.preventDefault();

      const selection = window.getSelection()?.toString().trim() ?? '';
      setSelectedText(selection);

      const menuWidth = 192;
      const itemCount = selection ? baseItems.length + 1 : baseItems.length;
      const menuHeight = itemCount * 40 + 16;
      const padding = 8;

      let x = e.clientX;
      let y = e.clientY;

      if (x + menuWidth + padding > window.innerWidth) {
        x = window.innerWidth - menuWidth - padding;
      }
      if (y + menuHeight + padding > window.innerHeight) {
        y = window.innerHeight - menuHeight - padding;
      }

      setPosition({ x, y });
      setVisible(true);
    },
    [baseItems.length],
  );

  const handleClickOutside = useCallback(() => {
    setVisible(false);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', handleClickOutside, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('scroll', handleClickOutside, true);
    };
  }, [handleContextMenu, handleClickOutside, handleKeyDown]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          style={{ left: position.x, top: position.y }}
          className="fixed z-9999 w-48 py-2 bg-[#1a1a2e]/95 border-2 border-[#4a4a6e] shadow-[0_4px_0_#2a2a4e,0_6px_12px_rgba(0,0,0,0.5)] backdrop-blur-sm font-minecraft-ae text-sm select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {selectedText && (
            <>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedText);
                  setVisible(false);
                }}
                className="w-full px-3 py-2 flex items-center gap-3 text-white/90 hover:bg-[#4a90d9]/30 hover:text-white transition-colors duration-75 cursor-pointer"
              >
                <span className="text-[#7dd3fc] opacity-80">
                  <Copy className="w-4 h-4" />
                </span>
                <span>{dict.ctxMenuCopyText}</span>
              </button>
              <div className="mx-2 my-1 h-px bg-[#4a4a6e]/60" />
            </>
          )}
          {baseItems.map((item, index) => (
            <div key={item.id}>
              {item.divider && index > 0 && <div className="mx-2 my-1 h-px bg-[#4a4a6e]/60" />}
              <button
                type="button"
                onClick={() => {
                  item.action();
                  setVisible(false);
                }}
                className="w-full px-3 py-2 flex items-center gap-3 text-white/90 hover:bg-[#4a90d9]/30 hover:text-white transition-colors duration-75 cursor-pointer"
              >
                <span className="text-[#7dd3fc] opacity-80">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
