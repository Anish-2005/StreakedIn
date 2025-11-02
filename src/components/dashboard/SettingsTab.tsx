"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsTabProps {}

export default function SettingsTab({}: SettingsTabProps) {
  const { user } = useAuth();
  const [settingsState, setSettingsState] = useState<Record<string, boolean>>({
    emailNotifications: true,
    pushNotifications: true,
    soundAlerts: false,
    autoGoalSuggestions: true,
  });

  const toggleSetting = (key: string) => {
    setSettingsState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-300">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Email Notifications</h4>
                <p className="text-slate-400 text-sm">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsState.emailNotifications}
                  onChange={() => toggleSetting('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Push Notifications</h4>
                <p className="text-slate-400 text-sm">Browser and desktop alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsState.pushNotifications}
                  onChange={() => toggleSetting('pushNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* AI & Preferences */}
        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI & Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Auto Goal Suggestions</h4>
                <p className="text-slate-400 text-sm">AI-powered goal recommendations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsState.autoGoalSuggestions}
                  onChange={() => toggleSetting('autoGoalSuggestions')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Sound Alerts</h4>
                <p className="text-slate-400 text-sm">Audio notifications for reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsState.soundAlerts}
                  onChange={() => toggleSetting('soundAlerts')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Display Name</label>
              <input
                type="text"
                defaultValue={user?.displayName || ''}
                className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Email</label>
              <input
                type="email"
                defaultValue={user?.email || ''}
                className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Timezone</label>
              <select className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Theme</label>
              <select className="w-full border border-slate-700/50 rounded-lg px-3 py-2 bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent">
                <option>Dark</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-700/50">
            <button className="px-4 py-2 border border-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700/40 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}