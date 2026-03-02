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
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-in-out ${isMobile
      ? `w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
      : `${isSidebarOpen ? 'w-72' : 'w-20'}`
      }`}>
      {/* Bold Clay Container */}
      <div
        className="absolute inset-0 bg-app-surface clay-card rounded-r-[4rem] border-r-4 border-app-border/20 z-0"
        style={{ borderRadius: '0 4rem 4rem 0' }}
      ></div>

      {/* Dynamic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-30 rounded-r-[4rem] z-0"></div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col overflow-hidden z-20">
        {/* Branding Area */}
        <div className={`flex items-center ${isSidebarOpen ? 'px-8 py-10' : 'justify-center py-10'}`}>
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 clay-button rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/20">
              <Image
                src="/streakedin.png"
                alt="Logo"
                width={32}
                height={32}
                className="brightness-0 invert p-1"
              />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-app-text leading-tight">
                  Streaked<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">In</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-text-muted">Professional</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isCollapsed={!isSidebarOpen}
          />
        </div>

        {/* Action area */}
        <div className={`flex flex-col gap-4 ${isSidebarOpen ? 'px-6 py-8' : 'items-center py-8'}`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 clay-button rounded-xl flex items-center justify-center text-app-text-muted hover:text-app-text"
            title={isSidebarOpen ? "Collapse" : "Expand"}
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-500 ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>

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