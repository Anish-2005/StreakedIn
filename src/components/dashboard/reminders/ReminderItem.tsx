"use client";
import { Mail, Smartphone, Bell, Edit2, Trash2 } from 'lucide-react';
import type { Reminder } from '../../../lib/services';

interface ReminderItemProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminderId: string) => void;
  onToggle: (reminder: Reminder) => void;
}

export default function ReminderItem({ reminder, onEdit, onDelete, onToggle }: ReminderItemProps) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg flex-shrink-0 ${
            reminder.type === 'email' ? 'bg-blue-900/30 text-blue-300' :
            reminder.type === 'browser' ? 'bg-green-900/30 text-green-300' :
            'bg-purple-900/30 text-purple-300'
          }`}>
            {reminder.type === 'email' ? <Mail className="w-4 h-4" /> :
             reminder.type === 'browser' ? <Smartphone className="w-4 h-4" /> :
             <Bell className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white">{reminder.title}</h3>
            {reminder.description && (
              <p className="text-sm text-slate-400 mt-1">{reminder.description}</p>
            )}
            {reminder.nextTrigger && (
              <p className="text-sm text-slate-500 mt-1">
                Next: {reminder.nextTrigger.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={reminder.enabled}
              onChange={() => onToggle(reminder)}
            />
            <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
          </label>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(reminder)}
              className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={() => onDelete(reminder.id)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-slate-300">
        <span>Frequency: {reminder.frequency}</span>
        <span>Type: {reminder.type}</span>
      </div>
    </div>
  );
}