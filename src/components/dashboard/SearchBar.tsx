import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  debounceMs?: number;
}

export default function SearchBar({
  placeholder = "Search goals, tasks...",
  onSearch,
  className = "",
  debounceMs = 300
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Call onSearch when debounced query changes
  useEffect(() => {
    onSearch?.(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
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