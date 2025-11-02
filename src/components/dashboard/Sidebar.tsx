"use client";
import { ChevronRight, TrendingUp } from 'lucide-react';
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
    <div className={`fixed inset-y-0 left-0 z-50 bg-slate-800/95 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ${
      isMobile
        ? `w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
        : `${isSidebarOpen ? 'w-64' : 'w-20'}`
    }`}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#0A66C2] rounded-md flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">StreakedIn</span>
          )}
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 hover:bg-slate-700/40 rounded-lg transition-colors"
        >
          <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${
            isSidebarOpen ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={!isSidebarOpen}
      />

      <UserProfile
        user={user}
        userProfile={userProfile}
        isCollapsed={!isSidebarOpen}
      />
    </div>
  );
}