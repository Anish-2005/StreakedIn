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
    <div className="clay-card rounded-2xl p-7 sm:p-8 transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-app-text mb-6 text-center transition-colors duration-300">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>

      {error && (
        <div className="bg-app-danger/15 border border-app-danger/30 rounded-lg p-3 mb-4 transition-colors duration-300">
          <p className="text-app-danger text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-app-text-muted mb-2 transition-colors duration-300">
            Email
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-app-text-muted/70 transition-colors duration-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-app-border rounded-xl bg-app-surface text-app-text placeholder-app-text-muted/70 focus:outline-none focus:ring-2 focus:ring-app-primary/30 focus:border-app-primary/60 transition-colors duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-app-text-muted mb-2 transition-colors duration-300">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-app-text-muted/70 transition-colors duration-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 border border-app-border rounded-xl bg-app-surface text-app-text placeholder-app-text-muted/70 focus:outline-none focus:ring-2 focus:ring-app-primary/30 focus:border-app-primary/60 transition-colors duration-200"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-app-text-muted hover:text-app-text transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-app-primary text-white py-2.5 rounded-xl font-medium hover:brightness-110 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[0_10px_22px_rgba(37,99,235,0.28)]"
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
