"use client";
import { motion } from 'framer-motion';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

interface TasksHeaderProps {
  taskStats: TaskStats;
}

export default function TasksHeader({ taskStats }: TasksHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-semibold text-app-text mb-1"
        >
          Task Manager
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-app-text-muted"
        >
          Organize, prioritize, and conquer your tasks
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <div className="border border-app-border rounded-lg px-3 py-2 text-center bg-app-surface/80">
          <div className="text-base font-semibold text-app-text">{taskStats.total}</div>
          <div className="text-xs text-app-text-muted">Total</div>
        </div>
        <div className="border border-app-border rounded-lg px-3 py-2 text-center bg-app-surface/80">
          <div className="text-base font-semibold text-app-text">{taskStats.pending}</div>
          <div className="text-xs text-app-text-muted">Pending</div>
        </div>
        <div className="border border-app-border rounded-lg px-3 py-2 text-center bg-app-surface/80">
          <div className="text-base font-semibold text-app-text">{taskStats.completed}</div>
          <div className="text-xs text-app-text-muted">Done</div>
        </div>
        {taskStats.overdue > 0 && (
          <div className="border border-app-border rounded-lg px-3 py-2 text-center bg-app-surface/80">
            <div className="text-base font-semibold text-red-400">{taskStats.overdue}</div>
            <div className="text-xs text-app-text-muted">Overdue</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}