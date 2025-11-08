"use client";
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';

interface RemindersHeaderProps {
  onOpenAIPrompt: () => void;
  onAddReminder: () => void;
}

export default function RemindersHeader({ onOpenAIPrompt, onAddReminder }: RemindersHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Reminders & Notifications</h1>
        <p className="text-slate-300">Set up automated reminders to stay on track with your goals and tasks</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
        <button
          onClick={onOpenAIPrompt}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition-colors w-full sm:w-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Create</span>
        </button>
        <button
          onClick={onAddReminder}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Manual Reminder</span>
        </button>
      </div>
    </motion.div>
  );
}