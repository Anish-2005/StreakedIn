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
    <div className="border border-app-border rounded-xl p-4 sm:p-5 bg-app-surface/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="p-2 rounded-lg flex-shrink-0 bg-app-bg/70 border border-app-border/60 text-app-text">
            {reminder.type === 'email' ? <Mail className="w-4 h-4" /> :
             reminder.type === 'browser' ? <Smartphone className="w-4 h-4" /> :
             <Bell className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-app-text">{reminder.title}</h3>
            {reminder.description && (
              <p className="text-sm text-app-text-muted mt-1">{reminder.description}</p>
            )}
            {reminder.nextTrigger && (
              <p className="text-xs text-app-text-muted mt-1">
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
            <div className="w-11 h-6 bg-app-bg rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(reminder)}
              className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4 text-app-text-muted" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-app-text-muted">
        <span>Frequency: {reminder.frequency}</span>
        <span>Type: {reminder.type}</span>
      </div>
    </div>
  );
}