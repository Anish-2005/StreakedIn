import React from 'react';
import { User } from 'firebase/auth';

interface UserProfileProps {
  user: User | null;
  userProfile: { plan?: string; role?: string } | null;
  isCollapsed: boolean;
}

export default function UserProfile({ user, userProfile, isCollapsed }: UserProfileProps) {
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
    <div className="border-t border-slate-700/50 p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials(user)}
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm">{getDisplayName(user)}</div>
            <div className="text-slate-400 text-xs">{userProfile?.plan || 'Professional Plan'}</div>
          </div>
        )}
      </div>
    </div>
  );
}