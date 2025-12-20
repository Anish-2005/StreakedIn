// pages/dashboard.js
"use client";
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { GoalsService, TasksService } from '../../lib/services';
import { db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  Sidebar,
  TopBar,
  TabContainer,
  LoadingSpinner,
  SearchResults,
  BreadcrumbSection,
  MobileOverlay
} from '../../components/dashboard';

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface UserProfile {
  plan?: string;
  role?: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Start closed on mobile
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{
    goals: any[];
    tasks: any[];
  }>({ goals: [], tasks: [] });
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Clear search when switching tabs
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    if (searchQuery) {
      setSearchQuery('');
      setSearchResults({ goals: [], tasks: [] });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false); // Close sidebar on mobile by default
      } else {
        setIsSidebarOpen(true); // Open sidebar on desktop by default
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (!query.trim() || !user) {
      setSearchResults({ goals: [], tasks: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      // Search goals
      const allGoals = await new Promise<any[]>((resolve) => {
        const unsubscribe = GoalsService.subscribeToGoals(user.uid, (goals) => {
          unsubscribe();
          resolve(goals);
        });
      });

      // Search tasks
      const allTasks = await new Promise<any[]>((resolve) => {
        const unsubscribe = TasksService.subscribeToTasks(user.uid, (tasks) => {
          unsubscribe();
          resolve(tasks);
        });
      });

      const queryLower = query.toLowerCase();

      // Filter goals
      const matchingGoals = allGoals.filter(goal =>
        goal.title?.toLowerCase().includes(queryLower) ||
        goal.description?.toLowerCase().includes(queryLower) ||
        goal.category?.toLowerCase().includes(queryLower)
      );

      // Filter tasks
      const matchingTasks = allTasks.filter(task =>
        task.title?.toLowerCase().includes(queryLower) ||
        task.description?.toLowerCase().includes(queryLower) ||
        task.priority?.toLowerCase().includes(queryLower)
      );

      setSearchResults({
        goals: matchingGoals,
        tasks: matchingTasks
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ goals: [], tasks: [] });
    } finally {
      setIsSearching(false);
    }
  }, [user]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      handleSearch(query);
    }, 300),
    [handleSearch]
  );

  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults({ goals: [], tasks: [] });
      setIsSearching(false);
    } else {
      debouncedSearch(query);
    }
  };

  const handleNotificationsClick = () => {
    // Implement notifications functionality
    console.log('Notifications clicked');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 text-gray-900 dark:text-white">
      <Head>
        <title>Dashboard - StreakedIn</title>
        <meta name="description" content="Professional productivity dashboard" />
      </Head>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isMobile
          ? 'ml-0'
          : isSidebarOpen
            ? 'ml-72'
            : 'ml-20'
      }`}>
        <TopBar
          activeTab={activeTab}
          user={user}
          userProfile={userProfile}
          onSearch={handleSearchInput}
          onNotificationsClick={handleNotificationsClick}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          isMobile={isMobile}
          searchQuery={searchQuery}
          onClearSearch={() => {
            setSearchQuery('');
            setSearchResults({ goals: [], tasks: [] });
          }}
        />

        {/* Breadcrumb Navigation */}
        <BreadcrumbSection activeTab={activeTab} />

        {/* Search Results */}
        <SearchResults
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          onClearSearch={() => {
            setSearchQuery('');
            setSearchResults({ goals: [], tasks: [] });
          }}
          onTabChange={setActiveTab}
        />

        <TabContainer
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isMobile={isMobile}
        />
      </div>

      {/* Mobile Overlay */}
      <MobileOverlay
        isVisible={isMobile && isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}