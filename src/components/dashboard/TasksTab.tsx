"use client";
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Card, Button, Input, Select, Badge, Checkbox } from '../common';
import {
  TasksHeader,
  TasksFilters,
  AddTaskForm,
  TasksList,
  AIPromptModal,
  AIConfirmationModal,
  EditTaskModal
} from '../../components/dashboard/tasks';
import { TasksService } from '../../lib/services';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
  createdAt?: string;
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
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
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
  const [editDescription, setEditDescription] = useState('');
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

      // Only include description if it has a value
      if (newTaskDescription.trim()) {
        taskData.description = newTaskDescription.trim();
      }

      // Only include dueDate if it has a value
      if (newTaskDueDate.trim()) {
        taskData.dueDate = newTaskDueDate;
      }

      await addDoc(collection(db, 'tasks'), taskData);
      setNewTaskTitle('');
      setNewTaskDescription('');
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
    setEditDescription(task.description || '');
    setEditPriority((task.priority as 'low' | 'medium' | 'high') || 'medium');
    setEditDueDate(task.dueDate || '');
    setShowEditModal(true);
  };

  const cancelEditingTask = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
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

      // Only include description if it has a value
      if (editDescription.trim()) {
        updateData.description = editDescription.trim();
      } else {
        // If description is being cleared, we need to explicitly set it to null or delete the field
        updateData.description = null;
      }

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
      <TasksHeader taskStats={taskStats} />

      {/* Filters and Controls */}
      <TasksFilters
        filter={filter}
        sortBy={sortBy}
        onFilterChange={setFilter}
        onSortChange={setSortBy}
      />

      {/* Add Task Form */}
      <AddTaskForm
        newTaskTitle={newTaskTitle}
        newTaskDescription={newTaskDescription}
        newTaskPriority={newTaskPriority}
        newTaskDueDate={newTaskDueDate}
        isAddingTask={isAddingTask}
        onTitleChange={setNewTaskTitle}
        onDescriptionChange={setNewTaskDescription}
        onPriorityChange={setNewTaskPriority}
        onDueDateChange={setNewTaskDueDate}
        onAddTask={addTask}
        onOpenAIPrompt={() => setShowAIPrompt(true)}
      />

      {/* Tasks List */}
      <TasksList
        tasks={filteredAndSortedTasks}
        filter={filter}
        onToggle={toggleTask}
        onEdit={startEditingTask}
        onDelete={deleteTask}
        getPriorityColor={getPriorityColor}
        formatDueDate={formatDueDate}
      />

      {/* AI Prompt Modal */}
      <AIPromptModal
        isOpen={showAIPrompt}
        aiPrompt={aiPrompt}
        isGeneratingAI={isGeneratingAI}
        onClose={() => setShowAIPrompt(false)}
        onPromptChange={setAiPrompt}
        onSubmit={handleAIPrompt}
      />

      {/* AI Confirmation Modal */}
      <AIConfirmationModal
        isOpen={showAIConfirmation}
        aiGeneratedTask={aiGeneratedTask}
        onClose={() => {
          setShowAIConfirmation(false);
          setAiGeneratedTask(null);
        }}
        onConfirm={confirmAICreatedTask}
        getPriorityColor={getPriorityColor}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        editingTask={editingTask}
        editTitle={editTitle}
        editDescription={editDescription}
        editPriority={editPriority}
        editDueDate={editDueDate}
        onClose={cancelEditingTask}
        onTitleChange={setEditTitle}
        onDescriptionChange={setEditDescription}
        onPriorityChange={setEditPriority}
        onDueDateChange={setEditDueDate}
        onSave={saveEditedTask}
      />
    </motion.div>
  );
}