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
    <div className={`relative ${isCollapsed ? 'px-2 py-1.5' : 'px-2 py-2'}`}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="relative">
          <div
            className={`rounded-full flex items-center justify-center bg-app-surface text-app-text font-medium border border-app-border ${
              isCollapsed ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-xs'
            }`}
          >
            {getInitials(user)}
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-xs font-medium text-app-text truncate">
                {getDisplayName(user)}
              </span>
              <span className="block text-[11px] text-app-text-muted truncate">
                {userProfile?.plan || 'Professional Plan'}
              </span>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-full p-1.5 text-app-text-muted hover:text-app-text hover:bg-app-bg/60 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}