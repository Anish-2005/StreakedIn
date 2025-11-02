// pages/dashboard.js
"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/TopBar';
import TabContainer from '../../components/dashboard/TabContainer';
import LoadingSpinner from '../../components/dashboard/LoadingSpinner';

interface UserProfile {
  plan?: string;
  role?: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // User profile state
  const [userProfile, setUserProfile] = useState<{ plan?: string; role?: string } | null>(null);

  // Fetch user profile
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const userProfileRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userProfileRef, (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as { plan?: string; role?: string });
      } else {
        // Create default profile
        setUserProfile({ plan: 'Professional Plan', role: 'User' });
      }
    });

    return () => unsubscribeProfile();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

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
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Head>
        <title>Dashboard - StreakedIn</title>
        <meta name="description" content="Professional productivity dashboard" />
      </Head>

      {/* Sidebar */}
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

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        {/* Top Bar */}
        <header className="backdrop-blur-md bg-slate-900/60 border-b border-slate-700/50 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-80 border border-slate-700/50 rounded-lg bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white text-sm">{user?.displayName || user?.email || 'User'}</div>
                <div className="text-slate-400 text-xs">{userProfile?.plan || 'Professional Plan'}</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 
                 user?.email ? user.email[0].toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <OverviewTab setActiveTab={setActiveTab} />
            )}
            {activeTab === 'tasks' && (
              <TasksTab />
            )}
            {activeTab === 'settings' && (
              <SettingsTab />
            )}
            {activeTab === 'ai-assistant' && (
              <AIAssistantTab />
            )}
            {activeTab === 'reminders' && (
              <RemindersTab />
            )}
            {activeTab === 'goals' && (
              <GoalsTab />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsTab />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}