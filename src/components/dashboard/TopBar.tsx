import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Menu, Search, Sparkles, Zap } from 'lucide-react';
import SearchBar from './SearchBar';
import NotificationsBell from './NotificationsBell';
import UserMenu from './UserMenu';
import ThemeToggle from '../common/ThemeToggle';

interface TopBarProps {
  activeTab: string;
  user: User | null;
  userProfile: { plan?: string; role?: string } | null;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onMenuClick?: () => void;
  isMobile?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function TopBar({
  activeTab,
  user,
  userProfile,
  onSearch,
  onNotificationsClick,
  onMenuClick,
  isMobile = false,
  searchQuery,
  onClearSearch
}: TopBarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const formatTabName = (tab: string) => {
    return tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      {/* Enhanced TopBar with Glassmorphism */}
      <header className="relative h-20 overflow-hidden header">
        {/* Dark Theme Background */}
        <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-slate-900/95 dark:via-purple-900/90 dark:to-slate-900/95 light:bg-gradient-to-r light:from-white/95 light:via-purple-50/90 light:to-white/95 dark:backdrop-blur-xl light:backdrop-blur-sm dark:border-b dark:border-slate-700/60 light:border-b light:border-gray-200/60"></div>

        {/* Subtle Animated Overlay */}
        <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 light:from-blue-600/5 light:via-purple-600/5 light:to-pink-600/5 animate-pulse-slow"></div>

        {/* Glass Effect Border */}
        <div className="absolute bottom-0 left-0 right-0 h-px dark:bg-gradient-to-r dark:from-transparent dark:via-blue-400/30 dark:to-transparent light:bg-gradient-to-r light:from-transparent light:via-purple-300/20 light:to-transparent"></div>

        {/* Main Content */}
        <div className="relative h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            {/* Mobile Menu Button */}
            {isMobile && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="group p-2.5 dark:hover:bg-white/10 light:hover:bg-gray-900/10 rounded-xl transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                <Menu className="w-5 h-5 dark:text-white light:text-gray-900 dark:group-hover:text-blue-300 light:group-hover:text-blue-600 transition-colors" />
              </button>
            )}

            {/* Tab Title with Enhanced Styling */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-purple-500/20 light:bg-gradient-to-br light:from-blue-400/15 light:to-purple-400/15 rounded-xl flex items-center justify-center dark:border dark:border-white/10 light:border light:border-gray-300/30">
                <Sparkles className="w-5 h-5 dark:text-blue-300 light:text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-purple-200 light:bg-gradient-to-r light:from-gray-900 light:via-blue-700 light:to-purple-700 bg-clip-text text-transparent truncate">
                  {formatTabName(activeTab)}
                </h1>
                <p className="text-xs dark:text-slate-400 light:text-gray-500 hidden sm:block">Professional Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Productivity Indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 dark:bg-green-500/10 light:bg-green-400/10 dark:border dark:border-green-500/20 light:border light:border-green-400/30 rounded-full">
              <Zap className="w-4 h-4 dark:text-green-400 light:text-green-600" />
              <span className="text-sm dark:text-green-300 light:text-green-700 font-medium">Active</span>
            </div>

            {/* Mobile Search Toggle */}
            {isMobile && (
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="group p-2.5 dark:hover:bg-white/10 light:hover:bg-gray-900/10 rounded-xl transition-all duration-300 hover:scale-105 sm:hidden"
              >
                <Search className="w-5 h-5 dark:text-white light:text-gray-900 dark:group-hover:text-blue-300 light:group-hover:text-blue-600 transition-colors" />
              </button>
            )}

            {/* Desktop Search */}
            <div className="hidden sm:block">
              <SearchBar
                onSearch={onSearch}
                className="w-48 md:w-64 lg:w-80"
                externalQuery={searchQuery}
                onClear={onClearSearch}
              />
            </div>

            {/* Enhanced Notification Bell */}
            <div className="relative">
              <NotificationsBell onClick={onNotificationsClick} />
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 dark:bg-blue-500/20 light:bg-blue-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* User Menu */}
            <UserMenu
              user={user}
              userProfile={userProfile}
              className={isMobile ? "hidden sm:flex" : ""}
            />

            {/* Mobile User Avatar */}
            {isMobile && (
              <div className="relative group">
                <div className="w-10 h-10 dark:bg-gradient-to-br dark:from-blue-500 dark:to-purple-600 light:bg-gradient-to-br light:from-blue-400 light:to-purple-500 rounded-xl flex items-center justify-center dark:text-white light:text-white font-semibold text-sm flex-shrink-0 dark:border-2 dark:border-white/20 dark:hover:border-white/40 light:border-2 light:border-white/30 light:hover:border-white/50 transition-colors">
                  {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
                   user?.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                {/* Avatar glow */}
                <div className="absolute -inset-0.5 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-600 light:bg-gradient-to-r light:from-blue-400 light:to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Search Bar */}
      {isMobile && showMobileSearch && (
        <div className="relative px-4 py-4 dark:border-b dark:border-slate-700/60 light:border-b light:border-gray-200/60 dark:bg-gradient-to-r dark:from-slate-900/95 dark:to-slate-800/95 light:bg-gradient-to-r light:from-white/95 light:to-gray-50/95 dark:backdrop-blur-xl light:backdrop-blur-sm">
          <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-600/5 dark:to-purple-600/5 light:from-blue-600/3 light:to-purple-600/3"></div>
          <div className="relative">
            <SearchBar
              onSearch={onSearch}
              className="w-full"
              externalQuery={searchQuery}
              onClear={onClearSearch}
            />
          </div>
        </div>
      )}
    </>
  );
}