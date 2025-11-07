import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled';
  error?: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  variant?: 'default' | 'filled';
  error?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
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

export function Select({ variant = 'default', error, className = '', children, value, onChange, placeholder, disabled, onClick, ...props }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected option text
  const selectedOption = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && (child.props as { value: string }).value === value
  ) as React.ReactElement | undefined;

  const selectedText = selectedOption ? (selectedOption.props as { children: React.ReactNode }).children : (placeholder || 'Select...');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const combinedClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base text-left flex items-center justify-between ${variantClasses[variant]} ${error ? 'border-red-500/50 focus:ring-red-500/60' : ''} ${className}`;

  return (
    <div className="space-y-1" ref={dropdownRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={combinedClasses}
          disabled={disabled}
        >
          <span className={selectedText === 'Select...' ? 'text-slate-400' : 'text-white'}>
            {selectedText}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${disabled ? 'opacity-50' : 'text-slate-400'}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-slate-800/95 backdrop-blur-md border border-slate-600/60 rounded-lg shadow-xl max-h-60 overflow-auto">
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return null;

              const childProps = child.props as { value: string; children: React.ReactNode };
              const isSelected = childProps.value === value;
              return (
                <button
                  key={childProps.value}
                  type="button"
                  onClick={() => handleSelect(childProps.value)}
                  className={`w-full px-4 py-3 text-left transition-colors duration-150 hover:bg-slate-700/60 ${
                    isSelected ? 'bg-blue-500/20 text-blue-300' : 'text-white'
                  } first:rounded-t-lg last:rounded-b-lg`}
                >
                  {childProps.children}
                </button>
              );
            })}
          </div>
        )}
      </div>
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