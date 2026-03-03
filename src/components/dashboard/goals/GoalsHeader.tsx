"use client";

import { Filter, Plus, Sparkles } from 'lucide-react';
import { Button } from '../../common';

interface GoalsHeaderProps {
  showCreateForm: boolean;
  onToggleCreate: () => void;
  onOpenAIPrompt: () => void;
}

export default function GoalsHeader({ showCreateForm, onToggleCreate, onOpenAIPrompt }: GoalsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-app-text">Goals & Targets</h1>
        <p className="text-app-text-muted">Set and track your professional development goals</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button variant="outline" icon={<Filter />} className="w-full sm:w-auto">
          Filter
        </Button>
        <Button
          variant="primary"
          icon={<Plus />}
          onClick={onToggleCreate}
          className="w-full sm:w-auto"
        >
          New Goal
        </Button>
        <Button
          variant="secondary"
          icon={<Sparkles className="w-4 h-4" />}
          onClick={onOpenAIPrompt}
          className="w-full sm:w-auto"
        >
          AI Create
        </Button>
      </div>
    </div>
  );
}