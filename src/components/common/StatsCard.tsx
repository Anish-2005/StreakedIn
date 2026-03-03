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
      variant="default"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-app-text-muted mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-semibold text-app-text tracking-tight">
            {value}
          </p>
          {change && (
            <span
              className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-app-border/70 bg-app-surface/60 ${color}`}
            >
              {change}
            </span>
          )}
        </div>
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full border border-app-border/60 bg-app-surface/70 flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}