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
    <Card className={`clay-card rounded-[2rem] overflow-hidden ${className}`} hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-app-text-muted text-xs font-semibold uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-extra-bold text-app-text mt-1">{value}</p>
          {change && (
            <div className={`text-xs mt-2 px-2 py-0.5 rounded-full inline-block ${color} bg-opacity-10 border border-current`}>
              {change}
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl shadow-lg bg-app-bg ${color} clay-button`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}