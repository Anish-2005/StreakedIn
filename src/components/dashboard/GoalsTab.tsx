"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Edit3, MoreHorizontal, Calendar, Target, Brain, Trash2, CheckCircle, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // AI carousel state
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  // AI-related state
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedGoal, setAiGeneratedGoal] = useState<Partial<Goal> | null>(null);
  const [showAIConfirmation, setShowAIConfirmation] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const nextSuggestion = () => {
    setCurrentSuggestionIndex((prev) => (prev + 1) % aiSuggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentSuggestionIndex((prev) => (prev - 1 + aiSuggestions.length) % aiSuggestions.length);
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Subscribe to goals
    const unsubscribe = GoalsService.subscribeToGoals(user.uid, (goalsData) => {
      setGoals(goalsData);
      setLoading(false);
    });

    // AI suggestions will be generated manually by user

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

  const handleAIPrompt = async () => {
    if (!aiPrompt.trim() || !user || isGeneratingAI) return;

    setIsGeneratingAI(true);
    try {
      const generatedGoal = await GoalsService.generateGoalFromPrompt(user.uid, aiPrompt.trim());

      if (generatedGoal) {
        setAiGeneratedGoal(generatedGoal);
        setShowAIPrompt(false);
        setShowAIConfirmation(true);
        setAiPrompt('');
      } else {
        // Fallback: create a basic goal from the prompt
        const fallbackGoal = GoalsService.generateGoalFromPromptFallback(aiPrompt.trim());
        setAiGeneratedGoal(fallbackGoal);
        setShowAIPrompt(false);
        setShowAIConfirmation(true);
        setAiPrompt('');
      }
    } catch (error) {
      console.error('Error generating AI goal:', error);
      // Fallback: create a basic goal from the prompt
      const fallbackGoal = GoalsService.generateGoalFromPromptFallback(aiPrompt.trim());
      setAiGeneratedGoal(fallbackGoal);
      setShowAIPrompt(false);
      setShowAIConfirmation(true);
      setAiPrompt('');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!user || isGeneratingSuggestions) return;

    setIsGeneratingSuggestions(true);
    try {
      const suggestions = await AISuggestionsService.generateGoalSuggestions(user.uid);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const confirmAICreatedGoal = async () => {
    if (!aiGeneratedGoal || !user) return;

    try {
      await GoalsService.createGoal(user.uid, {
        title: aiGeneratedGoal.title || 'New Goal',
        description: aiGeneratedGoal.description || '',
        progress: aiGeneratedGoal.progress || 0,
        deadline: aiGeneratedGoal.deadline || '',
        category: aiGeneratedGoal.category || 'Career Development',
        aiSuggested: aiGeneratedGoal.aiSuggested || true,
        status: aiGeneratedGoal.status || 'active'
      });
      setShowAIConfirmation(false);
      setAiGeneratedGoal(null);
    } catch (error) {
      console.error('Error adding AI-generated goal:', error);
    }
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

  const getPriorityColor = (category: string) => {
    switch (category) {
      case 'Career Development': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'Skill Learning': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Networking': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'Health & Wellness': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'Personal Growth': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Financial Goals': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'Creative Projects': return 'text-pink-400 bg-pink-500/20 border-pink-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Goals Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Goals & Targets</h1>
          <p className="text-slate-300">Set and track your professional development goals</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" icon={<Filter />} className="w-full sm:w-auto">
            Filter
          </Button>
          <Button
            variant="primary"
            icon={<Plus />}
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full sm:w-auto"
          >
            New Goal
          </Button>
          <Button
            onClick={() => setShowAIPrompt(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Create
            </div>
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
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Goals List */}
        <div className="xl:col-span-2 space-y-4">
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
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-semibold text-white text-lg">{goal.title}</h3>
                      <div className="flex flex-wrap gap-2">
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
                    </div>
                    {goal.description && (
                      <p className="text-slate-300 text-sm mb-2">{goal.description}</p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-300">
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
                  <div className="flex items-center gap-2 self-start">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Update Progress
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                      View Details
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" icon={<Brain className="w-4 h-4" />} className="w-full sm:w-auto">
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
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 sm:p-6">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-md border border-slate-600/50 rounded-xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI Goal Suggestions</h3>
                <p className="text-slate-300 text-sm">Smart recommendations based on your progress</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {aiSuggestions.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700/40">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-400 text-sm mb-4">Ready to get personalized goal suggestions?</p>
                  <Button
                    onClick={handleGenerateSuggestions}
                    disabled={isGeneratingSuggestions}
                    className="mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2"
                  >
                    {isGeneratingSuggestions ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate AI Suggestions
                      </div>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  {/* Main suggestion card */}
                  <motion.div
                    key={currentSuggestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-6 hover:border-slate-500/60 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        {aiSuggestions[currentSuggestionIndex].includes('Learning Modules') ? (
                          // Formatted suggestion with modules (AI-generated format)
                          <div className="space-y-4">
                            {(() => {
                              const lines = aiSuggestions[currentSuggestionIndex].split('\n').filter(line => line.trim());
                              const mainGoal = lines[0];
                              // Find modules - they could be numbered like "1. Module" or just listed after "Learning Modules"
                              const modulesStartIndex = lines.findIndex(line => line.includes('Learning Modules')) + 1;
                              const modules = lines.slice(modulesStartIndex)
                                .filter(line => line.trim() && !/^\d+$/.test(line.trim())) // Filter out standalone numbers
                                .map(line => line.replace(/^\d+\.?\s*/, '').trim()) // Remove numbering
                                .filter(line => line.length > 0);

                              return (
                                <>
                                  <div className="text-white text-base leading-relaxed">
                                    {mainGoal}
                                  </div>
                                  <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                                    <h4 className="text-blue-300 font-medium mb-3 flex items-center gap-2">
                                      <Target className="w-4 h-4" />
                                      Learning Modules
                                    </h4>
                                    <div className="space-y-2">
                                      {modules.map((module, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-600/20">
                                          <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mt-0.5">
                                            <span className="text-xs font-semibold text-blue-300">{idx + 1}</span>
                                          </div>
                                          <span className="text-slate-200 text-sm leading-relaxed">{module}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        ) : aiSuggestions[currentSuggestionIndex].includes('**') ? (
                          // Formatted suggestion with modules (structured format)
                          <div className="space-y-4">
                            <div className="text-white text-base leading-relaxed">
                              {aiSuggestions[currentSuggestionIndex].split('**')[0].trim()}
                            </div>
                            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                              <h4 className="text-blue-300 font-medium mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Learning Modules
                              </h4>
                              <div className="space-y-2">
                                {aiSuggestions[currentSuggestionIndex]
                                  .split('**')[1]
                                  .split('\n')
                                  .filter(line => line.trim())
                                  .map((module, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-600/20">
                                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mt-0.5">
                                        <span className="text-xs font-semibold text-blue-300">{idx + 1}</span>
                                      </div>
                                      <span className="text-slate-200 text-sm leading-relaxed">{module.trim()}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                            {aiSuggestions[currentSuggestionIndex].split('**')[2] && (
                              <div className="text-slate-300 text-sm">
                                {aiSuggestions[currentSuggestionIndex].split('**')[2].trim()}
                              </div>
                            )}
                          </div>
                        ) : (
                          // Regular suggestion
                          <p className="text-white text-base leading-relaxed">
                            {aiSuggestions[currentSuggestionIndex]}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Navigation */}
                  {aiSuggestions.length > 1 && (
                    <div className="flex items-center justify-between mt-4 gap-2">
                      <Button
                        onClick={prevSuggestion}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 flex-shrink-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      {/* Indicators */}
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-center overflow-x-auto">
                        {aiSuggestions.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSuggestionIndex(index)}
                            className={`flex-shrink-0 w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentSuggestionIndex
                                ? 'bg-blue-500 w-4 sm:w-6'
                                : 'bg-slate-600 hover:bg-slate-500'
                            }`}
                          />
                        ))}
                      </div>

                      <Button
                        onClick={nextSuggestion}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 flex-shrink-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {aiSuggestions.length > 0 && (
              <Button
                onClick={handleGenerateSuggestions}
                disabled={isGeneratingSuggestions}
                className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 transition-all duration-200"
              >
                {isGeneratingSuggestions ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">Generate More Suggestions</span>
                  </div>
                )}
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* AI Prompt Modal */}
      <AnimatePresence>
        {showAIPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAIPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-xl p-4 sm:p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Goal Creation</h3>
                </div>
                <button
                  onClick={() => setShowAIPrompt(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-slate-300 mb-4">
                Describe the goal you want to create. Our AI will generate a well-structured goal with appropriate category and details.
              </p>

              <textarea
                placeholder="e.g., Complete a professional certification in data science within 6 months"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAIPrompt()}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 mb-4"
                rows={3}
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  onClick={() => setShowAIPrompt(false)}
                  variant="secondary"
                  className="px-4 py-2 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAIPrompt}
                  disabled={!aiPrompt.trim() || isGeneratingAI}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 w-full sm:w-auto"
                >
                  {isGeneratingAI ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate Goal
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Confirmation Modal */}
      <AnimatePresence>
        {showAIConfirmation && aiGeneratedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAIConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-xl p-4 sm:p-6 w-full max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Generated Goal</h3>
                </div>
                <button
                  onClick={() => setShowAIConfirmation(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                <h4 className="text-white font-medium mb-2">{aiGeneratedGoal.title}</h4>
                {aiGeneratedGoal.description && aiGeneratedGoal.description.trim() && (
                  <p className="text-slate-300 text-sm mb-3">{aiGeneratedGoal.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(aiGeneratedGoal.category || 'Career Development')}`}>
                    <Target className="w-3 h-3 inline mr-1" />
                    {aiGeneratedGoal.category || 'Career Development'}
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-6">
                This goal was generated by AI based on your description. You can add it to your goals list or make changes later.
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowAIConfirmation(false);
                    setAiGeneratedGoal(null);
                  }}
                  variant="secondary"
                  className="px-4 py-2 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAICreatedGoal}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 w-full sm:w-auto"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Goal
                  </div>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}