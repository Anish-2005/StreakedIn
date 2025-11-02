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
      className={`relative p-2 text-slate-300 hover:text-white transition-colors ${className}`}
    >
      <Bell className="w-5 h-5" />
      {hasUnread && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}