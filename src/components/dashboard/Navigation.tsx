import React from 'react';
import { BarChart3, Target, CheckSquare, Activity, Bell, Brain, Settings } from 'lucide-react';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isCollapsed: boolean;
}

const navigationItems: NavigationItem[] = [
  { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'goals', name: 'Goals & Targets', icon: <Target className="w-5 h-5" /> },
  { id: 'tasks', name: 'Task Manager', icon: <CheckSquare className="w-5 h-5" /> },
  { id: 'analytics', name: 'Analytics', icon: <Activity className="w-5 h-5" /> },
  { id: 'reminders', name: 'Reminders', icon: <Bell className="w-5 h-5" /> },
  { id: 'ai-assistant', name: 'AI Assistant', icon: <Brain className="w-5 h-5" /> },
  { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> }
];

export default function Navigation({ activeTab, onTabChange, isCollapsed }: NavigationProps) {
  return (
    <nav className="flex-1 px-4 py-6 space-y-2">
      {navigationItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
            activeTab === item.id
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'text-slate-300 hover:bg-slate-700/40'
          }`}
        >
          {item.icon}
          {!isCollapsed && <span className="font-medium">{item.name}</span>}
        </button>
      ))}
    </nav>
  );
}

export { navigationItems };
export type { NavigationItem };