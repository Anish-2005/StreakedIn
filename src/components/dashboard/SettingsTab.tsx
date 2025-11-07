"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, ToggleSwitch, Button, FormField } from '../common';

interface SettingsTabProps {
  // No props needed for this component
}

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
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Email Notifications</h4>
                <p className="text-slate-400 text-sm">Receive updates via email</p>
              </div>
              <ToggleSwitch
                checked={settingsState.emailNotifications}
                onChange={() => toggleSetting('emailNotifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Push Notifications</h4>
                <p className="text-slate-400 text-sm">Browser and desktop alerts</p>
              </div>
              <ToggleSwitch
                checked={settingsState.pushNotifications}
                onChange={() => toggleSetting('pushNotifications')}
              />
            </div>
          </div>
        </Card>

        {/* AI & Preferences */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">AI & Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Auto Goal Suggestions</h4>
                <p className="text-slate-400 text-sm">AI-powered goal recommendations</p>
              </div>
              <ToggleSwitch
                checked={settingsState.autoGoalSuggestions}
                onChange={() => toggleSetting('autoGoalSuggestions')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Sound Alerts</h4>
                <p className="text-slate-400 text-sm">Audio notifications for reminders</p>
              </div>
              <ToggleSwitch
                checked={settingsState.soundAlerts}
                onChange={() => toggleSetting('soundAlerts')}
              />
            </div>
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Display Name"
              type="input"
              defaultValue={user?.displayName || ''}
            />
            <FormField
              label="Email"
              type="input"
              defaultValue={user?.email || ''}
            />
            <FormField
              label="Timezone"
              type="select"
            >
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC+0 (GMT)</option>
            </FormField>
            <FormField
              label="Theme"
              type="select"
            >
              <option>Dark</option>
              <option>Light</option>
              <option>System</option>
            </FormField>
          </div>
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-700/50">
            <Button variant="outline">
              Cancel
            </Button>
            <Button>
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}