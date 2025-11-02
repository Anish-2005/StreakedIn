import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Menu, Search } from 'lucide-react';
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const formatTabName = (tab: string) => {
    return tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <header className="backdrop-blur-md bg-slate-900/60 border-b border-slate-700/50 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          {isMobile && onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors md:hidden flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          )}
          <h1 className="text-lg sm:text-2xl font-bold text-white capitalize truncate">
            {formatTabName(activeTab)}
          </h1>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
          {/* Mobile Search Toggle */}
          {isMobile && (
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors sm:hidden"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Desktop Search */}
          <div className="hidden sm:block">
            <SearchBar
              onSearch={onSearch}
              className="w-48 md:w-64 lg:w-80"
            />
          </div>

          <NotificationsBell onClick={onNotificationsClick} />
          <UserMenu
            user={user}
            userProfile={userProfile}
            className={isMobile ? "hidden sm:flex" : ""}
          />
          {isMobile && (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
               user?.email ? user.email[0].toUpperCase() : 'U'}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isMobile && showMobileSearch && (
        <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-900/60 sm:hidden">
          <SearchBar
            onSearch={onSearch}
            className="w-full"
          />
        </div>
      )}
    </>
  );
}