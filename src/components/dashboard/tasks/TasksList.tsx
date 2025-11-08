"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import { Button } from '../../common';
import TaskItem from './TaskItem';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
  createdAt?: string;
}

interface TasksListProps {
  tasks: Task[];
  filter: 'all' | 'pending' | 'completed';
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority: string) => string;
  formatDueDate: (dueDate: string) => { text: string; urgent: boolean } | null;
}

export default function TasksList({
  tasks,
  filter,
  onToggle,
  onEdit,
  onDelete,
  getPriorityColor,
  formatDueDate
}: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="text-center py-16 bg-gradient-to-br from-slate-800/40 to-slate-700/40 backdrop-blur-md border border-slate-600/30 rounded-xl"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {filter === 'all' ? 'No tasks yet' :
             filter === 'pending' ? 'No pending tasks' :
             'No completed tasks'}
          </h3>
          <p className="text-slate-400 mb-6">
            {filter === 'all' ? 'Create your first task to get started on your productivity journey!' :
             filter === 'pending' ? 'All caught up! Great job staying on top of things.' :
             'Complete some tasks to see them here.'}
          </p>
          {filter === 'all' && (
            <Button
              onClick={() => {
                const input = document.querySelector('input[placeholder="What needs to be done?"]') as HTMLInputElement;
                input?.focus();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Create Your First Task
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            getPriorityColor={getPriorityColor}
            formatDueDate={formatDueDate}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}