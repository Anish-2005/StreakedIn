"use client";

import React, { useState } from "react";
import { User } from "firebase/auth";
import Image from "next/image";
import { Menu, Search, Zap } from "lucide-react";
import SearchBar from "./SearchBar";
import NotificationsBell from "./NotificationsBell";
import UserMenu from "./UserMenu";
import ThemeToggle from "../common/ThemeToggle";

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
      <header className="relative h-16 sm:h-18 mb-4">
        <div className="absolute inset-0 border-b border-app-border/40 bg-app-bg/80 backdrop-blur-xl" />

        <div className="relative h-full flex items-center justify-between px-3 sm:px-4 lg:px-6">
          {/* LEFT */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {isMobile && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2.5 rounded-xl transition hover:bg-app-surface/30"
              >
                <Menu className="w-5 h-5 text-app-text" />
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
                <h1 className="text-base sm:text-lg font-semibold truncate text-app-text">
                  {formatTabName(activeTab)}
                </h1>
                <p className="text-[11px] text-app-text-muted hidden sm:block">
                  Professional Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {isMobile && (
              <button
                onClick={() => setShowMobileSearch((v) => !v)}
                className="p-2.5 rounded-xl transition hover:bg-app-surface/30 sm:hidden"
              >
                <Search className="w-5 h-5 text-app-text" />
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

            <ThemeToggle />

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
            relative px-4 py-3 border-b backdrop-blur-xl
            bg-app-bg/90 border-app-border/40
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
