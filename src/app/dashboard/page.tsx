// pages/dashboard.js
"use client";
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Users, 
  Bell,
  MessageCircle,
  Settings,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  Mail,
  Smartphone,
  Zap,
  Brain,
  Edit3,
  Trash2,
  Play,
  Pause,
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
  Download,
  Share2,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Bot,
  Send,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckSquare,
  PieChart,
  LineChart,
  BarChart,
  Activity
} from 'lucide-react';

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
  id: number;
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
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

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

    setTasks([
      {
        id: 1,
        title: 'Complete project proposal',
        completed: true,
        priority: 'high',
        dueDate: '2024-01-20'
      },
      {
        id: 2,
        title: 'Schedule team meeting',
        completed: false,
        priority: 'medium',
        dueDate: '2024-01-22'
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
              JD
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">John Doe</div>
                <div className="text-slate-400 text-xs">Product Manager</div>
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
                <div className="font-semibold text-white text-sm">John Doe</div>
                <div className="text-slate-400 text-xs">Professional Plan</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                JD
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
                    <h1 className="text-2xl font-bold text-gray-900">Reminders & Notifications</h1>
                    <p className="text-gray-600">Configure how and when you receive reminders</p>
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
                      <div key={reminder.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              reminder.type === 'email' ? 'bg-blue-100 text-blue-600' :
                              reminder.type === 'browser' ? 'bg-green-100 text-green-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {reminder.type === 'email' ? <Mail className="w-4 h-4" /> :
                               reminder.type === 'browser' ? <Smartphone className="w-4 h-4" /> :
                               <Bell className="w-4 h-4" />}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                              <p className="text-sm text-gray-500">Next: {reminder.nextTrigger}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked={reminder.enabled} />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
                            </label>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Frequency: {reminder.frequency}</span>
                          <div className="flex space-x-2">
                            <button className="text-[#0A66C2] hover:text-[#004182] transition-colors">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-700 transition-colors">
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
                    <h1 className="text-2xl font-bold text-gray-900">Goals & Targets</h1>
                    <p className="text-gray-600">Set and track your professional development goals</p>
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
                      <div key={goal.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg">{goal.title}</h3>
                              {goal.aiSuggested && (
                                <span className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                  <Sparkles className="w-3 h-3" />
                                  <span>AI Suggested</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit3 className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-semibold text-[#0A66C2]">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-[#0A66C2] h-3 rounded-full transition-all duration-500"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-blue-100 text-[#0A66C2] rounded-lg hover:bg-blue-200 transition-colors">
                              Update Progress
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                              View Details
                            </button>
                          </div>
                          <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
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
                    <h1 className="text-2xl font-bold text-gray-900">Productivity Analytics</h1>
                    <p className="text-gray-600">Detailed insights into your performance and progress</p>
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
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Productivity Trends</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <LineChart className="w-12 h-12 text-gray-300" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Goal Distribution</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <PieChart className="w-12 h-12 text-gray-300" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Weekly Performance</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <BarChart className="w-12 h-12 text-gray-300" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">AI Insights</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-900">Peak Productivity</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Your most productive hours are between 9-11 AM. Schedule important tasks during this time.
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-900">Progress Alert</span>
                        </div>
                        <p className="text-sm text-green-700">
                          You're on track to complete 85% of your monthly goals. Keep up the good work!
                        </p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="font-semibold text-orange-900">Attention Needed</span>
                        </div>
                        <p className="text-sm text-orange-700">
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