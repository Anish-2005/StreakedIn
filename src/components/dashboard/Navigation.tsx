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
    <nav className={`flex-1 ${isCollapsed ? 'px-2 py-6' : 'px-6 py-8'}`}>
      <div className={`space-y-${isCollapsed ? '2' : '3'}`}>
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group relative w-full flex items-center justify-center ${
                isCollapsed ? 'px-2 py-3' : 'space-x-4 px-4 py-3.5'
              } rounded-xl transition-all duration-300 hover:scale-110 ${
                isActive
                  ? 'dark:bg-gradient-to-r dark:from-white/15 dark:to-white/5 light:bg-gradient-to-r light:from-purple-100/40 light:to-blue-100/40 dark:border dark:border-white/20 light:border light:border-purple-300/40 dark:shadow-lg dark:shadow-blue-500/20 light:shadow-lg light:shadow-purple-300/20'
                  : 'dark:hover:bg-white/5 light:hover:bg-gray-100/50 dark:border dark:border-transparent light:border light:border-transparent dark:hover:border-white/10 light:hover:border-gray-300/30'
              }`}
            >
              {/* Active indicator - only show when not collapsed */}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full"></div>
              )}

              {/* Active indicator for collapsed state */}
              {isActive && isCollapsed && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30"></div>
              )}

              {/* Icon with enhanced styling */}
              <div className={`relative flex-shrink-0 transition-all duration-300 ${
                isActive
                  ? 'dark:text-white light:text-purple-700 scale-110'
                  : 'dark:text-slate-400 light:text-gray-600 dark:group-hover:text-white light:group-hover:text-purple-600 group-hover:scale-105'
              }`}>
                {item.icon}

                {/* Icon glow effect */}
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg blur opacity-60"></div>
                )}

                {/* Hover glow for non-active items */}
                {!isActive && (
                  <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                )}
              </div>

              {/* Text and badge - only show when not collapsed */}
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className={`font-medium transition-colors ${
                    isActive
                      ? 'dark:text-white light:text-purple-800'
                      : 'dark:text-slate-300 light:text-gray-700 dark:group-hover:text-white light:group-hover:text-purple-700'
                  }`}>
                    {item.name}
                  </span>

                  {/* Active sparkle indicator */}
                  {isActive && (
                    <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                  )}
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 dark:bg-slate-800/95 light:bg-white/95 backdrop-blur-md dark:text-white light:text-gray-900 text-sm rounded-lg dark:border dark:border-slate-600/50 light:border light:border-gray-300/50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {item.name}
                  {/* Tooltip arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent dark:border-r-slate-800/95 light:border-r-white/95"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Decorative elements - hide when collapsed */}
      {!isCollapsed && (
        <div className="mt-8 flex justify-center">
          <div className="w-32 h-px dark:bg-gradient-to-r dark:from-transparent dark:via-slate-600 dark:to-transparent light:bg-gradient-to-r light:from-transparent light:via-gray-300 light:to-transparent"></div>
        </div>
      )}
    </nav>
  );
}

export { navigationItems };
export type { NavigationItem };