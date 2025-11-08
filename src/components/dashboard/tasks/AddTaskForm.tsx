"use client";
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { Button, Input, Select } from '../../common';

interface AddTaskFormProps {
  newTaskTitle: string;
  newTaskDescription: string;
  newTaskPriority: string;
  newTaskDueDate: string;
  isAddingTask: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onPriorityChange: (priority: string) => void;
  onDueDateChange: (dueDate: string) => void;
  onAddTask: () => void;
  onOpenAIPrompt: () => void;
}

export default function AddTaskForm({
  newTaskTitle,
  newTaskDescription,
  newTaskPriority,
  newTaskDueDate,
  isAddingTask,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onDueDateChange,
  onAddTask,
  onOpenAIPrompt
}: AddTaskFormProps) {
  return (
    <motion.div
      layout
      className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-md border border-slate-600/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Plus className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Add New Task</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Task Title</label>
          <Input
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAddTask()}
            className="text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description (Optional)</label>
          <textarea
            placeholder="Add more details about this task..."
            value={newTaskDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full px-4 py-3 border border-slate-600/60 bg-slate-800/60 text-white placeholder-slate-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none text-base"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
            <Select
              value={newTaskPriority}
              onChange={(value) => onPriorityChange(value)}
              className="bg-slate-700/50 border-slate-600"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Due Date (Optional)</label>
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
        <Button
          onClick={onOpenAIPrompt}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 w-full sm:w-auto"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Create
          </div>
        </Button>
        <Button
          onClick={onAddTask}
          disabled={!newTaskTitle.trim() || isAddingTask}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 w-full sm:w-auto"
        >
          {isAddingTask ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
}