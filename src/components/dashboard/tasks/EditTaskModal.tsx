"use client";
import { motion } from 'framer-motion';
import { Edit, X } from 'lucide-react';
import { Button, Input, Select } from '../../common';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
  createdAt?: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  editTitle: string;
  editDescription: string;
  editPriority: 'low' | 'medium' | 'high';
  editDueDate: string;
  onClose: () => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onPriorityChange: (priority: 'low' | 'medium' | 'high') => void;
  onDueDateChange: (dueDate: string) => void;
  onSave: () => void;
}

export default function EditTaskModal({
  isOpen,
  editingTask,
  editTitle,
  editDescription,
  editPriority,
  editDueDate,
  onClose,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onDueDateChange,
  onSave
}: EditTaskModalProps) {
  if (!isOpen || !editingTask) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-xl p-4 sm:p-6 w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Edit className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Edit Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Task Title</label>
            <Input
              placeholder="What needs to be done?"
              value={editTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSave()}
              className="text-white placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
            <textarea
              placeholder="Add more details about this task..."
              value={editDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-600/60 bg-slate-800/60 text-white placeholder-slate-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none text-base"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
              <Select
                value={editPriority}
                onChange={(value) => onPriorityChange(value as 'low' | 'medium' | 'high')}
                className="bg-slate-700/50 border-slate-600"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
              <Input
                type="date"
                value={editDueDate}
                onChange={(e) => onDueDateChange(e.target.value)}
                className="bg-slate-700/50 border-slate-600"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-4 py-2 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!editTitle.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 w-full sm:w-auto"
          >
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Save Changes
            </div>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}