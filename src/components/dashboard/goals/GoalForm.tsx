"use client";

import { Card, Button, Input, Select } from '../../common';
import React from 'react';

interface GoalFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: string[];
  editingGoal: any | null;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function GoalForm({ formData, setFormData, categories, editingGoal, onCancel, onSubmit }: GoalFormProps) {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-app-text">
          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Goal title..."
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev:any) => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="md:col-span-2">
          <textarea
            placeholder="Goal description (optional)..."
            value={formData.description}
            onChange={(e) => setFormData((prev:any) => ({ ...prev, description: e.target.value }))}
            className="w-full border border-slate-700 light:border-slate-300/50 rounded-lg px-3 py-2 text-sm bg-slate-900 light:bg-slate-50/20 text-app-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <Select
          value={formData.category}
          onChange={(value: any) => setFormData((prev:any) => ({ ...prev, category: value }))}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>

        <Input
          type="date"
          value={formData.deadline}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev:any) => ({ ...prev, deadline: e.target.value }))}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-app-text-muted mb-2">
            Initial Progress: {formData.progress}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => setFormData((prev:any) => ({ ...prev, progress: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={onSubmit}>
          {editingGoal ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </Card>
  );
}