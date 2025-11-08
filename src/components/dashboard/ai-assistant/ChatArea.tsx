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
      <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between flex-shrink-0">
          <h3 className="font-semibold text-white">Chat with AI Assistant</h3>
          <button
            onClick={onClearChat}
            className="flex items-center space-x-2 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
            title="Clear chat history"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #1e293b' }}>
          {conversationHistory.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              <Brain className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p>Ask me anything about your productivity, goals, or schedule!</p>
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