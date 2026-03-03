"use client";

import { RotateCcw, Brain } from 'lucide-react';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import ChatInput from './ChatInput';

interface ChatAreaProps {
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  onSubmit: () => void;
  onClearChat: () => void;
  isLoading: boolean;
  onSpeakText: (text: string) => void;
}

export default function ChatArea({
  conversationHistory,
  aiPrompt,
  setAiPrompt,
  onSubmit,
  onClearChat,
  isLoading,
  onSpeakText
}: ChatAreaProps) {
  return (
    <div className="lg:col-span-6">
      <div className="bg-app-surface/50 border border-app-border/30 backdrop-blur-sm rounded-2xl h-[600px] flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-app-border/20 flex items-center justify-between flex-shrink-0">
          <h3 className="font-semibold text-app-text text-lg">Conversation</h3>
          <button
            onClick={onClearChat}
            className="flex items-center gap-2 px-3 py-1.5 bg-app-bg/80 hover:bg-app-bg text-app-text-muted hover:text-app-text border border-app-border/30 rounded-lg transition-all text-sm font-medium"
            title="Clear chat history"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div 
          className="chat-scrollbar flex-1 p-6 overflow-y-auto space-y-4 min-h-0"
        >
          {conversationHistory.length === 0 ? (
            <div className="text-center text-app-text-muted py-12 flex flex-col items-center justify-center h-full">
              <Brain className="w-12 h-12 text-app-border/50 mx-auto mb-4" />
              <p className="text-base">Start a conversation to get personalized recommendations</p>
              <p className="text-sm text-app-text-muted/70 mt-1">Ask about goals, tasks, or productivity insights</p>
            </div>
          ) : (
            conversationHistory.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                onSpeakText={onSpeakText}
              />
            ))
          )}

          {/* Loading indicator */}
          {isLoading && <LoadingIndicator />}
        </div>

        {/* Input Area */}
        <ChatInput
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}