import React from 'react';
import { User } from 'firebase/auth';
import { Crown, Zap } from 'lucide-react';

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
    <div className="relative p-6 border-t border-slate-700/60">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-800/50 to-transparent rounded-t-xl"></div>

      <div className="relative flex items-center space-x-4">
        {/* Enhanced Avatar */}
        <div className="relative group">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 group-hover:border-white/40 transition-colors">
            {getInitials(user)}
          </div>
          {/* Avatar glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity"></div>

          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full">
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-white text-sm truncate">{getDisplayName(user)}</span>
              <Crown className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-xs">{userProfile?.plan || 'Professional Plan'}</span>
              <div className="flex items-center space-x-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <Zap className="w-3 h-3 text-green-400" />
                <span className="text-green-300 text-xs font-medium">Active</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
    </div>
  );
}