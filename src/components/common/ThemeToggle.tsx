"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={`
        relative p-2.5 rounded-xl transition-all duration-300
        backdrop-blur-md border
        bg-white/70 hover:bg-white/90
        border-gray-300/40
        shadow-sm
        dark:bg-slate-800/70 dark:hover:bg-slate-800/90
        dark:border-white/10
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-purple-500/60
        active:scale-95
      `}
    >
      {/* Icon wrapper for smooth swap */}
      <span className="relative flex items-center justify-center">
        {isDark ? (
          <Sun
            className="
              w-5 h-5
              text-yellow-400
              transition-transform duration-300
              rotate-0 scale-100
            "
          />
        ) : (
          <Moon
            className="
              w-5 h-5
              text-purple-600
              transition-transform duration-300
              rotate-0 scale-100
            "
          />
        )}
      </span>
    </button>
  );
}
