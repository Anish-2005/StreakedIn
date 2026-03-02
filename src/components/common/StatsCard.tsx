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
    <Card className={`clay-card rounded-[3.5rem] p-8 hover:scale-[1.05] active:scale-95 group cursor-pointer transition-all duration-300 ${className}`} variant="default">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-app-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
          <p className="text-4xl font-black text-app-text tracking-tight">{value}</p>
          {change && (
            <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center clay-pressed bg-opacity-20 ${color}`}>
              {change}
            </div>
          )}
        </div>
        <div className={`w-16 h-16 clay-button rounded-[1.5rem] flex items-center justify-center bg-app-surface shadow-inner-clay group-hover:scale-110 transition-transform ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}