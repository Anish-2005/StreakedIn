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
  primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 border-transparent',
  secondary: 'dark:bg-slate-700/50 light:bg-gray-200/50 dark:text-slate-300 light:text-gray-800 dark:hover:bg-slate-600/50 light:hover:bg-gray-300/50 dark:border-slate-600/50 light:border-gray-400/50',
  outline: 'dark:border dark:border-slate-700/50 light:border light:border-gray-400 dark:text-slate-300 light:text-gray-700 dark:hover:border-blue-500/60 dark:hover:text-blue-400 light:hover:border-blue-500/60 light:hover:text-blue-600 bg-transparent',
  ghost: 'dark:text-slate-300 light:text-gray-700 dark:hover:text-white light:hover:text-gray-900 dark:hover:bg-slate-700/40 light:hover:bg-gray-200/40 border-transparent',
  danger: 'dark:bg-red-500/20 light:bg-red-100/40 dark:text-red-300 light:text-red-700 dark:hover:bg-red-500/30 light:hover:bg-red-100/50 dark:border-red-500/30 light:border-red-400/40'
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