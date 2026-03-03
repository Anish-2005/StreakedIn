"use client";

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function AIAssistantHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
    >
      <div className="bg-app-surface/50 border border-app-border/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-app-bg rounded-xl flex items-center justify-center flex-shrink-0 border border-app-border/50">
            <Brain className="w-6 h-6 text-app-text" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-app-text mb-1">AI Assistant</h1>
            <p className="text-app-text-muted text-base leading-relaxed">
              Leverage intelligent insights to optimize your productivity and achieve your goals more efficiently
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}