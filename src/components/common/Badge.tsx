import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-app-surface border border-app-border text-app-text-muted',
  primary: 'bg-app-primary-soft border border-app-primary/30 text-app-primary',
  success: 'bg-app-success/15 border border-app-success/30 text-app-success',
  warning: 'bg-app-warning/15 border border-app-warning/30 text-app-warning',
  danger: 'bg-app-danger/15 border border-app-danger/30 text-app-danger',
  purple: 'bg-sky-500/15 border border-sky-500/30 text-sky-500'
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm'
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = ''
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center space-x-1 rounded-full border font-medium tracking-wide';
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={combinedClasses}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
