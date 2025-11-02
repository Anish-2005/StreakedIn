"use client";
import { motion } from 'framer-motion';
import { Plus, Mail, Smartphone, Bell, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Reminder {
  id: number;
  title: string;
  type?: string;
  frequency?: string;
  enabled?: boolean;
  nextTrigger?: string;
}

interface RemindersTabProps {}

export default function RemindersTab({}: RemindersTabProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    setReminders([
      {
        id: 1,
        title: 'Weekly progress review',
        type: 'email',
        frequency: 'weekly',
        enabled: true,
        nextTrigger: '2024-01-22 09:00'
      },
      {
        id: 2,
        title: 'Daily goal check-in',
        type: 'browser',
        frequency: 'daily',
        enabled: true,
        nextTrigger: '2024-01-21 08:00'
      }
    ]);
  }, []);

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
        <button className="flex items-center space-x-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reminders List */}
        <div className="lg:col-span-2 space-y-4">
          {reminders.map((reminder) => (
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
                    <p className="text-sm text-slate-400">Next: {reminder.nextTrigger}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={reminder.enabled} />
                    <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                  </label>
                  <button className="p-2 hover:bg-slate-700/40 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Frequency: {reminder.frequency}</span>
                <div className="flex space-x-2">
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    Edit
                  </button>
                  <button className="text-red-500 hover:text-red-400 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
    </motion.div>
  );
}