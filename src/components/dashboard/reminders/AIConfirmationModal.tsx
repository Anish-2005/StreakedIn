"use client";
import type { Reminder } from '../../../lib/services';

interface AIConfirmationModalProps {
  isOpen: boolean;
  pendingReminder: Partial<Reminder> | null;
  onConfirm: () => void;
  onReject: () => void;
}

export default function AIConfirmationModal({
  isOpen,
  pendingReminder,
  onConfirm,
  onReject
}: AIConfirmationModalProps) {
  if (!isOpen || !pendingReminder) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 light:bg-white border border-slate-700 light:border-slate-300 rounded-xl p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-app-text mb-4">Confirm AI-Generated Reminder</h3>
        <div className="bg-app-bg rounded-lg p-4 mb-4">
          <h4 className="font-medium text-app-text mb-2">{pendingReminder.title}</h4>
          {pendingReminder.description && (
            <p className="text-app-text-muted text-sm mb-2">{pendingReminder.description}</p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-app-text-muted">
            <span>Type: {pendingReminder.type}</span>
            <span>Frequency: {pendingReminder.frequency}</span>
          </div>
        </div>
        <p className="text-app-text-muted text-sm mb-6">Does this reminder look correct?</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReject}
            className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            No, Try Again
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-green-500 text-app-text rounded-lg hover:bg-green-600 transition-colors"
          >
            Yes, Save Reminder
          </button>
        </div>
      </div>
    </div>
  );
}