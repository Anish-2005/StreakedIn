import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationsBellProps {
  hasUnread?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function NotificationsBell({
  hasUnread = true,
  onClick,
  className = ""
}: NotificationsBellProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative p-2.5 dark:hover:bg-white/10 light:hover:bg-gray-900/10 rounded-xl transition-all duration-300 hover:scale-105 ${className}`}
    >
      <Bell className="w-5 h-5 dark:text-white light:text-gray-900 dark:group-hover:text-blue-300 light:group-hover:text-blue-600 transition-colors" />
      {hasUnread && (
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full dark:border dark:border-white/20 light:border light:border-gray-200/40 shadow-lg animate-pulse"></span>
      )}
      {/* Subtle glow effect */}
      <div className="absolute inset-0 dark:bg-blue-500/20 light:bg-blue-400/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </button>
  );
}