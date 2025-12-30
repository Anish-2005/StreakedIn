"use client";
import { ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import UserProfile from './UserProfile';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobile?: boolean;
}

interface UserProfileData {
  plan?: string;
  role?: string;
}

export default function Sidebar({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, isMobile = false }: SidebarProps) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const userProfileRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userProfileRef, (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserProfileData);
      } else {
        setUserProfile({ plan: 'Professional Plan', role: 'User' });
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-in-out ${
      isMobile
        ? `w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
        : `${isSidebarOpen ? 'w-72' : 'w-20'}`
    }`}>
      {/* Enhanced Background with Multiple Layers - Dark Mode */}
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-slate-900/98 dark:via-purple-900/95 dark:to-slate-900/98 light:bg-gradient-to-b light:from-white light:via-gray-50/98 light:to-white backdrop-blur-2xl"></div>
      
      {/* Gradient overlays - Dark mode */}
      <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-600/10 dark:via-transparent dark:to-purple-600/10 light:bg-gradient-to-r light:from-blue-400/5 light:via-transparent light:to-purple-400/5"></div>
      
      {/* Bottom gradient - Dark mode */}
      <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-black/20 dark:via-transparent dark:to-white/5 light:bg-gradient-to-t light:from-black/3 light:via-transparent light:to-white/10"></div>

      {/* Animated Border - Responsive to theme */}
      <div className="absolute right-0 top-0 bottom-0 w-px dark:bg-gradient-to-b dark:from-transparent dark:via-blue-400/30 dark:to-transparent light:bg-gradient-to-b light:from-transparent light:via-purple-300/20 light:to-transparent"></div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col overflow-hidden">
        {/* Enhanced Logo Section - Theme responsive */}
        <div className={`flex flex-col items-center ${isSidebarOpen ? 'h-20 px-6 py-3' : 'h-20 px-2 py-3'} dark:border-b dark:border-slate-700/60 light:border-b light:border-gray-300/40 relative transition-colors duration-300`}>
          {/* Logo and title row */}
          <div className={`flex ${isSidebarOpen ? 'items-center space-x-4 w-full justify-between' : 'justify-center'}`}>
            <div className="relative group">
              <div className={`flex items-center justify-center transition-colors duration-300 ${
                isSidebarOpen ? 'w-12 h-12' : 'w-12 h-12'
              }`}>
                <Image
                  src="/streakedin.png"
                  alt="StreakedIn Logo"
                  width={isSidebarOpen ? 32 : 32}
                  height={isSidebarOpen ? 32 : 32}
                  className="w-full h-full object-contain dark:brightness-110 light:brightness-90 transition-all duration-300"
                />
              </div>
              {/* Logo glow */}
              <div className="absolute -inset-1 bg-gradient-to-r dark:from-blue-500 light:from-blue-400 dark:to-purple-600 light:to-purple-500 rounded-xl blur dark:opacity-0 light:opacity-0 dark:group-hover:opacity-30 light:group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-purple-200 light:bg-gradient-to-r light:from-gray-900 light:via-blue-700 light:to-purple-700 bg-clip-text text-transparent transition-colors duration-300">
                  StreakedIn
                </span>
                <Sparkles className="dark:text-purple-300 light:text-purple-500 w-5 h-5 animate-pulse transition-colors duration-300" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        {isSidebarOpen ? (
          <div className="flex-1 overflow-y-auto">
            <Navigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isCollapsed={!isSidebarOpen}
            />
          </div>
        ) : (
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isCollapsed={!isSidebarOpen}
          />
        )}

        {/* Sidebar Toggle Button - Theme responsive */}
        <div className={`flex ${isSidebarOpen ? 'justify-end px-6 py-4' : 'justify-center px-2 py-3'}`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="group p-2 dark:hover:bg-white/10 light:hover:bg-gray-900/10 rounded-xl transition-all duration-300 dark:hover:scale-110 light:hover:scale-110"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <ChevronRight className={`w-5 h-5 dark:text-slate-400 light:text-gray-600 dark:group-hover:text-white light:group-hover:text-gray-900 transition-all duration-300 ${
              isSidebarOpen ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {/* User Profile - Fixed at bottom */}
        <div className="flex-shrink-0">
          <UserProfile
            user={user}
            userProfile={userProfile}
            isCollapsed={!isSidebarOpen}
          />
        </div>
      </div>
    </div>
  );
}