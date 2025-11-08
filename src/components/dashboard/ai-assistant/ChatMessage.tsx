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
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

      // Handle numbered lists (1. Text)
      if (/^\d+\.\s/.test(line)) {
        return `<div class="flex items-start space-x-2 mb-2">
          <span class="text-blue-400 font-medium text-sm flex-shrink-0 mt-1">${line.match(/^\d+/)?.[0]}.</span>
          <span class="text-slate-300 leading-relaxed">${line.replace(/^\d+\.\s*/, '')}</span>
        </div>`;
      }

      // Handle regular paragraphs
      if (line.trim()) {
        return `<p class="text-slate-300 leading-relaxed mb-3">${line}</p>`;
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-xs lg:max-w-md">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-3">
      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-slate-900/20 rounded-2xl rounded-bl-none px-4 py-3 flex-1">
        <div
          className="text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatAIResponse(message.content) }}
        />
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/30">
          <div className="flex space-x-3">
            <button className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-full transition-colors font-medium">
              Create Tasks
            </button>
            <button className="text-xs px-3 py-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-full transition-colors font-medium">
              Set Reminders
            </button>
            <button className="text-xs px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-full transition-colors font-medium">
              Analyze Further
            </button>
          </div>
          <button
            onClick={handleSpeakText}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSpeaking
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
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