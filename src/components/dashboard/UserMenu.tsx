import React from 'react';
import { User } from 'firebase/auth';
import { ChevronDown } from 'lucide-react';

interface UserMenuProps {
  user: User | null;
  userProfile: { plan?: string; role?: string } | null;
  className?: string;
}

export default function UserMenu({ user, userProfile, className = "" }: UserMenuProps) {
  const getInitials = (user: User | null) => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = (user: User | null) => {
    return user?.displayName || user?.email || 'User';
  };

  return (
    <button className={`group flex items-center space-x-3 hover:bg-app-surface/20 rounded-xl p-2 transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="text-right">
        <div className="font-semibold text-app-text text-sm transition-colors">{getDisplayName(user)}</div>
        <div className="text-app-text-muted text-xs transition-colors">{userProfile?.plan || 'Professional Plan'}</div>
      </div>
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm border-2 border-white/20 transition-colors">
          {getInitials(user)}
        </div>
        {/* Avatar glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
      </div>
      <ChevronDown className="w-4 h-4 text-app-text-muted group-hover:text-app-text transition-colors" />
    </button>
  );
}