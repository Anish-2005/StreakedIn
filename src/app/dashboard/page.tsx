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
import { Breadcrumb } from '../../components/common';

interface UserProfile {
  plan?: string;
  role?: string;
}

const tabNames: Record<string, string> = {
  overview: 'Overview',
  goals: 'Goals & Targets',
  tasks: 'Task Manager',
  analytics: 'Analytics',
  reminders: 'Reminders',
  'ai-assistant': 'AI Assistant',
  settings: 'Settings'
};

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Fetch user profile
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const userProfileRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userProfileRef, (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserProfile);
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

  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log('Search query:', query);
  };

  const handleNotificationsClick = () => {
    // Implement notifications functionality
    console.log('Notifications clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Head>
        <title>Dashboard - StreakedIn</title>
        <meta name="description" content="Professional productivity dashboard" />
      </Head>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        <TopBar
          activeTab={activeTab}
          user={user}
          userProfile={userProfile}
          onSearch={handleSearch}
          onNotificationsClick={handleNotificationsClick}
        />

        {/* Breadcrumb Navigation */}
        <div className="px-6 py-4 border-b border-slate-700/50">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: tabNames[activeTab] || activeTab }
            ]}
          />
        </div>

        <TabContainer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}