// Minecraft server status component: connects to mcsrvstat.us API to display
// real-time server status, player count, and player names.
// Minecraft 服务器状态组件：通过 mcsrvstat.us API 连接服务器，
// 实时显示服务器状态、在线人数和玩家名称。
'use client';

import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { Box, Server, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { mcConfig } from '@/config';
import { en } from '@/dictionaries/en';
import { zh } from '@/dictionaries/zh';
import { i18n } from '@/lib/i18n';

// Locale → labels lookup / 按 locale 查表获取文案
const LABELS = { zh, en } as const;

interface McPlayer {
  name: string;
  uuid: string;
}

interface McServerData {
  online: boolean;
  ip: string;
  port: number;
  hostname?: string;
  version?: string;
  players: {
    online: number;
    max: number;
    list?: McPlayer[];
  };
}

/**
 * Calculate the number of fake players.
 * Players returned by the API (with name + uuid + avatar) are real players.
 * The rest (online - real) are fake players.
 * 计算假人数量。API 返回的玩家（带名称、UUID、头像）是真人玩家，
 * 其余（在线人数 - 真人数量）为假人。
 */
function getFakePlayerCount(online: number, realList: McPlayer[]): number {
  return Math.max(0, online - realList.length);
}

export function McServerStatus({ locale }: { locale?: string }) {
  const [data, setData] = useState<McServerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { locale: fumadocsLocale } = useI18n();
  const currentLocale = locale ?? fumadocsLocale ?? i18n.defaultLanguage;
  const labels =
    LABELS[currentLocale as keyof typeof LABELS as 'zh' | 'en'] ?? LABELS[i18n.defaultLanguage];

  const handleCopyIp = useCallback(() => {
    // If default port is 25565, copy only the IP; otherwise copy IP:port.
    // 若默认端口为 25565，仅复制 IP；否则复制 IP:端口。
    const text =
      mcConfig.defaultPort === 25565
        ? mcConfig.serverIp
        : `${mcConfig.serverIp}:${mcConfig.defaultPort}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    });
  }, []);

  useEffect(() => {
    // Fetch MC server status from mcsrvstat.us API.
    // 从 mcsrvstat.us API 获取 MC 服务器状态。
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `${mcConfig.statusApiBase}/${mcConfig.serverIp}:${mcConfig.defaultPort}`,
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData({
          online: json.online ?? false,
          ip: json.ip ?? mcConfig.serverIp,
          port: json.port ?? mcConfig.defaultPort,
          hostname: json.hostname,
          version: json.version,
          players: {
            online: json.players?.online ?? 0,
            max: json.players?.max ?? 0,
            list: json.players?.list ?? [],
          },
        });
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Refresh at configured interval / 按配置间隔刷新
    const interval = setInterval(fetchStatus, mcConfig.pollingIntervalMs);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mc-status">
      <div className="mc-status__header">
        <Server size={18} className="text-fd-muted-foreground" />
        <span className="font-minecraft-ae text-sm font-bold">{labels.serverStatus}</span>
        {loading ? (
          <span className="text-xs text-fd-muted-foreground animate-pulse">...</span>
        ) : data?.online ? (
          <>
            <span className="mc-status__indicator mc-status__indicator--online" />
            <span className="text-xs text-green-600 dark:text-green-400 font-minecraft-ae">
              {labels.serverOnline}
            </span>
          </>
        ) : (
          <>
            <span className="mc-status__indicator mc-status__indicator--offline" />
            <span className="text-xs text-red-600 dark:text-red-400 font-minecraft-ae">
              {labels.serverOffline}
            </span>
          </>
        )}
      </div>

      {/* Skeleton layer / 骨架屏层 */}
      <div
        className={`flex flex-col gap-1 transition-opacity duration-500 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
        aria-hidden={!loading}
      >
        <div className="flex items-center gap-2 text-sm">
          <Users size={14} className="text-fd-muted-foreground" />
          <span className="h-4 w-24 rounded bg-fd-muted-foreground/20 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Box size={14} className="text-fd-muted-foreground" />
          <span className="h-4 w-16 rounded bg-fd-muted-foreground/20 animate-pulse" />
        </div>
        <div className="mc-status__player-section">
          <div className="mc-status__player-list">
            <span className="mc-status__player">
              <span className="mc-status__player-avatar rounded bg-fd-muted-foreground/20 animate-pulse" />
              <span className="h-3 w-16 rounded bg-fd-muted-foreground/20 animate-pulse" />
            </span>
            <span className="mc-status__player">
              <span className="mc-status__player-avatar rounded bg-fd-muted-foreground/20 animate-pulse" />
              <span className="h-3 w-12 rounded bg-fd-muted-foreground/20 animate-pulse" />
            </span>
          </div>
        </div>
      </div>

      {/* Real data layer / 真实数据层 */}
      <div
        className={`flex flex-col gap-1 transition-opacity duration-500 ${!loading && data?.online ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
        aria-hidden={loading || !data?.online}
      >
        <div className="flex items-center gap-2 text-sm">
          <Users size={14} className="text-fd-muted-foreground" />
          <span className="font-minecraft-ae">
            {data?.players.online} / {data?.players.max} {labels.serverPlayers}
            {(() => {
              const fakeCount = getFakePlayerCount(
                data?.players.online ?? 0,
                data?.players.list ?? [],
              );
              const realCount = (data?.players.list ?? []).length;
              if (fakeCount <= 0) return null;
              return (
                <span className="text-fd-muted-foreground text-xs ml-1">
                  ({fakeCount} {labels.fakePlayers} / {realCount} {labels.realPlayers})
                </span>
              );
            })()}
          </span>
        </div>

        {data?.version && (
          <div className="flex items-center gap-2 text-sm">
            <Box size={14} className="text-fd-muted-foreground" />
            <span className="font-minecraft-ae text-black">{data.version}</span>
          </div>
        )}

        {/* Real players returned by API / API 返回的真人玩家 */}
        {data?.players.list && data.players.list.length > 0 && (
          <div className="mc-status__player-section">
            <div className="mc-status__player-list">
              {data.players.list.map((player) => (
                <span key={player.uuid} className="mc-status__player">
                  {/* biome-ignore lint/performance/noImgElement: external MC head avatar API, 16px fixed size */}
                  <img
                    src={`${mcConfig.avatarApiBase}/${player.uuid}/${mcConfig.avatarSize}`}
                    alt={player.name}
                    className="mc-status__player-avatar"
                    loading="lazy"
                  />
                  <span className="font-minecraft-ae">{player.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {mcConfig.showServerIp && (
        <div className="flex items-center gap-2 text-xs text-fd-muted-foreground">
          <span className="font-minecraft-ae text-black">{labels.serverIp}:</span>
          <button
            type="button"
            onClick={handleCopyIp}
            className={`relative bg-fd-accent px-1.5 py-0.5 rounded text-xs font-minecraft-ae cursor-pointer transition-all duration-200 hover:brightness-110 ${
              copied
                ? 'bg-green-500/20 text-green-700 dark:text-green-400 ring-1 ring-green-500/40'
                : ''
            }`}
            title={copied ? '已复制 / Copied' : '点击复制 / Click to copy'}
          >
            {mcConfig.defaultPort === 25565
              ? mcConfig.serverIp
              : `${mcConfig.serverIp}:${mcConfig.defaultPort}`}
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 bg-[#1a2e1a]/95 border border-green-600/60 text-[10px] text-green-400 font-minecraft-ae whitespace-nowrap rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-200 animate-in fade-in slide-in-from-bottom-1">
                <svg
                  className="w-3 h-3 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-label="Check"
                >
                  <title>Check</title>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {currentLocale === 'zh' ? '已复制' : 'Copied'}
                {/* Small arrow pointing down / 指向下方的箭头 */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#1a2e1a] border-r border-b border-green-600/60 rotate-45" />
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
