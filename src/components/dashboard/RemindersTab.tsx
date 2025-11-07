"use client";
import { motion } from 'framer-motion';
import { Plus, Mail, Smartphone, Bell, MessageCircle, MoreHorizontal, Edit2, Trash2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RemindersService, AISuggestionsService } from '../../lib/services';
import type { Reminder } from '../../lib/services';

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

    const unsubscribe = RemindersService.subscribeToReminders(user.uid, (remindersData) => {
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
        // Fallback: create basic reminder
        setPendingReminder({
          title: aiPrompt,
          type: 'browser',
          frequency: 'once',
          enabled: true,
        });
        setShowConfirmation(true);
        setShowAIPrompt(false);
      }
    } catch (error) {
      console.error('Error generating reminder from AI:', error);
      // Fallback
      setPendingReminder({
        title: aiPrompt,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reminders & Notifications</h1>
          <p className="text-slate-300">Configure how and when you receive reminders</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAIPrompt(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Create</span>
          </button>
          <button
            onClick={handleAddReminder}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reminders List */}
        <div className="lg:col-span-2 space-y-4">
          {reminders.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl">
              <Bell className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No reminders set up yet</p>
              <p className="text-slate-500 text-sm mt-2">Get started by creating your first reminder to stay organized and productive!</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      reminder.type === 'email' ? 'bg-blue-900/30 text-blue-300' :
                      reminder.type === 'browser' ? 'bg-green-900/30 text-green-300' :
                      'bg-purple-900/30 text-purple-300'
                    }`}>
                      {reminder.type === 'email' ? <Mail className="w-4 h-4" /> :
                       reminder.type === 'browser' ? <Smartphone className="w-4 h-4" /> :
                       <Bell className="w-4 h-4" />}
                    </div>
                    <div>
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
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={reminder.enabled}
                        onChange={() => handleToggleReminder(reminder)}
                      />
                      <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                    </label>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditReminder(reminder)}
                        className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-slate-300" />
                      </button>
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Frequency: {reminder.frequency}</span>
                  <span>Type: {reminder.type}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          {/* Notification Channels */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Notification Channels</h3>
            <div className="space-y-4">
              {[
                { icon: <Mail className="w-4 h-4" />, label: 'Email Notifications', enabled: true },
                { icon: <Smartphone className="w-4 h-4" />, label: 'Browser Push', enabled: true },
                { icon: <Bell className="w-4 h-4" />, label: 'Desktop Alerts', enabled: false },
                { icon: <MessageCircle className="w-4 h-4" />, label: 'SMS Alerts', enabled: false }
              ].map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-600">{channel.icon}</div>
                    <span className="text-sm text-gray-700">{channel.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={channel.enabled} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* AI Reminder Suggestions */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">AI Reminder Suggestions</h3>
            <div className="space-y-3">
              {[
                'Set daily progress check-in',
                'Weekly goal review reminder',
                'Monthly productivity analysis',
                'Networking follow-up reminders'
              ].map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700">{suggestion}</span>
                  <button className="text-[#0A66C2] hover:text-[#004182] transition-colors text-sm">
                    Enable
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Prompt Modal */}
      {showAIPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Create Reminder with AI Assistant</h3>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the reminder you want to create naturally... e.g., 'Remind me to review my weekly goals every Monday at 9 AM' or 'Send me a daily reminder to drink water'"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAIPrompt(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAIPrompt}
                disabled={aiLoading || !aiPrompt.trim()}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {aiLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
            <span>{aiLoading ? 'Generating...' : 'Generate Reminder'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && pendingReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm AI-Generated Reminder</h3>
            <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-white mb-2">{pendingReminder.title}</h4>
              {pendingReminder.description && (
                <p className="text-slate-300 text-sm mb-2">{pendingReminder.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span>Type: {pendingReminder.type}</span>
                <span>Frequency: {pendingReminder.frequency}</span>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-6">Does this reminder look correct?</p>
            <div className="flex space-x-3">
              <button
                onClick={handleRejectReminder}
                className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                No, Try Again
              </button>
              <button
                onClick={handleConfirmReminder}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Yes, Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Reminder title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional details"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'email' | 'browser' | 'sms' })}
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
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'once' })}
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
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="enabled" className="text-sm text-slate-300">Enable reminder</label>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReminder}
                disabled={!formData.title.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {editingReminder ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}