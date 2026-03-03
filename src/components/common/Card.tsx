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
  default: 'clay-card rounded-[4rem] bg-app-surface border-app-border',
  elevated: 'clay-card rounded-[4rem] bg-app-surface border-app-border shadow-2xl scale-[1.03] hover:scale-[1.05]',
  outlined: 'clay-card rounded-[4rem] bg-transparent border-4 border-app-border bg-opacity-5 backdrop-blur-sm',
  glass: 'clay-card rounded-[4rem] bg-app-glass backdrop-blur-3xl border-app-border'
};

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  variant = 'default',
  animated = false
}: CardProps) {
  const baseClasses = 'rounded-[3rem] transition-all duration-300 will-change-transform';
  const hoverClasses = hover
    ? 'hover:-translate-y-1 hover:shadow-xl'
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