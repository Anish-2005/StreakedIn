"use client";
import { Mail, Smartphone, Bell, MessageCircle } from 'lucide-react';

export default function NotificationSettings() {
  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="border border-app-border rounded-xl p-4 sm:p-5 bg-app-surface/80">
        <h3 className="font-semibold text-app-text mb-4">Notification Channels</h3>
        <div className="space-y-4">
          {[
            { icon: <Mail className="w-4 h-4" />, label: 'Email Notifications', enabled: true },
            { icon: <Smartphone className="w-4 h-4" />, label: 'Browser Push', enabled: true },
            { icon: <Bell className="w-4 h-4" />, label: 'Desktop Alerts', enabled: false },
            { icon: <MessageCircle className="w-4 h-4" />, label: 'SMS Alerts', enabled: false }
          ].map((channel, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-app-text-muted">{channel.icon}</div>
                <span className="text-sm text-app-text-muted">{channel.label}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={channel.enabled} />
                <div className="w-11 h-6 bg-slate-700 light:bg-slate-100/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* AI Reminder Suggestions */}
      <div className="border border-app-border rounded-xl p-4 sm:p-5 bg-app-surface/80">
        <h3 className="font-semibold text-app-text mb-4">AI Reminder Suggestions</h3>
        <div className="space-y-3">
          {[
            'Set daily progress check-in',
            'Weekly goal review reminder',
            'Monthly productivity analysis',
            'Networking follow-up reminders'
          ].map((suggestion, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-app-border/60">
              <span className="text-sm text-app-text-muted">{suggestion}</span>
              <button className="text-blue-500 hover:text-blue-400 transition-colors text-sm px-3 py-1 rounded hover:bg-blue-500/10 w-full sm:w-auto text-center">
                Enable
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}