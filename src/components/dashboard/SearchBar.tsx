import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={`relative group ${className}`}>
      <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-300 transition-colors" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="pl-12 pr-4 py-3 w-full border border-slate-700/60 rounded-xl bg-slate-800/40 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-slate-800/60"
      />
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
}