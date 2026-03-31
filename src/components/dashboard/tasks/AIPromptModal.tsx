"use client";
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
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
        className="bg-app-surface backdrop-blur-md border border-app-border rounded-xl p-4 sm:p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-app-primary-soft rounded-lg">
              <Sparkles className="w-5 h-5 text-app-primary" />
            </div>
            <h3 className="text-lg font-semibold text-app-text">AI Task Creation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-app-text-muted hover:text-app-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-app-text-muted mb-4">
          Describe the task you want to create. Our AI will generate a well-structured task with appropriate priority and details.
        </p>

        <textarea
          placeholder="e.g., Complete the quarterly financial report by Friday"
          value={aiPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSubmit()}
          className="w-full bg-app-bg border border-app-border rounded-lg px-4 py-3 text-app-text placeholder-app-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-app-primary/35 mb-4"
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
            className="text-app-text px-6 py-2 w-full sm:w-auto"
          >
            {isGeneratingAI ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Task
              </div>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
