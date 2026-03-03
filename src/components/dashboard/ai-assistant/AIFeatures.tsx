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
    <div className="bg-app-surface/50 border border-app-border/30 backdrop-blur-sm rounded-2xl p-6">
      <h3 className="font-semibold text-app-text mb-4 text-base">AI Capabilities</h3>
      <div className="space-y-3">
        {featuresToRender.map((feature, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-app-text-muted">{feature.icon}</div>
              <span className="text-sm text-app-text-muted">{feature.label}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={feature.enabled} />
              <div className="w-11 h-6 bg-app-bg peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-app-border/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-app-text after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-app-text/40 after:border-app-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-app-bg peer-checked:after:bg-app-text peer-checked:after:border-app-text"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}