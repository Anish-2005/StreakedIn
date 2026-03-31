import React from 'react';
import Card from './Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  color = 'text-blue-400',
  className = ''
}: StatsCardProps) {
  return (
    <Card
      className={`p-4 sm:p-5 lg:p-6 cursor-default ${className}`}
      variant="elevated"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-app-text-muted mb-1 uppercase tracking-[0.06em]">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-semibold text-app-text tracking-tight">
            {value}
          </p>
          {change && (
            <span
              className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-app-border bg-app-primary-soft ${color}`}
            >
              {change}
            </span>
          )}
        </div>
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl border border-app-border bg-app-surface-strong flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
