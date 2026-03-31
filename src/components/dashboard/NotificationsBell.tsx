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
      className={`group relative p-2.5 hover:bg-app-surface rounded-xl transition-all duration-200 ${className}`}
    >
      <Bell className="w-5 h-5 text-app-text group-hover:text-app-primary transition-colors" />
      {hasUnread && (
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-app-danger rounded-full border border-white/30 shadow-lg animate-pulse"></span>
      )}
      <div className="absolute inset-0 bg-app-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </button>
  );
}
