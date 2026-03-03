import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    'bg-blue-600 text-white border-transparent hover:bg-blue-500 active:bg-blue-600 shadow-sm hover:shadow-md',
  secondary:
    'bg-app-surface text-app-text border border-app-border hover:bg-app-surface/80',
  outline:
    'bg-transparent border border-app-border text-app-text hover:bg-app-surface/40',
  ghost:
    'bg-transparent border-transparent text-app-text-muted hover:text-app-text hover:bg-app-surface/30',
  danger:
    'bg-red-500 text-white border-transparent hover:bg-red-600'
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
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
    'rounded-2xl font-semibold tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed';
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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...(props as any)}
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