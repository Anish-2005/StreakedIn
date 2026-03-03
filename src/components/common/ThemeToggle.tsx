"use client";

import React, { useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    // Get button position relative to viewport
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate distance to cover the entire screen from button position
    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y)
    ) + 100; // Add buffer to ensure full coverage

    // Create ripple element
    const ripple = document.createElement("div");
    ripple.className = "theme-ripple";
    ripple.style.setProperty("--ripple-x", `${x}px`);
    ripple.style.setProperty("--ripple-y", `${y}px`);
    ripple.style.setProperty("--max-distance", `${maxDistance}px`);
    document.body.appendChild(ripple);

    // Trigger theme change
    toggleTheme();

    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 900);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="relative p-2.5 rounded-lg transition-all duration-600 ease-in-out bg-app-bg hover:bg-app-bg/80 text-app-text-muted hover:text-app-text border border-app-border/30 overflow-hidden"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
