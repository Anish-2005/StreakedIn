import React from 'react';
import { User } from 'firebase/auth';
import SearchBar from './SearchBar';
import NotificationsBell from './NotificationsBell';
import UserMenu from './UserMenu';

interface TopBarProps {
  activeTab: string;
  user: User | null;
  userProfile: { plan?: string; role?: string } | null;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
}

export default function TopBar({
  activeTab,
  user,
  userProfile,
  onSearch,
  onNotificationsClick
}: TopBarProps) {
  const formatTabName = (tab: string) => {
    return tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="backdrop-blur-md bg-slate-900/60 border-b border-slate-700/50 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-white capitalize">
          {formatTabName(activeTab)}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <SearchBar
          onSearch={onSearch}
          className="w-80"
        />
        <NotificationsBell onClick={onNotificationsClick} />
        <UserMenu user={user} userProfile={userProfile} />
      </div>
    </header>
  );
}