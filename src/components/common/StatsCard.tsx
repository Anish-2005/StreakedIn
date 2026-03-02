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
    <Card className={className} hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-app-text-muted text-sm">{title}</p>
          <p className="text-2xl font-bold text-app-text mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${color}`}>{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-app-bg ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}