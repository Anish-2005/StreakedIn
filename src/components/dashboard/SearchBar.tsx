import React, { useState, useEffect } from 'react';
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

  const query = externalQuery !== undefined ? externalQuery : internalQuery;

  useEffect(() => {
    if (externalQuery === undefined) {
      const timer = setTimeout(() => {
        setDebouncedQuery(internalQuery);
      }, debounceMs);

      return () => clearTimeout(timer);
    }
  }, [internalQuery, debounceMs, externalQuery]);

  useEffect(() => {
    if (externalQuery === undefined) {
      onSearch?.(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, externalQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (externalQuery !== undefined) {
      onSearch?.(value);
    } else {
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
        className="pl-11 pr-10 py-2.5 w-full border border-app-border rounded-xl bg-app-surface text-app-text placeholder-app-text-muted focus:outline-none focus:ring-2 focus:ring-app-primary/30 focus:border-app-primary/60 transition-all duration-200"
      />
      {query && (
        <button
          onClick={handleClear}
          className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-app-text-muted hover:text-app-text transition-colors flex items-center justify-center"
          aria-label="Clear search"
        >
          <span className="text-base leading-none">x</span>
        </button>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-app-primary/8 to-cyan-500/8 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
}
