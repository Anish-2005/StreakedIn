// pages/dashboard.js
"use client";
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { GoalsService, TasksService } from '../../lib/services';
import { db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/TopBar';
import TabContainer from '../../components/dashboard/TabContainer';
import LoadingSpinner from '../../components/dashboard/LoadingSpinner';
import { Breadcrumb } from '../../components/common';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
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
        <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: tabNames[activeTab] || activeTab }
            ]}
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50 bg-slate-800/20">
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Search Results for "{searchQuery}"
                </h2>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults({ goals: [], tasks: [] });
                  }}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  Clear
                </button>
              </div>

              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-slate-400 mt-2">Searching...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Goals Results */}
                  {searchResults.goals.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-blue-300 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Goals ({searchResults.goals.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.goals.slice(0, 5).map((goal) => (
                          <div
                            key={goal.id}
                            className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/40 hover:border-slate-600/60 transition-colors cursor-pointer"
                            onClick={() => setActiveTab('goals')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white truncate">{goal.title}</h4>
                                <p className="text-sm text-slate-400 truncate">{goal.description || 'No description'}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                  {goal.category}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {goal.progress}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks Results */}
                  {searchResults.tasks.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-green-300 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Tasks ({searchResults.tasks.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.tasks.slice(0, 5).map((task) => (
                          <div
                            key={task.id}
                            className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/40 hover:border-slate-600/60 transition-colors cursor-pointer"
                            onClick={() => setActiveTab('tasks')}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white truncate">{task.title}</h4>
                                <p className="text-sm text-slate-400 truncate">{task.description || 'No description'}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-green-500/20 text-green-300'
                                }`}>
                                  {task.priority}
                                </span>
                                <span className={`text-xs ${task.completed ? 'text-green-400' : 'text-slate-500'}`}>
                                  {task.completed ? '✓' : '○'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchResults.goals.length === 0 && searchResults.tasks.length === 0 && !isSearching && (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No results found for "{searchQuery}"</p>
                      <p className="text-slate-500 text-sm mt-1">Try searching for goals, tasks, or categories</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <TabContainer
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isMobile={isMobile}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}