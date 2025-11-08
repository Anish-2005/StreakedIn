"use client";
import { Mail, Smartphone, Bell, MessageCircle } from 'lucide-react';

export default function NotificationSettings() {
  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 sm:p-6">
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
                <div className="text-slate-400">{channel.icon}</div>
                <span className="text-sm text-slate-300">{channel.label}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={channel.enabled} />
                <div className="w-11 h-6 bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* AI Reminder Suggestions */}
      <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-white mb-4">AI Reminder Suggestions</h3>
        <div className="space-y-3">
          {[
            'Set daily progress check-in',
            'Weekly goal review reminder',
            'Monthly productivity analysis',
            'Networking follow-up reminders'
          ].map((suggestion, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-slate-600/50">
              <span className="text-sm text-slate-300">{suggestion}</span>
              <button className="text-[#0A66C2] hover:text-[#004182] transition-colors text-sm px-3 py-1 rounded hover:bg-[#0A66C2]/10 w-full sm:w-auto text-center">
                Enable
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}