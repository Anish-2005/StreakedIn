"use client";

import { Zap, Bell, TrendingUp, Calendar } from 'lucide-react';

interface AIFeature {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
}

interface AIFeaturesProps {
  features?: AIFeature[];
}

export default function AIFeatures({ features }: AIFeaturesProps) {
  const defaultFeatures: AIFeature[] = [
    { icon: <Zap className="w-4 h-4" />, label: 'Auto Goal Setting', enabled: true },
    { icon: <Bell className="w-4 h-4" />, label: 'Smart Reminders', enabled: true },
    { icon: <TrendingUp className="w-4 h-4" />, label: 'Progress Predictions', enabled: false },
    { icon: <Calendar className="w-4 h-4" />, label: 'Schedule Optimization', enabled: true }
  ];

  const featuresToRender = features || defaultFeatures;

  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
      <h3 className="font-semibold text-white mb-4">AI Features</h3>
      <div className="space-y-3">
        {featuresToRender.map((feature, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-blue-400">{feature.icon}</div>
              <span className="text-sm text-slate-300">{feature.label}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={feature.enabled} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A66C2]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}