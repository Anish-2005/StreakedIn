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
    <div
      className={`fixed inset-y-0 left-0 z-40 transition-all duration-400 ease-in-out ${
        isMobile
          ? `w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          : `${isSidebarOpen ? 'w-64' : 'w-20'}`
      }`}
    >
      <div
        className="absolute inset-0 bg-app-surface/95 border-r border-app-border/40 rounded-r-3xl backdrop-blur-xl"
        style={{ borderRadius: '0 1.75rem 1.75rem 0' }}
      />

      <div className="relative h-full flex flex-col overflow-hidden z-20">
        <div className={`flex items-center ${isSidebarOpen ? 'px-5 pt-6 pb-4' : 'justify-center pt-6 pb-4'}`}>
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-app-bg border border-app-border/60">
              <Image
                src="/streakedin.png"
                alt="Logo"
                width={24}
                height={24}
                className="brightness-0 invert p-1.5"
              />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight text-app-text leading-tight">
                  Streaked<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">In</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-app-text-muted">
                  Dashboard
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2">
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isCollapsed={!isSidebarOpen}
          />
        </div>

        <div className={`flex flex-col gap-4 border-t border-app-border/30 ${isSidebarOpen ? 'px-4 py-4' : 'items-center py-4'}`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-app-text-muted hover:text-app-text hover:bg-app-bg/60 transition-colors"
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