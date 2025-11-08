"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GoalsService, AISuggestionsService, Goal } from '../../lib/services';
import { Card, Button, Input, Select, Badge, ProgressBar } from '../common';
import {
  GoalsHeader,
  GoalForm,
  GoalsList,
  QuickGoalSetup,
  AISuggestionsPanel
} from '../../components/dashboard/goals';

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
      <GoalsHeader
        showCreateForm={showCreateForm}
        onToggleCreate={() => setShowCreateForm(prev => !prev)}
        onOpenAIPrompt={() => setShowAIPrompt(true)}
      />

      {showCreateForm && (
        <GoalForm
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          editingGoal={editingGoal}
          onCancel={resetForm}
          onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <GoalsList
            goals={goals}
            loading={loading}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
            getPriorityColor={getPriorityColor}
          />
        </div>

        <div className="space-y-6">
          <QuickGoalSetup />

          <AISuggestionsPanel
            aiSuggestions={aiSuggestions}
            currentSuggestionIndex={currentSuggestionIndex}
            isGeneratingSuggestions={isGeneratingSuggestions}
            onGenerate={handleGenerateSuggestions}
            onPrev={prevSuggestion}
            onNext={nextSuggestion}
            onSelectSuggestion={(s) => handleAISuggestionClick(s)}
          />
        </div>
      </div>

      {/* AI Prompt Modal (kept in parent for logic) */}
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
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Goal Creation</h3>
                </div>
                <button
                  onClick={() => setShowAIPrompt(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Close</span>
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

      {/* AI Confirmation Modal kept in parent */}
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
                    <div className="w-4 h-4 bg-green-400 rounded" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Generated Goal</h3>
                </div>
                <button
                  onClick={() => setShowAIConfirmation(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                <h4 className="text-white font-medium mb-2">{aiGeneratedGoal.title}</h4>
                {aiGeneratedGoal.description && aiGeneratedGoal.description.trim() && (
                  <p className="text-slate-300 text-sm mb-3">{aiGeneratedGoal.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(aiGeneratedGoal.category || 'Career Development')}`}>
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