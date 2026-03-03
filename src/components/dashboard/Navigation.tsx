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
    <nav className={`flex-1 ${isCollapsed ? 'px-2 py-4' : 'px-4 py-6'}`}>
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group relative w-full flex items-center justify-center transition-colors duration-200 ${
                isCollapsed ? 'px-2 py-2.5 rounded-2xl' : 'space-x-3 px-4 py-3 rounded-2xl'
              } ${
                isActive
                  ? 'bg-app-surface/90 border border-app-border text-app-text shadow-sm'
                  : 'bg-transparent border border-transparent text-app-text-muted hover:bg-app-surface/60 hover:text-app-text'
              }`}
            >
              <div className={`relative flex-shrink-0 transition-all duration-300 ${isActive
                  ? 'text-blue-400'
                  : 'text-app-text-muted group-hover:text-app-text'
                }`}>
                {item.icon}
              </div>

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className={`font-medium text-sm transition-colors ${isActive
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

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-app-surface/95 border border-app-border text-app-text text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {!isCollapsed && (
        <div className="mt-8 flex justify-center">
          <div className="w-24 h-px bg-app-border/60" />
        </div>
      )}
    </nav>
  );
}

export { navigationItems };
export type { NavigationItem };