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
  const setQuery = externalQuery !== undefined ? () => {} : setInternalQuery;

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
      <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-300 transition-colors" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="pl-12 pr-10 py-3 w-full border border-slate-700/60 rounded-xl bg-slate-800/40 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-slate-800/60"
      />
      {query && (
        <button
          onClick={handleClear}
          className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        >
          ×
        </button>
      )}
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
}