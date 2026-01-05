"use client";

import React, { createContext, useContext, useEffect, useLayoutEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyThemeClass = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme: Theme = 'dark';

  useLayoutEffect(() => {
    applyThemeClass(theme);
  }, []);

  useEffect(() => {
    applyThemeClass(theme);
  }, []);

  const toggleTheme = () => {
    // Light mode disabled; keep dark
  };

  const setTheme = (newTheme: Theme) => {
    // Light mode disabled; keep dark
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
