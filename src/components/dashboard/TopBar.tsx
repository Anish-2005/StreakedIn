"use client";

import React, { useState } from "react";
import { User } from "firebase/auth";
import Image from "next/image";
import { Menu, Search, Zap } from "lucide-react";
import SearchBar from "./SearchBar";
import NotificationsBell from "./NotificationsBell";
import UserMenu from "./UserMenu";

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
  onClearSearch,
}: TopBarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const formatTabName = (tab: string) =>
    tab.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <>
      <header className="relative h-20 overflow-hidden">
        {/* Background */}
        <div
          className={`
            absolute inset-0 backdrop-blur-xl border-b
            bg-gradient-to-r from-gray-50/95 via-blue-50/90 to-gray-50/95
            border-gray-300/40
            dark:from-slate-900/95 dark:via-purple-900/90 dark:to-slate-900/95
            dark:border-slate-700/60
          `}
        />

        {/* Glow overlay */}
        <div
          className={`
            absolute inset-0 animate-pulse-slow
            bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5
            dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10
          `}
        />

        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {isMobile && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2.5 rounded-xl transition hover:scale-105
                           hover:bg-gray-900/10 dark:hover:bg-white/10"
              >
                <Menu className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            )}

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 relative">
                <Image
                  src="/streakedin.png"
                  alt="StreakedIn Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <h1
                  className={`
                    text-xl sm:text-2xl font-bold truncate
                    bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700
                    dark:from-white dark:via-blue-100 dark:to-purple-200
                    bg-clip-text text-transparent
                  `}
                >
                  {formatTabName(activeTab)}
                </h1>
                <p className="text-xs text-gray-600 dark:text-slate-400 hidden sm:block">
                  Professional Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className={`
                hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border
                bg-green-100/60 border-green-400/30
                dark:bg-green-500/10 dark:border-green-500/20
              `}
            >
              <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Active
              </span>
            </div>

            {isMobile && (
              <button
                onClick={() => setShowMobileSearch((v) => !v)}
                className="p-2.5 rounded-xl transition hover:scale-105
                           hover:bg-gray-900/10 dark:hover:bg-white/10 sm:hidden"
              >
                <Search className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            )}

            <div className="hidden sm:block">
              <SearchBar
                onSearch={onSearch}
                className="w-48 md:w-64 lg:w-80"
                externalQuery={searchQuery}
                onClear={onClearSearch}
              />
            </div>

            <NotificationsBell onClick={onNotificationsClick} />

            <UserMenu
              user={user}
              userProfile={userProfile}
              className={isMobile ? "hidden sm:flex" : ""}
            />
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH */}
      {isMobile && showMobileSearch && (
        <div
          className={`
            relative px-4 py-4 border-b backdrop-blur-xl
            bg-gradient-to-r from-gray-50/95 to-white/95
            border-gray-300/40
            dark:from-slate-900/95 dark:to-slate-800/95
            dark:border-slate-700/60
          `}
        >
          <SearchBar
            onSearch={onSearch}
            className="w-full"
            externalQuery={searchQuery}
            onClear={onClearSearch}
          />
        </div>
      )}
    </>
  );
}
