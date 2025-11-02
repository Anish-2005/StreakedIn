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
  default: 'bg-slate-800/30 backdrop-blur-md border border-slate-700/50',
  elevated: 'bg-slate-800/50 backdrop-blur-md border border-slate-600/60 shadow-lg',
  outlined: 'border-2 border-slate-700/50 bg-transparent'
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
  const hoverClasses = hover ? 'hover:border-slate-600/50 hover:bg-slate-800/40' : '';
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