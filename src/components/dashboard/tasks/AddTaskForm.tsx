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
      className="border border-app-border rounded-xl p-5 bg-app-surface/80"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-app-bg/70 border border-app-border/60">
          <Plus className="w-5 h-5 text-app-text" />
        </div>
        <h3 className="text-lg font-semibold text-app-text">Add New Task</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-app-text-muted mb-2">Task Title</label>
          <Input
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAddTask()}
            className="text-app-text placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-app-text-muted mb-2">Description (Optional)</label>
          <textarea
            placeholder="Add more details about this task..."
            value={newTaskDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full px-4 py-3 border border-app-border bg-app-bg text-app-text placeholder-app-text-muted rounded-lg transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed resize-none text-sm"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-app-text-muted mb-2">Priority</label>
              <Select
              value={newTaskPriority}
              onChange={(value) => onPriorityChange(value)}
              className="bg-slate-700 light:bg-slate-100/50 border-slate-600 light:border-slate-300"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-app-text-muted mb-2">Due Date (Optional)</label>
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              className="bg-slate-700 light:bg-slate-100/50 border-slate-600 light:border-slate-300 text-app-text"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
        <Button
          onClick={onOpenAIPrompt}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Create
          </div>
        </Button>
        <Button
          onClick={onAddTask}
          disabled={!newTaskTitle.trim() || isAddingTask}
          className="w-full sm:w-auto"
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