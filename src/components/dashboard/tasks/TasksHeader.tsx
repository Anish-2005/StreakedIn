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
          className="text-3xl font-bold text-white mb-2"
        >
          Task Manager
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-300"
        >
          Organize, prioritize, and conquer your tasks
        </motion.p>
      </div>

      {/* Task Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-2 text-center">
          <div className="text-lg font-semibold text-white">{taskStats.total}</div>
          <div className="text-xs text-slate-400">Total</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-center">
          <div className="text-lg font-semibold text-blue-400">{taskStats.pending}</div>
          <div className="text-xs text-slate-400">Pending</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-center">
          <div className="text-lg font-semibold text-green-400">{taskStats.completed}</div>
          <div className="text-xs text-slate-400">Done</div>
        </div>
        {taskStats.overdue > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-center">
            <div className="text-lg font-semibold text-red-400">{taskStats.overdue}</div>
            <div className="text-xs text-slate-400">Overdue</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}