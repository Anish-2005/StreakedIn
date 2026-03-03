"use client";

import { useTheme } from '../../contexts/ThemeContext';

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

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${current.container} rounded-2xl flex items-center justify-center transition-colors duration-600 ${
          withGradientBg
            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30'
            : 'bg-transparent'
        }`}
      >
        <svg
          width={current.svg}
          height={current.svg}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Outer circle background */}
          <circle
            cx="32"
            cy="32"
            r="30"
            fill={isDark ? '#382454' : '#f8f5ff'}
            opacity="0.3"
            className="transition-all duration-600"
          />

          {/* Inner circle accent */}
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke={isDark ? '#9370a8' : '#8b6dad'}
            strokeWidth="0.5"
            opacity="0.4"
            className="transition-all duration-600"
          />

          {/* Flame/Streak base - left side */}
          <path
            d="M 20 42 Q 18 32 22 24 Q 24 18 32 16 Q 30 24 28 32 Q 26 38 24 42 Z"
            fill="url(#flameGradient)"
            className="transition-all duration-600"
          />

          {/* Flame/Streak middle - right side */}
          <path
            d="M 32 42 Q 30 34 34 24 Q 36 16 42 12 Q 40 22 38 32 Q 36 38 34 42 Z"
            fill="url(#flameGradient2)"
            opacity="0.85"
            className="transition-all duration-600"
          />

          {/* Upward arrow path for momentum */}
          <path
            d="M 32 16 L 32 38"
            stroke={isDark ? '#9370a8' : '#8b6dad'}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
            className="transition-all duration-600"
          />

          {/* Arrow tip - up */}
          <path
            d="M 32 16 L 28 22 M 32 16 L 36 22"
            stroke={isDark ? '#9370a8' : '#8b6dad'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
            className="transition-all duration-600"
          />

          {/* Central dot */}
          <circle
            cx="32"
            cy="32"
            r="3"
            fill={isDark ? '#9370a8' : '#8b6dad'}
            opacity="0.8"
            className="transition-all duration-600"
          />

          {/* Decorative rings for momentum */}
          <circle
            cx="32"
            cy="42"
            r="8"
            fill="none"
            stroke={isDark ? '#9370a8' : '#8b6dad'}
            strokeWidth="0.75"
            opacity="0.3"
            className="transition-all duration-600"
          />

          <circle
            cx="32"
            cy="42"
            r="12"
            fill="none"
            stroke={isDark ? '#9370a8' : '#8b6dad'}
            strokeWidth="0.5"
            opacity="0.15"
            className="transition-all duration-600"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient
              id="flameGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isDark ? '#a78bfa' : '#c084fc'}
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor={isDark ? '#7c3aed' : '#9333ea'}
                stopOpacity="0.6"
              />
            </linearGradient>

            <linearGradient
              id="flameGradient2"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isDark ? '#60a5fa' : '#93c5fd'}
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor={isDark ? '#3b82f6' : '#60a5fa'}
                stopOpacity="0.6"
              />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight transition-colors duration-600 ${
              size === 'sm'
                ? 'text-sm'
                : size === 'md'
                  ? 'text-base'
                  : 'text-lg'
            }`}
            style={{
              background: isDark ? 'linear-gradient(to right, #c084fc, #60a5fa)' : undefined,
              WebkitBackgroundClip: isDark ? 'text' : undefined,
              WebkitTextFillColor: isDark ? 'transparent' : undefined,
              backgroundClip: isDark ? 'text' : undefined,
              color: !isDark ? '#2d1b4e' : undefined,
            } as React.CSSProperties}
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
