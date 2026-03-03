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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-app-surface border border-app-border rounded-xl p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-app-text mb-4">Create Reminder with AI Assistant</h3>
        <textarea
          value={aiPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the reminder you want to create naturally... e.g., 'Remind me to review my weekly goals every Monday at 9 AM' or 'Send me a daily reminder to drink water'"
          className="w-full p-3 bg-app-bg border border-app-border rounded-lg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-1 focus:ring-blue-500/40 mb-4 text-sm"
          rows={4}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-app-bg text-app-text-muted rounded-lg hover:bg-app-surface/80 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={aiLoading || !aiPrompt.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
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