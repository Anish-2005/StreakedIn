"use client";

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function AIAssistantHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Productivity Assistant</h1>
            <p className="text-slate-300">Get personalized recommendations and automate your productivity tracking</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}