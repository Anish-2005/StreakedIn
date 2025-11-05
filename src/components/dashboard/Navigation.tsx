import React from 'react';
import { BarChart3, Target, CheckSquare, Activity, Bell, Brain, Settings, Sparkles } from 'lucide-react';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isCollapsed: boolean;
}

const navigationItems: NavigationItem[] = [
  { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
  { id: 'goals', name: 'Goals & Targets', icon: <Target className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
  { id: 'tasks', name: 'Task Manager', icon: <CheckSquare className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
  { id: 'analytics', name: 'Analytics', icon: <Activity className="w-5 h-5" />, color: 'from-orange-500 to-red-500' },
  { id: 'reminders', name: 'Reminders', icon: <Bell className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
  { id: 'ai-assistant', name: 'AI Assistant', icon: <Brain className="w-5 h-5" />, color: 'from-indigo-500 to-purple-500' },
  { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" />, color: 'from-slate-500 to-gray-500' }
];

export default function Navigation({ activeTab, onTabChange, isCollapsed }: NavigationProps) {
  return (
    <nav className="flex-1 px-6 py-8">
      <div className="space-y-3">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group relative w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 ${
                isActive
                  ? 'bg-gradient-to-r from-white/15 to-white/5 border border-white/20 shadow-lg shadow-blue-500/20'
                  : 'hover:bg-white/5 border border-transparent hover:border-white/10'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full"></div>
              )}

              {/* Icon with enhanced styling */}
              <div className={`relative flex-shrink-0 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 group-hover:text-white transition-colors'
              }`}>
                {item.icon}
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-50"></div>
                )}
              </div>

              {/* Text and badge */}
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className={`font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {item.name}
                  </span>

                  {/* Active sparkle indicator */}
                  {isActive && (
                    <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                  )}
                </div>
              )}

              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
            </button>
          );
        })}
      </div>

      {/* Decorative elements */}
      <div className="mt-8 flex justify-center">
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>
    </nav>
  );
}

export { navigationItems };
export type { NavigationItem };