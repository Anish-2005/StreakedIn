"use client";

import { Bot } from 'lucide-react';

export default function LoadingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-app-bg rounded-lg flex items-center justify-center flex-shrink-0 border border-app-border/50">
        <Bot className="w-4 h-4 text-app-text" />
      </div>
      <div className="bg-app-surface/30 border border-app-border/20 rounded-xl rounded-tl-none px-4 py-3 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-app-text-muted rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-app-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-app-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}