import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  animated?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8'
};

const variantClasses = {
  default: 'clay-card bg-app-surface border-app-border',
  elevated: 'clay-card bg-app-surface-strong border-app-border shadow-[0_18px_34px_rgba(2,6,23,0.2)]',
  outlined: 'bg-transparent border border-app-border rounded-2xl',
  glass: 'clay-card bg-app-glass backdrop-blur-xl border-app-border'
};

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  variant = 'default',
  animated = false
}: CardProps) {
  const baseClasses = 'rounded-2xl transition-all duration-200';
  const hoverClasses = hover
    ? 'hover:-translate-y-0.5 hover:border-app-border-strong'
    : '';
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
