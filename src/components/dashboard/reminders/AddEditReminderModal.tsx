"use client";
import type { Reminder } from '../../../lib/services';

interface AddEditReminderModalProps {
  isOpen: boolean;
  editingReminder: Reminder | null;
  formData: {
    title: string;
    description: string;
    type: 'email' | 'browser' | 'sms';
    frequency: 'daily' | 'weekly' | 'monthly' | 'once';
    enabled: boolean;
  };
  onClose: () => void;
  onFormChange: (data: {
    title: string;
    description: string;
    type: 'email' | 'browser' | 'sms';
    frequency: 'daily' | 'weekly' | 'monthly' | 'once';
    enabled: boolean;
  }) => void;
  onSave: () => void;
}

export default function AddEditReminderModal({
  isOpen,
  editingReminder,
  formData,
  onClose,
  onFormChange,
  onSave
}: AddEditReminderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Review weekly goals"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional details or context for this reminder"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => onFormChange({ ...formData, type: e.target.value as 'email' | 'browser' | 'sms' })}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="browser">Browser</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => onFormChange({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'once' })}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => onFormChange({ ...formData, enabled: e.target.checked })}
              className="rounded border-slate-600 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="enabled" className="text-sm text-slate-300">Enable this reminder</label>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!formData.title.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {editingReminder ? 'Save Changes' : 'Create Reminder'}
          </button>
        </div>
      </div>
    </div>
  );
}