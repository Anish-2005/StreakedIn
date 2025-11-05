"use client";
import { motion } from 'framer-motion';
import { Download, Brain, LineChart, PieChart, BarChart, Sparkles, TrendingUp, AlertCircle, Calendar, Target, CheckSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AnalyticsService, GoalsService, TasksService, Goal, Task } from '../../lib/services';
import { Card, Button, StatsCard } from '../common';

interface AnalyticsTabProps {}

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Productivity Analytics</h1>
          <p className="text-slate-300">Detailed insights into your performance and progress</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors">
            <Brain className="w-4 h-4" />
            <span>AI Analysis</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Productivity Trends</h3>
          <div className="h-64 bg-slate-900/20 rounded-lg flex items-center justify-center">
            <LineChart className="w-12 h-12 text-slate-500" />
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Goal Distribution</h3>
          <div className="h-64 bg-slate-900/20 rounded-lg flex items-center justify-center">
            <PieChart className="w-12 h-12 text-slate-500" />
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Weekly Performance</h3>
          <div className="h-64 bg-slate-900/20 rounded-lg flex items-center justify-center">
            <BarChart className="w-12 h-12 text-slate-500" />
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">AI Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/20 rounded-lg border border-slate-700/40">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">Peak Productivity</span>
              </div>
              <p className="text-sm text-slate-300">
                Your most productive hours are between 9-11 AM. Schedule important tasks during this time.
              </p>
            </div>
            <div className="p-4 bg-slate-900/20 rounded-lg border border-slate-700/40">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-semibold text-white">Progress Alert</span>
              </div>
              <p className="text-sm text-slate-300">
                You're on track to complete 85% of your monthly goals. Keep up the good work!
              </p>
            </div>
            <div className="p-4 bg-slate-900/20 rounded-lg border border-slate-700/40">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <span className="font-semibold text-white">Attention Needed</span>
              </div>
              <p className="text-sm text-slate-300">
                Networking goals are lagging behind. Consider scheduling 2-3 connection requests daily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}