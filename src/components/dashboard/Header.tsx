"use client";
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
}

interface UserProfile {
  plan?: string;
  role?: string;
}

export default function Header({ activeTab }: HeaderProps) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const userProfileRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userProfileRef, (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserProfile);
      } else {
        setUserProfile({ plan: 'Professional Plan', role: 'User' });
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <header className="backdrop-blur-md dark:bg-slate-900/60 light:bg-white/80 dark:border-b light:border-b dark:border-slate-700/50 light:border-gray-200/60 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold dark:text-white light:text-gray-900 capitalize">
          {activeTab.replace('-', ' ')}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-slate-400 light:text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-80 dark:border light:border dark:border-slate-700/50 light:border-gray-300/50 rounded-lg dark:bg-slate-800/30 light:bg-gray-50/50 dark:text-white light:text-gray-900 dark:placeholder-slate-400 light:placeholder-gray-500 focus:outline-none focus:ring-2 dark:focus:ring-blue-500/60 light:focus:ring-blue-400/50 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 dark:text-slate-300 light:text-gray-600 dark:hover:text-white light:hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="font-semibold dark:text-white light:text-gray-900 text-sm">{user?.displayName || user?.email || 'User'}</div>
            <div className="dark:text-slate-400 light:text-gray-500 text-xs">{userProfile?.plan || 'Professional Plan'}</div>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
             user?.email ? user.email[0].toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}