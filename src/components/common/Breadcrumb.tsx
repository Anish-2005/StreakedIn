import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

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
    <nav className={`flex items-center space-x-1.5 sm:space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 ? (
            item.href ? (
              <a
                href={item.href}
                className="flex items-center space-x-1 px-2 py-1 rounded-lg text-app-text-muted hover:text-app-text hover:bg-app-surface/45 transition-colors text-xs sm:text-sm"
              >
                {item.icon || <Home className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">Home</span>
              </a>
            ) : (
              <span className="flex items-center space-x-1 px-2 py-1 text-app-text-muted text-xs sm:text-sm">
                {item.icon || <Home className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">Home</span>
              </span>
            )
          ) : (
            item.href ? (
              <a
                href={item.href}
                className="px-2 py-1 rounded-lg text-app-text-muted hover:text-app-text hover:bg-app-surface/45 transition-colors text-xs sm:text-sm"
              >
                {item.label}
              </a>
            ) : (
              <span className="px-2 py-1 text-app-text font-semibold text-xs sm:text-sm">{item.label}</span>
            )
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-app-text-muted/80" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
