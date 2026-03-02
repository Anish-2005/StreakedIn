import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-app-surface border border-app-border text-app-text-muted shadow-sm',
  primary: 'bg-blue-500/10 border border-blue-500/20 text-blue-400 light:text-blue-600 shadow-inner-clay rounded-xl',
  success: 'bg-green-500/10 border border-green-500/20 text-green-400 light:text-green-600 shadow-inner-clay rounded-xl',
  warning: 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 light:text-yellow-600 shadow-inner-clay rounded-xl',
  danger: 'bg-red-500/10 border border-red-500/20 text-red-400 light:text-red-600 shadow-inner-clay rounded-xl',
  purple: 'bg-purple-500/10 border border-purple-500/20 text-purple-400 light:text-purple-600 shadow-inner-clay rounded-xl'
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = ''
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center space-x-1 rounded-full border font-medium';
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={combinedClasses}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}