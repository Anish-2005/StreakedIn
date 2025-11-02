// pages/dashboard.js
"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import OverviewTab from '../../components/dashboard/OverviewTab';
import TasksTab from '../../components/dashboard/TasksTab';
import SettingsTab from '../../components/dashboard/SettingsTab';
import AIAssistantTab from '../../components/dashboard/AIAssistantTab';
import RemindersTab from '../../components/dashboard/RemindersTab';
import GoalsTab from '../../components/dashboard/GoalsTab';
import AnalyticsTab from '../../components/dashboard/AnalyticsTab';

interface NotificationItem {
  id: number;
  message?: string;
  time?: string;
  read?: boolean;
}

interface Goal {
  id: number;
  title: string;
  progress: number;
  deadline: string;
  category?: string;
  aiSuggested?: boolean;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
}

interface Reminder {
  id: number;
  title: string;
  type?: string;
  frequency?: string;
  enabled?: boolean;
  nextTrigger?: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Task manager helpers
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<string>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');

  // Settings state
  const [settingsState, setSettingsState] = useState<Record<string, boolean>>({
    emailNotifications: true,
    pushNotifications: true,
    soundAlerts: false,
    autoGoalSuggestions: true,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Sample data
  useEffect(() => {
    setGoals([
      {
        id: 1,
        title: 'Complete React Certification',
        progress: 75,
        deadline: '2024-02-15',
        category: 'Learning',
        aiSuggested: true
      },
      {
        id: 2,
        title: 'Increase Network by 50+',
        progress: 40,
        deadline: '2024-03-01',
        category: 'Networking',
        aiSuggested: false
      }
    ]);

    setReminders([
      {
        id: 1,
        title: 'Weekly progress review',
        type: 'email',
        frequency: 'weekly',
        enabled: true,
        nextTrigger: '2024-01-22 09:00'
      },
      {
        id: 2,
        title: 'Daily goal check-in',
        type: 'browser',
        frequency: 'daily',
        enabled: true,
        nextTrigger: '2024-01-21 08:00'
      }
    ]);
  }, []);

  // User profile state
  const [userProfile, setUserProfile] = useState<{ plan?: string; role?: string } | null>(null);

  // Firestore tasks integration
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setUserProfile(null);
      return;
    }

    // Fetch user profile
    const userProfileRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userProfileRef, (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as { plan?: string; role?: string });
      } else {
        // Create default profile
        setUserProfile({ plan: 'Professional Plan', role: 'User' });
      }
    });

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeTasks();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleAiPrompt = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsAiLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setAiResponse(`Based on your current goals and progress, I recommend:

1. **Focus on React Certification**: You're 75% complete - schedule 2 hours daily to finish by next week.
2. **Networking Strategy**: Connect with 5 professionals in your field daily to reach your goal.
3. **Skill Development**: Consider adding a backend technology to your learning path for full-stack development.

Would you like me to create specific tasks for these recommendations?`);
      setIsAiLoading(false);
    }, 2000);
  };

  const quickAiPrompts = [
    "Analyze my productivity patterns",
    "Suggest weekly goals",
    "Optimize my schedule",
    "Review progress and suggest improvements"
  ];

  const addTask = async () => {
    if (!newTaskTitle.trim() || !user) return;
    
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTaskTitle.trim(),
        completed: false,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        userId: user.uid,
        createdAt: new Date()
      });
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateDoc(taskRef, {
          completed: !task.completed
        });
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleSetting = (key: string) => {
    setSettingsState(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Productivity Score', value: '87%', change: '+5%', icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-400' },
                    { title: 'Goals Completed', value: '12/20', change: '60%', icon: <Target className="w-6 h-6" />, color: 'text-blue-400' },
                    { title: 'Tasks Due', value: '8', change: '2 overdue', icon: <Clock className="w-6 h-6" />, color: 'text-orange-400' },
                    { title: 'Network Growth', value: '+24', change: 'This week', icon: <Users className="w-6 h-6" />, color: 'text-purple-400' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300 text-sm">{stat.title}</p>
                          <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                          <p className={`text-sm ${stat.color} mt-1`}>{stat.change}</p>
                        </div>
                        <div className={`p-3 rounded-lg bg-slate-900/30 ${stat.color}`}>
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Goals Progress */}
                  <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-white">Goals Progress</h2>
                      <button className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Add Goal</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="border border-slate-700/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-white">{goal.title}</h3>
                              {goal.aiSuggested && (
                                <span className="flex items-center space-x-1 px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                                  <Sparkles className="w-3 h-3" />
                                  <span>AI Suggested</span>
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-slate-400">Due {goal.deadline}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 bg-slate-700/40 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${goal.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-slate-300">{goal.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                      {[
                        { icon: <Plus className="w-5 h-5" />, label: 'Create New Goal', action: () => {} },
                        { icon: <Bell className="w-5 h-5" />, label: 'Set Reminder', action: () => {} },
                        { icon: <Brain className="w-5 h-5" />, label: 'AI Suggestions', action: () => setActiveTab('ai-assistant') },
                        { icon: <Download className="w-5 h-5" />, label: 'Export Report', action: () => {} }
                      ].map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-slate-700/50 hover:border-blue-500/60 hover:bg-slate-700/40 transition-all duration-200"
                        >
                          <div className="text-blue-400">{action.icon}</div>
                          <span className="font-medium text-slate-300">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Task Manager Tab */}
            {activeTab === 'tasks' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Task Manager</h1>
                    <p className="text-slate-300">Create, prioritize and track tasks</p>
                  </div>
                  <div className="text-sm text-slate-300">{tasks.length} tasks</div>
                </div>

                {/* New Task Form */}
                <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Task title..."
                      className="col-span-2 w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
                    />
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={addTask}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Add Task
                    </button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-8 text-center text-slate-400">
                      <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No tasks yet. Create your first task above!</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:border-slate-600/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => toggleTask(task.id)} 
                            className="w-5 h-5 rounded border-slate-600 bg-slate-700/50 text-blue-500 focus:ring-blue-500/60" 
                          />
                          <div>
                            <div className={`font-medium text-lg ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                              {task.title}
                            </div>
                            <div className="text-sm text-slate-400">
                              {task.dueDate ? `Due ${task.dueDate}` : 'No due date'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            task.priority === 'high' 
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                              : task.priority === 'medium' 
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            {task.priority}
                          </div>
                          <button 
                            onClick={() => deleteTask(task.id)} 
                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-white">Settings</h1>
                  <p className="text-slate-300">Manage your account and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Notification Settings */}
                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Email Notifications</h4>
                          <p className="text-slate-400 text-sm">Receive updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settingsState.emailNotifications} 
                            onChange={() => toggleSetting('emailNotifications')} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Push Notifications</h4>
                          <p className="text-slate-400 text-sm">Browser and desktop alerts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settingsState.pushNotifications} 
                            onChange={() => toggleSetting('pushNotifications')} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* AI & Preferences */}
                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">AI & Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Auto Goal Suggestions</h4>
                          <p className="text-slate-400 text-sm">AI-powered goal recommendations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settingsState.autoGoalSuggestions} 
                            onChange={() => toggleSetting('autoGoalSuggestions')} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Sound Alerts</h4>
                          <p className="text-slate-400 text-sm">Audio notifications for reminders</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settingsState.soundAlerts} 
                            onChange={() => toggleSetting('soundAlerts')} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 text-sm mb-2 block">Display Name</label>
                        <input 
                          type="text" 
                          defaultValue={user?.displayName || ''} 
                          className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 text-sm mb-2 block">Email</label>
                        <input 
                          type="email" 
                          defaultValue={user?.email || ''} 
                          className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 text-sm mb-2 block">Timezone</label>
                        <select className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent">
                          <option>UTC-5 (Eastern Time)</option>
                          <option>UTC-8 (Pacific Time)</option>
                          <option>UTC+0 (GMT)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 text-sm mb-2 block">Theme</label>
                        <select className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent">
                          <option>Dark</option>
                          <option>Light</option>
                          <option>System</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-700/50">
                      <button className="px-4 py-2 border border-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700/40 transition-colors">
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white hover:opacity-90 transition-opacity">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai-assistant' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                {/* AI Assistant Header */}
                <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">AI Productivity Assistant</h1>
                      <p className="text-slate-300">Get personalized recommendations and automate your productivity tracking</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* AI Chat */}
                  <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-sm">
                    <div className="p-4 border-b border-slate-700/50">
                      <h3 className="font-semibold text-white">Chat with AI Assistant</h3>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="p-4 h-96 overflow-y-auto space-y-4">
                      {aiResponse ? (
                        <>
                          {/* User Message */}
                          <div className="flex justify-end">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-xs">
                              {aiPrompt}
                            </div>
                          </div>
                          
                          {/* AI Response */}
                          <div className="flex space-x-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-slate-900/20 rounded-2xl rounded-bl-none px-4 py-3 flex-1">
                              <div className="whitespace-pre-line text-slate-300">
                                {aiResponse}
                              </div>
                              <div className="flex space-x-2 mt-3">
                                <button className="text-xs text-[#0A66C2] hover:text-[#004182]">
                                  Create Tasks
                                </button>
                                <button className="text-xs text-[#0A66C2] hover:text-[#004182]">
                                  Set Reminders
                                </button>
                                <button className="text-xs text-[#0A66C2] hover:text-[#004182]">
                                  Analyze Further
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-slate-400 py-12">
                            <Brain className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <p>Ask me anything about your productivity, goals, or schedule!</p>
                          </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-700/50">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Ask for productivity advice, goal suggestions, or schedule optimization..."
                          className="flex-1 border border-slate-700/50 rounded-lg px-4 py-2 bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleAiPrompt()}
                        />
                        <button
                          onClick={handleAiPrompt}
                          disabled={isAiLoading}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                          {isAiLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Prompts */}
                  <div className="space-y-6">
                    {/* Quick AI Prompts */}
                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">Quick Prompts</h3>
                      <div className="space-y-2">
                        {quickAiPrompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setAiPrompt(prompt);
                              handleAiPrompt();
                            }}
                            className="w-full text-left p-3 rounded-lg border border-slate-700/50 hover:border-blue-500/60 hover:bg-slate-700/40 transition-all duration-200 text-sm text-slate-300"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AI Features */}
                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">AI Features</h3>
                      <div className="space-y-3">
                        {[
                          { icon: <Zap className="w-4 h-4" />, label: 'Auto Goal Setting', enabled: true },
                          { icon: <Bell className="w-4 h-4" />, label: 'Smart Reminders', enabled: true },
                          { icon: <TrendingUp className="w-4 h-4" />, label: 'Progress Predictions', enabled: false },
                          { icon: <Calendar className="w-4 h-4" />, label: 'Schedule Optimization', enabled: true }
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-blue-400">{feature.icon}</div>
                              <span className="text-sm text-slate-300">{feature.label}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={feature.enabled} />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reminders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Reminders Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Reminders & Notifications</h1>
                    <p className="text-slate-300">Configure how and when you receive reminders</p>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Reminder</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Reminders List */}
                  <div className="lg:col-span-2 space-y-4">
                    {reminders.map((reminder) => (
                      <div key={reminder.id} className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              reminder.type === 'email' ? 'bg-blue-900/30 text-blue-300' :
                              reminder.type === 'browser' ? 'bg-green-900/30 text-green-300' :
                              'bg-purple-900/30 text-purple-300'
                            }`}>
                              {reminder.type === 'email' ? <Mail className="w-4 h-4" /> :
                               reminder.type === 'browser' ? <Smartphone className="w-4 h-4" /> :
                               <Bell className="w-4 h-4" />}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{reminder.title}</h3>
                              <p className="text-sm text-slate-400">Next: {reminder.nextTrigger}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={reminder.enabled} />
                              <div className="w-11 h-6 bg-slate-700/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                            </label>
                            <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-slate-300" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>Frequency: {reminder.frequency}</span>
                          <div className="flex space-x-2">
                            <button className="text-blue-400 hover:text-blue-300 transition-colors">
                              Edit
                            </button>
                            <button className="text-red-500 hover:text-red-400 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notification Settings */}
                  <div className="space-y-6">
                    {/* Notification Channels */}
                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">Notification Channels</h3>
                      <div className="space-y-4">
                        {[
                          { icon: <Mail className="w-4 h-4" />, label: 'Email Notifications', enabled: true },
                          { icon: <Smartphone className="w-4 h-4" />, label: 'Browser Push', enabled: true },
                          { icon: <Bell className="w-4 h-4" />, label: 'Desktop Alerts', enabled: false },
                          { icon: <MessageCircle className="w-4 h-4" />, label: 'SMS Alerts', enabled: false }
                        ].map((channel, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-600">{channel.icon}</div>
                              <span className="text-sm text-gray-700">{channel.label}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={channel.enabled} />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Reminder Suggestions */}
                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">AI Reminder Suggestions</h3>
                      <div className="space-y-3">
                        {[
                          'Set daily progress check-in',
                          'Weekly goal review reminder',
                          'Monthly productivity analysis',
                          'Networking follow-up reminders'
                        ].map((suggestion, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                            <span className="text-sm text-gray-700">{suggestion}</span>
                            <button className="text-[#0A66C2] hover:text-[#004182] transition-colors text-sm">
                              Enable
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Goals Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Goals & Targets</h1>
                    <p className="text-slate-300">Set and track your professional development goals</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>New Goal</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Goals List */}
                  <div className="lg:col-span-3 space-y-4">
                    {goals.map((goal) => (
                      <div key={goal.id} className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-white text-lg">{goal.title}</h3>
                              {goal.aiSuggested && (
                                <span className="flex items-center space-x-1 px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                                  <Sparkles className="w-3 h-3" />
                                  <span>AI Suggested</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-300">
                              <span className="flex items-center space-x-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Due {goal.deadline}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Target className="w-4 h-4" />
                                <span>{goal.category}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors">
                              <Edit3 className="w-4 h-4 text-slate-300" />
                            </button>
                            <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-slate-300" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-300">Progress</span>
                            <span className="text-sm font-semibold text-white">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-700/40 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-slate-900/30 text-blue-400 rounded-lg hover:opacity-90 transition-colors">
                              Update Progress
                            </button>
                            <button className="px-3 py-1 text-sm bg-slate-900/20 text-slate-300 rounded-lg hover:opacity-90 transition-colors">
                              View Details
                            </button>
                          </div>
                          <button className="flex items-center space-x-1 text-sm text-slate-300 hover:text-white transition-colors">
                            <Brain className="w-4 h-4" />
                            <span>Get AI Tips</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Goal Creation & AI */}
                  <div className="space-y-6">
                    {/* Quick Goal Creation */}
                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">Quick Goal Setup</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Goal title..."
                          className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm bg-slate-900/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
                        />
                        <select className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm bg-slate-900/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent">
                          <option>Select category</option>
                          <option>Career Development</option>
                          <option>Skill Learning</option>
                          <option>Networking</option>
                          <option>Health & Wellness</option>
                        </select>
                        <input
                          type="date"
                          className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
                        />
                        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-2 text-sm hover:opacity-95 transition-colors">
                          Create Goal
                        </button>
                      </div>
                    </div>

                    {/* AI Goal Suggestions */}
                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">AI Goal Suggestions</h3>
                      <div className="space-y-3">
                        {[
                          'Complete advanced React course',
                          'Attend 3 networking events this month',
                          'Publish 2 technical articles',
                          'Learn TypeScript fundamentals'
                        ].map((suggestion, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                            <span className="text-sm text-gray-700 flex-1">{suggestion}</span>
                            <button className="text-[#0A66C2] hover:text-[#004182] transition-colors text-sm">
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-4 flex items-center justify-center space-x-2 py-2 border border-slate-700/50 rounded-lg hover:bg-slate-700/40 transition-colors text-sm text-white">
                        <Brain className="w-4 h-4" />
                        <span>Generate More Suggestions</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Analytics Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Productivity Analytics</h1>
                    <p className="text-slate-300">Detailed insights into your performance and progress</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors">
                      <Brain className="w-4 h-4" />
                      <span>AI Analysis</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Charts */}
                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Productivity Trends</h3>
                    <div className="h-64 bg-slate-900/20 rounded-lg flex items-center justify-center">
                      <LineChart className="w-12 h-12 text-slate-500" />
                    </div>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Goal Distribution</h3>
                    <div className="h-64 bg-slate-900/20 rounded-lg flex items-center justify-center">
                      <PieChart className="w-12 h-12 text-slate-500" />
                    </div>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Weekly Performance</h3>
                    <div className="h-64 bg-slate-900/20 rounded-lg flex items-center justify-center">
                      <BarChart className="w-12 h-12 text-slate-500" />
                    </div>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">AI Insights</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-900/20 rounded-lg border border-slate-700/40">
                        <div className="flex items-center space-x-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold text-white">Peak Productivity</span>
                        </div>
                        <p className="text-sm text-slate-300">
                          Your most productive hours are between 9-11 AM. Schedule important tasks during this time.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-900/20 rounded-lg border border-slate-700/40">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="font-semibold text-white">Progress Alert</span>
                        </div>
                        <p className="text-sm text-slate-300">
                          You're on track to complete 85% of your monthly goals. Keep up the good work!
                        </p>
                      </div>
                      <div className="p-4 bg-slate-900/20 rounded-lg border border-slate-700/40">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                          <span className="font-semibold text-white">Attention Needed</span>
                        </div>
                        <p className="text-sm text-slate-300">
                          Networking goals are lagging behind. Consider scheduling 2-3 connection requests daily.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}