"use client";
import { motion } from 'framer-motion';
import { Download, Brain, LineChart, PieChart, BarChart, Sparkles, TrendingUp, AlertCircle, Calendar, Target, CheckSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AnalyticsService, GoalsService, TasksService, Goal, Task } from '../../lib/services';
import { Card, Button, StatsCard } from '../common';

interface AnalyticsTabProps {
  // No props needed for this component
}

export default function AnalyticsTab({}: AnalyticsTabProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Subscribe to goals and tasks
    const unsubscribeGoals = GoalsService.subscribeToGoals(user.uid, (goalsData) => {
      setGoals(goalsData);
    });

    const unsubscribeTasks = TasksService.subscribeToTasks(user.uid, (tasksData) => {
      setTasks(tasksData);
      setLoading(false);
    });

    return () => {
      unsubscribeGoals();
      unsubscribeTasks();
    };
  }, [user]);

  // Calculate analytics data
  const getProductivityScore = () => {
    if (goals.length === 0) return 0;
    const avgProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;
    return Math.round(avgProgress);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.status === 'completed').length;
  };

  const getTotalGoals = () => goals.length;

  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed).length;
  };

  const getTotalTasks = () => tasks.length;

  const getTasksDueToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === today).length;
  };

  const getOverdueTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate && task.dueDate < today && !task.completed).length;
  };

  const getGoalsByCategory = () => {
    const categories: Record<string, number> = {};
    goals.forEach(goal => {
      categories[goal.category] = (categories[goal.category] || 0) + 1;
    });
    return Object.entries(categories).map(([category, count]) => ({ category, count }));
  };

  const getWeeklyProgress = () => {
    // Mock weekly data - in a real app, this would come from analytics collection
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      tasks: Math.floor(Math.random() * 5) + 1,
      goals: Math.floor(Math.random() * 2)
    }));
  };

  const getInsights = () => {
    const insights = [];

    if (getProductivityScore() > 80) {
      insights.push({
        type: 'success',
        icon: <TrendingUp className="w-4 h-4 text-green-400" />,
        title: 'Excellent Progress!',
        message: 'You\'re performing exceptionally well. Keep up the momentum!'
      });
    }

    if (getOverdueTasks() > 0) {
      insights.push({
        type: 'warning',
        icon: <AlertCircle className="w-4 h-4 text-orange-400" />,
        title: 'Tasks Need Attention',
        message: `You have ${getOverdueTasks()} overdue tasks that need immediate attention.`
      });
    }

    if (goals.length === 0) {
      insights.push({
        type: 'info',
        icon: <Target className="w-4 h-4 text-blue-400" />,
        title: 'Set Your First Goal',
        message: 'Start your productivity journey by creating your first goal.'
      });
    }

    if (getCompletedTasks() / Math.max(getTotalTasks(), 1) > 0.8) {
      insights.push({
        type: 'success',
        icon: <CheckSquare className="w-4 h-4 text-green-400" />,
        title: 'Task Master!',
        message: 'You\'re completing tasks at an impressive rate.'
      });
    }

    return insights.slice(0, 3); // Return top 3 insights
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="space-y-5"
    >
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-app-text">Productivity Analytics</h1>
          <p className="text-app-text-muted">Detailed insights into your performance and progress</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            <span>AI Analysis</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Productivity Score"
          value={`${getProductivityScore()}%`}
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
          change={getProductivityScore() > 50 ? '+15%' : '-5%'}
        />
        <StatsCard
          title="Goals Completed"
          value={`${getCompletedGoals()}/${getTotalGoals()}`}
          icon={<Target className="w-5 h-5 text-blue-400" />}
          change={getCompletedGoals() > 0 ? `+${getCompletedGoals()}` : '0'}
        />
        <StatsCard
          title="Tasks Done"
          value={`${getCompletedTasks()}/${getTotalTasks()}`}
          icon={<CheckSquare className="w-5 h-5 text-purple-400" />}
          change={getCompletedTasks() > 0 ? `+${getCompletedTasks()}` : '0'}
        />
        <StatsCard
          title="Due Today"
          value={getTasksDueToday().toString()}
          icon={<Calendar className="w-5 h-5 text-orange-400" />}
          change={getTasksDueToday() > 0 ? `${getTasksDueToday()}` : '0'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trends */}
        <div className="border border-app-border rounded-xl p-5 bg-app-surface/70">
          <h3 className="font-semibold text-app-text mb-4">Weekly Progress</h3>
          <div className="space-y-3">
            {getWeeklyProgress().map((day, index) => (
              <div key={day.day} className="flex items-center justify-between">
                <span className="text-app-text-muted text-sm">{day.day}</span>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-slate-400 light:text-slate-600">{day.tasks} tasks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-400 light:text-slate-600">{day.goals} goals</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Distribution */}
        <div className="border border-app-border rounded-xl p-5 bg-app-surface/70">
          <h3 className="font-semibold text-app-text mb-4">Goals by Category</h3>
          <div className="space-y-3">
            {getGoalsByCategory().map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-app-text-muted capitalize">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-700 light:bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: `${(item.count / Math.max(...getGoalsByCategory().map(g => g.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 light:text-slate-600">{item.count}</span>
                </div>
              </div>
            ))}
            {getGoalsByCategory().length === 0 && (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 light:text-slate-600">No goals yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Overview */}
        <div className="border border-app-border rounded-xl p-5 bg-app-surface/70">
          <h3 className="font-semibold text-app-text mb-4">Task Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-app-text-muted">Completed</span>
              <span className="text-green-400 font-semibold">{getCompletedTasks()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-app-text-muted">Pending</span>
              <span className="text-yellow-400 font-semibold">{getTotalTasks() - getCompletedTasks()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-app-text-muted">Due Today</span>
              <span className="text-blue-400 font-semibold">{getTasksDueToday()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-app-text-muted">Overdue</span>
              <span className="text-red-400 font-semibold">{getOverdueTasks()}</span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="border border-app-border rounded-xl p-5 bg-app-surface/70">
          <h3 className="font-semibold text-app-text mb-4">AI Insights</h3>
          <div className="space-y-4">
            {getInsights().map((insight, index) => (
              <div key={index} className="p-4 bg-slate-900 light:bg-slate-50/20 rounded-lg border border-slate-700 light:border-slate-300/40">
                <div className="flex items-center space-x-2 mb-2">
                  {insight.icon}
                  <span className="font-semibold text-app-text">{insight.title}</span>
                </div>
                <p className="text-sm text-app-text-muted">{insight.message}</p>
              </div>
            ))}
            {getInsights().length === 0 && (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 light:text-slate-600">No insights available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}