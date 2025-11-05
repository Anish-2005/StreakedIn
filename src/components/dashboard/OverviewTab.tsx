"use client";
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Users, Plus, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, StatsCard, Badge, ProgressBar, Button } from '../common';
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

  const getTasksDueToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === today && !task.completed).length;
  };

  const getOverdueTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate && task.dueDate < today && !task.completed).length;
  };

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
          value={loading ? "..." : `${getTasksDueToday()}`}
          change={`${getOverdueTasks()} overdue`}
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
            {goals.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No goals yet. Create your first goal!</p>
              </div>
            ) : (
              goals.slice(0, 3).map((goal) => (
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
                    <span className="text-sm text-slate-400">
                      Due {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <ProgressBar value={goal.progress} className="flex-1" />
                    <span className="text-sm font-semibold text-slate-300">{goal.progress}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: <Plus className="w-5 h-5" />, label: 'Create New Goal', action: () => setActiveTab('goals') },
              { icon: <Clock className="w-5 h-5" />, label: 'Set Reminder', action: () => setActiveTab('reminders') },
              { icon: <Brain className="w-5 h-5" />, label: 'AI Suggestions', action: () => setActiveTab('ai-assistant') },
              { icon: <TrendingUp className="w-5 h-5" />, label: 'View Analytics', action: () => setActiveTab('analytics') }
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

          {/* AI Suggestions Preview */}
          {aiSuggestions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">AI Suggestions</h3>
              <div className="space-y-2">
                {aiSuggestions.slice(0, 2).map((suggestion, index) => (
                  <div key={index} className="text-sm text-slate-300 bg-slate-800/30 rounded-lg p-3">
                    {suggestion}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setActiveTab('ai-assistant')}
                >
                  View All Suggestions
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}