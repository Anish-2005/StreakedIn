"use client";
import { Filter } from 'lucide-react';
import { Select } from '../../common';

interface TasksFiltersProps {
  filter: 'all' | 'pending' | 'completed';
  sortBy: 'created' | 'priority' | 'dueDate';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
  onSortChange: (sortBy: 'created' | 'priority' | 'dueDate') => void;
}

export default function TasksFilters({
  filter,
  sortBy,
  onFilterChange,
  onSortChange
}: TasksFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400 light:text-slate-600" />
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => onFilterChange(filterType)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-app-surface/70 text-app-text-muted hover:bg-app-surface'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 light:text-slate-600">Sort by:</span>
          <Select
            value={sortBy}
            onChange={(value) => onSortChange(value as any)}
            className="w-32"
          >
            <option value="created">Created</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </Select>
        </div>
      </div>
    </div>
  );
}