"use client";
import { motion } from 'framer-motion';
import { Plus, Filter, Edit3, MoreHorizontal, Calendar, Target, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Goal {
  id: number;
  title: string;
  progress: number;
  deadline: string;
  category?: string;
  aiSuggested?: boolean;
}

interface GoalsTabProps {}

export default function GoalsTab({}: GoalsTabProps) {
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
      {/* Goals Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Goals & Targets</h1>
          <p className="text-slate-300">Set and track your professional development goals</p>
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
            <div key={goal.id} className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-white text-lg">{goal.title}</h3>
                    {goal.aiSuggested && (
                      <span className="flex items-center space-x-1 px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                        <Brain className="w-3 h-3" />
                        <span>AI Suggested</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-300">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due {goal.deadline}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{goal.category}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4 text-slate-300" />
                  </button>
                  <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Progress</span>
                  <span className="text-sm font-semibold text-white">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-700/40 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-slate-900/30 text-blue-400 rounded-lg hover:opacity-90 transition-colors">
                    Update Progress
                  </button>
                  <button className="px-3 py-1 text-sm bg-slate-900/20 text-slate-300 rounded-lg hover:opacity-90 transition-colors">
                    View Details
                  </button>
                </div>
                <button className="flex items-center space-x-1 text-sm text-slate-300 hover:text-white transition-colors">
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
  );
}