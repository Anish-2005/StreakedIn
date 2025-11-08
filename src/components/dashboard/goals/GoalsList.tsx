"use client";

import GoalCard from './GoalCard';
import { Card } from '../../common';

interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  category?: string;
  progress: number;
  aiSuggested?: boolean;
  status?: string;
}

interface GoalsListProps {
  goals: Goal[];
  loading: boolean;
  onEdit: (g: Goal) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (category: string) => string;
}

export default function GoalsList({ goals, loading, onEdit, onDelete, getPriorityColor }: GoalsListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-slate-400 mt-2">Loading goals...</p>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 6 6 .5-4.5 4 1 6L12 17l-5.5 2.5 1-6L3 8.5 9 8z"/></svg>
        </div>
        <p className="text-slate-400">No goals yet. Create your first goal!</p>
      </Card>
    );
  }

  return (
    <>
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onEdit={onEdit} onDelete={onDelete} getPriorityColor={getPriorityColor} />
      ))}
    </>
  );
}