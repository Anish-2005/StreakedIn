"use client";

import { useTheme } from '../../contexts/ThemeContext';
import type { CSSProperties } from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  withGradientBg?: boolean;
}

export default function AppLogo({
  size = 'md',
  showText = false,
  withGradientBg = false,
}: AppLogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeMap = {
    sm: { container: 'w-8 h-8', svg: 24 },
    md: { container: 'w-10 h-10', svg: 40 },
    lg: { container: 'w-16 h-16', svg: 64 },
  };

  const current = sizeMap[size];
  const primary = isDark ? '#60a5fa' : '#2563eb';
  const secondary = isDark ? '#34d399' : '#0f766e';
  const ring = isDark ? '#8fb3e8' : '#64748b';

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${current.container} rounded-2xl flex items-center justify-center transition-colors duration-300 ${
          withGradientBg
            ? 'bg-gradient-to-br from-app-primary-soft to-emerald-500/20 border border-app-border'
            : 'bg-transparent border border-app-border/70'
        }`}
      >
        <svg
          width={current.svg}
          height={current.svg}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <circle
            cx="32"
            cy="32"
            r="30"
            fill={isDark ? '#0f1d33' : '#eef4ff'}
            opacity="0.95"
            className="transition-all duration-300"
          />
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke={ring}
            strokeWidth="0.75"
            opacity="0.5"
            className="transition-all duration-300"
          />
          <path
            d="M 21 43 Q 20 34 24 26 Q 27 20 33 19 Q 31 28 30 35 Q 29 40 27 44 Z"
            fill="url(#streakPrimary)"
            className="transition-all duration-300"
          />
          <path
            d="M 33 43 Q 31 35 35 24 Q 38 16 44 14 Q 42 24 39 34 Q 37 40 35 44 Z"
            fill="url(#streakSecondary)"
            opacity="0.88"
            className="transition-all duration-300"
          />
          <path
            d="M 32 16 L 32 36"
            stroke={ring}
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.64"
            className="transition-all duration-300"
          />
          <path
            d="M 32 16 L 28 22 M 32 16 L 36 22"
            stroke={ring}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.64"
            className="transition-all duration-300"
          />
          <circle
            cx="32"
            cy="32"
            r="2.8"
            fill={ring}
            opacity="0.92"
            className="transition-all duration-300"
          />
          <circle
            cx="32"
            cy="42"
            r="8"
            fill="none"
            stroke={ring}
            strokeWidth="0.75"
            opacity="0.3"
            className="transition-all duration-300"
          />
          <circle
            cx="32"
            cy="42"
            r="12"
            fill="none"
            stroke={ring}
            strokeWidth="0.5"
            opacity="0.18"
            className="transition-all duration-300"
          />

          <defs>
            <linearGradient
              id="streakPrimary"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={primary} stopOpacity="1" />
              <stop offset="100%" stopColor={primary} stopOpacity="0.55" />
            </linearGradient>

            <linearGradient
              id="streakSecondary"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={secondary} stopOpacity="1" />
              <stop offset="100%" stopColor={secondary} stopOpacity="0.58" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight transition-colors duration-300 ${
              size === 'sm'
                ? 'text-sm'
                : size === 'md'
                  ? 'text-base'
                  : 'text-lg'
            }`}
            style={{
              background: isDark ? 'linear-gradient(to right, #93c5fd, #34d399)' : undefined,
              WebkitBackgroundClip: isDark ? 'text' : undefined,
              WebkitTextFillColor: isDark ? 'transparent' : undefined,
              backgroundClip: isDark ? 'text' : undefined,
              color: !isDark ? '#0f172a' : undefined,
            } as CSSProperties}
          >
            StreakedIn
          </span>
          {size === 'lg' && (
            <span className="text-[10px] font-medium uppercase tracking-widest text-app-text-muted">
              Dashboard
            </span>
          )}
        </div>
      )}
    </div>
  );
}
