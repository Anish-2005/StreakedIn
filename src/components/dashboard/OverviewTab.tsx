"use client";
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Users, Plus, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, StatsCard, Badge, ProgressBar, Button } from '../common';

interface Goal {
  id: number;
  title: string;
  progress: number;
  deadline: string;
  category?: string;
  aiSuggested?: boolean;
}

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
}

export default function OverviewTab({ setActiveTab }: OverviewTabProps) {
  const [goals, setGoals] = useState<Goal[]>([]);

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
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Productivity Score"
          value="87%"
          change="+5%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-green-400"
        />
        <StatsCard
          title="Goals Completed"
          value="12/20"
          change="60%"
          icon={<Target className="w-6 h-6" />}
          color="text-blue-400"
        />
        <StatsCard
          title="Tasks Due"
          value="8"
          change="2 overdue"
          icon={<Clock className="w-6 h-6" />}
          color="text-orange-400"
        />
        <StatsCard
          title="Network Growth"
          value="+24"
          change="This week"
          icon={<Users className="w-6 h-6" />}
          color="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals Progress */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Goals Progress</h2>
            <Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Goal
            </Button>
          </div>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-white">{goal.title}</h3>
                    {goal.aiSuggested && (
                      <Badge variant="purple" size="sm" icon={<Brain className="w-3 h-3" />}>
                        AI Suggested
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-slate-400">Due {goal.deadline}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <ProgressBar value={goal.progress} className="flex-1" />
                  <span className="text-sm font-semibold text-slate-300">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: <Plus className="w-5 h-5" />, label: 'Create New Goal', action: () => {} },
              { icon: <Clock className="w-5 h-5" />, label: 'Set Reminder', action: () => {} },
              { icon: <Brain className="w-5 h-5" />, label: 'AI Suggestions', action: () => setActiveTab('ai-assistant') },
              { icon: <TrendingUp className="w-5 h-5" />, label: 'Export Report', action: () => {} }
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                icon={action.icon}
                onClick={action.action}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}