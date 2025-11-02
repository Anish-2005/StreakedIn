"use client";
import { motion } from 'framer-motion';
import { CheckSquare, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
}

interface TasksTabProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export default function TasksTab({ tasks, setTasks }: TasksTabProps) {
  const { user } = useAuth();
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<string>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');

  const addTask = async () => {
    if (!newTaskTitle.trim() || !user) return;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Manager</h1>
          <p className="text-slate-300">Create, prioritize and track tasks</p>
        </div>
        <div className="text-sm text-slate-300">{tasks.length} tasks</div>
      </div>

      {/* New Task Form */}
      <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title..."
            className="col-span-2 w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={addTask}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-8 text-center text-slate-400">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tasks yet. Create your first task above!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:border-slate-600/50 transition-colors">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700/50 text-blue-500 focus:ring-blue-500/60"
                />
                <div>
                  <div className={`font-medium text-lg ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </div>
                  <div className="text-sm text-slate-400">
                    {task.dueDate ? `Due ${task.dueDate}` : 'No due date'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.priority === 'high'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : task.priority === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
                  {task.priority}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}