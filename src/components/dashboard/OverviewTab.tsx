"use client";
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Users, Plus, Brain, CheckCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Card, StatsCard, ProgressBar, Button } from '../common';
import { GoalsService, TasksService, StatsService, AISuggestionsService, Goal, Task, UserStats } from '../../lib/services';
import { useAuth } from '../../contexts/AuthContext';

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
}

export default function OverviewTab({ setActiveTab }: OverviewTabProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Subscribe to goals
    const unsubscribeGoals = GoalsService.subscribeToGoals(user.uid, (goalsData) => {
      setGoals(goalsData);
    });

    // Subscribe to tasks
    const unsubscribeTasks = TasksService.subscribeToTasks(user.uid, (tasksData) => {
      setTasks(tasksData);
    });

    // Subscribe to user stats
    const unsubscribeStats = StatsService.subscribeToUserStats(user.uid, (stats) => {
      setUserStats(stats);
      setLoading(false);
    });

    // Load AI suggestions
    AISuggestionsService.generateGoalSuggestions(user.uid).then(setAiSuggestions);

    return () => {
      unsubscribeGoals();
      unsubscribeTasks();
      unsubscribeStats();
    };
  }, [user]);

  const getTasksDueToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === today && !task.completed).length;
  }, [tasks]);

  const getOverdueTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate && task.dueDate < today && !task.completed).length;
  }, [tasks]);

  const getPendingTasks = useMemo(() => {
    return tasks.filter(task => !task.completed).length;
  }, [tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Productivity Score"
          value={loading ? "..." : `${userStats?.productivityScore || 0}%`}
          change={userStats && userStats.productivityScore > 0 ? "+5%" : "N/A"}
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-green-400"
        />
        <StatsCard
          title="Goals Completed"
          value={loading ? "..." : `${userStats?.completedGoals || 0}/${userStats?.totalGoals || 0}`}
          change={`${userStats ? Math.round((userStats.completedGoals / Math.max(userStats.totalGoals, 1)) * 100) : 0}%`}
          icon={<Target className="w-6 h-6" />}
          color="text-blue-400"
        />
        <StatsCard
          title="Tasks Due"
          value={loading ? "..." : `${getTasksDueToday}`}
          change={`${getPendingTasks} pending`}
          icon={<Clock className="w-6 h-6" />}
          color="text-orange-400"
        />
        <StatsCard
          title="Network Growth"
          value={loading ? "..." : `+${userStats?.networkGrowth || 0}`}
          change="This week"
          icon={<Users className="w-6 h-6" />}
          color="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Goals Progress */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h2 className="text-base sm:text-lg font-semibold text-white">Goals Progress</h2>
            <Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />} className="self-start sm:self-auto">
              Add Goal
            </Button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-slate-400">
                <Target className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-sm sm:text-base">No goals yet. Create your first goal!</p>
              </div>
            ) : (
              goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="border border-slate-700/50 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">{goal.title}</h3>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-400 self-end sm:self-auto">
                      Due {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <ProgressBar value={goal.progress} className="flex-1" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">{goal.progress}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Goals Achieved */}
        <Card>
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Goals Achieved</h2>
          <div className="space-y-3 sm:space-y-4">
            {goals.filter(goal => goal.progress === 100).length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-slate-400">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-sm sm:text-base">No goals achieved yet. Keep pushing!</p>
              </div>
            ) : (
              goals
                .filter(goal => goal.progress === 100)
                .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
                .slice(0, 3)
                .map((goal) => (
                  <div key={goal.id} className="border border-green-500/30 bg-green-500/5 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm sm:text-base truncate">{goal.title}</h3>
                        <p className="text-xs sm:text-sm text-green-400">Completed!</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 ml-9 sm:ml-11">
                      Achieved on {new Date(goal.updatedAt || goal.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
            )}
            {goals.filter(goal => goal.progress === 100).length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-sm"
                onClick={() => setActiveTab('goals')}
              >
                View All Achieved Goals
              </Button>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Quick Actions</h2>
          <div className="space-y-2 sm:space-y-3">
            {[
              { icon: <Plus className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Create New Goal', action: () => setActiveTab('goals') },
              { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Set Reminder', action: () => setActiveTab('reminders') },
              { icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'AI Suggestions', action: () => setActiveTab('ai-assistant') },
              { icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'View Analytics', action: () => setActiveTab('analytics') }
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-sm sm:text-base"
                icon={action.icon}
                onClick={action.action}
              >
                {action.label}
              </Button>
            ))}
          </div>

          {/* AI Suggestions Preview */}
          {aiSuggestions.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-sm sm:text-lg font-semibold text-white mb-2 sm:mb-3">AI Suggestions</h3>
              <div className="space-y-2">
                {aiSuggestions.slice(0, 2).map((suggestion, index) => (
                  <div key={index} className="text-xs sm:text-sm text-slate-300 bg-slate-800/30 rounded-lg p-2 sm:p-3">
                    {suggestion}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-sm"
                  onClick={() => setActiveTab('ai-assistant')}
                >
                  View All Suggestions
                </Button>
              </div>
            </div>
          )}

          {/* AI Service Unavailable Message */}
          {aiSuggestions.length === 0 && (
            <div className="mt-4 sm:mt-6">
              <div className="text-xs sm:text-sm text-slate-400 bg-slate-800/20 rounded-lg p-2 sm:p-3">
                <Brain className="w-4 h-4 inline mr-2" />
                AI suggestions are currently unavailable. Using fallback recommendations.
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}