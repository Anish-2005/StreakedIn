"use client";

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isSignUp: boolean;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  isSignUp,
  loading,
  error,
  onSubmit
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-md border border-gray-300/50 dark:border-slate-700/50 rounded-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/30 rounded-lg p-3 mb-4">
          <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-700/50 rounded-lg bg-white dark:bg-slate-900/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-500/60 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-slate-700/50 rounded-lg bg-white dark:bg-slate-900/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-500/60 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <span>{loading ? 'Signing in...' : (isSignUp ? 'Create Account' : 'Sign In')}</span>
        </button>
      </form>
    </div>
  );
}