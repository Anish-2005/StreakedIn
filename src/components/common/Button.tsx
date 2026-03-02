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
  primary: 'clay-button rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all',
  secondary: 'clay-button rounded-2xl bg-app-surface text-app-text border-app-border hover:bg-opacity-80',
  outline: 'clay-button rounded-2xl border-2 border-app-border text-app-text-muted hover:border-blue-500 hover:text-blue-500 bg-transparent',
  ghost: 'rounded-2xl text-app-text-muted hover:text-app-text hover:bg-app-surface/50 border-transparent transition-colors',
  danger: 'clay-button rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-red-500/20'
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
  const baseClasses = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 border focus:outline-none focus:ring-2 focus:ring-blue-500/60 disabled:opacity-50 disabled:cursor-not-allowed';
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