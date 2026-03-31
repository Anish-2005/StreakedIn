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
    <header className="backdrop-blur-md bg-app-glass border-b border-app-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-app-text capitalize">
          {activeTab.replace('-', ' ')}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-app-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-80 border border-app-border rounded-lg bg-app-surface text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-app-primary/35 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-app-text-muted hover:text-app-text transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-app-danger rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="font-semibold text-app-text text-sm">{user?.displayName || user?.email || 'User'}</div>
            <div className="text-app-text-muted text-xs">{userProfile?.plan || 'Professional Plan'}</div>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-app-primary to-cyan-500 rounded-full flex items-center justify-center text-app-text font-semibold text-sm">
            {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
             user?.email ? user.email[0].toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
