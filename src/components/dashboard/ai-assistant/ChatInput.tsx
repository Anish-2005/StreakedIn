"use client";

import { Send } from 'lucide-react';

interface ChatInputProps {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function ChatInput({ aiPrompt, setAiPrompt, onSubmit, isLoading }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      <div className="flex space-x-2">
        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Ask for productivity advice, goal suggestions, or schedule optimization..."
          className="flex-1 border border-slate-700/50 rounded-lg px-4 py-2 bg-slate-800/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}