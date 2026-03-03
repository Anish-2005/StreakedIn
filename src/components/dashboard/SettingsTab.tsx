"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings } from 'lucide-react';
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
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="bg-app-surface/50 border border-app-border/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-app-bg rounded-xl flex items-center justify-center flex-shrink-0 border border-app-border/50">
            <Settings className="w-6 h-6 text-app-text" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-app-text mb-1">Settings</h1>
            <p className="text-app-text-muted text-base">Configure your preferences and account settings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-app-text mb-6">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-app-border/20">
              <div className="flex-1">
                <h4 className="text-app-text font-medium text-sm">Email Notifications</h4>
                <p className="text-app-text-muted text-xs mt-1">Receive updates and summaries via email</p>
              </div>
              <ToggleSwitch
                checked={settingsState.emailNotifications}
                onChange={() => toggleSetting('emailNotifications')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <h4 className="text-app-text font-medium text-sm">Push Notifications</h4>
                <p className="text-app-text-muted text-xs mt-1">Browser and mobile alerts</p>
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
          <h3 className="text-lg font-semibold text-app-text mb-6">AI & Automation</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-app-border/20">
              <div className="flex-1">
                <h4 className="text-app-text font-medium text-sm">Auto Goal Suggestions</h4>
                <p className="text-app-text-muted text-xs mt-1">Personalized goal recommendations</p>
              </div>
              <ToggleSwitch
                checked={settingsState.autoGoalSuggestions}
                onChange={() => toggleSetting('autoGoalSuggestions')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <h4 className="text-app-text font-medium text-sm">Sound Alerts</h4>
                <p className="text-app-text-muted text-xs mt-1">Audio notifications for reminders</p>
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
          <h3 className="text-lg font-semibold text-app-text mb-6">Account & Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Display Name"
              type="input"
              defaultValue={user?.displayName || ''}
            />
            <FormField
              label="Email Address"
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
              label="Theme Preference"
              type="select"
            >
              <option>Dark</option>
              <option>Light</option>
              <option>System</option>
            </FormField>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-app-border/20">
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