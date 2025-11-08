"use client";

import { Chrome } from 'lucide-react';

interface GoogleSignInButtonProps {
  onClick: () => void;
  loading: boolean;
}

export default function GoogleSignInButton({ onClick, loading }: GoogleSignInButtonProps) {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/50" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-800/30 text-slate-400">Or continue with</span>
        </div>
      </div>

      <button
        onClick={onClick}
        disabled={loading}
        className="w-full mt-4 flex items-center justify-center space-x-3 px-4 py-3 border border-slate-700/50 rounded-lg bg-slate-900/20 text-white hover:bg-slate-700/40 transition-colors disabled:opacity-50"
      >
        <Chrome className="w-5 h-5" />
        <span>Google</span>
      </button>
    </div>
  );
}