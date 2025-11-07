import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled';
  error?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'filled';
  error?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled';
  error?: string;
}

const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base';

const variantClasses = {
  default: 'border-slate-600/60 bg-slate-800/60 text-white placeholder-slate-400 hover:border-slate-500/60',
  filled: 'border-slate-600/80 bg-slate-700/80 text-white placeholder-slate-500 hover:border-slate-500/80'
};

export function Input({ variant = 'default', error, className = '', ...props }: InputProps) {
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${error ? 'border-red-500/50 focus:ring-red-500/60' : ''} ${className}`;

  return (
    <div className="space-y-1">
      <input className={combinedClasses} {...props} />
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

export function Select({ variant = 'default', error, className = '', children, ...props }: SelectProps) {
  const combinedClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base ${variantClasses[variant]} ${error ? 'border-red-500/50 focus:ring-red-500/60' : ''} ${className}`;

  return (
    <div className="space-y-1">
      <select className={combinedClasses} {...props}>
        {children}
      </select>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

export function Textarea({ variant = 'default', error, className = '', ...props }: TextareaProps) {
  const combinedClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none text-base ${variantClasses[variant]} ${error ? 'border-red-500/50 focus:ring-red-500/60' : ''} ${className}`;

  return (
    <div className="space-y-1">
      <textarea className={combinedClasses} {...props} />
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}

export function Checkbox({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={`w-5 h-5 rounded border-2 border-slate-600 bg-slate-700/50 text-blue-500 focus:ring-blue-500/60 focus:ring-2 transition-all duration-200 ${className}`}
      {...props}
    />
  );
}