"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Trash2, Plus, Calendar, Flag, Clock, CheckCircle2, Circle, Filter, Sparkles, X, Edit } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Card, Button, Input, Select, Badge, Checkbox } from '../common';
import { TasksService } from '../../lib/services';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
}

interface AIGeneratedTask {
  title?: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  completed?: boolean;
}

interface TasksTabProps {
  // No props needed for this component
}

export default function TasksTab({}: TasksTabProps) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<string>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'dueDate'>('created');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // AI-related state
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedTask, setAiGeneratedTask] = useState<AIGeneratedTask | null>(null);
  const [showAIConfirmation, setShowAIConfirmation] = useState(false);

  // Edit-related state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply filter
    switch (filter) {
      case 'pending':
        filtered = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      default:
        filtered = tasks;
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 2) -
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 2);
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'created':
        default:
          return 0; // Already sorted by createdAt from Firebase
      }
    });
  }, [tasks, filter, sortBy]);

  // Task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(task =>
      task.dueDate &&
      !task.completed &&
      new Date(task.dueDate) < new Date()
    ).length;

    return { total, completed, pending, overdue };
  }, [tasks]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({
          id: doc.id,
          ...doc.data()
        } as Task);
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (!newTaskTitle.trim() || !user || isAddingTask) return;

    setIsAddingTask(true);
    try {
      const taskData: any = {
        title: newTaskTitle.trim(),
        completed: false,
        priority: newTaskPriority,
        userId: user.uid,
        createdAt: new Date()
      };

      // Only include dueDate if it has a value
      if (newTaskDueDate.trim()) {
        taskData.dueDate = newTaskDueDate;
      }

      await addDoc(collection(db, 'tasks'), taskData);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsAddingTask(false);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateDoc(taskRef, {
          completed: !task.completed
        });
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditPriority((task.priority as 'low' | 'medium' | 'high') || 'medium');
    setEditDueDate(task.dueDate || '');
    setShowEditModal(true);
  };

  const cancelEditingTask = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditPriority('medium');
    setEditDueDate('');
    setShowEditModal(false);
  };

  const saveEditedTask = async () => {
    if (!editingTask || !editTitle.trim()) return;

    try {
      const updateData: any = {
        title: editTitle.trim(),
        priority: editPriority,
        updatedAt: new Date()
      };

      // Only include dueDate if it has a value
      if (editDueDate.trim()) {
        updateData.dueDate = editDueDate;
      } else {
        // If dueDate is being cleared, we need to explicitly set it to null or delete the field
        updateData.dueDate = null;
      }

      const taskRef = doc(db, 'tasks', editingTask.id);
      await updateDoc(taskRef, updateData);

      cancelEditingTask();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAIPrompt = async () => {
    if (!aiPrompt.trim() || !user || isGeneratingAI) return;

    setIsGeneratingAI(true);
    try {
      const generatedTask = await TasksService.generateTaskFromPrompt(user.uid, aiPrompt.trim());

      if (generatedTask) {
        setAiGeneratedTask(generatedTask);
        setShowAIPrompt(false);
        setShowAIConfirmation(true);
        setAiPrompt('');
      } else {
        // Fallback: create a basic task from the prompt
        const fallbackTask = TasksService.generateTaskFromPromptFallback(aiPrompt.trim());
        setAiGeneratedTask(fallbackTask);
        setShowAIPrompt(false);
        setShowAIConfirmation(true);
        setAiPrompt('');
      }
    } catch (error) {
      console.error('Error generating AI task:', error);
      // Fallback: create a basic task from the prompt
      const fallbackTask = TasksService.generateTaskFromPromptFallback(aiPrompt.trim());
      setAiGeneratedTask(fallbackTask);
      setShowAIPrompt(false);
      setShowAIConfirmation(true);
      setAiPrompt('');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const confirmAICreatedTask = async () => {
    if (!aiGeneratedTask || !user) return;

    try {
      const taskData: any = {
        title: aiGeneratedTask.title || 'New Task',
        description: aiGeneratedTask.description || undefined,
        completed: false,
        priority: aiGeneratedTask.priority || 'medium',
        userId: user.uid,
        createdAt: new Date()
      };

      // Only include dueDate if it has a value
      if (aiGeneratedTask.dueDate) {
        taskData.dueDate = aiGeneratedTask.dueDate;
      }

      await addDoc(collection(db, 'tasks'), taskData);
      setShowAIConfirmation(false);
      setAiGeneratedTask(null);
    } catch (error) {
      console.error('Error adding AI-generated task:', error);
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const formatDueDate = (dueDate: string) => {
    if (!dueDate) return null;

    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    const isOverdue = date < today && date.toDateString() !== today.toDateString();

    if (isToday) return { text: 'Today', urgent: true };
    if (isTomorrow) return { text: 'Tomorrow', urgent: false };
    if (isOverdue) return { text: `Overdue (${date.toLocaleDateString()})`, urgent: true };

    return { text: date.toLocaleDateString(), urgent: false };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Task Manager</h1>
          <p className="text-slate-300">Organize, prioritize, and conquer your tasks</p>
        </div>

        {/* Task Statistics */}
        <div className="flex items-center gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex gap-2">
            {(['all', 'pending', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Sort by:</span>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-32"
          >
            <option value="created">Created</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </Select>
        </div>
      </div>

      {/* Add Task Form */}
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
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="text-white placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
              <Select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
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
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={() => setShowAIPrompt(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Create
            </div>
          </Button>
          <Button
            onClick={addTask}
            disabled={!newTaskTitle.trim() || isAddingTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
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

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedTasks.length === 0 ? (
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
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Task
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            filteredAndSortedTasks.map((task, index) => {
              const dueDateInfo = formatDueDate(task.dueDate || '');
              const isOverdue = dueDateInfo?.urgent && dueDateInfo.text.includes('Overdue');

              return (
                <motion.div
                  key={task.id}
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

                  <div className="flex items-center p-6">
                    {/* Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${
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
                    <div className="flex-1 min-w-0">
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

                      <div className="flex items-center gap-4 text-sm">
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
                    <div className="flex items-center gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => startEditingTask(task)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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
            })
          )}
        </AnimatePresence>
      </div>

      {/* AI Prompt Modal */}
      <AnimatePresence>
        {showAIPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAIPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Task Creation</h3>
                </div>
                <button
                  onClick={() => setShowAIPrompt(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-slate-300 mb-4">
                Describe the task you want to create. Our AI will generate a well-structured task with appropriate priority and details.
              </p>

              <textarea
                placeholder="e.g., Complete the quarterly financial report by Friday"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAIPrompt()}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 mb-4"
                rows={3}
              />

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowAIPrompt(false)}
                  variant="secondary"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAIPrompt}
                  disabled={!aiPrompt.trim() || isGeneratingAI}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2"
                >
                  {isGeneratingAI ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate Task
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Confirmation Modal */}
      <AnimatePresence>
        {showAIConfirmation && aiGeneratedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAIConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Generated Task</h3>
                </div>
                <button
                  onClick={() => setShowAIConfirmation(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                <h4 className="text-white font-medium mb-2">{aiGeneratedTask.title}</h4>
                {aiGeneratedTask.description && aiGeneratedTask.description.trim() && (
                  <p className="text-slate-300 text-sm mb-3">{aiGeneratedTask.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(aiGeneratedTask.priority || 'medium')}`}>
                    <Flag className="w-3 h-3 inline mr-1" />
                    {aiGeneratedTask.priority || 'medium'} priority
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-6">
                This task was generated by AI based on your description. You can add it to your task list or make changes later.
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowAIConfirmation(false);
                    setAiGeneratedTask(null);
                  }}
                  variant="secondary"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAICreatedTask}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Task
                  </div>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {showEditModal && editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => cancelEditingTask()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 w-full max-w-lg"
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
                  onClick={() => cancelEditingTask()}
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
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEditedTask()}
                    className="text-white placeholder-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                    <Select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
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
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="bg-slate-700/50 border-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => cancelEditingTask()}
                  variant="secondary"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEditedTask}
                  disabled={!editTitle.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Save Changes
                  </div>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}