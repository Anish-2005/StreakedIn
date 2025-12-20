"use client";

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
        theme === 'light'
          ? 'bg-purple-200'
          : 'bg-slate-700'
      }`}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          theme === 'light' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {theme === 'light' ? (
          <svg
            className="h-6 w-6 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-1.414-1.414a1 1 0 10-1.415 1.415l1.414 1.414a1 1 0 101.415-1.415zm2.121-10.607a1 1 0 010 1.414l-1.414 1.414a1 1 0 11-1.415-1.415l1.414-1.414a1 1 0 011.415 0zM17 11a1 1 0 100-2h-2a1 1 0 100 2h2zm-7 4a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-1.414 1.414a1 1 0 00-1.415 1.415l1.414-1.414zm5.657 9.193l-1.414 1.414a1 1 0 11-1.415-1.415l1.414-1.414a1 1 0 111.415 1.415zM5 17a1 1 0 100-2H3a1 1 0 100 2h2z" />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-slate-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </span>
    </button>
  );
}
