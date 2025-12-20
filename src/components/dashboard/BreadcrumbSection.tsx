"use client";

import { Breadcrumb } from '../common';

interface BreadcrumbSectionProps {
  activeTab: string;
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

export default function BreadcrumbSection({ activeTab }: BreadcrumbSectionProps) {
  return (
    <div className="px-4 sm:px-6 py-4 dark:border-b dark:border-slate-700/50 light:border-b light:border-gray-200">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: tabNames[activeTab] || activeTab }
        ]}
      />
    </div>
  );
}