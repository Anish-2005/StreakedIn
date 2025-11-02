"use client";
import { ChevronRight, TrendingUp, BarChart3, Target, CheckSquare, Activity, Bell, Brain, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

interface UserProfile {
  plan?: string;
  role?: string;
}

export default function Sidebar({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
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

  const navigation = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'goals', name: 'Goals & Targets', icon: <Target className="w-5 h-5" /> },
    { id: 'tasks', name: 'Task Manager', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <Activity className="w-5 h-5" /> },
    { id: 'reminders', name: 'Reminders', icon: <Bell className="w-5 h-5" /> },
    { id: 'ai-assistant', name: 'AI Assistant', icon: <Brain className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 bg-slate-800/30 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ${
      isSidebarOpen ? 'w-64' : 'w-20'
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

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-slate-300 hover:bg-slate-700/40'
            }`}
          >
            {item.icon}
            {isSidebarOpen && <span className="font-medium">{item.name}</span>}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-700/50 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
             user?.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">{user?.displayName || user?.email || 'User'}</div>
              <div className="text-slate-400 text-xs">{userProfile?.plan || 'Professional Plan'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}