"use client";
import { Sparkles } from 'lucide-react';

interface AIPromptModalProps {
  isOpen: boolean;
  aiPrompt: string;
  aiLoading: boolean;
  onClose: () => void;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
}

export default function AIPromptModal({
  isOpen,
  aiPrompt,
  aiLoading,
  onClose,
  onPromptChange,
  onSubmit
}: AIPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Create Reminder with AI Assistant</h3>
        <textarea
          value={aiPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the reminder you want to create naturally... e.g., 'Remind me to review my weekly goals every Monday at 9 AM' or 'Send me a daily reminder to drink water'"
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={aiLoading || !aiPrompt.trim()}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {aiLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{aiLoading ? 'Generating...' : 'Generate Reminder'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}