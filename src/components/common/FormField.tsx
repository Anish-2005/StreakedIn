import React from 'react';
import { Input, Select, Textarea } from './Input';

interface BaseFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

interface InputFieldProps extends BaseFormFieldProps, React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'input';
}

interface SelectFieldProps extends BaseFormFieldProps, React.SelectHTMLAttributes<HTMLSelectElement> {
  type: 'select';
  children: React.ReactNode;
}

interface TextareaFieldProps extends BaseFormFieldProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  type: 'textarea';
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

export default function FormField({
  label,
  error,
  required = false,
  helperText,
  className = '',
  ...props
}: FormFieldProps) {
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={fieldId}
        className="text-slate-300 text-sm font-medium block"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {props.type === 'select' ? (
        <Select
          id={fieldId}
          error={error}
          {...(props as SelectFieldProps)}
        >
          {props.children}
        </Select>
      ) : props.type === 'textarea' ? (
        <Textarea
          id={fieldId}
          error={error}
          {...(props as TextareaFieldProps)}
        />
      ) : (
        <Input
          id={fieldId}
          error={error}
          {...(props as InputFieldProps)}
        />
      )}

      {helperText && !error && (
        <p className="text-slate-400 text-xs">{helperText}</p>
      )}
    </div>
  );
}