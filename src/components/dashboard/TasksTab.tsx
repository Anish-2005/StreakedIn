"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Trash2, Plus, Calendar, Flag, Clock, CheckCircle2, Circle, Filter } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Card, Button, Input, Select, Badge, Checkbox } from '../common';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
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
      await addDoc(collection(db, 'tasks'), {
        title: newTaskTitle.trim(),
        completed: false,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        userId: user.uid,
        createdAt: new Date()
      });
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="text-white placeholder-slate-400"
            />
          </div>

          <Select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="bg-slate-700/50 border-slate-600"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </Select>

          <Input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="bg-slate-700/50 border-slate-600"
          />
        </div>

        <div className="flex justify-end mt-4">
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
    </motion.div>
  );
}