"use client";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RemindersService } from '../../lib/services';
import type { Reminder } from '../../lib/services';
import {
  RemindersHeader,
  RemindersList,
  NotificationSettings,
  AIPromptModal,
  AIConfirmationModal,
  AddEditReminderModal
} from '../../components/dashboard/reminders';

interface RemindersTabProps {
  // No props needed for this component
}

export default function RemindersTab({}: RemindersTabProps) {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Prompt functionality
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [pendingReminder, setPendingReminder] = useState<Partial<Reminder> | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Add/Edit reminder modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'browser' as 'email' | 'browser' | 'sms',
    frequency: 'once' as 'daily' | 'weekly' | 'monthly' | 'once',
    enabled: true,
  });

  // Load reminders from Firebase
  useEffect(() => {
    if (!user) return;

    const unsubscribe = RemindersService.subscribeToReminders(user.uid, (remindersData: Reminder[]) => {
      setReminders(remindersData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleAddReminder = () => {
    setEditingReminder(null);
    setFormData({
      title: '',
      description: '',
      type: 'browser',
      frequency: 'once',
      enabled: true,
    });
    setShowAddModal(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      type: reminder.type,
      frequency: reminder.frequency,
      enabled: reminder.enabled,
    });
    setShowAddModal(true);
  };

  const handleSaveReminder = async () => {
    if (!user || !formData.title.trim()) return;

    try {
      if (editingReminder) {
        await RemindersService.updateReminder(editingReminder.id, formData);
      } else {
        await RemindersService.createReminder(user.uid, formData);
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await RemindersService.deleteReminder(reminderId);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleToggleReminder = async (reminder: Reminder) => {
    try {
      await RemindersService.updateReminder(reminder.id, { enabled: !reminder.enabled });
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  // AI Prompt functionality
  const handleAIPrompt = async () => {
    if (!aiPrompt.trim() || !user) return;

    setAiLoading(true);
    try {
      const generatedReminder = await RemindersService.generateReminderFromPrompt(user.uid, aiPrompt);

      if (generatedReminder) {
        setPendingReminder(generatedReminder);
        setShowConfirmation(true);
        setShowAIPrompt(false);
      } else {
        // Enhanced fallback: create a better formatted reminder from the prompt
        const prompt = aiPrompt.trim();
        let title = 'New Reminder';
        const description = `Reminder: ${prompt}`;
        let frequency = 'once';
        let type = 'browser';

        // Try to extract a reasonable title from the prompt
        if (prompt.length <= 50) {
          // Capitalize first letter and clean up
          title = prompt.charAt(0).toUpperCase() + prompt.slice(1);
        } else {
          // Take first sentence or first 30 characters
          const firstSentence = prompt.split('.')[0] || prompt.split('!')[0] || prompt.split('?')[0];
          title = firstSentence.length <= 40 ? firstSentence : prompt.substring(0, 37) + '...';
          title = title.charAt(0).toUpperCase() + title.slice(1);
        }

        // Try to determine frequency from keywords
        if (prompt.toLowerCase().includes('daily') || prompt.toLowerCase().includes('every day')) {
          frequency = 'daily';
        } else if (prompt.toLowerCase().includes('weekly') || prompt.toLowerCase().includes('every week')) {
          frequency = 'weekly';
        } else if (prompt.toLowerCase().includes('monthly') || prompt.toLowerCase().includes('every month')) {
          frequency = 'monthly';
        }

        // Try to determine type from keywords
        if (prompt.toLowerCase().includes('email') || prompt.toLowerCase().includes('send')) {
          type = 'email';
        } else if (prompt.toLowerCase().includes('text') || prompt.toLowerCase().includes('sms')) {
          type = 'sms';
        }

        setPendingReminder({
          title,
          description,
          type: type as 'email' | 'browser' | 'sms',
          frequency: frequency as 'daily' | 'weekly' | 'monthly' | 'once',
          enabled: true,
        });
        setShowConfirmation(true);
        setShowAIPrompt(false);
      }
    } catch (error) {
      console.error('Error generating reminder from AI:', error);
      // Enhanced fallback for errors
      const prompt = aiPrompt.trim();
      let title = 'New Reminder';
      const description = `Reminder: ${prompt}`;

      if (prompt.length <= 50) {
        title = prompt.charAt(0).toUpperCase() + prompt.slice(1);
      } else {
        const firstSentence = prompt.split('.')[0] || prompt.split('!')[0] || prompt.split('?')[0];
        title = firstSentence.length <= 40 ? firstSentence : prompt.substring(0, 37) + '...';
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }

      setPendingReminder({
        title,
        description,
        type: 'browser',
        frequency: 'once',
        enabled: true,
      });
      setShowConfirmation(true);
      setShowAIPrompt(false);
    } finally {
      setAiLoading(false);
    }
  };

  const handleConfirmReminder = async () => {
    if (!pendingReminder || !user) return;

    try {
      await RemindersService.createReminder(user.uid, pendingReminder as Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
      setShowConfirmation(false);
      setPendingReminder(null);
      setAiPrompt('');
    } catch (error) {
      console.error('Error saving AI-generated reminder:', error);
    }
  };

  const handleRejectReminder = () => {
    setShowConfirmation(false);
    setPendingReminder(null);
    setAiPrompt('');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading reminders...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Reminders Header */}
      <RemindersHeader
        onOpenAIPrompt={() => setShowAIPrompt(true)}
        onAddReminder={handleAddReminder}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reminders List */}
        <div className="lg:col-span-2 space-y-4">
          <RemindersList
            reminders={reminders}
            onEdit={handleEditReminder}
            onDelete={handleDeleteReminder}
            onToggle={handleToggleReminder}
          />
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <NotificationSettings />
        </div>
      </div>

      {/* AI Prompt Modal */}
      <AIPromptModal
        isOpen={showAIPrompt}
        aiPrompt={aiPrompt}
        aiLoading={aiLoading}
        onClose={() => setShowAIPrompt(false)}
        onPromptChange={setAiPrompt}
        onSubmit={handleAIPrompt}
      />

      {/* Confirmation Modal */}
      <AIConfirmationModal
        isOpen={showConfirmation}
        pendingReminder={pendingReminder}
        onConfirm={handleConfirmReminder}
        onReject={handleRejectReminder}
      />

      {/* Add/Edit Reminder Modal */}
      <AddEditReminderModal
        isOpen={showAddModal}
        editingReminder={editingReminder}
        formData={formData}
        onClose={() => setShowAddModal(false)}
        onFormChange={setFormData}
        onSave={handleSaveReminder}
      />
    </motion.div>
  );
}