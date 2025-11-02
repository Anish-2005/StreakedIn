import React from 'react';
import { User } from 'firebase/auth';
import { Menu } from 'lucide-react';
import SearchBar from './SearchBar';
import NotificationsBell from './NotificationsBell';
import UserMenu from './UserMenu';

interface TopBarProps {
  activeTab: string;
  user: User | null;
  userProfile: { plan?: string; role?: string } | null;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export default function TopBar({
  activeTab,
  user,
  userProfile,
  onSearch,
  onNotificationsClick,
  onMenuClick,
  isMobile = false
}: TopBarProps) {
  const formatTabName = (tab: string) => {
    return tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="backdrop-blur-md bg-slate-900/60 border-b border-slate-700/50 h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center space-x-4">
        {isMobile && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors md:hidden"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        )}
        <h1 className="text-lg sm:text-2xl font-bold text-white capitalize">
          {formatTabName(activeTab)}
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <SearchBar
          onSearch={onSearch}
          className={`${isMobile ? 'w-32 sm:w-48' : 'w-64 lg:w-80'}`}
        />
        <NotificationsBell onClick={onNotificationsClick} />
        <UserMenu user={user} userProfile={userProfile} />
      </div>
    </header>
  );
}