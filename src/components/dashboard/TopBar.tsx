import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Menu, Search, Sparkles, Zap } from 'lucide-react';
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
      <header className="relative h-20 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/60"></div>

        {/* Subtle Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse-slow"></div>

        {/* Glass Effect Border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>

        {/* Main Content */}
        <div className="relative h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            {/* Mobile Menu Button */}
            {isMobile && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="group p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
              </button>
            )}

            {/* Tab Title with Enhanced Styling */}
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-blue-300" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent truncate">
                  {formatTabName(activeTab)}
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">Professional Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
            {/* Productivity Indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300 font-medium">Active</span>
            </div>

            {/* Mobile Search Toggle */}
            {isMobile && (
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="group p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105 sm:hidden"
              >
                <Search className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
              </button>
            )}

            {/* Desktop Search */}
            <div className="hidden sm:block">
              <SearchBar
                onSearch={onSearch}
                className="w-48 md:w-64 lg:w-80"
              />
            </div>

            {/* Enhanced Notification Bell */}
            <div className="relative">
              <NotificationsBell onClick={onNotificationsClick} />
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 border-2 border-white/20 hover:border-white/40 transition-colors">
                  {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
                   user?.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                {/* Avatar glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Search Bar */}
      {isMobile && showMobileSearch && (
        <div className="relative px-4 py-4 border-b border-slate-700/60 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <div className="relative">
            <SearchBar
              onSearch={onSearch}
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}