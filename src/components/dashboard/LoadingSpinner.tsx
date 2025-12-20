import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({
  message = "Loading...",
  size = 'md',
  className = ""
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`min-h-screen dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:bg-gradient-to-br light:from-gray-50 light:via-blue-50 light:to-gray-50 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-2 dark:border-white light:border-gray-900 dark:border-t-transparent light:border-t-transparent rounded-full animate-spin mx-auto mb-4`} />
        <div className="dark:text-white light:text-gray-900 text-xl">{message}</div>
      </div>
    </div>
  );
}