"use client";
import { motion } from 'framer-motion';
import { Plus, Filter, Edit3, MoreHorizontal, Calendar, Target, Brain, Trash2, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { GoalsService, AISuggestionsService, Goal } from '../../lib/services';
import { Card, Button, Input, Select, Badge, ProgressBar } from '../common';

interface GoalsTabProps {
  // No props needed for this component
}

export default function GoalsTab({}: GoalsTabProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: 'Career Development',
    progress: 0
  });

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Subscribe to goals
    const unsubscribe = GoalsService.subscribeToGoals(user.uid, (goalsData) => {
      setGoals(goalsData);
      setLoading(false);
    });

    // Load AI suggestions
    AISuggestionsService.generateGoalSuggestions(user.uid).then(setAiSuggestions);

    return unsubscribe;
  }, [user]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      deadline: '',
      category: 'Career Development',
      progress: 0
    });
    setEditingGoal(null);
    setShowCreateForm(false);
  };

  const handleCreateGoal = async () => {
    if (!user || !formData.title.trim()) return;

    try {
      await GoalsService.createGoal(user.uid, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        progress: formData.progress,
        deadline: formData.deadline,
        category: formData.category,
        aiSuggested: false,
        status: 'active'
      });
      resetForm();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateGoal = async () => {
    if (!editingGoal || !formData.title.trim()) return;

    try {
      await GoalsService.updateGoal(editingGoal.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        progress: formData.progress,
        deadline: formData.deadline,
        category: formData.category
      });
      resetForm();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      await GoalsService.deleteGoal(goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      deadline: goal.deadline,
      category: goal.category,
      progress: goal.progress
    });
    setShowCreateForm(true);
  };

  const handleAISuggestionClick = (suggestion: string) => {
    setFormData(prev => ({
      ...prev,
      title: suggestion,
      aiSuggested: true
    }));
    setShowCreateForm(true);
  };

  const categories = [
    'Career Development',
    'Skill Learning',
    'Networking',
    'Health & Wellness',
    'Personal Growth',
    'Financial Goals',
    'Creative Projects'
  ];

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
          <Button variant="outline" icon={<Filter />}>
            Filter
          </Button>
          <Button
            variant="primary"
            icon={<Plus />}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            New Goal
          </Button>
        </div>
      </div>

      {/* Create/Edit Goal Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Goal title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <textarea
                placeholder="Goal description (optional)..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm bg-slate-900/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <Select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>

            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Initial Progress: {formData.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={editingGoal ? handleUpdateGoal : handleCreateGoal}>
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Goals List */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-slate-400 mt-2">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <Card className="text-center py-8">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
              <p className="text-slate-400">No goals yet. Create your first goal!</p>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-white text-lg">{goal.title}</h3>
                      {goal.aiSuggested && (
                        <Badge variant="purple" size="sm" icon={<Brain className="w-3 h-3" />}>
                          AI Suggested
                        </Badge>
                      )}
                      {goal.status === 'completed' && (
                        <Badge variant="success" size="sm" icon={<CheckCircle className="w-3 h-3" />}>
                          Completed
                        </Badge>
                      )}
                    </div>
                    {goal.description && (
                      <p className="text-slate-300 text-sm mb-2">{goal.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-slate-300">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{goal.category}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditGoal(goal)}
                      className="p-2"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Progress</span>
                    <span className="text-sm font-semibold text-white">{goal.progress}%</span>
                  </div>
                  <ProgressBar value={goal.progress} className="w-full" />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Update Progress
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Brain className="w-4 h-4" />}>
                    Get AI Tips
                  </Button>
                </div>
              </Card>
            ))
          )}
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
          <Card>
            <h3 className="font-semibold text-white mb-4">AI Goal Suggestions</h3>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/40">
                  <span className="text-sm text-slate-300 flex-1">{suggestion}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAISuggestionClick(suggestion)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              icon={<Brain className="w-4 h-4" />}
              onClick={() => AISuggestionsService.generateGoalSuggestions(user?.uid || '').then(setAiSuggestions)}
            >
              Generate More Suggestions
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}