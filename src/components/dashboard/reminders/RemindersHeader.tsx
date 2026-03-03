"use client";
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '../../common';

interface RemindersHeaderProps {
  onOpenAIPrompt: () => void;
  onAddReminder: () => void;
}

export default function RemindersHeader({ onOpenAIPrompt, onAddReminder }: RemindersHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-semibold text-app-text">Reminders & Notifications</h1>
        <p className="text-app-text-muted">
          Set up automated reminders to stay on track with your goals and tasks.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full sm:w-auto flex items-center gap-2"
          onClick={onOpenAIPrompt}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Create</span>
        </Button>
        <Button
          size="sm"
          className="w-full sm:w-auto flex items-center gap-2"
          onClick={onAddReminder}
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </Button>
      </div>
    </motion.div>
  );
}