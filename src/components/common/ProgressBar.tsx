import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
};

export default function ProgressBar({
  value,
  max = 100,
  showValue = false,
  size = 'md',
  variant = 'default',
  className = '',
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const progressBar = (
    <div className={`w-full bg-slate-700/40 rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
      <motion.div
        className={`h-full rounded-full transition-all duration-500 ${
          variant === 'gradient'
            ? 'bg-gradient-to-r from-blue-500 to-purple-600'
            : 'bg-blue-500'
        }`}
        initial={{ width: 0 }}
        animate={{ width: animated ? `${percentage}%` : `${percentage}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );

  if (showValue) {
    return (
      <div className="space-y-2">
        {progressBar}
        <div className="flex justify-between text-sm text-slate-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      </div>
    );
  }

  return progressBar;
}