"use client";

import { motion } from 'framer-motion';
import { Brain, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../common';
import React from 'react';

interface AISuggestionsPanelProps {
  aiSuggestions: string[];
  currentSuggestionIndex: number;
  isGeneratingSuggestions: boolean;
  onGenerate: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectSuggestion: (s: string) => void;
}

export default function AISuggestionsPanel({ aiSuggestions, currentSuggestionIndex, isGeneratingSuggestions, onGenerate, onPrev, onNext, onSelectSuggestion }: AISuggestionsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="border border-app-border rounded-xl p-4 sm:p-6 bg-app-surface/80"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-app-bg/70 border border-app-border/60">
          <Brain className="w-5 h-5 text-app-text" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-app-text">AI Goal Suggestions</h3>
          <p className="text-app-text-muted text-sm">Smart recommendations based on your progress</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {aiSuggestions.length === 0 ? (
          <div className="text-center py-10 rounded-lg border border-app-border/70 bg-app-bg/70">
            <Brain className="w-10 h-10 mx-auto mb-4 text-app-text-muted" />
            <p className="text-app-text-muted text-sm mb-4">Ready to get personalized goal suggestions?</p>
            <Button
              onClick={onGenerate}
              disabled={isGeneratingSuggestions}
              className="mx-auto px-6 py-2"
            >
              {isGeneratingSuggestions ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate AI Suggestions
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="relative">
            <motion.div
              key={currentSuggestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="border border-app-border/70 rounded-lg p-4 bg-app-bg/80"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-app-text text-base leading-relaxed">
                    {aiSuggestions[currentSuggestionIndex]}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            {aiSuggestions.length > 1 && (
              <div className="flex items-center justify-between mt-4 gap-2">
                <Button
                  onClick={onPrev}
                  variant="ghost"
                  size="sm"
                  className="text-app-text-muted hover:text-app-text hover:bg-app-surface p-2 flex-shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-center overflow-x-auto">
                  {aiSuggestions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => onSelectSuggestion(aiSuggestions[index])}
                      className={`flex-shrink-0 w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSuggestionIndex
                          ? 'bg-app-primary w-4 sm:w-6'
                          : 'bg-app-border hover:bg-app-primary/80'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={onNext}
                  variant="ghost"
                  size="sm"
                  className="text-app-text-muted hover:text-app-text hover:bg-app-surface p-2 flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {aiSuggestions.length > 0 && (
        <Button
          onClick={onGenerate}
          disabled={isGeneratingSuggestions}
          className="w-full mt-2"
        >
          {isGeneratingSuggestions ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-app-text border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Generating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Generate More Suggestions</span>
            </div>
          )}
        </Button>
      )}
    </motion.div>
  );
}
