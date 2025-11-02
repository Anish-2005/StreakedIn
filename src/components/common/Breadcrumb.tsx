import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Button from './Button';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 ? (
            item.href ? (
              <a
                href={item.href}
                className="flex items-center space-x-1 px-2 py-1 rounded-md text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
              >
                {item.icon || <Home className="w-4 h-4" />}
                <span>{item.label}</span>
              </a>
            ) : (
              <span className="flex items-center space-x-1 px-2 py-1 text-slate-400">
                {item.icon || <Home className="w-4 h-4" />}
                <span>{item.label}</span>
              </span>
            )
          ) : (
            item.href ? (
              <a
                href={item.href}
                className="px-2 py-1 rounded-md text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="px-2 py-1 text-slate-300 font-medium">{item.label}</span>
            )
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}