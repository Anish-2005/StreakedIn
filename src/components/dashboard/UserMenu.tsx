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
    <button className={`group flex items-center space-x-3 dark:hover:bg-white/10 light:hover:bg-gray-900/10 rounded-xl p-2 transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="text-right">
        <div className="font-semibold dark:text-white light:text-gray-900 text-sm dark:group-hover:text-blue-200 light:group-hover:text-blue-600 transition-colors">{getDisplayName(user)}</div>
        <div className="dark:text-slate-400 light:text-gray-600 text-xs dark:group-hover:text-slate-300 light:group-hover:text-gray-700 transition-colors">{userProfile?.plan || 'Professional Plan'}</div>
      </div>
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm dark:border-2 dark:border-white/20 light:border-2 light:border-gray-300/40 dark:group-hover:border-white/40 light:group-hover:border-gray-400/60 transition-colors">
          {getInitials(user)}
        </div>
        {/* Avatar glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
      </div>
      <ChevronDown className="w-4 h-4 dark:text-slate-400 light:text-gray-600 dark:group-hover:text-white light:group-hover:text-gray-900 transition-colors" />
    </button>
  );
}