import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
}

const variantClasses = {
  primary:
    'bg-app-primary text-white border-transparent hover:brightness-110 shadow-[0_10px_22px_rgba(37,99,235,0.34)]',
  secondary:
    'bg-app-surface-strong text-app-text border border-app-border hover:border-app-border-strong',
  outline:
    'bg-transparent border border-app-border text-app-text hover:bg-app-surface/45 hover:border-app-border-strong',
  ghost:
    'bg-transparent border-transparent text-app-text-muted hover:text-app-text hover:bg-app-surface/35',
  danger:
    'bg-app-danger text-white border-transparent hover:brightness-110 shadow-[0_10px_22px_rgba(220,38,38,0.28)]'
};

const sizeClasses = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-4.5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base'
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  animated = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'clay-button font-semibold transition-all duration-200 flex items-center justify-center gap-2 border whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-app-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-55 disabled:cursor-not-allowed disabled:shadow-none';
  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  const buttonContent = (
    <>
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {icon && !loading && icon}
      <span>{children}</span>
    </>
  );

  if (animated) {
    return (
      <motion.button
        className={combinedClasses}
        disabled={disabled || loading}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </button>
  );
}
