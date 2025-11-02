import React from 'react';
import { AnimatePresence } from 'framer-motion';
import OverviewTab from './OverviewTab';
import TasksTab from './TasksTab';
import SettingsTab from './SettingsTab';
import AIAssistantTab from './AIAssistantTab';
import RemindersTab from './RemindersTab';
import GoalsTab from './GoalsTab';
import AnalyticsTab from './AnalyticsTab';

interface TabContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
}

export default function TabContainer({ activeTab, setActiveTab, isMobile = false }: TabContainerProps) {
  return (
    <main className={`${isMobile ? 'p-4' : 'p-6'}`}>
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <OverviewTab setActiveTab={setActiveTab} />
        )}
        {activeTab === 'tasks' && (
          <TasksTab />
        )}
        {activeTab === 'settings' && (
          <SettingsTab />
        )}
        {activeTab === 'ai-assistant' && (
          <AIAssistantTab />
        )}
        {activeTab === 'reminders' && (
          <RemindersTab />
        )}
        {activeTab === 'goals' && (
          <GoalsTab />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsTab />
        )}
      </AnimatePresence>
    </main>
  );
}