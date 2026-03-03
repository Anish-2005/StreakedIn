"use client";

import { Button } from '../../common';
import React from 'react';

interface QuickGoalSetupProps {
  // Optional handler when quick create is wired
  onCreate?: (data: any) => void;
}

export default function QuickGoalSetup({ onCreate }: QuickGoalSetupProps) {
  return (
    <div className="border border-app-border rounded-xl p-4 sm:p-5 bg-app-surface/80">
      <h3 className="font-semibold text-app-text mb-4">Quick Goal Setup</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Goal title..."
          className="w-full border border-app-border rounded-lg px-3 py-2 text-sm bg-app-bg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-1 focus:ring-blue-500/40"
        />
        <select className="w-full border border-app-border rounded-lg px-3 py-2 text-sm bg-app-bg text-app-text placeholder-app-text-muted focus:outline-none focus:ring-1 focus:ring-blue-500/40">
          <option>Select category</option>
          <option>Career Development</option>
          <option>Skill Learning</option>
          <option>Networking</option>
          <option>Health & Wellness</option>
        </select>
        <input
          type="date"
          className="w-full border border-app-border rounded-lg px-3 py-2 text-sm bg-app-bg text-app-text focus:outline-none focus:ring-1 focus:ring-blue-500/40"
        />
        <Button className="w-full text-sm" size="sm">
          Create Goal
        </Button>
      </div>
    </div>
  );
}