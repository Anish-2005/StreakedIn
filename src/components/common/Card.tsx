import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
  animated?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

const variantClasses = {
  default: 'bg-app-glass backdrop-blur-md border border-app-border light:bg-white/40 light:border-gray-300/50',
  elevated: 'bg-app-surface border border-app-border shadow-lg light:bg-white/80 light:border-gray-200',
  outlined: 'border-2 border-app-border bg-transparent'
};

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  variant = 'default',
  animated = false
}: CardProps) {
  const baseClasses = 'rounded-xl transition-all duration-200';
  const hoverClasses = hover ? 'dark:hover:border-slate-600/50 dark:hover:bg-slate-800/40 light:hover:border-gray-400/50 light:hover:bg-white/60' : '';
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={combinedClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}