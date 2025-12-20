import React from 'react';
import { User } from 'firebase/auth';
import { Crown, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfileProps {
  user: User | null;
  userProfile: { plan?: string; role?: string } | null;
  isCollapsed: boolean;
}

export default function UserProfile({ user, userProfile, isCollapsed }: UserProfileProps) {
  const { logout } = useAuth();
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
    <div className={`relative ${isCollapsed ? 'p-2' : 'p-4'} dark:border-t dark:border-slate-700/60 light:border-t light:border-gray-300/40 transition-colors duration-300`}>
      {/* Background gradient - Theme responsive */}
      <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-slate-800/50 dark:to-transparent light:bg-gradient-to-t light:from-gray-100/30 light:to-transparent rounded-t-xl transition-colors duration-300"></div>

      <div className={`relative flex ${isCollapsed ? 'justify-center' : 'items-center space-x-4'}`}>
        {/* Enhanced Avatar */}
        <div className="relative group">
          <div className={`dark:bg-gradient-to-br light:bg-gradient-to-br dark:from-blue-500 light:from-blue-400 dark:to-purple-600 light:to-purple-500 rounded-xl flex items-center justify-center dark:text-white light:text-white font-bold dark:border-2 light:border-2 dark:border-white/20 light:border-white/40 dark:group-hover:border-white/40 light:group-hover:border-white/60 transition-colors duration-300 ${
            isCollapsed ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-sm'
          }`}>
            {getInitials(user)}
          </div>
          {/* Avatar glow */}
          <div className="absolute -inset-1 dark:bg-gradient-to-r light:bg-gradient-to-r dark:from-blue-500 light:from-blue-400 dark:to-purple-600 light:to-purple-500 rounded-xl blur dark:opacity-0 light:opacity-0 dark:group-hover:opacity-40 light:group-hover:opacity-25 transition-opacity duration-300"></div>

          {/* Online indicator */}
          <div className={`absolute dark:bg-green-500 light:bg-green-500 dark:border-2 light:border-2 dark:border-slate-900 light:border-white rounded-full ${
            isCollapsed ? '-bottom-0.5 -right-0.5 w-3 h-3' : '-bottom-0.5 -right-0.5 w-4 h-4'
          }`}>
            <div className="w-full h-full dark:bg-green-400 light:bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold dark:text-white light:text-gray-900 text-sm truncate transition-colors duration-300">{getDisplayName(user)}</span>
              <Crown className="w-4 h-4 dark:text-yellow-400 light:text-yellow-500 transition-colors duration-300" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="dark:text-slate-400 light:text-gray-500 text-xs transition-colors duration-300">{userProfile?.plan || 'Professional Plan'}</span>
              <div className="flex items-center space-x-1 px-2 py-0.5 dark:bg-green-500/10 light:bg-green-100/50 dark:border dark:border-green-500/20 light:border light:border-green-300/40 rounded-full transition-colors duration-300">
                <Zap className="w-3 h-3 dark:text-green-400 light:text-green-600 transition-colors duration-300" />
                <span className="dark:text-green-300 light:text-green-700 text-xs font-medium transition-colors duration-300">Active</span>
              </div>
            </div>
            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 mt-3 px-3 py-1.5 dark:bg-red-500/10 light:bg-red-100/40 dark:hover:bg-red-500/20 light:hover:bg-red-100/60 dark:border dark:border-red-500/20 light:border light:border-red-300/40 dark:hover:border-red-500/30 light:hover:border-red-300/60 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 dark:text-red-400 light:text-red-600 dark:group-hover:text-red-300 light:group-hover:text-red-700 transition-colors duration-200" />
              <span className="dark:text-red-400 light:text-red-600 dark:group-hover:text-red-300 light:group-hover:text-red-700 text-xs font-medium transition-colors duration-200">Logout</span>
            </button>
          </div>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-4 py-3 dark:bg-slate-800/95 light:bg-white/95 backdrop-blur-md dark:text-white light:text-gray-900 rounded-lg dark:border dark:border-slate-600/50 light:border light:border-gray-300/50 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 shadow-xl">
            <div className="font-semibold text-sm mb-1 dark:text-white light:text-gray-900">{getDisplayName(user)}</div>
            <div className="dark:text-slate-400 light:text-gray-500 text-xs mb-2">{userProfile?.plan || 'Professional Plan'}</div>
            <div className="flex items-center space-x-1 mb-3">
              <div className="w-2 h-2 dark:bg-green-400 light:bg-green-500 rounded-full"></div>
              <span className="dark:text-green-300 light:text-green-700 text-xs">Active</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="flex items-center space-x-2 w-full px-3 py-1.5 dark:bg-red-500/10 light:bg-red-100/40 dark:hover:bg-red-500/20 light:hover:bg-red-100/60 dark:border dark:border-red-500/20 light:border light:border-red-300/40 dark:hover:border-red-500/30 light:hover:border-red-300/60 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-3 h-3 dark:text-red-400 light:text-red-600" />
              <span className="dark:text-red-400 light:text-red-600 text-xs font-medium">Logout</span>
            </button>
            {/* Tooltip arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent dark:border-r-slate-800/95 light:border-r-white/95"></div>
          </div>
        )}
      </div>

      {/* Decorative bottom border - hide when collapsed */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-6 right-6 h-px dark:bg-gradient-to-r light:bg-gradient-to-r dark:from-transparent light:from-transparent dark:via-blue-400/30 light:via-purple-300/20 dark:to-transparent light:to-transparent transition-colors duration-300"></div>
      )}
    </div>
  );
}