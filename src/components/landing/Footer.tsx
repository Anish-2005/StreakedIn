import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="dark:border-t dark:border-slate-800 light:border-t light:border-gray-200 py-12 dark:bg-slate-900 light:bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              StreakedIn
            </span>
          </div>
          <div className="dark:text-slate-400 light:text-gray-600 text-center md:text-right">
            <p>&copy; 2024 StreakedIn. All rights reserved.</p>
            <p className="text-sm mt-1">Professional productivity tracking reimagined.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}