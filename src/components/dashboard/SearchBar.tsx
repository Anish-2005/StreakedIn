import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  debounceMs?: number;
  externalQuery?: string;
  onClear?: () => void;
}

export default function SearchBar({
  placeholder = "Search goals, tasks...",
  onSearch,
  className = "",
  debounceMs = 300,
  externalQuery,
  onClear
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Use external query if provided, otherwise use internal state
  const query = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = externalQuery !== undefined ? () => { } : setInternalQuery;

  // Debounce the search query only when not using external query
  useEffect(() => {
    if (externalQuery === undefined) {
      const timer = setTimeout(() => {
        setDebouncedQuery(internalQuery);
      }, debounceMs);

      return () => clearTimeout(timer);
    }
  }, [internalQuery, debounceMs, externalQuery]);

  // Call onSearch when debounced query changes (only for uncontrolled component)
  useEffect(() => {
    if (externalQuery === undefined) {
      onSearch?.(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, externalQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (externalQuery !== undefined) {
      // For controlled component, just call onSearch with the new value
      // The parent will handle debouncing and state updates
      onSearch?.(value);
    } else {
      // For uncontrolled component, update internal state
      setInternalQuery(value);
    }
  };

  const handleClear = () => {
    if (externalQuery !== undefined && onClear) {
      onClear();
    } else {
      setInternalQuery('');
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-app-text-muted transition-colors" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="pl-12 pr-10 py-3 w-full border border-app-border rounded-2xl bg-app-surface shadow-inner-clay text-app-text placeholder-app-text-muted focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:scale-[1.01]"
        style={{
          boxShadow: 'var(--clay-shadow-outer), var(--clay-shadow-inner)'
        }}
      />
      {query && (
        <button
          onClick={handleClear}
          className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 text-app-text-muted hover:text-app-text transition-colors"
        >
          ×
        </button>
      )}
      {/* Subtle glow effect */}
      <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-500/10 dark:to-purple-500/10 light:bg-gradient-to-r light:from-blue-400/5 light:to-purple-400/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
}