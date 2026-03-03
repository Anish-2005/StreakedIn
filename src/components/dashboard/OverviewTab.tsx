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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -2 }}
      className="space-y-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-app-text">Today at a glance</h1>
          <p className="text-sm text-app-text-muted">
            Key productivity metrics, active goals, and quick actions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
        <Card className="xl:col-span-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-app-text">Goals Progress</h2>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setActiveTab('goals')}
            >
              Add Goal
            </Button>
          </div>
          <div className="space-y-3">
            {goals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50 dark:text-slate-400 light:text-gray-400" />
                <p className="text-app-text-muted mb-4">No goals yet. Create your first goal!</p>
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
                <div
                  key={goal.id}
                  className="rounded-lg border border-app-border/60 bg-app-surface/70 p-4 hover:bg-app-surface/80 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-app-text text-sm mb-1 truncate">
                        {goal.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-app-text-muted">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Active'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-app-border/60 text-xs">
                          {goal.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-semibold text-blue-400">
                        {goal.progress}%
                      </div>
                      <div className="text-[11px] text-app-text-muted">
                        Progress
                      </div>
                    </div>
                  </div>
                  <ProgressBar value={goal.progress} size="sm" />
                  {goal.description && (
                    <p className="text-app-text-muted text-sm mt-3 line-clamp-2">
                      {goal.description}
                    </p>
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
              <h2 className="text-xl font-semibold text-app-text">Goals Achieved</h2>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 dark:text-green-400 light:text-green-600" />
                <span className="dark:text-green-400 light:text-green-600 font-semibold">
                  {goals.filter(goal => goal.progress === 100).length}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {goals.filter(goal => goal.progress === 100).length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50 dark:text-slate-400 light:text-gray-400" />
                  <p className="text-app-text-muted">No goals achieved yet. Keep pushing!</p>
                </div>
              ) : (
                goals
                  .filter(goal => goal.progress === 100)
                  .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
                  .slice(0, 3)
                  .map((goal) => (
                    <div
                      key={goal.id}
                      className="rounded-xl border border-app-border/60 bg-app-surface/70 p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-green-500/10 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-app-text truncate">{goal.title}</h3>
                          <p className="text-sm dark:text-green-400 light:text-green-600">Completed!</p>
                        </div>
                      </div>
                      <div className="text-xs text-app-text-muted ml-13">
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
            <h2 className="text-xl font-semibold text-app-text mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { icon: <Plus className="w-5 h-5" />, label: 'Create Goal', action: () => setActiveTab('goals') },
                  { icon: <Clock className="w-5 h-5" />, label: 'Reminder', action: () => setActiveTab('reminders') },
                  { icon: <Brain className="w-5 h-5" />, label: 'AI Pilot', action: () => setActiveTab('ai-assistant') },
                  { icon: <TrendingUp className="w-5 h-5" />, label: 'Analytics', action: () => setActiveTab('analytics') }
                ].map((action, index) => (
                <button
                  key={index}
                    className="w-full h-20 flex flex-col gap-2 items-center justify-center rounded-xl border border-app-border/60 bg-app-surface/60 hover:bg-app-surface/80 transition-colors"
                  onClick={action.action}
                >
                  {action.icon}
                  <span className="text-xs font-medium text-app-text">
                      {action.label}
                    </span>
                </button>
              ))}
            </div>

            {/* AI Suggestions Preview */}
            <div className="dark:border-t light:border-t dark:border-slate-700/50 light:border-gray-200/40 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-app-text">AI Suggestions</h3>
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
                    <div key={index} className="bg-app-surface/50 dark:border light:border border-app-border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 dark:text-purple-400 light:text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-app-text-muted text-sm leading-relaxed">{suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dark:bg-slate-800/30 light:bg-gray-50/40 dark:border light:border dark:border-slate-700/40 light:border-gray-200/40 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-app-text-muted" />
                    <div>
                      <p className="dark:text-slate-400 light:text-gray-600 text-sm">AI suggestions are currently unavailable</p>
                      <p className="dark:text-slate-500 light:text-gray-400 text-xs mt-1">Using intelligent fallback recommendations</p>
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