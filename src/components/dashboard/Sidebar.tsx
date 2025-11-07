"use client";
import { ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
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
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/98 via-purple-900/95 to-slate-900/98 backdrop-blur-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5"></div>

      {/* Animated Border */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col overflow-hidden">
        {/* Enhanced Logo Section */}
        <div className={`flex flex-col items-center ${isSidebarOpen ? 'h-20 px-6 py-3' : 'h-20 px-2 py-3'} border-b border-slate-700/60 relative`}>
          {/* Logo and title row */}
          <div className={`flex ${isSidebarOpen ? 'items-center space-x-4 w-full justify-between' : 'justify-center'}`}>
            <div className="relative group">
              <div className={`bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors ${
                isSidebarOpen ? 'w-12 h-12' : 'w-12 h-12'
              }`}>
                <TrendingUp className={`text-blue-300 ${isSidebarOpen ? 'w-6 h-6' : 'w-6 h-6'}`} />
              </div>
              {/* Logo glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </div>
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  StreakedIn
                </span>
                <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
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

        {/* Sidebar Toggle Button */}
        <div className={`flex ${isSidebarOpen ? 'justify-end px-6 py-4' : 'justify-center px-2 py-3'}`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="group p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <ChevronRight className={`w-5 h-5 text-slate-400 group-hover:text-white transition-all duration-300 ${
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