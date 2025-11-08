"use client";
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../../common';

interface AIPromptModalProps {
  isOpen: boolean;
  aiPrompt: string;
  isGeneratingAI: boolean;
  onClose: () => void;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
}

export default function AIPromptModal({
  isOpen,
  aiPrompt,
  isGeneratingAI,
  onClose,
  onPromptChange,
  onSubmit
}: AIPromptModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
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
            onClick={onClose}
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
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSubmit()}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 mb-4"
          rows={3}
        />

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-4 py-2 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
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
  );
}