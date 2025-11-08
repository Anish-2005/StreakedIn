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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Goals Progress - Takes up 6 columns on xl screens */}
        <Card className="xl:col-span-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Goals Progress</h2>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setActiveTab('goals')}
            >
              Add Goal
            </Button>
          </div>
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />
                <p className="text-slate-400 mb-4">No goals yet. Create your first goal!</p>
                <Button
                  variant="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setActiveTab('goals')}
                >
                  Create Your First Goal
                </Button>
              </div>
            ) : (
              goals.slice(0, 4).map((goal) => (
                <div key={goal.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/70 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-lg mb-1 truncate">{goal.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Due {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}
                        </span>
                        <span className="px-2 py-1 bg-slate-700/50 rounded-full text-xs">
                          {goal.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-white">{goal.progress}%</div>
                      <div className="text-xs text-slate-400">Complete</div>
                    </div>
                  </div>
                  <ProgressBar value={goal.progress} className="w-full h-2" />
                  {goal.description && (
                    <p className="text-slate-300 text-sm mt-3 line-clamp-2">{goal.description}</p>
                  )}
                </div>
              ))
            )}
            {goals.length > 4 && (
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => setActiveTab('goals')}
              >
                View All Goals ({goals.length})
              </Button>
            )}
          </div>
        </Card>

        {/* Right Column - Takes up 6 columns on xl screens */}
        <div className="xl:col-span-6 space-y-6">
          {/* Goals Achieved */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Goals Achieved</h2>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">
                  {goals.filter(goal => goal.progress === 100).length}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {goals.filter(goal => goal.progress === 100).length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
                  <p className="text-slate-400">No goals achieved yet. Keep pushing!</p>
                </div>
              ) : (
                goals
                  .filter(goal => goal.progress === 100)
                  .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
                  .slice(0, 3)
                  .map((goal) => (
                    <div key={goal.id} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{goal.title}</h3>
                          <p className="text-sm text-green-400">Completed!</p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 ml-13">
                        Achieved on {new Date(goal.updatedAt || goal.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
              )}
              {goals.filter(goal => goal.progress === 100).length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setActiveTab('goals')}
                >
                  View All Achieved Goals
                </Button>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: <Plus className="w-5 h-5" />, label: ' Create New Goal', action: () => setActiveTab('goals'), color: 'bg-blue-500 hover:bg-blue-600' },
                { icon: <Clock className="w-5 h-5" />, label: ' Set Reminder', action: () => setActiveTab('reminders'), color: 'bg-orange-500 hover:bg-orange-600' },
                { icon: <Brain className="w-5 h-5" />, label: ' AI Suggestions', action: () => setActiveTab('ai-assistant'), color: 'bg-purple-500 hover:bg-purple-600' },
                { icon: <TrendingUp className="w-5 h-5" />, label: ' View Analytics', action: () => setActiveTab('analytics'), color: 'bg-green-500 hover:bg-green-600' }
              ].map((action, index) => (
                <Button
                  key={index}
                  className={`w-full h-20 flex gap-2 items-center justify-center ${action.color} text-white border-0`}
                  onClick={action.action}
                >
                  
                  <span className="text-sm font-medium flex gap-2">{action.icon} {action.label}</span>
                </Button>
              ))}
            </div>

            {/* AI Suggestions Preview */}
            <div className="border-t border-slate-700/50 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('ai-assistant')}
                >
                  View All
                </Button>
              </div>

              {aiSuggestions.length > 0 ? (
                <div className="space-y-3">
                  {aiSuggestions.slice(0, 2).map((suggestion, index) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-300 text-sm leading-relaxed">{suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-slate-400 text-sm">AI suggestions are currently unavailable</p>
                      <p className="text-slate-500 text-xs mt-1">Using intelligent fallback recommendations</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}