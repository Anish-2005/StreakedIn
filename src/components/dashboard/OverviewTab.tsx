"use client";
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Users, Plus, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

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
                        <Brain className="w-3 h-3" />
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
              { icon: <Clock className="w-5 h-5" />, label: 'Set Reminder', action: () => {} },
              { icon: <Brain className="w-5 h-5" />, label: 'AI Suggestions', action: () => setActiveTab('ai-assistant') },
              { icon: <TrendingUp className="w-5 h-5" />, label: 'Export Report', action: () => {} }
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
  );
}