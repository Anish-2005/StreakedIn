import React from 'react';
import { User } from 'firebase/auth';

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
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="text-right">
        <div className="font-semibold text-white text-sm">{getDisplayName(user)}</div>
        <div className="text-slate-400 text-xs">{userProfile?.plan || 'Professional Plan'}</div>
      </div>
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
        {getInitials(user)}
      </div>
    </div>
  );
}