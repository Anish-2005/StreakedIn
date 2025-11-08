"use client";

import { Button } from '../../common';
import React from 'react';

interface QuickGoalSetupProps {
  // Optional handler when quick create is wired
  onCreate?: (data: any) => void;
}

export default function QuickGoalSetup({ onCreate }: QuickGoalSetupProps) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 sm:p-6">
      <h3 className="font-semibold text-white mb-4">Quick Goal Setup</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Goal title..."
          className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm bg-slate-900/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
        />
        <select className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm bg-slate-900/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent">
          <option>Select category</option>
          <option>Career Development</option>
          <option>Skill Learning</option>
          <option>Networking</option>
          <option>Health & Wellness</option>
        </select>
        <input
          type="date"
          className="w-full border border-slate-700/50 rounded-lg px-3 py-2 text-sm bg-slate-900/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent"
        />
        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-2 text-sm hover:opacity-95 transition-colors">
          Create Goal
        </Button>
      </div>
    </div>
  );
}