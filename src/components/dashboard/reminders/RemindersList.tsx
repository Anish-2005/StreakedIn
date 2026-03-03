"use client";
import { Bell } from 'lucide-react';
import ReminderItem from './ReminderItem';
import type { Reminder } from '../../../lib/services';

interface RemindersListProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminderId: string) => void;
  onToggle: (reminder: Reminder) => void;
}

export default function RemindersList({ reminders, onEdit, onDelete, onToggle }: RemindersListProps) {
  if (reminders.length === 0) {
    return (
      <div className="text-center py-12 border border-app-border rounded-xl bg-app-surface/80">
        <Bell className="w-10 h-10 text-app-text-muted mx-auto mb-4" />
        <p className="text-app-text-muted">No reminders set up yet</p>
        <p className="text-app-text-muted text-sm mt-2">
          Get started by creating your first reminder to stay organized and productive.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <ReminderItem
          key={reminder.id}
          reminder={reminder}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}