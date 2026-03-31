"use client";

import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    // Create smooth fade overlay
    const overlay = document.createElement("div");
    overlay.className = "theme-transition-overlay";
    document.body.appendChild(overlay);

    // Fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      overlay.style.backdropFilter = "blur(6px)";
    });

    setTimeout(() => {
      toggleTheme();
    }, 110);

    setTimeout(() => {
      overlay.style.opacity = "0";
      overlay.style.backdropFilter = "blur(0px)";
    }, 130);

    setTimeout(() => {
      overlay.remove();
    }, 280);
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2.5 rounded-xl transition-all duration-200 ease-in-out bg-app-surface hover:bg-app-surface-strong text-app-text-muted hover:text-app-text border border-app-border overflow-hidden"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
