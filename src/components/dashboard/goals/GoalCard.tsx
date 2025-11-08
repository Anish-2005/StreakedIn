"use client";

import { Card, Button, Badge, ProgressBar } from '../../common';
import { Calendar, Target, Brain, CheckCircle, Edit3, Trash2 } from 'lucide-react';
import type { Goal } from '../../../lib/services';

interface GoalCardProps {
  goal: Goal;
  onEdit: (g: Goal) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (category: string) => string;
}

export default function GoalCard({ goal, onEdit, onDelete, getPriorityColor }: GoalCardProps) {
  return (
    <Card hover>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="font-semibold text-white text-lg">{goal.title}</h3>
            <div className="flex flex-wrap gap-2">
              {goal.aiSuggested && (
                <Badge variant="purple" size="sm" icon={<Brain className="w-3 h-3" />}>
                  AI Suggested
                </Badge>
              )}
              {goal.status === 'completed' && (
                <Badge variant="success" size="sm" icon={<CheckCircle className="w-3 h-3" />}>
                  Completed
                </Badge>
              )}
            </div>
          </div>
          {goal.description && (
            <p className="text-slate-300 text-sm mb-2">{goal.description}</p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-300">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Due {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '—'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{goal.category}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goal)}
            className="p-2"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(goal.id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Progress</span>
          <span className="text-sm font-semibold text-white">{goal.progress}%</span>
        </div>
        <ProgressBar value={goal.progress} className="w-full" />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Update Progress
          </Button>
          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
            View Details
          </Button>
        </div>
        <Button variant="ghost" size="sm" icon={<Brain className="w-4 h-4" />} className="w-full sm:w-auto">
          Get AI Tips
        </Button>
      </div>
    </Card>
  );
}