"use client";

import { motion } from 'framer-motion';
import { Brain, Target, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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
      className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-md border border-slate-600/50 rounded-xl p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
          <Brain className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Goal Suggestions</h3>
          <p className="text-slate-300 text-sm">Smart recommendations based on your progress</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {aiSuggestions.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700/40">
            <Brain className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400 text-sm mb-4">Ready to get personalized goal suggestions?</p>
            <Button
              onClick={onGenerate}
              disabled={isGeneratingSuggestions}
              className="mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2"
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
              className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-xl p-6 hover:border-slate-500/60 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-white text-base leading-relaxed">
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
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 flex-shrink-0"
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
                          ? 'bg-blue-500 w-4 sm:w-6'
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={onNext}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50 p-2 flex-shrink-0"
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
          className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 transition-all duration-200"
        >
          {isGeneratingSuggestions ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
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