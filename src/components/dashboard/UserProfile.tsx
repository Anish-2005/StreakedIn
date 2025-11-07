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
    <div className={`relative ${isCollapsed ? 'p-2' : 'p-6'} border-t border-slate-700/60`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-800/50 to-transparent rounded-t-xl"></div>

      <div className={`relative flex ${isCollapsed ? 'justify-center' : 'items-center space-x-4'}`}>
        {/* Enhanced Avatar */}
        <div className="relative group">
          <div className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold border-2 border-white/20 group-hover:border-white/40 transition-colors ${
            isCollapsed ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-sm'
          }`}>
            {getInitials(user)}
          </div>
          {/* Avatar glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity"></div>

          {/* Online indicator */}
          <div className={`absolute bg-green-500 border-2 border-slate-900 rounded-full ${
            isCollapsed ? '-bottom-0.5 -right-0.5 w-3 h-3' : '-bottom-0.5 -right-0.5 w-4 h-4'
          }`}>
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

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-4 py-3 bg-slate-800/95 backdrop-blur-md text-white rounded-lg border border-slate-600/50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-xl">
            <div className="font-semibold text-sm mb-1">{getDisplayName(user)}</div>
            <div className="text-slate-400 text-xs">{userProfile?.plan || 'Professional Plan'}</div>
            <div className="flex items-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-300 text-xs">Active</span>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-slate-800/95"></div>
          </div>
        )}
      </div>

      {/* Decorative bottom border - hide when collapsed */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      )}
    </div>
  );
}