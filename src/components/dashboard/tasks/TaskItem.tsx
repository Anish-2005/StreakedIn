"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Flag, Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
  createdAt?: string;
}

interface TaskItemProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority: string) => string;
  formatDueDate: (dueDate: string) => { text: string; urgent: boolean } | null;
}

export default function TaskItem({
  task,
  index,
  onToggle,
  onEdit,
  onDelete,
  getPriorityColor,
  formatDueDate
}: TaskItemProps) {
  const dueDateInfo = formatDueDate(task.dueDate || '');
  const isOverdue = dueDateInfo?.urgent && dueDateInfo.text.includes('Overdue');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
        task.completed
          ? 'bg-green-500/5 border-green-500/20'
          : isOverdue
          ? 'bg-red-500/5 border-red-500/20'
          : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600/70'
      }`}
    >
      {/* Priority indicator stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        task.priority === 'high' ? 'bg-red-500' :
        task.priority === 'medium' ? 'bg-yellow-500' :
        'bg-green-500'
      }`} />

      <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:p-6">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 transition-all ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-slate-500 hover:border-slate-400'
          }`}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <CheckCircle2 className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
          {!task.completed && <Circle className="w-3 h-3" />}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0 mb-3 sm:mb-0">
          <motion.h3
            className={`text-lg font-medium mb-1 transition-all ${
              task.completed
                ? 'text-slate-400 line-through'
                : 'text-white group-hover:text-blue-300'
            }`}
            animate={{ opacity: task.completed ? 0.6 : 1 }}
          >
            {task.title}
          </motion.h3>

          {task.description && task.description.trim() && (
            <p className={`text-sm mb-2 transition-all ${
              task.completed
                ? 'text-slate-500 line-through'
                : 'text-slate-300'
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
            {/* Created Date */}
            {task.createdAt && (
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>Added {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            )}

            {/* Due Date */}
            {dueDateInfo && (
              <div className={`flex items-center gap-1 ${
                dueDateInfo.urgent ? 'text-red-400' : 'text-slate-400'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{dueDateInfo.text}</span>
              </div>
            )}

            {/* Priority Badge */}
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority || 'medium')}`}>
              <Flag className="w-3 h-3 inline mr-1" />
              {task.priority}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Completion Animation Overlay */}
      <AnimatePresence>
        {task.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute inset-0 bg-green-500/10 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}