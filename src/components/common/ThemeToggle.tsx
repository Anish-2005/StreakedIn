"use client";

import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Create smooth fade overlay
    const overlay = document.createElement("div");
    overlay.className = "theme-transition-overlay";
    document.body.appendChild(overlay);

    // Fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    // Switch theme at midpoint
    setTimeout(() => {
      toggleTheme();
    }, 250);

    // Fade out and cleanup
    setTimeout(() => {
      overlay.style.opacity = "0";
    }, 250);

    // Remove overlay after animation
    setTimeout(() => {
      overlay.remove();
    }, 500);
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2.5 rounded-lg transition-all duration-600 ease-in-out bg-app-bg hover:bg-app-bg/80 text-app-text-muted hover:text-app-text border border-app-border/30 overflow-hidden"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
