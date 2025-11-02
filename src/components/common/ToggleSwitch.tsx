import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-4 after:w-3 after:h-3',
  md: 'w-11 h-6 after:w-5 after:h-5',
  lg: 'w-14 h-7 after:w-6 after:h-6'
};

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = ''
}: ToggleSwitchProps) {
  const baseClasses = 'relative inline-flex items-center cursor-pointer';
  const switchClasses = `${sizeClasses[size]} bg-slate-700/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-600 after:border after:rounded-full after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600`;
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <label className={`${baseClasses} ${disabledClasses} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className={switchClasses} />
    </label>
  );
}