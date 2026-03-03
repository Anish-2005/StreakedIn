"use client";

import { Bot, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
  onSpeakText?: (text: string) => void;
}

export default function ChatMessage({ message, onSpeakText }: ChatMessageProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const formatAIResponse = (text: string) => {
    // Split by lines and process each line
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Handle bold text (**text**)
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-app-text font-semibold">$1</strong>');

      // Handle numbered lists (1. Text)
      if (/^\d+\.\s/.test(line)) {
        return `<div class="flex items-start gap-2 mb-2">
          <span class="text-app-text-muted font-medium text-sm flex-shrink-0 mt-0.5">${line.match(/^\d+/)?.[0]}.</span>
          <span class="text-app-text-muted leading-relaxed">${line.replace(/^\d+\.\s*/, '')}</span>
        </div>`;
      }

      // Handle regular paragraphs
      if (line.trim()) {
        return `<p class="text-app-text-muted leading-relaxed mb-3">${line}</p>`;
      }

      // Empty lines become spacing
      return '<div class="h-2"></div>';
    });

    return formattedLines.join('');
  };

  const handleSpeakText = () => {
    if (onSpeakText) {
      onSpeakText(message.content);
    }
  };

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-app-bg border border-app-border/50 text-app-text rounded-xl rounded-tr-none px-4 py-2.5 max-w-xs lg:max-w-md text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-app-bg rounded-lg flex items-center justify-center flex-shrink-0 border border-app-border/50">
        <Bot className="w-4 h-4 text-app-text" />
      </div>
      <div className="bg-app-surface/30 border border-app-border/20 rounded-xl rounded-tl-none px-4 py-3 flex-1 space-y-3">
        <div
          className="text-app-text-muted leading-relaxed text-sm"
          dangerouslySetInnerHTML={{ __html: formatAIResponse(message.content) }}
        />
        <div className="flex items-center justify-between pt-3 border-t border-app-border/20">
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 bg-app-bg hover:bg-app-bg/80 text-app-text border border-app-border/30 rounded-lg transition-all font-medium">
              Create Task
            </button>
            <button className="text-xs px-3 py-1.5 bg-app-bg hover:bg-app-bg/80 text-app-text border border-app-border/30 rounded-lg transition-all font-medium">
              Set Reminder
            </button>
            <button className="text-xs px-3 py-1.5 bg-app-bg hover:bg-app-bg/80 text-app-text border border-app-border/30 rounded-lg transition-all font-medium">
              Details
            </button>
          </div>
          <button
            onClick={handleSpeakText}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              isSpeaking
                ? 'bg-app-bg border border-app-border/50 text-app-text'
                : 'bg-app-bg/60 border border-app-border/30 text-app-text-muted hover:bg-app-bg hover:border-app-border/50'
            }`}
            title={isSpeaking ? 'Stop speaking' : 'Listen to response'}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}