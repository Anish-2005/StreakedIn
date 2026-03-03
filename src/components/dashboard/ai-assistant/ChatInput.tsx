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
    <div className="px-6 py-4 border-t border-app-border/20">
      <div className="flex gap-3">
        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Ask for recommendations, goal ideas, or schedule optimization..."
          className="flex-1 border border-app-border/30 rounded-lg px-4 py-2.5 bg-app-bg text-app-text placeholder-app-text-muted/60 focus:outline-none focus:ring-1 focus:ring-app-border/60 focus:border-app-border/40 transition-all text-sm"
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="px-4 py-2.5 bg-app-bg hover:bg-app-bg/80 text-app-text border border-app-border/30 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 font-medium text-sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-app-text/30 border-t-app-text rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}