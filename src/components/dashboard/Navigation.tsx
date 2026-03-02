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
              className={`group relative w-full flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'px-2 py-3 mb-2 rounded-2xl' : 'space-x-4 px-6 py-4 rounded-[2rem]'
                } ${isActive
                  ? 'clay-pressed scale-95 shadow-lg'
                  : 'clay-button hover:scale-105 active:scale-95'
                }`}
            >
              {/* Icon with enhanced styling */}
              <div className={`relative flex-shrink-0 transition-all duration-300 ${isActive
                  ? 'text-blue-500 scale-100'
                  : 'text-app-text-muted group-hover:text-app-text group-hover:scale-110'
                }`}>
                {item.icon}
              </div>

              {/* Text - only show when not collapsed */}
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className={`font-semibold text-lg transition-colors ${isActive
                      ? 'text-app-text'
                      : 'text-app-text-muted group-hover:text-app-text'
                    }`}>
                    {item.name}
                  </span>

                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                  )}
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 clay-card text-app-text text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {!isCollapsed && (
        <div className="mt-8 flex justify-center">
          <div className="w-32 h-px dark:bg-gradient-to-r light:bg-gradient-to-r dark:from-transparent light:from-transparent dark:via-slate-600 light:via-gray-300 dark:to-transparent light:to-transparent"></div>
        </div>
      )}
    </nav>
  );
}

export { navigationItems };
export type { NavigationItem };