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

const baseClasses =
  "w-full px-4 py-2.5 rounded-xl bg-app-surface text-app-text placeholder-app-text-muted border border-app-border focus:outline-none focus:ring-2 focus:ring-app-primary/30 focus:border-app-primary/60 transition-all duration-200 disabled:opacity-55 disabled:cursor-not-allowed";

const variantClasses: Record<'default' | 'filled' | 'error', string> = {
  default: "",
  filled: "bg-app-surface-strong",
  error: "border-app-danger/55 focus:ring-app-danger/25 focus:border-app-danger/70",
};

export function Input({ variant = 'default', error, className = '', ...props }: InputProps) {
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${error ? variantClasses.error : ''} ${className}`;

  return (
    <div className="space-y-1">
      <input className={combinedClasses} {...props} />
      {error && <p className="text-app-danger text-sm">{error}</p>}
    </div>
  );
}

export function Select({
  variant = 'default',
  error,
  className = '',
  children,
  value,
  onChange,
  placeholder,
  disabled,
  ...props
}: SelectProps) {
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

  const combinedClasses = `w-full px-4 py-2.5 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-primary/30 focus:border-app-primary/60 disabled:opacity-55 disabled:cursor-not-allowed text-sm text-left flex items-center justify-between bg-app-surface text-app-text ${variantClasses[variant]} ${error ? 'border-app-danger/55 focus:ring-app-danger/25 focus:border-app-danger/70' : 'border-app-border'} ${className}`;

  return (
    <div className="space-y-1" ref={dropdownRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={combinedClasses}
          disabled={disabled}
        >
          <span className={selectedText === 'Select...' ? 'text-app-text-muted' : 'text-app-text'}>
            {selectedText}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${disabled ? 'opacity-50' : 'text-app-text-muted'}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-app-surface border border-app-border rounded-xl shadow-[0_16px_24px_rgba(2,6,23,0.24)] max-h-60 overflow-auto">
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return null;

              const childProps = child.props as { value: string; children: React.ReactNode };
              const isSelected = childProps.value === value;
              return (
                <button
                  key={childProps.value}
                  type="button"
                  onClick={() => handleSelect(childProps.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                    isSelected
                      ? 'bg-app-primary-soft text-app-primary'
                      : 'text-app-text hover:bg-app-bg-subtle'
                  } first:rounded-t-xl last:rounded-b-xl`}
                >
                  {childProps.children}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {error && <p className="text-app-danger text-sm">{error}</p>}
    </div>
  );
}

export function Textarea({ variant = 'default', error, className = '', ...props }: TextareaProps) {
  const combinedClasses = `w-full px-4 py-2.5 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-primary/30 focus:border-app-primary/60 disabled:opacity-55 disabled:cursor-not-allowed resize-none text-sm bg-app-surface text-app-text placeholder-app-text-muted ${variantClasses[variant]} ${error ? 'border-app-danger/55 focus:ring-app-danger/25 focus:border-app-danger/70' : 'border-app-border'} ${className}`;

  return (
    <div className="space-y-1">
      <textarea className={combinedClasses} {...props} />
      {error && <p className="text-app-danger text-sm">{error}</p>}
    </div>
  );
}

export function Checkbox({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={`w-4 h-4 rounded border border-app-border bg-app-surface text-app-primary focus:ring-app-primary/40 focus:ring-2 transition-all duration-200 ${className}`}
      {...props}
    />
  );
}
